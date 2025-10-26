# 📄 Rechnungsextraktion - AI-Powered Invoice Processing

**Automatische Extraktion von Rechnungsdaten mit Google Gemini 2.5 Flash**

Eine moderne Web-App zur automatischen Verarbeitung von Rechnungen (JPG, PNG, PDF) mit KI-gestützter Datenextraktion, Validierung und Export-Funktionen.

---

## ✨ Features

- 📤 **Drag & Drop Upload** - Einfaches Hochladen von Rechnungen
- 🤖 **AI-Extraktion** - Automatische Erkennung aller Rechnungsdaten
- ✅ **VAT-Validierung** - Deutsche & EU-USt-IdNr. Prüfung
- 📊 **Dashboard** - Übersicht über alle verarbeiteten Rechnungen
- 📥 **Export** - CSV & JSON Export
- 🎨 **Moderne UI** - Responsive Design mit Dark Mode
- 🔗 **Website-Integration** - Einfach in bestehende Websites einbindbar

---

## 🚀 Quick Start

### Option 1: Replit (Empfohlen)

**Setup in 10 Minuten:**

1. **Projekt in Replit importieren**
2. **PostgreSQL aktivieren** (Tools → Database)
3. **Google Cloud Credentials hinzufügen** (Tools → Secrets)
4. **Migration ausführen:** `npm run db:push`
5. **Run klicken** ✅

**Detaillierte Anleitung:** Siehe [`QUICK_START.md`](QUICK_START.md)

**Replit Setup:** Siehe [`REPLIT_SETUP.md`](REPLIT_SETUP.md)

### Option 2: Lokale Entwicklung

```bash
# Repository klonen
git clone <repo-url>
cd Rechnungsextraktion-Replit

# Dependencies installieren
npm install

# Environment Variables setzen
# Erstellen Sie .env mit DATABASE_URL und GOOGLE_CLOUD_CREDENTIALS

# Database Migration
npm run db:push

# Development Server starten
npm run dev
```

App läuft auf: `http://localhost:5000`

---

## 📋 Voraussetzungen

### Erforderlich:
- **Node.js 20+**
- **PostgreSQL 16+** Datenbank
- **Google Cloud Account** mit:
  - Vertex AI API aktiviert
  - Service Account mit "Vertex AI User" Rolle

### Optional:
- Replit Account (für einfaches Hosting)

---

## 🌐 Website-Integration

Die App kann einfach in Ihre bestehende Website eingebunden werden.

### Quick Integration:

```html
<!-- Button auf Ihrer Website -->
<button onclick="openInvoice()">📄 Invoice Data Extraction</button>

<!-- iFrame Modal -->
<div id="invoice-modal" style="display:none;">
  <iframe src="https://your-repl.repl.co/upload"></iframe>
</div>

<script>
  function openInvoice() {
    document.getElementById('invoice-modal').style.display = 'block';
  }
</script>
```

**Vollständige Integration-Anleitung:**
- 📖 [`WEBSITE_INTEGRATION.md`](WEBSITE_INTEGRATION.md)
- 📝 [`example-website-integration.html`](example-website-integration.html)

---

## 🔧 Konfiguration

### Environment Variables

| Variable | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `DATABASE_URL` | PostgreSQL Connection String | ✅ Ja |
| `GOOGLE_CLOUD_CREDENTIALS` | Service Account JSON | ✅ Ja |
| `GOOGLE_CLOUD_LOCATION` | Vertex AI Region (default: us-central1) | ⭕ Optional |
| `ALLOWED_ORIGINS` | CORS Origins für iframe-Embedding | ⭕ Optional |
| `PORT` | Server Port (default: 5000) | ⭕ Optional |

### Replit Secrets

In Replit werden Environment Variables als **Secrets** gespeichert:

**Tools → Secrets:**
- `DATABASE_URL` → Automatisch von PostgreSQL
- `GOOGLE_CLOUD_CREDENTIALS` → Manuell hinzufügen
- `ALLOWED_ORIGINS` → `http://localhost:8000,https://ihre-website.com`

**Setup-Anleitung:** [`REPLIT_SETUP.md`](REPLIT_SETUP.md)

---

## 🎯 Architektur

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (Build Tool)
- TailwindCSS + shadcn/ui
- TanStack Query (State Management)
- Wouter (Routing)

**Backend:**
- Node.js + Express
- Drizzle ORM
- PostgreSQL (Neon)
- Google Vertex AI (Gemini 2.5 Flash)

**Deployment:**
- Replit (Primary)
- Docker-fähig
- Alternative: Railway, Render, Fly.io

### Datenbankschema

```sql
CREATE TABLE invoices (
  id VARCHAR PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_data TEXT NOT NULL,
  
  -- Extracted Data
  invoice_number TEXT,
  invoice_date TEXT,
  supplier_name TEXT,
  supplier_address TEXT,
  supplier_vat_id TEXT,
  
  -- Financial Data
  subtotal DECIMAL(10,2),
  vat_rate DECIMAL(5,2),
  vat_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  
  -- Line Items (JSON)
  line_items JSONB,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'processing',
  vat_validated TEXT,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 API Endpoints

### Invoices

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| GET | `/api/invoices` | Alle Rechnungen abrufen |
| GET | `/api/invoices/:id` | Einzelne Rechnung abrufen |
| POST | `/api/invoices/upload` | Rechnung hochladen & verarbeiten |
| DELETE | `/api/invoices/:id` | Rechnung löschen |
| GET | `/api/invoices/export?format=csv\|json` | Rechnungen exportieren |

### Request/Response Examples

**Upload:**
```bash
curl -X POST https://your-app.repl.co/api/invoices/upload \
  -F "file=@rechnung.pdf"
```

**Response:**
```json
{
  "id": "uuid",
  "fileName": "rechnung.pdf",
  "status": "processing",
  "createdAt": "2025-10-26T12:00:00Z"
}
```

---

## 🧪 Testing

### Manuelle Tests

1. **Upload Test:**
   - Gehen Sie zu `/upload`
   - Laden Sie eine Beispielrechnung hoch
   - Prüfen Sie Status in `/history`

2. **API Test:**
   ```bash
   curl http://localhost:5000/api/invoices
   ```

3. **Database Test:**
   ```bash
   npm run db:push
   ```

### Sample Rechnungen

Die App enthält 4 Beispiel-Rechnungen in `client/public/samples/`:
- `rechnung-1.jpg` - Deutsche Rechnung (JPG)
- `rechnung-2.jpg` - Deutsche Rechnung (JPG)
- `rechnung-3.pdf` - English Invoice (PDF)
- `rechnung-4.pdf` - Deutsche Rechnung (PDF)

---

## 💰 Kosten

### Google Vertex AI (Gemini 2.5 Flash)
- **Preis:** ~$0.0001 pro Bild
- **Free Tier:** Erste 1000 Anfragen/Monat oft kostenlos
- **Beispiel:** 500 Rechnungen/Monat = ~$0.05/Monat

### Replit Hosting
- **Free Tier:** Begrenzt (schläft nach Inaktivität)
- **Hacker Plan:** $7/Monat (Always-On)
- **PostgreSQL:** Inkludiert

### Total
**~$7-10/Monat** für 100-500 Rechnungen

---

## 🐛 Troubleshooting

### App startet nicht
```bash
npm install
npm run db:push
```

### "DATABASE_URL must be set"
- Aktivieren Sie PostgreSQL in Replit
- Oder setzen Sie `DATABASE_URL` in .env

### "GOOGLE_CLOUD_CREDENTIALS fehlt"
- Prüfen Sie Secrets in Replit
- JSON muss als EINE Zeile eingefügt werden

### "Vertex AI ist nicht konfiguriert"
1. Vertex AI API in Google Cloud aktiviert?
2. Service Account hat "Vertex AI User" Rolle?
3. Credentials JSON korrekt formatiert?

**Detailliertes Troubleshooting:** [`REPLIT_SETUP.md`](REPLIT_SETUP.md#8%EF%B8%8F⃣-troubleshooting)

---

## 📚 Dokumentation

| Datei | Beschreibung |
|-------|--------------|
| [`QUICK_START.md`](QUICK_START.md) | ⚡ Schnellstart-Anleitung (10 Min) |
| [`REPLIT_SETUP.md`](REPLIT_SETUP.md) | 🔧 Detaillierte Replit-Konfiguration |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | 🚀 Deployment-Optionen (Replit & Hosting) |
| [`WEBSITE_INTEGRATION.md`](WEBSITE_INTEGRATION.md) | 🌐 Website-Einbindung (iFrame) |
| [`example-website-integration.html`](example-website-integration.html) | 📝 HTML-Beispiel für Integration |
| [`design_guidelines.md`](design_guidelines.md) | 🎨 Design-System & UI-Guidelines |

---

## 🛠️ Development

### Project Structure

```
Rechnungsextraktion-Replit/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Upload, History
│   │   ├── components/    # UI Components (shadcn/ui)
│   │   └── lib/           # Utils, Query Client
│   └── public/            # Static Assets
├── server/                # Express Backend
│   ├── index.ts           # Server Entry Point
│   ├── routes.ts          # API Routes
│   ├── gemini-vertex.ts   # AI Integration
│   ├── storage.ts         # Database Layer
│   └── db.ts              # Database Connection
├── shared/                # Shared Types
│   └── schema.ts          # Drizzle Schema
├── package.json
├── .replit               # Replit Configuration
└── README.md
```

### Scripts

```bash
# Development
npm run dev              # Start dev server (HMR)

# Production
npm run build            # Build frontend & backend
npm start                # Start production server

# Database
npm run db:push          # Run migrations

# Type Checking
npm run check            # TypeScript type checking
```

---

## 🔒 Sicherheit

### Best Practices

- ✅ **CORS konfiguriert** für iframe-Embedding
- ✅ **Environment Variables** für Secrets
- ✅ **PostgreSQL SSL** in Production
- ✅ **File Size Limits** (10MB max)
- ✅ **MIME Type Validation**
- ⚠️ **Rate Limiting** empfohlen (siehe Deployment Guide)

### Credentials Management

**❌ NIEMALS:**
- Credentials in Code committen
- `.env` Dateien in Git einchecken
- Secrets in Logs ausgeben

**✅ IMMER:**
- Replit Secrets nutzen
- `.env.example` für Templates
- `.gitignore` prüfen

---

## 🤝 Contributing

Contributions willkommen!

1. Fork das Repository
2. Feature Branch erstellen
3. Changes committen
4. Pull Request öffnen

---

## 📝 License

MIT License - siehe LICENSE Datei

---

## 💡 Roadmap

### Geplante Features

- [ ] Batch Upload (mehrere Rechnungen gleichzeitig)
- [ ] OCR Fallback bei AI-Fehlern
- [ ] Export Templates (Excel, DATEV)
- [ ] Email-Integration (Rechnungen per Email senden)
- [ ] Multi-Language Support (EN, FR, ES)
- [ ] Mobile App (React Native)
- [ ] Webhook Integration
- [ ] Duplicate Detection

---

## 📞 Support

**Probleme?** 
1. Prüfen Sie die [Troubleshooting Section](#-troubleshooting)
2. Lesen Sie [`REPLIT_SETUP.md`](REPLIT_SETUP.md)
3. Öffnen Sie ein Issue auf GitHub

**Fragen zur Integration?**
- Siehe [`WEBSITE_INTEGRATION.md`](WEBSITE_INTEGRATION.md)
- Nutzen Sie [`example-website-integration.html`](example-website-integration.html)

---

## ⭐ Credits

**Technologien:**
- [Google Vertex AI](https://cloud.google.com/vertex-ai) - AI Model
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Replit](https://replit.com) - Hosting Platform

---

## 🎉 Los geht's!

```bash
# Klonen & Starten
git clone <repo-url>
cd Rechnungsextraktion-Replit
npm install
npm run dev
```

**Oder direkt auf Replit deployen: [`QUICK_START.md`](QUICK_START.md)**

---

**Made with ❤️ for automated invoice processing**

