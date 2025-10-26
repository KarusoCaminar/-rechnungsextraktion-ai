# German Invoice Extraction System

## Overview

This is a German invoice data extraction web application that uses Google's Gemini 2.5 Flash (via Vertex AI) to automatically extract structured data from uploaded invoices in German. The system accepts JPG, PNG, and PDF files, processes them using AI-powered OCR and extraction, and stores the extracted data including supplier information, line items, amounts, VAT details, and validation status. The application provides a dashboard for monitoring extraction statistics, an upload interface with sample invoices, a history view for managing processed invoices, and detailed invoice views with export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite as the build tool and bundler.

**UI Component System**: shadcn/ui components based on Radix UI primitives with Tailwind CSS for styling. The design follows Material Design 3 principles focused on data clarity, efficient workflows, and professional appearance. Typography uses Inter font family with a defined hierarchy for different content types.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. No global client-side state management library is used; component state is managed with React hooks.

**Routing**: wouter for client-side routing with a simple, declarative route configuration in App.tsx.

**Layout System**: Collapsible sidebar navigation using shadcn/ui Sidebar component with mobile responsiveness. Main content area uses a flex-based layout with responsive grid systems for dashboard cards and invoice lists.

**Key Pages**:
- Dashboard: Statistics overview with four stat cards (total invoices, completed, processing, errors) and total amount calculation
- Upload: Drag-and-drop file upload with preview, sample invoice selection, and real-time upload progress
- History: Invoice list with status badges, delete/export actions, and CSV/JSON export capabilities
- Invoice Detail: Full invoice view with extracted data display, file preview, and individual invoice actions

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API endpoints following conventional HTTP methods:
- GET /api/invoices - Retrieve all invoices
- GET /api/invoices/:id - Retrieve single invoice
- POST /api/invoices/upload - Upload and process invoice
- DELETE /api/invoices/:id - Delete invoice
- GET /api/invoices/export - Export invoices (CSV/JSON)

**File Upload Handling**: Multer middleware for multipart/form-data processing with 10MB file size limit and mimetype validation (image/jpeg, image/png, application/pdf).

**PDF Processing**: pdf-parse library for extracting text content from PDF files before sending to AI model.

**AI Integration**: Google Vertex AI with Gemini 2.5 Flash model for invoice data extraction. The system uses vision capabilities to analyze invoice images and structured prompts to extract specific fields (invoice number, date, supplier details, line items, amounts, VAT information).

**Error Handling**: Comprehensive error handling with German-language error messages, graceful degradation when AI credentials are missing, and detailed logging for debugging.

**Development Tools**: Custom Vite middleware setup for development with HMR, runtime error overlay, and request logging middleware.

### Data Storage Solutions

**Primary Storage**: In-memory storage implementation (MemStorage class) using JavaScript Map objects for development and testing. The architecture is abstracted through an IStorage interface to allow easy migration to persistent storage.

**Schema Definition**: Drizzle ORM schema defined for PostgreSQL (dialect: "postgresql") with support for future database integration. Schema includes:
- Invoice metadata (id, fileName, fileType, fileData as base64)
- Extracted data fields (invoiceNumber, invoiceDate, supplier information)
- Financial data (subtotal, vatRate, vatAmount, totalAmount as decimal types)
- Line items stored as JSONB
- Processing status tracking (status, errorMessage)
- Timestamps (createdAt)

**Database Configuration**: Drizzle Kit configured with migrations directory, but database is not yet provisioned. The application expects DATABASE_URL environment variable for PostgreSQL connection.

**Migration Path**: The architecture supports adding PostgreSQL via Neon serverless database or similar PostgreSQL provider. The @neondatabase/serverless package is already included as a dependency.

### Authentication and Authorization Mechanisms

**Current State**: No authentication implemented. The storage interface includes user-related methods (getUser, getUserByUsername, createUser) suggesting authentication was planned or existed previously, but current routes do not enforce authentication.

**Session Management**: connect-pg-simple package included for PostgreSQL-backed sessions, but not actively used.

**Future Consideration**: Authentication implementation would require adding session middleware, user authentication routes, and protecting API endpoints with authentication checks.

### External Dependencies

**Google Cloud Vertex AI**: 
- **Package**: @google-cloud/vertexai
- **Purpose**: AI-powered invoice data extraction using Gemini 2.5 Flash model
- **Configuration**: Requires GOOGLE_CLOUD_CREDENTIALS environment variable with service account JSON, GOOGLE_CLOUD_LOCATION (defaults to us-central1)
- **Features Used**: Vision API for image analysis, structured output extraction
- **Fallback**: Application starts without credentials but extraction functionality is disabled with warning messages

**Google Generative AI**:
- **Package**: @google/genai
- **Purpose**: Alternative/supplementary AI capabilities (included but specific usage not evident in provided code)

**Database** (Planned):
- **Package**: @neondatabase/serverless
- **Type**: PostgreSQL serverless database
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Current Status**: Not provisioned; schema defined but using in-memory storage
- **Migration Command**: npm run db:push (drizzle-kit push)

**UI Component Libraries**:
- **Core**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS with custom design tokens, class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Additional**: react-day-picker for date selection, react-dropzone for file uploads, vaul for drawers, embla-carousel-react for carousels

**Development Environment**:
- **Platform**: Replit-specific plugins (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)
- **Features**: Runtime error overlay, development banner, code mapping

**Build and Deployment**:
- **Bundler**: Vite for frontend, esbuild for backend
- **TypeScript**: Full TypeScript support with strict mode enabled
- **Output**: Static frontend assets to dist/public, bundled backend to dist/index.js
- **Start Command**: NODE_ENV=production node dist/index.js