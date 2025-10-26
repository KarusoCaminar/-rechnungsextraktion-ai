# Rechnungsextraktion

## Overview

This is an invoice data extraction web application that uses Google's Gemini 2.5 Flash (via Vertex AI) to automatically extract structured data from uploaded invoices. The system accepts JPG, PNG, and PDF files, processes them using AI vision capabilities, and presents the extracted data (invoice numbers, dates, amounts, VAT information, line items) in a structured format with validation and export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite as the build tool and development server.

**UI Component System**: shadcn/ui components based on Radix UI primitives with Tailwind CSS for styling. The design follows Material Design 3 principles focused on data clarity and professional appearance. Custom CSS variables define the complete color system for both light and dark modes.

**State Management**: TanStack Query (React Query) v5 for server state management with custom query client configuration. No global client-side state management library is used; component-level state is managed with React hooks (useState, useCallback).

**Routing**: wouter library for lightweight client-side routing with declarative route definitions in App.tsx. Routes include dashboard (/), upload (/upload), history (/history), and invoice detail (/invoice/:id).

**Layout System**: Collapsible sidebar navigation using shadcn/ui Sidebar component with responsive behavior. Main content area uses flexbox layout with responsive grid systems (Tailwind's grid utilities) for dashboard cards and invoice lists.

**Key Pages**:
- **Dashboard**: Displays statistics overview with four stat cards (total invoices, completed, processing, errors) and total amount calculation from completed invoices
- **Upload**: Drag-and-drop file upload interface with preview, sample invoice selection, and real-time upload progress using react-dropzone
- **History**: Invoice list with status badges, delete/export actions, and CSV/JSON export capabilities
- **Invoice Detail**: Full invoice view with extracted data display, file preview (base64 images or PDF indicator), and individual invoice actions

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript in ESM module format.

**API Design**: RESTful API endpoints following conventional HTTP methods:
- `GET /api/invoices` - Retrieve all invoices
- `GET /api/invoices/:id` - Retrieve single invoice by ID
- `POST /api/invoices/upload` - Upload and process invoice file (multipart/form-data)
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/export?format=csv|json` - Export invoices in specified format

**File Upload Handling**: Multer middleware for multipart/form-data processing with 10MB file size limit and mimetype validation (image/jpeg, image/png, application/pdf). Files are stored in memory as buffers and converted to base64 for storage.

**PDF Processing**: pdf-parse library extracts text content from PDF files before sending to AI model, enabling text-based analysis alongside vision capabilities.

**AI Integration**: Google Vertex AI with Gemini 2.5 Flash model for invoice data extraction. The system uses vision capabilities to analyze invoice images/PDFs and structured prompts to extract specific fields (invoice number, date, supplier info, amounts, VAT, line items). Includes graceful degradation when credentials are missing - application starts but extraction fails with clear error messages.

**Error Handling**: Comprehensive error handling with German-language error messages for user-facing responses. Detailed server-side logging for debugging. Try-catch blocks around all async operations with appropriate HTTP status codes (404, 500, etc.).

**Request Logging Middleware**: Custom Express middleware captures request/response data for API endpoints, logging method, path, status code, duration, and JSON response bodies (truncated to 80 characters).

**Development Tools**: Custom Vite middleware setup for development with HMR (Hot Module Replacement), runtime error overlay via @replit/vite-plugin-runtime-error-modal, and conditional loading of Replit-specific plugins (cartographer, dev-banner) in development mode only.

### Data Storage

**Storage Interface**: Abstract IStorage interface defines methods for invoice and user operations, allowing for easy swapping between in-memory and database implementations.

**Current Implementation**: MemStorage class provides in-memory storage using JavaScript Maps. Invoices and users are stored in memory with UUID-based IDs generated via Node's crypto.randomUUID(). Data persists only during application runtime.

**Database Schema**: Drizzle ORM schema defined in shared/schema.ts for PostgreSQL with the invoices table containing:
- File metadata (fileName, fileType, fileData as base64)
- Extracted invoice fields (invoiceNumber, invoiceDate, supplier details, amounts)
- Line items as JSONB array
- VAT validation status and processing status
- Timestamps

**Migration Configuration**: drizzle.config.ts configured for PostgreSQL dialect with migrations output to ./migrations directory. Requires DATABASE_URL environment variable (currently not connected to actual database - using in-memory storage).

### External Dependencies

**Google Cloud Vertex AI**: Primary AI service for invoice data extraction using Gemini 2.5 Flash model. Requires GOOGLE_CLOUD_CREDENTIALS environment variable containing service account JSON credentials with project_id and private_key. Optional GOOGLE_CLOUD_LOCATION environment variable (defaults to us-central1).

**Service Account Configuration**: Application expects complete Google Cloud service account credentials in JSON format. The gemini-vertex.ts module initializes the VertexAI client with these credentials and handles missing/invalid credential scenarios gracefully.

**VAT Validation**: extractInvoiceData function includes German VAT ID validation logic (checks format DE followed by 9 digits). The validateGermanVatId function is declared but implementation details are not visible in provided files.

**Third-Party UI Libraries**: Extensive use of Radix UI primitives (@radix-ui/react-*) for accessible component foundations, styled with Tailwind CSS utility classes and CSS variables.

**Build & Development Dependencies**: 
- Vite for build tooling and dev server
- esbuild for server-side bundling in production
- tsx for TypeScript execution in development
- Replit-specific plugins for enhanced development experience (cartographer for code navigation, dev-banner, runtime error modal)

**Font Loading**: Google Fonts CDN loads Inter, DM Sans, Fira Code, Geist Mono, and Architects Daughter font families via <link> tags in client/index.html.