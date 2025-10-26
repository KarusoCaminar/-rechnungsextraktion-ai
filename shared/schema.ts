import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Invoice data extracted from German invoices
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // 'image/jpeg', 'image/png', 'application/pdf'
  fileData: text("file_data").notNull(), // base64 encoded
  
  // Extracted invoice data
  invoiceNumber: text("invoice_number"),
  invoiceDate: text("invoice_date"), // German format: DD.MM.YYYY
  supplierName: text("supplier_name"),
  supplierAddress: text("supplier_address"),
  supplierVatId: text("supplier_vat_id"),
  
  // Financial data
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
  vatRate: decimal("vat_rate", { precision: 5, scale: 2 }), // e.g., 19.00 for 19%
  vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  
  // Line items as JSON
  lineItems: jsonb("line_items").$type<LineItem[]>(),
  
  // Validation status
  vatValidated: text("vat_validated"), // 'valid', 'invalid', 'not_checked'
  
  // Processing status
  status: text("status").notNull().default("processing"), // 'processing', 'completed', 'error'
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// User schema (keep existing for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
