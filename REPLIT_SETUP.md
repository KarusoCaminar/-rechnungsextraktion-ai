# 🔧 Replit Setup - Schritt für Schritt

## Schnell-Setup für Replit Deployment

Diese Datei führt Sie durch die exakte Konfiguration in Replit.

---

## 1️⃣ Projekt in Replit importieren

### Option A: GitHub Import
1. Gehen Sie zu [replit.com](https://replit.com)
2. Klicken Sie **+ Create Repl**
3. Wählen Sie **Import from GitHub**
4. Repository URL eingeben
5. Klicken Sie **Import from GitHub**

### Option B: Upload
1. Gehen Sie zu [replit.com](https://replit.com)
2. Klicken Sie **+ Create Repl**
3. Wählen Sie **Upload**
4. ZIP-Datei hochladen
5. Warten bis Extraktion abgeschlossen

---

## 2️⃣ Replit Configuration prüfen

Die `.replit` Datei sollte so aussehen:

```toml
modules = ["nodejs-20", "web", "postgresql-16"]
run = "npm run dev"

[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

[[ports]]
localPort = 5000
externalPort = 80
```

✅ Wenn `.replit` fehlt, wird diese automatisch erstellt.

---

## 3️⃣ PostgreSQL Database einrichten

### Schritt 1: Database aktivieren

1. Linke Sidebar → **Tools** (Werkzeug-Icon)
2. Klicken Sie auf **Database**
3. Klicken Sie **Add Database**
4. Wählen Sie **PostgreSQL**
5. Warten Sie ~30 Sekunden bis die DB bereit ist

### Schritt 2: DATABASE_URL prüfen

1. Gehen Sie zu **Tools** → **Secrets**
2. Sie sollten sehen: `DATABASE_URL` = `postgresql://...`
3. ✅ Wenn ja, perfekt! Wenn nein, Database nochmal aktivieren

### Schritt 3: Database Migration

Öffnen Sie die **Shell** (unten in Replit) und führen Sie aus:

```bash
npm install
npm run db:push
```

**Erwartete Ausgabe:**
```
✔ Database tables created successfully
  → invoices
  → users
```

**Bei Fehler:**
```bash
# Prüfen Sie DATABASE_URL
echo $DATABASE_URL

# Falls leer, setzen Sie manuell in Secrets
```

---

## 4️⃣ Google Cloud Secrets konfigurieren

### Secret 1: GOOGLE_CLOUD_CREDENTIALS

**Wichtig:** Dies ist das Hauptsecret für die AI-Funktionalität.

#### Schritt 1: JSON-Datei öffnen

Sie haben die Datei bereits: `koretex-zugang-1a1666db9cad.json`

#### Schritt 2: Als Secret hinzufügen

1. In Replit: **Tools** → **Secrets**
2. Klicken Sie **New Secret**
3. **Key:** `GOOGLE_CLOUD_CREDENTIALS`
4. **Value:** Kopieren Sie den **gesamten JSON-Inhalt** als **EINE ZEILE**

**Kopieren Sie den Inhalt aus Ihrer `koretex-zugang-XXXXX.json` Datei:**

```
Paste your complete Google Cloud Service Account JSON as a single line.
Format: {"type":"service_account","project_id":"YOUR_PROJECT",...}
```

⚠️ **Important:** Paste the JSON as ONE LINE (compress all line breaks, except `\n` in private_key)

5. Klicken Sie **Add Secret**

**⚠️ WICHTIG:**
- Der Wert muss als **EINE einzige Zeile** eingefügt werden
- **KEINE** Zeilenumbrüche im JSON
- Beginnt mit `{` und endet mit `}`
- Enthält `\n` als Text (nicht echte Newlines) im private_key

### Secret 2: ALLOWED_ORIGINS (Optional, für Website-Integration)

Nur erforderlich, wenn Sie die App in Ihre Website einbetten möchten.

1. **Tools** → **Secrets** → **New Secret**
2. **Key:** `ALLOWED_ORIGINS`
3. **Value:** `http://localhost:8000,http://127.0.0.1:8000`
4. Klicken Sie **Add Secret**

**Später für Production:** Fügen Sie Ihre echte Website-Domain hinzu:
```
https://ihre-website.com,https://www.ihre-website.com
```

### Secret 3: GOOGLE_CLOUD_LOCATION (Optional)

Standard ist `us-central1`, nur ändern wenn Sie eine andere Region nutzen möchten.

1. **Tools** → **Secrets** → **New Secret**
2. **Key:** `GOOGLE_CLOUD_LOCATION`
3. **Value:** `us-central1` (oder `europe-west1`, `asia-southeast1`, etc.)
4. Klicken Sie **Add Secret**

---

## 5️⃣ Secrets Übersicht (Checklist)

Prüfen Sie in **Tools → Secrets**, dass Sie haben:

| Secret Name | Status | Quelle |
|-------------|--------|--------|
| `DATABASE_URL` | ✅ Automatisch | Von Replit PostgreSQL |
| `GOOGLE_CLOUD_CREDENTIALS` | ⚠️ Manuell | Aus JSON-Datei kopieren |
| `ALLOWED_ORIGINS` | ⭕ Optional | Für Website-Integration |
| `GOOGLE_CLOUD_LOCATION` | ⭕ Optional | Standard: us-central1 |

**Minimum erforderlich:**
- ✅ `DATABASE_URL`
- ✅ `GOOGLE_CLOUD_CREDENTIALS`

---

## 6️⃣ App starten

### Entwicklungsmodus (Dev)

1. Klicken Sie auf den grünen **Run** Button
2. Warten Sie ~30-60 Sekunden
3. Prüfen Sie Console-Ausgabe:

**Erwartete Ausgabe:**
```
✅ Vertex AI configuration: project=koretex-zugang, location=us-central1
✅ Vertex AI initialized successfully with Gemini 2.5 Flash
serving on port 5000
```

**Bei Fehler:**
```
❌ GOOGLE_CLOUD_CREDENTIALS environment variable is missing!
```
→ Prüfen Sie Secret in Schritt 4

### Production Deployment

1. Klicken Sie auf **Deploy** (oben rechts)
2. Wählen Sie **Autoscale** (empfohlen)
3. Klicken Sie **Deploy**
4. Warten Sie 2-3 Minuten
5. Ihre App läuft auf: `https://your-repl-name.repl.co`

---

## 7️⃣ Testen

### Test 1: API Check

Öffnen Sie in einem neuen Tab:
```
https://your-repl-name.repl.co/api/invoices
```

Erwartetes Ergebnis: `[]` (leeres Array)

### Test 2: Dashboard

Öffnen Sie:
```
https://your-repl-name.repl.co
```

Sie sollten sehen:
- Dashboard mit Statistiken (alle 0)
- Sidebar mit Navigation
- "Upload", "Dashboard", "History" Links

### Test 3: Upload & Processing

1. Klicken Sie **Upload**
2. Ziehen Sie eine Rechnung (JPG/PNG/PDF) in die Dropzone
3. Klicken Sie **Upload & Process**
4. Status: "Processing" (erscheint für 5-10 Sekunden)
5. Automatische Weiterleitung zu **History**
6. Nach ~10 Sekunden: Status ändert zu "Completed"
7. Klicken Sie auf die Rechnung → Details werden angezeigt

**Wenn das funktioniert: ✅ Setup komplett!**

---

## 8️⃣ Troubleshooting

### App startet nicht

```bash
# In Shell ausführen:
npm install
npm run db:push
```

### "DATABASE_URL must be set"

1. **Tools** → **Database** → PostgreSQL aktivieren
2. Repl neustarten (Stop → Run)

### "GOOGLE_CLOUD_CREDENTIALS fehlt"

1. Prüfen Sie **Tools** → **Secrets**
2. `GOOGLE_CLOUD_CREDENTIALS` sollte existieren
3. Value beginnt mit `{"type":"service_account"`
4. Wenn falsch: Löschen und neu hinzufügen (Schritt 4)

### "Vertex AI ist nicht konfiguriert"

**Fehlerquelle A: JSON falsch formatiert**
- Secret muss **EINE Zeile** sein, keine Zeilenumbrüche
- Nutzen Sie den kopierten Text aus Schritt 4

**Fehlerquelle B: Vertex AI API nicht aktiviert**
1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com)
2. Projekt: `koretex-zugang`
3. Navigation → APIs & Services → Library
4. Suchen: "Vertex AI API"
5. Status: Enabled ✅

**Fehlerquelle C: Service Account fehlt Berechtigung**
1. Google Cloud Console → IAM & Admin → IAM
2. Finden Sie: `austin-bittner@koretex-zugang.iam.gserviceaccount.com`
3. Rolle: **Vertex AI User** ✅

### Upload funktioniert, aber "Error" Status

**Mögliche Ursachen:**
1. Bild ist zu groß (>10MB)
2. Datei ist korrupt
3. Vertex AI Quota überschritten (unwahrscheinlich)
4. Network timeout

**Debug:**
1. Öffnen Sie **Logs** in Replit
2. Suchen Sie nach: "Error processing invoice"
3. Lesen Sie die Fehlermeldung

---

## 9️⃣ Nächste Schritte

Nach erfolgreichem Setup:

1. **Website-Integration:**
   - Siehe `WEBSITE_INTEGRATION.md`
   - Nutzen Sie `example-website-integration.html`

2. **Styling anpassen:**
   - Farben in `client/src/index.css` ändern
   - Logo in `client/public/favicon.png` ersetzen

3. **Domain verbinden:**
   - Replit unterstützt Custom Domains
   - Settings → Domain → Add Domain

---

## ✅ Setup Checklist

Vor Go-Live prüfen:

- [ ] Replit Projekt importiert
- [ ] `.replit` Datei existiert
- [ ] PostgreSQL Database aktiviert
- [ ] `npm run db:push` ausgeführt (ohne Fehler)
- [ ] Secret `DATABASE_URL` existiert (automatisch)
- [ ] Secret `GOOGLE_CLOUD_CREDENTIALS` hinzugefügt (manuell)
- [ ] App startet mit `✅ Vertex AI initialized`
- [ ] Test-Upload funktioniert
- [ ] Rechnung wird erfolgreich verarbeitet
- [ ] Extracted data wird angezeigt

**Alles ✅? Perfekt! Sie sind bereit für Production! 🚀**

---

## 📞 Support

Bei Problemen:

1. **Prüfen Sie Logs:**
   - Replit: Console-Ausgabe ansehen
   - Browser: DevTools → Console (F12)

2. **Secrets verifizieren:**
   ```bash
   # In Replit Shell:
   echo $DATABASE_URL
   echo $GOOGLE_CLOUD_CREDENTIALS | head -c 50
   ```

3. **Database Status:**
   ```bash
   npm run db:push
   ```

4. **App neu starten:**
   - Stop Button → Run Button

---

**Viel Erfolg! 🎉**

