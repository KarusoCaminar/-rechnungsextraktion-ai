import { VertexAI } from "@google-cloud/vertexai";
import type { LineItem } from "@shared/schema";

// Initialize Vertex AI with Google Cloud credentials from environment
// Require proper credentials for production use
if (!process.env.GOOGLE_CLOUD_CREDENTIALS) {
  console.error(
    "\n❌ GOOGLE_CLOUD_CREDENTIALS environment variable is missing!\n" +
    "Please provide your Google Cloud service account JSON credentials.\n" +
    "The application will start but invoice extraction will not work.\n"
  );
}

let projectId: string = "";
let location: string = "";
let credentials: any = null;
let vertexAI: VertexAI | null = null;

if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
  try {
    credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    
    if (!credentials.project_id) {
      console.error(
        "\n❌ GOOGLE_CLOUD_CREDENTIALS is missing 'project_id' field!\n" +
        "Please provide complete service account credentials.\n"
      );
    } else {
      projectId = credentials.project_id;
      location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
      
      console.log(`✅ Vertex AI configuration: project=${projectId}, location=${location}`);
      
      try {
        vertexAI = new VertexAI({
          project: projectId,
          location: location,
          googleAuthOptions: {
            credentials: credentials,
          },
        });
        
        console.log(`✅ Vertex AI initialized successfully with Gemini 2.5 Flash`);
      } catch (error) {
        console.error("❌ Failed to initialize Vertex AI:", error);
        vertexAI = null;
      }
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(
        "\n❌ GOOGLE_CLOUD_CREDENTIALS contains invalid JSON!\n" +
        "Please check the format of your credentials.\n"
      );
    } else {
      console.error("❌ Error parsing credentials:", error);
    }
  }
}

// Using Gemini 2.5 Flash via Vertex AI
// Note: Model name may vary by region and availability
const model = "gemini-2.5-flash";

export interface ExtractedInvoiceData {
  invoiceNumber?: string;
  invoiceDate?: string; // German format DD.MM.YYYY
  supplierName?: string;
  supplierAddress?: string;
  supplierVatId?: string;
  subtotal?: string;
  vatRate?: string;
  vatAmount?: string;
  totalAmount?: string;
  lineItems?: LineItem[];
}

export async function extractInvoiceData(
  fileData: string,
  mimeType: string
): Promise<ExtractedInvoiceData> {
  // Check if Vertex AI is properly initialized
  if (!vertexAI) {
    throw new Error(
      "Vertex AI ist nicht konfiguriert. Bitte setzen Sie GOOGLE_CLOUD_CREDENTIALS mit gültigen Google Cloud Service Account Zugangsdaten."
    );
  }
  
  if (!fileData || !mimeType) {
    throw new Error("Dateidaten oder MIME-Typ fehlen");
  }
  
  try {
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
    });

    // Remove data URL prefix if present
    const base64Data = fileData.replace(/^data:.*?;base64,/, "");
    
    if (!base64Data || base64Data.length === 0) {
      throw new Error("Ungültige Dateidaten - Base64-Dekodierung fehlgeschlagen");
    }

    const prompt = `Du bist ein Experte für die Extraktion von Rechnungsdaten aus deutschen Rechnungen.
Analysiere dieses Rechnungsdokument und extrahiere die folgenden Informationen im JSON-Format:

{
  "invoiceNumber": "Rechnungsnummer (z.B. RE-2024-001)",
  "invoiceDate": "Rechnungsdatum im Format DD.MM.YYYY",
  "supplierName": "Name des Lieferanten/Ausstellers",
  "supplierAddress": "Vollständige Adresse des Lieferanten",
  "supplierVatId": "USt-IdNr. oder Steuernummer (falls vorhanden, z.B. DE123456789)",
  "subtotal": "Nettobetrag/Zwischensumme als Zahl (z.B. 1234.56)",
  "vatRate": "Mehrwertsteuersatz als Zahl (z.B. 19 für 19%)",
  "vatAmount": "Mehrwertsteuerbetrag als Zahl (z.B. 234.56)",
  "totalAmount": "Gesamtbetrag/Bruttobetrag als Zahl (z.B. 1469.12)",
  "lineItems": [
    {
      "description": "Beschreibung der Position",
      "quantity": Menge als Zahl,
      "unitPrice": "Einzelpreis als String (z.B. '12,50 €')",
      "total": "Gesamtpreis dieser Position als String (z.B. '25,00 €')"
    }
  ]
}

Wichtige Hinweise:
- Alle Geldbeträge als Dezimalzahlen mit Punkt (nicht Komma)
- Datum im Format DD.MM.YYYY
- Falls ein Feld nicht gefunden wird, setze es auf null
- Bei deutschen Rechnungen ist die MwSt. meist 19% oder 7%
- Extrahiere alle Positionen aus der Rechnung für lineItems

Antworte NUR mit dem JSON-Objekt, ohne zusätzlichen Text.`;

    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    };

    const response = await generativeModel.generateContent(request);
    const result = response.response;
    
    if (!result || !result.candidates || result.candidates.length === 0) {
      throw new Error("Keine Antwort vom KI-Modell erhalten");
    }

    const candidate = result.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("Leere Antwort vom KI-Modell");
    }

    const textResponse = candidate.content.parts[0].text || "";
    
    if (!textResponse || textResponse.trim().length === 0) {
      throw new Error("KI-Modell hat keinen Text zurückgegeben");
    }
    
    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = textResponse.trim();
    
    // Remove markdown code blocks (both ```json and ```)
    jsonText = jsonText.replace(/^```(?:json)?\s*/gm, "").replace(/```\s*$/gm, "");
    
    // Try to find JSON object if there's extra text using balanced brace matching
    // This accounts for braces inside string literals
    const firstBrace = jsonText.indexOf('{');
    if (firstBrace !== -1) {
      let depth = 0;
      let lastBrace = -1;
      let inString = false;
      let escapeNext = false;
      
      for (let i = firstBrace; i < jsonText.length; i++) {
        const char = jsonText[i];
        
        // Handle escape sequences
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        // Track string boundaries
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        // Only count braces outside of strings
        if (!inString) {
          if (char === '{') {
            depth++;
          } else if (char === '}') {
            depth--;
            if (depth === 0) {
              lastBrace = i;
              break;
            }
          }
        }
      }
      
      // Verify we found balanced braces
      if (lastBrace === -1 || depth !== 0) {
        console.error("Unbalanced braces in AI response");
        console.error("Response text:", textResponse);
        throw new Error("KI-Antwort enthält unausgewogene geschweifte Klammern. Bitte versuchen Sie es erneut.");
      }
      
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    
    // Remove any leading/trailing whitespace and newlines
    jsonText = jsonText.trim();
    
    try {
      const extractedData = JSON.parse(jsonText) as ExtractedInvoiceData;
      return extractedData;
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error("Response text:", textResponse);
      console.error("Cleaned JSON text:", jsonText);
      throw new Error("Konnte extrahierte Daten nicht als JSON parsen");
    }
  } catch (error) {
    console.error("Error extracting invoice data:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("quota")) {
        throw new Error("API-Quota überschritten. Bitte versuchen Sie es später erneut.");
      }
      if (error.message.includes("permission")) {
        throw new Error("Keine Berechtigung für Vertex AI. Überprüfen Sie die Service Account Rechte.");
      }
      throw new Error(`Extraktion fehlgeschlagen: ${error.message}`);
    }
    throw new Error(`Extraktion fehlgeschlagen: ${String(error)}`);
  }
}

// German VAT ID validation (basic format check)
export function validateGermanVatId(vatId: string): boolean {
  if (!vatId) return false;
  
  // German VAT ID format: DE + 9 digits
  const dePattern = /^DE\d{9}$/;
  
  // Also accept EU VAT IDs
  const euPattern = /^[A-Z]{2}\d{8,12}$/;
  
  return dePattern.test(vatId.replace(/\s/g, "")) || euPattern.test(vatId.replace(/\s/g, ""));
}
