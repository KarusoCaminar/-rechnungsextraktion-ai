# 🚀 Deployment Guide - Rechnungsextraktion App

## 📋 Übersicht

Diese Anleitung hilft Ihnen, die Rechnungsextraktion-App zu deployen:
- **Option 1**: Replit (empfohlen, einfachste Lösung)
- **Option 2**: Eigenes Hosting (VPS, Cloud, etc.)

---

## 🎯 Option 1: Replit Deployment (Empfohlen)

### Voraussetzungen

1. **Replit Account** mit aktivierter Database
2. **Google Cloud Account** für Gemini AI (Vertex AI)

### Schritt-für-Schritt Anleitung

#### 1. Replit Setup

1. Erstellen Sie ein neues Replit oder importieren Sie dieses Projekt
2. Stellen Sie sicher, dass folgende Module aktiviert sind:
   - `nodejs-20`
   - `web`
   - `postgresql-16`

#### 2. Database Setup (Replit)

1. Gehen Sie zu **Tools** → **Database** in Replit
2. Aktivieren Sie die PostgreSQL Database
3. Die `DATABASE_URL` wird automatisch als Secret hinzugefügt
4. Führen Sie die Migration aus:

```bash
npm install
npm run db:push
```

Dies erstellt die notwendigen Tabellen (`invoices`, `users`) in Ihrer Datenbank.

#### 3. Google Cloud Setup (Vertex AI)

##### 3a. Google Cloud Console

1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes
3. Aktivieren Sie die **Vertex AI API**:
   - Navigation: APIs & Services → Library
   - Suchen Sie nach "Vertex AI API"
   - Klicken Sie auf "Enable"

##### 3b. Service Account erstellen

1. Gehen Sie zu **IAM & Admin** → **Service Accounts**
2. Klicken Sie auf **Create Service Account**
3. Name: `invoice-extractor-ai`
4. Rolle hinzufügen: **Vertex AI User** (oder **Vertex AI Administrator**)
5. Klicken Sie auf **Done**

##### 3c. JSON Key herunterladen

1. Klicken Sie auf den erstellten Service Account
2. **Keys** Tab → **Add Key** → **Create new key**
3. Wählen Sie **JSON** Format
4. Die Datei wird heruntergeladen (z.B. `projekt-name-abc123.json`)

##### 3d. Credentials zu Replit hinzufügen

1. Öffnen Sie die heruntergeladene JSON-Datei
2. Kopieren Sie den **kompletten JSON-Inhalt** (die gesamte Datei!)
3. In Replit: **Tools** → **Secrets**
4. Fügen Sie ein neues Secret hinzu:
   - Key: `GOOGLE_CLOUD_CREDENTIALS`
   - Value: *Fügen Sie den kompletten JSON-Inhalt ein*

**JSON-Format (Beispiel):**
```json
{
  "type": "service_account",
  "project_id": "ihr-projekt-id",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...[ENTFERNT]...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@ihr-projekt.iam.gserviceaccount.com",
  ...
}
```

⚠️ In Replit als **EINE Zeile** einfügen (alle Zeilenumbrüche entfernen)

#### 4. App starten

1. Klicken Sie auf **Run** in Replit
2. Die App sollte starten auf Port 5000
3. Die Webview öffnet sich automatisch

#### 5. Verifizierung

Prüfen Sie die Console-Ausgabe:
```
✅ Server auf Port 5000
✅ API funktioniert: GET /api/invoices 200
✅ Vertex AI initialized successfully with Gemini 2.5 Flash
```

### Secrets Zusammenfassung (Replit)

| Secret Name | Quelle | Erforderlich |
|-------------|--------|--------------|
| `DATABASE_URL` | Automatisch von Replit PostgreSQL | ✅ Ja |
| `GOOGLE_CLOUD_CREDENTIALS` | Google Cloud Service Account JSON | ✅ Ja (für AI) |
| `GOOGLE_CLOUD_LOCATION` | Optional, Standard: `us-central1` | ⚠️ Optional |

---

## 🖥️ Option 2: Eigenes Hosting

### Voraussetzungen

- Node.js 20+
- PostgreSQL 16+ Datenbank
- Google Cloud Account (für AI)

### Setup

#### 1. Repository klonen

```bash
git clone <your-repo-url>
cd Rechnungsextraktion-Replit
npm install
```

#### 2. Umgebungsvariablen

Erstellen Sie eine `.env` Datei:

```env
# Server
NODE_ENV=production
PORT=5000

# Database (z.B. Neon, Supabase, oder eigene PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Google Cloud Vertex AI
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account","project_id":"YOUR_PROJECT_ID",...}
GOOGLE_CLOUD_LOCATION=us-central1
```

#### 3. Database Migration

```bash
npm run db:push
```

#### 4. Build & Start

```bash
# Build
npm run build

# Start
npm start
```

### Deployment Optionen

#### Docker (empfohlen)

Erstellen Sie eine `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 5000

# Start
CMD ["npm", "start"]
```

Build & Run:
```bash
docker build -t invoice-extractor .
docker run -p 5000:5000 --env-file .env invoice-extractor
```

#### Cloud Hosting Optionen

- **Railway**: Automatisches Deployment via GitHub, PostgreSQL inkludiert
- **Render**: Free Tier verfügbar, PostgreSQL Add-on
- **Fly.io**: Global deployment, gute PostgreSQL Integration
- **Heroku**: Add PostgreSQL Add-on
- **DigitalOcean App Platform**: Managed Database verfügbar

---

## 🔄 Alternative: Ohne Google Cloud (OpenAI)

Falls Google Cloud zu komplex ist, kann die App auf **OpenAI GPT-4 Vision** umgestellt werden.

### Vorteile
- ✅ Einfacheres Setup (nur API Key)
- ✅ Keine Service Account Konfiguration
- ✅ Günstigere Preise für kleine Projekte

### Umstellung

1. Secret hinzufügen: `OPENAI_API_KEY`
2. Code-Änderung in `server/gemini-vertex.ts` (kann ich für Sie umsetzen)

**Möchten Sie die OpenAI-Alternative?** Ich kann den Code dafür anpassen.

---

## 📊 Kostenübersicht

### Google Vertex AI (Gemini 2.5 Flash)
- **Preis**: ~$0.0001 pro Bild
- **Free Tier**: Erste 1000 Anfragen/Monat oft kostenlos
- **Ideal für**: Produktive Nutzung mit vielen Rechnungen

### OpenAI GPT-4 Vision
- **Preis**: ~$0.01 pro Bild
- **Free Tier**: $5 Credit bei Neuanmeldung
- **Ideal für**: Testing und kleine Projekte

### Replit Database
- **Free Tier**: Bis zu 1GB Storage
- **Starter Plan**: $7/Monat

---

## 🐛 Troubleshooting

### "DATABASE_URL must be set"
- Lösung: PostgreSQL Database in Replit aktivieren oder .env Datei erstellen

### "GOOGLE_CLOUD_CREDENTIALS environment variable is missing"
- Lösung: Service Account JSON als Secret hinzufügen
- Die App startet trotzdem, aber Invoice-Extraktion funktioniert nicht

### "Vertex AI ist nicht konfiguriert"
- Vertex AI API in Google Cloud aktivieren
- Service Account hat die richtige Rolle (Vertex AI User)
- JSON Format ist korrekt (komplettes JSON, nicht nur Teile)

### Migration Fehler
```bash
# Datenbank zurücksetzen und neu migrieren
npm run db:push
```

---

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Console-Logs in Replit
2. Verifizieren Sie alle Secrets
3. Testen Sie die API: `curl http://localhost:5000/api/invoices`

---

## ✅ Checkliste vor Go-Live

- [ ] PostgreSQL Database verbunden
- [ ] Database Migration durchgeführt (`npm run db:push`)
- [ ] Google Cloud Vertex AI aktiviert
- [ ] Service Account erstellt mit Vertex AI User Rolle
- [ ] `GOOGLE_CLOUD_CREDENTIALS` Secret gesetzt
- [ ] App startet ohne Fehler
- [ ] Test-Rechnung hochgeladen und erfolgreich verarbeitet
- [ ] Dashboard zeigt Statistiken an
- [ ] Export (CSV/JSON) funktioniert

**Status: Ready to Deploy! 🚀**

