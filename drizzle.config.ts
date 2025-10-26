import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// Add SSL parameter to DATABASE_URL if not present
const databaseUrl = process.env.DATABASE_URL;
const urlWithSSL = databaseUrl.includes('?') 
  ? `${databaseUrl}&sslmode=require` 
  : `${databaseUrl}?sslmode=require`;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: urlWithSSL,
  },
});
