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

    const prompt = `You are an expert in extracting invoice data from invoices in any language (German, English, etc.).
Analyze this invoice document and extract the following information in JSON format:

{
  "invoiceNumber": "Invoice number (e.g. RE-2024-001, INV-12345)",
  "invoiceDate": "Invoice date in DD.MM.YYYY format",
  "supplierName": "Supplier/vendor name",
  "supplierAddress": "Complete supplier address",
  "supplierVatId": "VAT ID or tax number if present (e.g. DE123456789, GB123456789)",
  "subtotal": "Net amount/subtotal as decimal number (e.g. 1234.56)",
  "vatRate": "VAT/tax rate as number (e.g. 19 for 19%, 20 for 20%)",
  "vatAmount": "VAT/tax amount as decimal number (e.g. 234.56)",
  "totalAmount": "Total/gross amount as decimal number (e.g. 1469.12)",
  "lineItems": [
    {
      "description": "Item description",
      "quantity": quantity as number,
      "unitPrice": "Unit price as string (e.g. '12.50 €', '$15.00')",
      "total": "Line total as string (e.g. '25.00 €', '$30.00')"
    }
  ]
}

Important instructions:
- ALL monetary amounts as decimal numbers with DOT (not comma) - e.g. 1234.56
- Date in DD.MM.YYYY format regardless of original format
- If a field is not found, set it to null
- Extract ALL line items from the invoice
- CRITICAL: For multi-page documents, focus on the FIRST PAGE with the main invoice
- Ignore attachments, payment terms, or additional pages
- Relevant data (amounts, line items, supplier) is usually on page 1
- Works for invoices in ANY language (German, English, French, etc.)

CRITICAL OUTPUT REQUIREMENTS:
- Respond ONLY with valid JSON object
- Do NOT include any markdown code blocks (no ```json or ```)
- Do NOT include any explanatory text before or after the JSON
- Do NOT include any comments or notes
- Start your response with { and end with }
- Ensure all JSON brackets and braces are properly balanced
- Ensure all strings are properly escaped and quoted

Example of correct output format:
{"invoiceNumber":"RE-2024-001","invoiceDate":"01.01.2024",...}`;

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
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
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
    
    // Helper function to extract JSON using balanced brace matching
    function extractJSON(text: string): string | null {
      const firstBrace = text.indexOf('{');
      if (firstBrace === -1) return null;
      
      let depth = 0;
      let lastBrace = -1;
      let inString = false;
      let escapeNext = false;
      
      for (let i = firstBrace; i < text.length; i++) {
        const char = text[i];
        
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
      
      if (lastBrace !== -1 && depth === 0) {
        return text.substring(firstBrace, lastBrace + 1);
      }
      
      return null;
    }
    
    // Try to extract JSON using balanced brace matching
    let extractedJson = extractJSON(jsonText);
    
    // If extraction failed, try alternative methods
    if (!extractedJson) {
      console.warn("Balanced brace extraction failed, trying alternative methods...");
      
      // Method 1: Try to find JSON between first { and last }
      const firstBraceAlt = jsonText.indexOf('{');
      const lastBraceAlt = jsonText.lastIndexOf('}');
      if (firstBraceAlt !== -1 && lastBraceAlt !== -1 && lastBraceAlt > firstBraceAlt) {
        extractedJson = jsonText.substring(firstBraceAlt, lastBraceAlt + 1);
        console.log("Using alternative extraction method (first { to last })");
      }
      
      // Method 2: Try regex to find JSON object
      if (!extractedJson) {
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch && jsonMatch[0]) {
          extractedJson = jsonMatch[0];
          console.log("Using regex extraction method");
        }
      }
    }
    
    if (!extractedJson) {
      console.error("Could not extract JSON from response");
      console.error("Response text:", textResponse);
      throw new Error("KI-Antwort enthält kein gültiges JSON. Bitte versuchen Sie es erneut.");
    }
    
    // Clean extracted JSON
    extractedJson = extractedJson.trim();
    
    // Try to parse the JSON
    try {
      const extractedData = JSON.parse(extractedJson) as ExtractedInvoiceData;
      return extractedData;
    } catch (parseError) {
      // If parsing fails, try to fix common issues
      console.warn("Initial JSON parse failed, attempting to fix common issues...");
      
      // Try to fix unescaped quotes in strings (basic attempt)
      let fixedJson = extractedJson;
      
      // Try parsing again after potential fixes
      try {
        // Remove trailing commas before closing braces/brackets
        fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
        const extractedData = JSON.parse(fixedJson) as ExtractedInvoiceData;
        console.log("Successfully parsed after fixing trailing commas");
        return extractedData;
      } catch (secondParseError) {
        console.error("JSON parsing failed after fixes:", secondParseError);
        console.error("Original response text:", textResponse);
        console.error("Cleaned JSON text:", extractedJson);
        console.error("Fixed JSON text:", fixedJson);
        throw new Error("Konnte extrahierte Daten nicht als JSON parsen. Die KI-Antwort war möglicherweise fehlerhaft formatiert.");
      }
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
