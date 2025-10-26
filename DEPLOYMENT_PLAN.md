# 🚀 Kompletter Deployment Plan
## Rechnungsextraktion → GitHub → Replit → Kortex Website

---

## 📋 Phase 1: GitHub Repository Setup (5 Min)

### Schritt 1.1: GitHub Repository erstellen

1. Gehen Sie zu: https://github.com/new
2. **Repository Name:** `rechnungsextraktion-ai`
3. **Description:** `AI-powered invoice data extraction with Google Gemini`
4. **Visibility:** Private (empfohlen) oder Public
5. ⚠️ **WICHTIG:** 
   - ❌ NICHT "Initialize with README" anklicken
   - ❌ NICHT .gitignore hinzufügen
   - ❌ NICHT License hinzufügen
6. Klicken Sie **Create repository**
7. **Kopieren Sie die URL**, z.B.:
   ```
   https://github.com/IHR-USERNAME/rechnungsextraktion-ai.git
   ```

### Schritt 1.2: Git Repository vorbereiten

**BEREITS ERLEDIGT - ich mache das jetzt:**
- .gitignore aktualisieren
- Alle Dateien committen
- GitHub Remote hinzufügen
- Pushen

---

## 📋 Phase 2: Replit Import & Setup (10 Min)

### Schritt 2.1: Projekt in Replit importieren

1. Gehen Sie zu: https://replit.com
2. Klicken Sie **+ Create Repl**
3. Wählen Sie **Import from GitHub**
4. Fügen Sie Ihre Repository-URL ein:
   ```
   https://github.com/IHR-USERNAME/rechnungsextraktion-ai
   ```
5. **Repl Name:** `rechnungsextraktion-koretex`
6. Klicken Sie **Import from GitHub**
7. Warten Sie ~2 Minuten bis Dependencies installiert sind

**Alternative (wenn Sie bereits ZIP haben):**
1. Klicken Sie **+ Create Repl**
2. Wählen Sie **Upload**
3. ZIP-Datei hochladen
4. Warten bis Extraktion abgeschlossen

### Schritt 2.2: PostgreSQL aktivieren

1. Linke Sidebar → **Tools** (Werkzeug-Icon)
2. Klicken Sie **Database**
3. Klicken Sie **Add Database**
4. Wählen Sie **PostgreSQL**
5. Warten Sie ~30 Sekunden
6. ✅ Prüfen Sie: **Tools** → **Secrets** → `DATABASE_URL` sollte existieren

### Schritt 2.3: Google Cloud Credentials einfügen

1. **Tools** → **Secrets**
2. Klicken Sie **New Secret**
3. **Key:** `GOOGLE_CLOUD_CREDENTIALS`
4. **Value:** Kopieren Sie den Inhalt Ihrer Google Cloud Service Account JSON-Datei als EINE Zeile:

```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "EXAMPLE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n",
  "client_email": "service-account@YOUR_PROJECT.iam.gserviceaccount.com"
}
```

⚠️ **Note:** Paste the entire JSON as a single line in Replit Secrets (newlines should be escaped as `\n`)

⚠️ **Wichtig:** Das gesamte JSON als eine Zeile, keine Zeilenumbrüche (außer `\n` im private_key Feld)

5. Klicken Sie **Add Secret**

### Schritt 2.4: CORS für Website konfigurieren

1. **Tools** → **Secrets**
2. Klicken Sie **New Secret**
3. **Key:** `ALLOWED_ORIGINS`
4. **Value:** `https://karusocaminar.github.io`
5. Klicken Sie **Add Secret**

### Schritt 2.5: Database Migration ausführen

1. Öffnen Sie die **Shell** in Replit (unten)
2. Führen Sie aus:
   ```bash
   npm install
   npm run db:push
   ```
3. Erwartete Ausgabe:
   ```
   ✔ Database tables created successfully
   ```

### Schritt 2.6: App starten & testen

1. Klicken Sie den grünen **Run** Button
2. Warten Sie ~30-60 Sekunden
3. Prüfen Sie Console:
   ```
   ✅ Vertex AI configuration: project=koretex-zugang
   ✅ Vertex AI initialized successfully
   serving on port 5000
   ```
4. Die Webview öffnet sich automatisch
5. **Testen Sie:**
   - Dashboard sollte laden
   - Gehen Sie zu "Upload"
   - Laden Sie eine Beispiel-Rechnung hoch
   - Nach ~10 Sekunden: Status = "Completed"

### Schritt 2.7: Replit URL kopieren

1. Oben in der Replit-Oberfläche sehen Sie die URL
2. **Format:** `https://rechnungsextraktion-koretex.USERNAME.repl.co`
3. **Kopieren Sie diese URL** - Sie brauchen sie gleich!

**Beispiel:**
```
https://rechnungsextraktion-koretex.karusocaminar.repl.co
```

---

## 📋 Phase 3: Kortex Website Integration (10 Min)

### Schritt 3.1: Website Repository klonen

```bash
# In einem neuen Terminal/PowerShell:
cd C:\Users\Moritz\Desktop
git clone https://github.com/karusocaminar/koretex-website.git
cd koretex-website
```

### Schritt 3.2: Integration Code einfügen

1. Öffnen Sie `index.html` in Ihrem Editor
2. Öffnen Sie gleichzeitig: `kortex-website-integration-snippet.html`

**Im `<head>` Bereich (nach den bestehenden <style> Tags):**

Kopieren Sie den gesamten `<style>` Block aus dem Snippet (Zeile ~70-140)

**Vor dem schließenden `</body>` Tag:**

Kopieren Sie:
1. Den `<div id="invoice-modal">` Block (Zeile ~145-150)
2. Den kompletten `<script>` Block (Zeile ~155-280)

**Im "Live-Demo" Bereich (oder wo Sie möchten):**

Fügen Sie den Button ein:
```html
<button onclick="openInvoiceWorkflow()" 
        style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
               color: white; 
               padding: 18px 32px; 
               border-radius: 50px; 
               border: none; 
               cursor: pointer; 
               font-size: 1.1rem; 
               font-weight: 600;
               display: inline-flex;
               align-items: center;
               gap: 10px;
               transition: all 0.2s;">
  <span>📄</span>
  <span>Invoice Data Extraction</span>
  <span>→</span>
</button>
```

### Schritt 3.3: Replit URL konfigurieren

In der `<script>` Sektion finden Sie (~Zeile 160):

```javascript
const INVOICE_WORKFLOW_URL = 'https://rechnungsextraktion-koretex.repl.co';
```

**Ersetzen Sie mit Ihrer echten Replit URL!**

### Schritt 3.4: Lokal testen

```bash
# Im koretex-website Ordner:
python -m http.server 8000

# Öffnen Sie im Browser:
# http://localhost:8000
```

**Testen Sie:**
1. Klicken Sie auf den "Invoice Data Extraction" Button
2. Modal sollte sich öffnen
3. Upload-Interface erscheint
4. Testen Sie mit einer Rechnung
5. Schließen mit X oder ESC

### Schritt 3.5: Auf GitHub Pages deployen

```bash
git add index.html
git commit -m "Add Invoice Extraction workflow integration"
git push origin main
```

**Live in 1-2 Minuten:**
```
https://karusocaminar.github.io/koretex-website/
```

---

## 📋 Phase 4: Final Testing & Verifizierung (5 Min)

### Schritt 4.1: End-to-End Test

1. **Öffnen Sie:** https://karusocaminar.github.io/koretex-website/
2. **Klicken Sie:** "Invoice Data Extraction" Button
3. **Modal öffnet sich** mit der Replit-App
4. **Laden Sie eine Rechnung hoch:**
   - Ziehen Sie eine PDF/JPG in die Dropzone
   - Klicken Sie "Upload & Process"
5. **Warten Sie ~10 Sekunden**
6. **Prüfen Sie:**
   - Status: "Processing" → "Completed"
   - Rechnung erscheint in "History"
   - Klicken Sie Details → Daten sollten extrahiert sein

### Schritt 4.2: Cross-Browser Testing

Testen Sie in:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari (wenn verfügbar)
- ✅ Mobile (Smartphone)

### Schritt 4.3: Performance Check

1. Öffnen Sie Browser DevTools (F12)
2. Console Tab → Keine Fehler?
3. Network Tab → Alle Requests erfolgreich?
4. Application Tab → Keine CORS-Fehler?

---

## 📋 Phase 5: Production Optimization (Optional, 10 Min)

### Schritt 5.1: Replit auf "Always On"

⚠️ **Wichtig für Production:**

1. In Replit → Klicken Sie **Upgrade**
2. Wählen Sie **Hacker Plan** ($7/Monat)
3. Ihr Repl schläft dann nicht mehr ein
4. Schnellere Ladezeiten für Benutzer

**Ohne Hacker Plan:**
- App schläft nach ~1 Stunde Inaktivität
- Erste Anfrage dauert ~10 Sekunden zum Aufwachen
- Danach normal

### Schritt 5.2: Custom Domain (Optional)

Falls Sie eine eigene Domain für die App möchten:

1. In Replit → **Settings** → **Domains**
2. Klicken Sie **Add Domain**
3. Folgen Sie den DNS-Anweisungen
4. Beispiel: `app.kortexsystem.de`

Dann in Ihrer Website:
```javascript
const INVOICE_WORKFLOW_URL = 'https://app.kortexsystem.de';
```

### Schritt 5.3: Analytics Setup (Optional)

Fügen Sie Google Analytics hinzu für Tracking:

```html
<!-- In Ihrer Kortex Website index.html im <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ Erfolgs-Checkliste

### Phase 1: GitHub ✓
- [ ] GitHub Repository erstellt
- [ ] Code committed und gepusht
- [ ] Repository ist sichtbar auf GitHub

### Phase 2: Replit ✓
- [ ] Projekt aus GitHub importiert
- [ ] PostgreSQL aktiviert
- [ ] `DATABASE_URL` Secret vorhanden
- [ ] `GOOGLE_CLOUD_CREDENTIALS` Secret gesetzt
- [ ] `ALLOWED_ORIGINS` Secret gesetzt
- [ ] `npm run db:push` erfolgreich
- [ ] App startet mit `✅ Vertex AI initialized`
- [ ] Test-Upload funktioniert
- [ ] Replit URL kopiert

### Phase 3: Website ✓
- [ ] koretex-website Repo geklont
- [ ] Integration Code eingefügt
- [ ] Replit URL aktualisiert
- [ ] Lokal getestet (http://localhost:8000)
- [ ] Auf GitHub gepusht
- [ ] Live auf GitHub Pages

### Phase 4: Testing ✓
- [ ] End-to-End Test erfolgreich
- [ ] Modal öffnet/schließt korrekt
- [ ] Upload funktioniert
- [ ] Extraktion erfolgreich
- [ ] Keine Console-Fehler
- [ ] Mobile-Test erfolgreich

### Phase 5: Production (Optional) ✓
- [ ] Replit Hacker Plan aktiviert (Always-On)
- [ ] Custom Domain konfiguriert (optional)
- [ ] Analytics eingerichtet (optional)

---

## 🎯 Erwartete URLs nach Completion

| Service | URL | Status |
|---------|-----|--------|
| **GitHub Repo** | `github.com/IHR-USERNAME/rechnungsextraktion-ai` | 🔒 Private/Public |
| **Replit App** | `rechnungsextraktion-koretex.USERNAME.repl.co` | 🟢 Live |
| **Kortex Website** | `karusocaminar.github.io/koretex-website` | 🟢 Live |

---

## 🆘 Troubleshooting

### "npm run db:push" schlägt fehl
```bash
# Prüfen Sie DATABASE_URL:
echo $DATABASE_URL

# Sollte beginnen mit: postgresql://...
```

### Modal öffnet nicht
- Prüfen Sie Browser Console (F12)
- CORS-Fehler? → `ALLOWED_ORIGINS` Secret korrekt?

### "Vertex AI ist nicht konfiguriert"
- Secret `GOOGLE_CLOUD_CREDENTIALS` vorhanden?
- Als EINE Zeile eingefügt (kein \n)?

### Replit App schläft ein
- Lösung: Hacker Plan ($7/Monat)
- Oder: Ping-Service verwenden (z.B. UptimeRobot)

---

## 📞 Support-Kontakt

Bei Problemen:
1. Prüfen Sie diese Checkliste nochmal
2. Schauen Sie in die Detail-Guides:
   - `REPLIT_SETUP.md`
   - `WEBSITE_INTEGRATION.md`
   - `README.md`

---

## 🎉 Fertig!

Ihre komplette Pipeline sollte jetzt sein:

```
Benutzer → Kortex Website → Button klicken 
  ↓
Modal öffnet → Replit App lädt
  ↓
Upload Rechnung → Gemini AI verarbeitet
  ↓
Daten extrahiert → Anzeige & Export
```

**Geschätzte Gesamtzeit:** 30-40 Minuten
**Monatliche Kosten:** ~$7-10 (Replit + Google AI)

**Viel Erfolg! 🚀**

