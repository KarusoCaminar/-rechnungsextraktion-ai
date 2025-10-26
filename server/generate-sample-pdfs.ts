// Script to generate sample German invoice PDFs
// This is a simple text-based approach since we don't have PDF generation libraries

export const samplePDF1Content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 595 842]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 850
>>
stream
BT
/F1 24 Tf
50 800 Td
(Schmidt & Partner GmbH) Tj
0 -30 Td
/F1 12 Tf
(Musterstrasse 123) Tj
0 -15 Td
(10115 Berlin) Tj
0 -15 Td
(USt-IdNr: DE123456789) Tj
0 -50 Td
/F1 18 Tf
(RECHNUNG) Tj
0 -30 Td
/F1 12 Tf
(Rechnungsnummer: RE-2025-042) Tj
0 -15 Td
(Datum: 15.01.2025) Tj
0 -40 Td
(Kunde: Mustermann GmbH) Tj
0 -15 Td
(Kundenstrasse 456) Tj
0 -15 Td
(20095 Hamburg) Tj
0 -40 Td
/F1 14 Tf
(Leistungen:) Tj
0 -25 Td
/F1 11 Tf
(1. Beratung Software-Entwicklung    8 Std    EUR 120,00    EUR   960,00) Tj
0 -15 Td
(2. Projektmanagement                 4 Std    EUR 150,00    EUR   600,00) Tj
0 -15 Td
(3. Code Review                       2 Std    EUR 100,00    EUR   200,00) Tj
0 -30 Td
(Zwischensumme (Netto):                                      EUR 1.760,00) Tj
0 -15 Td
(19% MwSt:                                                    EUR   334,40) Tj
0 -15 Td
/F1 12 Tf
(Gesamtbetrag:                                                EUR 2.094,40) Tj
0 -40 Td
/F1 10 Tf
(Zahlbar innerhalb 14 Tagen ohne Abzug.) Tj
0 -15 Td
(Bankverbindung: IBAN DE89 3704 0044 0532 0130 00) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000315 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
1215
%%EOF`;

export const samplePDF2Content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 595 842]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 750
>>
stream
BT
/F1 20 Tf
50 800 Td
(Beratungsrechnung) Tj
0 -40 Td
/F1 12 Tf
(Freiberufliche Beratung IT-Consulting) Tj
0 -15 Td
(Max Mustermann) Tj
0 -15 Td
(Beraterweg 99, 80333 Muenchen) Tj
0 -15 Td
(Steuernummer: 123/456/78901) Tj
0 -50 Td
/F1 16 Tf
(Rechnung Nr: 2025-003) Tj
0 -20 Td
/F1 12 Tf
(Rechnungsdatum: 22.01.2025) Tj
0 -40 Td
(An: TechStart AG) Tj
0 -15 Td
(Startup-Allee 7) Tj
0 -15 Td
(10178 Berlin) Tj
0 -40 Td
/F1 14 Tf
(Beratungsleistungen:) Tj
0 -25 Td
/F1 11 Tf
(IT-Beratung Cloud-Migration         12 Std     EUR 95,00    EUR 1.140,00) Tj
0 -15 Td
(Technische Dokumentation             6 Std     EUR 75,00    EUR   450,00) Tj
0 -30 Td
(Nettobetrag:                                                 EUR 1.590,00) Tj
0 -15 Td
(zzgl. 19% Umsatzsteuer:                                      EUR   302,10) Tj
0 -15 Td
/F1 12 Tf
(Bruttobetrag:                                                EUR 1.892,10) Tj
0 -40 Td
/F1 10 Tf
(Zahlbar innerhalb 14 Tagen.) Tj
0 -15 Td
(Kontoverbindung: Sparkasse Muenchen) Tj
0 -15 Td
(IBAN: DE12 7015 0000 1234 5678 90) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000315 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
1115
%%EOF`;
