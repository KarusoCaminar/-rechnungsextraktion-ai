# ⚡ Quick Start Guide

## 🚀 Von 0 zu Deployed in 10 Minuten

Diese Anleitung bringt Ihre Rechnungsextraktion-App schnell zum Laufen.

---

## 📋 Was Sie brauchen

1. **Replit Account** (kostenlos)
2. **Google Cloud Account** (Free Tier verfügbar)
3. **5-10 Minuten Zeit**

---

## Schritt 1: Replit Setup (2 Min)

### 1.1 Projekt in Replit importieren

1. Gehen Sie zu [replit.com](https://replit.com)
2. Klicken Sie auf **+ Create Repl**
3. Wählen Sie **Import from GitHub** oder **Upload** dieses Projekt
4. Warten Sie, bis Dependencies installiert sind

### 1.2 PostgreSQL aktivieren

1. Linke Sidebar → **Tools** → **Database**
2. Klicken Sie auf **Add Database** → **PostgreSQL**
3. ✅ `DATABASE_URL` wird automatisch als Secret hinzugefügt

### 1.3 Database Migration

Öffnen Sie die Shell in Replit und führen Sie aus:

```bash
npm run db:push
```

Erwartete Ausgabe:
```
✔ Database tables created successfully
```

---

## Schritt 2: Google Cloud Setup (5 Min)

### 2.1 Service Account erstellen

**Schnellversion:**

1. Öffnen Sie: [Google Cloud Console](https://console.cloud.google.com)
2. Projekt erstellen oder auswählen
3. Navigation → **APIs & Services** → **Library**
4. Suchen: "Vertex AI API" → **Enable**
5. Navigation → **IAM & Admin** → **Service Accounts**
6. **Create Service Account**:
   - Name: `invoice-extractor`
   - Role: **Vertex AI User**
7. **Create Key** → JSON herunterladen

### 2.2 Credentials in Replit einfügen

**Wichtig: Sie haben die Credentials bereits in der Datei!**

Die Datei `koretex-zugang-1a1666db9cad.json` enthält bereits alles Notwendige.

1. In Replit: **Tools** → **Secrets**
2. **New Secret**:
   - Key: `GOOGLE_CLOUD_CREDENTIALS`
   - Value: Kopieren Sie den **kompletten Inhalt** Ihrer JSON-Datei
3. Klicken Sie **Add Secret**

**Kopieren Sie den Inhalt Ihrer Google Cloud JSON-Datei:**

```
Paste your Google Cloud Service Account JSON here as a single line.
Example format: {"type":"service_account","project_id":"YOUR_PROJECT",...}
```

**⚠️ Wichtig:** Das **komplette JSON als EINE Zeile** einfügen (keine echten Zeilenumbrüche)!

---

## Schritt 3: App starten (30 Sek)

1. Klicken Sie auf den grünen **Run** Button in Replit
2. Warten Sie auf:
   ```
   ✅ Server auf Port 5000
   ✅ API funktioniert: GET /api/invoices 200
   ✅ Vertex AI initialized successfully
   ```
3. Die Webview öffnet sich automatisch

---

## Schritt 4: Testen (2 Min)

### 4.1 Dashboard öffnen

Die App sollte automatisch öffnen und das Dashboard zeigen.

### 4.2 Test-Rechnung hochladen

1. Klicken Sie auf **Upload** in der Sidebar
2. Wählen Sie eine der Sample-Rechnungen ODER laden Sie eine eigene hoch
3. Klicken Sie **Upload & Process**
4. Status ändert sich: "Processing" → "Completed" (dauert 5-10 Sekunden)

### 4.3 Ergebnis prüfen

1. Gehen Sie zu **History**
2. Klicken Sie auf die verarbeitete Rechnung
3. Sie sollten sehen:
   - ✅ Rechnungsnummer extrahiert
   - ✅ Datum extrahiert
   - ✅ Lieferant-Informationen
   - ✅ Beträge (Netto, MwSt, Brutto)
   - ✅ Einzelpositionen (Line Items)

---

## Schritt 5: Website-Integration (3 Min)

### 5.1 Replit URL kopieren

Oben in Replit sehen Sie die URL, z.B.:
```
https://rechnungsextraktion-username.repl.co
```

Kopieren Sie diese URL.

### 5.2 CORS aktivieren

**In Replit:**

1. Installieren Sie CORS:
```bash
npm install cors
npm install --save-dev @types/cors
```

2. Fügen Sie Secret hinzu:
   - Key: `ALLOWED_ORIGINS`
   - Value: `http://localhost:8000,http://127.0.0.1:8000`

### 5.3 Code in Ihre Website einfügen

Öffnen Sie Ihre `http://localhost:8000/index.html` und fügen Sie den Code aus `WEBSITE_INTEGRATION.md` ein.

**Kurz-Version für schnellen Test:**

```html
<!-- In Ihrem HTML -->
<button onclick="window.open('https://IHRE-REPL-URL.repl.co/upload', '_blank', 'width=1200,height=800')">
  📄 Invoice Data Extraction
</button>
```

Ersetzen Sie `IHRE-REPL-URL.repl.co` mit Ihrer echten Replit URL.

---

## ✅ Fertig!

Sie haben jetzt:
- ✅ App läuft auf Replit
- ✅ Database konfiguriert
- ✅ Google AI funktioniert
- ✅ Kann in Website eingebunden werden

---

## 🎯 Nächste Schritte

1. **Styling anpassen**: Passen Sie Farben in `client/src/index.css` an
2. **Vollständige iFrame-Integration**: Siehe `WEBSITE_INTEGRATION.md`
3. **Production Deployment**: Siehe `DEPLOYMENT.md`

---

## 🐛 Probleme?

### App startet nicht
```bash
# Shell in Replit öffnen und ausführen:
npm install
npm run db:push
```

### "GOOGLE_CLOUD_CREDENTIALS fehlt"
- Prüfen Sie: **Tools** → **Secrets** → `GOOGLE_CLOUD_CREDENTIALS` existiert?
- Format: Die gesamte JSON als eine Zeile, beginnend mit `{"`

### "DATABASE_URL must be set"
- Aktivieren Sie PostgreSQL: **Tools** → **Database** → **Add Database**

### Vertex AI Fehler
1. Prüfen Sie [Google Cloud Console](https://console.cloud.google.com)
2. Vertex AI API aktiviert?
3. Service Account hat "Vertex AI User" Rolle?

---

## 📊 Kosten

**Geschätzte monatliche Kosten:**

| Service | Kosten | Free Tier |
|---------|--------|-----------|
| Replit Starter | $7/Mo | Hacker Plan auch OK |
| Google Vertex AI | ~$0.0001/Bild | 1000 Bilder frei |
| **Total** | **~$7-10/Mo** | Für 100-500 Rechnungen/Monat |

---

## 🎉 Das war's!

Ihre Rechnungsextraktion ist jetzt live und bereit für Ihre Website-Integration!

**Bei Fragen:** Siehe `DEPLOYMENT.md` oder `WEBSITE_INTEGRATION.md`

