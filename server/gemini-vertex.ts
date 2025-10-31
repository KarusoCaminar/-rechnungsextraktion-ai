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
        // responseMimeType is optional - helps ensure JSON output
        // If unsupported by the model version, the prompt will ensure JSON output
        responseMimeType: "application/json",
      } as any, // Type assertion for compatibility with different Vertex AI SDK versions
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
    
    // Check for truncated response - handles cases where JSON is cut off mid-string
    // Example: ends with "description (without closing quote)
    const quoteCount = (jsonText.match(/"/g) || []).length;
    const hasIncompleteString = quoteCount % 2 !== 0;
    const lastLine = jsonText.trim().split('\n').pop() || '';
    const endsWithIncompleteProperty = /:\s*"[^"]*$/.test(lastLine);
    
    if (hasIncompleteString || endsWithIncompleteProperty) {
      console.warn("Detected truncated response (incomplete string at end)");
      const firstBrace = jsonText.indexOf('{');
      if (firstBrace !== -1) {
        let incompleteJson = jsonText.substring(firstBrace);
        
        // Close the incomplete string property
        // Pattern: "description": "text (without closing quote)
        if (endsWithIncompleteProperty || incompleteJson.match(/:\s*"[^"]*$/)) {
          // Close the incomplete string - find last :" and add closing quote
          incompleteJson = incompleteJson.replace(/:\s*"([^"]*)$/, ': "$1"');
        } else if (hasIncompleteString) {
          // Just add closing quote if quote count is odd
          incompleteJson = incompleteJson.trim() + '"';
        }
        
        // Check if we're inside lineItems array
        const isInLineItems = incompleteJson.includes('"lineItems"') && 
                             incompleteJson.lastIndexOf('"lineItems"') > incompleteJson.lastIndexOf(']');
        
        // Count open structures
        const openBraces = (incompleteJson.match(/\{/g) || []).length;
        const closeBraces = (incompleteJson.match(/\}/g) || []).length;
        const openBrackets = (incompleteJson.match(/\[/g) || []).length;
        const closeBrackets = (incompleteJson.match(/\]/g) || []).length;
        
        // If inside lineItems and array is not closed, close it
        if (isInLineItems && openBrackets > closeBrackets) {
          // Make sure property ends properly before closing array
          if (!incompleteJson.trim().endsWith(',') && !incompleteJson.trim().endsWith(']')) {
            incompleteJson = incompleteJson.trim() + '\n]';
          }
        }
        
        // Close remaining arrays
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          incompleteJson = incompleteJson.trim() + '\n]';
        }
        
        // Close objects
        for (let i = 0; i < openBraces - closeBraces; i++) {
          incompleteJson = incompleteJson.trim() + '\n}';
        }
        
        extractedJson = incompleteJson;
        console.log("Fixed truncated JSON with incomplete string");
      }
    }
    
    // If extraction still failed, try alternative methods
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
      console.error("Response text:", textResponse.substring(0, 500)); // Log first 500 chars
      throw new Error("KI-Antwort enthält kein gültiges JSON. Bitte versuchen Sie es erneut.");
    }
    
    // Clean extracted JSON
    extractedJson = extractedJson.trim();
    
    // Helper function to fix incomplete JSON strings
    function fixIncompleteJson(json: string): string {
      // Fix incomplete strings at the end
      // Look for patterns like: "description (without closing quote)
      const incompleteStringPattern = /:\s*"([^"]*)$/m;
      const match = json.match(incompleteStringPattern);
      
      if (match && !match[0].endsWith('"')) {
        // Close the incomplete string
        json = json.replace(incompleteStringPattern, ': "$1"');
      }
      
      return json;
    }
    
    // Try to parse the JSON
    try {
      const extractedData = JSON.parse(extractedJson) as ExtractedInvoiceData;
      return extractedData;
    } catch (parseError) {
      // If parsing fails, try to fix common issues
      console.warn("Initial JSON parse failed, attempting to fix common issues...");
      
      let fixedJson = extractedJson;
      
      // Fix 1: Fix incomplete strings
      fixedJson = fixIncompleteJson(fixedJson);
      
      // Fix 2: Remove trailing commas
      fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix 3: Try to close unclosed strings in properties
      fixedJson = fixedJson.replace(/:\s*"([^"]*)$/gm, (match, content) => {
        if (!match.endsWith('"')) {
          return `: "${content}"`;
        }
        return match;
      });
      
      // Try parsing again after fixes
      try {
        const extractedData = JSON.parse(fixedJson) as ExtractedInvoiceData;
        console.log("Successfully parsed after fixing common issues");
        return extractedData;
      } catch (secondParseError) {
        // Last attempt: Try to extract partial data from what we have
        console.warn("JSON parsing failed after fixes, attempting partial extraction...");
        try {
          // Try to parse with a fallback: close all open structures
          let recoveryJson = fixedJson;
          
          // Count and close all open structures
          const openBracesCount = (recoveryJson.match(/\{/g) || []).length;
          const closeBracesCount = (recoveryJson.match(/\}/g) || []).length;
          const openBracketsCount = (recoveryJson.match(/\[/g) || []).length;
          const closeBracketsCount = (recoveryJson.match(/\]/g) || []).length;
          
          // Close incomplete strings
          const quoteCount = (recoveryJson.match(/"/g) || []).length;
          if (quoteCount % 2 !== 0) {
            recoveryJson = recoveryJson.trim() + '"';
          }
          
          // Close arrays
          for (let i = 0; i < openBracketsCount - closeBracketsCount; i++) {
            recoveryJson = recoveryJson.trim() + ']';
          }
          
          // Close objects
          for (let i = 0; i < openBracesCount - closeBracesCount; i++) {
            recoveryJson = recoveryJson.trim() + '}';
          }
          
          const extractedData = JSON.parse(recoveryJson) as ExtractedInvoiceData;
          console.log("Successfully parsed after recovery attempt");
          return extractedData;
        } catch (recoveryError) {
          console.error("All JSON parsing attempts failed");
          console.error("Original response text (first 1000 chars):", textResponse.substring(0, 1000));
          console.error("Cleaned JSON text:", extractedJson.substring(0, 500));
          console.error("Fixed JSON text:", fixedJson.substring(0, 500));
          throw new Error("Konnte extrahierte Daten nicht als JSON parsen. Die KI-Antwort war möglicherweise abgeschnitten oder fehlerhaft formatiert.");
        }
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
