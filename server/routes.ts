import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { extractInvoiceData, validateGermanVatId } from "./gemini-vertex";
import type { InsertInvoice } from "@shared/schema";
import pdfParse from "pdf-parse";
import { db } from "./db";
import { sql } from "drizzle-orm";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Nur JPG, PNG und PDF Dateien sind erlaubt"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Lightweight health check endpoint with no side effects
  app.get("/healthz", (_req: any, res: any) => {
    res.type("text/plain").send("OK");
  });

  // Export invoices - MUST be before /:id route!
  app.get("/api/invoices/export", async (req, res) => {
    try {
      const format = req.query.format as string;
      const invoices = await storage.getAllInvoices();

      if (format === "csv") {
        // Generate CSV with UTF-8 BOM for Excel compatibility
        const headers = [
          "Rechnungsnummer",
          "Datum",
          "Lieferant",
          "USt-IdNr",
          "Zwischensumme",
          "MwSt-Satz",
          "MwSt-Betrag",
          "Gesamtsumme",
          "Status",
        ];

        const csvRows = [
          // Header row with proper escaping
          headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
          // Data rows with proper escaping
          ...invoices.map((inv) => {
            const row = [
              inv.invoiceNumber || "",
              inv.invoiceDate || "",
              inv.supplierName || "",
              inv.supplierVatId || "",
              inv.subtotal || "",
              inv.vatRate || "",
              inv.vatAmount || "",
              inv.totalAmount || "",
              inv.status || "",
            ];
            return row.map((cell) => {
              const val = String(cell || "").replace(/"/g, '""');
              return `"${val}"`;
            }).join(",");
          }),
        ];

        // UTF-8 BOM for Excel compatibility (korrekte Darstellung von Umlauten)
        const BOM = "\uFEFF";
        const csv = BOM + csvRows.join("\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=rechnungen-export.csv");
        res.send(csv);
      } else if (format === "json") {
        // Generate JSON (exclude file data for smaller file size)
        const exportData = invoices.map((inv) => ({
          id: inv.id,
          fileName: inv.fileName,
          invoiceNumber: inv.invoiceNumber,
          invoiceDate: inv.invoiceDate,
          supplierName: inv.supplierName,
          supplierAddress: inv.supplierAddress,
          supplierVatId: inv.supplierVatId,
          subtotal: inv.subtotal,
          vatRate: inv.vatRate,
          vatAmount: inv.vatAmount,
          totalAmount: inv.totalAmount,
          lineItems: inv.lineItems,
          vatValidated: inv.vatValidated,
          status: inv.status,
          createdAt: inv.createdAt,
        }));

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=rechnungen-export.json");
        res.json(exportData);
      } else {
        res.status(400).send("Ungültiges Format. Verwenden Sie 'csv' oder 'json'.");
      }
    } catch (error) {
      console.error("Error exporting invoices:", error);
      res.status(500).send("Fehler beim Exportieren der Rechnungen");
    }
  });
  
  // Get all invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).send("Fehler beim Abrufen der Rechnungen");
    }
  });

  // Get single invoice
  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).send("Rechnung nicht gefunden");
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).send("Fehler beim Abrufen der Rechnung");
    }
  });

  // Upload and process invoice
  app.post("/api/invoices/upload", upload.single("file"), async (req, res) => {
    try {
      // Clean up old invoices before uploading new one
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await db.execute(sql`DELETE FROM invoices WHERE created_at < ${twentyFourHoursAgo}`);
      
      if (!req.file) {
        return res.status(400).send("Keine Datei hochgeladen");
      }

      const file = req.file;
      const fileData = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      // Create initial invoice record
      const invoiceData: InsertInvoice = {
        fileName: file.originalname,
        fileType: file.mimetype,
        fileData: fileData,
        status: "processing",
        invoiceNumber: null,
        invoiceDate: null,
        supplierName: null,
        supplierAddress: null,
        supplierVatId: null,
        subtotal: null,
        vatRate: null,
        vatAmount: null,
        totalAmount: null,
        lineItems: null,
        vatValidated: null,
        errorMessage: null,
      };

      const invoice = await storage.createInvoice(invoiceData);

      // Process extraction asynchronously
      setImmediate(async () => {
        try {
          // Extract data using Vertex AI Gemini 2.5 Flash
          const extractedData = await extractInvoiceData(fileData, file.mimetype);

          // Validate German VAT ID if present
          let vatValidated = null;
          if (extractedData.supplierVatId) {
            vatValidated = validateGermanVatId(extractedData.supplierVatId) ? "valid" : "invalid";
          }

          // Update invoice with extracted data
          await storage.updateInvoice(invoice.id, {
            status: "completed",
            invoiceNumber: extractedData.invoiceNumber || null,
            invoiceDate: extractedData.invoiceDate || null,
            supplierName: extractedData.supplierName || null,
            supplierAddress: extractedData.supplierAddress || null,
            supplierVatId: extractedData.supplierVatId || null,
            subtotal: extractedData.subtotal || null,
            vatRate: extractedData.vatRate || null,
            vatAmount: extractedData.vatAmount || null,
            totalAmount: extractedData.totalAmount || null,
            lineItems: extractedData.lineItems || null,
            vatValidated: vatValidated,
          });

          console.log(`Invoice ${invoice.id} processed successfully`);
        } catch (error) {
          console.error(`Error processing invoice ${invoice.id}:`, error);
          
          // Provide user-friendly error messages
          let userMessage = "Unbekannter Fehler bei der Verarbeitung";
          if (error instanceof Error) {
            if (error.message.includes("quota") || error.message.includes("limit")) {
              userMessage = "API-Limit erreicht. Bitte versuchen Sie es später erneut.";
            } else if (error.message.includes("credentials") || error.message.includes("authentication")) {
              userMessage = "Authentifizierung fehlgeschlagen. Bitte kontaktieren Sie den Support.";
            } else if (error.message.includes("timeout")) {
              userMessage = "Zeitüberschreitung. Bitte versuchen Sie es erneut.";
            } else if (error.message.includes("network") || error.message.includes("ECONNREFUSED")) {
              userMessage = "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.";
            } else {
              userMessage = `Verarbeitung fehlgeschlagen: ${error.message}`;
            }
          }
          
          await storage.updateInvoice(invoice.id, {
            status: "error",
            errorMessage: userMessage,
          });
        }
      });

      // Return immediately with processing status
      res.json(invoice);
    } catch (error) {
      console.error("Error uploading invoice:", error);
      res.status(500).send(error instanceof Error ? error.message : "Fehler beim Hochladen");
    }
  });

  // Delete invoice
  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInvoice(req.params.id);
      if (!deleted) {
        return res.status(404).send("Rechnung nicht gefunden");
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).send("Fehler beim Löschen der Rechnung");
    }
  });

  // Delete all invoices
  app.delete("/api/invoices", async (req, res) => {
    try {
      const deletedCount = await storage.deleteAllInvoices();
      console.log(`🗑️ Deleted all invoices (${deletedCount} invoices removed)`);
      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("Error deleting all invoices:", error);
      res.status(500).send("Fehler beim Löschen aller Rechnungen");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
