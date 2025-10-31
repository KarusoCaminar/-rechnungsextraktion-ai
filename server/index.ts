import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();

// Auto-initialize database tables on startup
async function initializeDatabase() {
  try {
    log("🔄 Checking database connection...");
    await db.execute(sql`SELECT 1`);
    log("✅ Database connected successfully");
    
    // Run migrations automatically
    log("🔄 Running database migrations...");
    const { execSync } = await import('child_process');
    execSync('npm run db:push', { stdio: 'inherit' });
    log("✅ Database migrations completed");
    
    // Clean up old invoices (older than 24 hours)
    await cleanupOldInvoices();
  } catch (error) {
    log(`⚠️ Database initialization warning: ${error}`);
    log("⚠️ Continuing startup, but database may need manual setup");
  }
}

// Delete invoices older than 24 hours
async function cleanupOldInvoices() {
  try {
    log("🔄 Cleaning up old invoices...");
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await db.execute(sql`
      DELETE FROM invoices 
      WHERE created_at < ${twentyFourHoursAgo}
    `);
    log(`✅ Cleaned up old invoices (${result.rowCount || 0} deleted)`);
  } catch (error) {
    log(`⚠️ Cleanup warning: ${error}`);
  }
}

// Auto-delete all invoices every hour (for privacy)
async function setupAutoDeleteJob() {
  const { storage } = await import("./storage");
  
  // Run immediately on startup
  try {
    const deletedCount = await storage.deleteAllInvoices();
    log(`🗑️ Auto-delete: Deleted all invoices on startup (${deletedCount} invoices removed)`);
  } catch (error) {
    log(`⚠️ Auto-delete error on startup: ${error}`);
  }

  // Then run every hour (3600000 ms)
  setInterval(async () => {
    try {
      const deletedCount = await storage.deleteAllInvoices();
      log(`🗑️ Auto-delete: Deleted all invoices (${deletedCount} invoices removed)`);
    } catch (error) {
      log(`⚠️ Auto-delete error: ${error}`);
    }
  }, 60 * 60 * 1000); // 1 hour = 3600000 ms
}

// CORS Configuration for iframe embedding
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from configured origins or in development mode
  if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || app.get('env') === 'development')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database first
  await initializeDatabase();
  
  // Setup auto-delete job (every hour)
  await setupAutoDeleteJob();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
