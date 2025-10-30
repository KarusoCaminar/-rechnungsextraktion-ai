# 🚀 n8n Business Card Workflow - Schritt-für-Schritt Anleitung

## 📋 Übersicht

Diese Anleitung führt dich durch den kompletten Setup-Prozess für den Visitenkarten-Extraktions-Workflow in n8n.

**Dauer:** Ca. 15-20 Minuten  
**Schwierigkeit:** Mittel (mit dieser Anleitung: einfach!)  
**Voraussetzungen:** n8n Account (Cloud oder Self-Hosted)

---

## ✅ Schritt 1: Workflow importieren

### 1.1 Öffne n8n

1. Gehe zu deiner n8n-Instanz:
   - Cloud: https://n8n.io (oder deine Custom-Domain)
   - Self-Hosted: https://n8n2.kortex-system.de

2. Logge dich ein.

### 1.2 Workflow importieren

1. Klicke oben links auf **"Workflows"**.

2. Klicke auf **"Import from File"** oder **"+"** → **"Import from File"**.

3. Wähle die Datei: **`n8n-business-card-workflow.json`**

4. Klicke **"Import"**.

✅ **Fertig:** Der Workflow wurde importiert!

---

## 🔧 Schritt 2: Workflow konfigurieren

### 2.1 Webhook konfigurieren

1. Klicke auf den Node **"Business Card Upload"** (ganz links).

2. Im rechten Panel:
   - **Path:** Sollte bereits `business-card-extraction` sein
   - **HTTP Method:** `POST`
   - **Response Code:** `200`
   - **Response Mode:** `Using 'Respond to Webhook' Node`

3. **WICHTIG:** Klicke auf **"⚙️ Options"**:
   - ✅ **"Continue Workflow after Webhook Response"** aktivieren
   - ✅ **"Binary Data"** aktivieren
   - **Binary Property Name:** `file`

4. Klicke **"Execute Node"** oder **"Test URL"**.

5. Kopiere die **Production URL** (z.B. `https://n8n2.kortex-system.de/webhook/business-card-extraction`).

📝 **Notiere dir diese URL!** Du brauchst sie später für die Website.

---

### 2.2 Sample-Bilder URLs anpassen

1. Klicke auf **"Lade Sample 1"** Node.

2. Im **"URL"** Feld ersetze:
   ```
   https://karusocaminar.github.io/koretex-website/samples/bc-1.jpg
   ```
   Durch deine tatsächliche URL für Visitenkarte 1 (Oliver Krause).

3. Klicke auf **"Lade Sample 2"** Node.

4. Ersetze die URL durch deine URL für Visitenkarte 2 (Gabi Graßnick).

💡 **Tipp:** Wenn du die Bilder auf GitHub Pages hochgeladen hast:
   - Upload sie in dein Repo: `koretex-website/samples/bc-1.jpg` und `bc-2.jpg`
   - Die URLs wären dann: `https://karusocaminar.github.io/koretex-website/samples/bc-1.jpg`

---

### 2.3 KI-Extraktion konfigurieren (WICHTIG!)

Der Node **"KI-Extraktion (PLACEHOLDER)"** ist aktuell nur ein Dummy. Du musst ihn durch deine echte KI-Extraktion ersetzen.

#### Option A: Google Vision API + GPT-4o

1. **Lösche** den "KI-Extraktion (PLACEHOLDER)" Node.

2. **Füge hinzu:** "Google Vision API" Node
   - Bild an Google Vision senden (OCR)
   - Extrahierten Text auslesen

3. **Füge hinzu:** "OpenAI" Node (GPT-4o)
   - Prompt: `"Extrahiere Name, Firma, E-Mail, Telefon, Adresse, Stadt, Website, Job-Titel aus dieser Visitenkarte:\n\n[TEXT VON GOOGLE VISION]\n\nGib nur strukturierte JSON zurück: {\"name\": \"\", \"company\": \"\", \"email\": \"\", \"phone\": \"\", ...}"`
   - Response parsen

4. **Verbinde** mit "Formatiere für Website" Node.

#### Option B: Vertex AI (Google Cloud)

1. **Lösche** den "KI-Extraktion (PLACEHOLDER)" Node.

2. **Füge hinzu:** "Google Vertex AI" Node
   - Modell: `gemini-pro-vision` oder `gemini-1.5-pro`
   - Prompt: Siehe Option A
   - Image als Input

3. **Verbinde** mit "Formatiere für Website" Node.

#### Option C: Eigene KI-API

1. **Lösche** den "KI-Extraktion (PLACEHOLDER)" Node.

2. **Füge hinzu:** "HTTP Request" Node
   - Method: POST
   - URL: Deine KI-API URL
   - Body: JSON mit Bild-Base64 oder Binary
   - Response parsen

3. **Verbinde** mit "Formatiere für Website" Node.

⚠️ **WICHTIG:** 
- Der Output deines KI-Nodes muss exakt diese Felder haben:
  - `name`, `company`, `email`, `phone`, `address`, `city`, `website`, `job_title`
- Oder passe den "Formatiere für Website" Node an deine Output-Struktur an!

---

## 🔗 Schritt 3: Workflow aktivieren

1. Klicke oben rechts auf **"Active"** → **"Activate"**.

2. Bestätige mit **"Activate Workflow"**.

✅ **Fertig:** Der Workflow läuft jetzt!

---

## 🧪 Schritt 4: Workflow testen

### 4.1 Test mit Sample 1

1. Öffne einen neuen Tab im Browser.

2. Gehe zu:
   ```
   https://deine-n8n-url/webhook/business-card-extraction?sample=1
   ```

3. Der Workflow sollte automatisch:
   - Sample 1 laden
   - KI-Extraktion durchführen (oder Demo-Daten zurückgeben)
   - JSON-Response senden

4. Prüfe die Response im Browser (sollte JSON mit Oliver Krause Daten sein).

### 4.2 Test mit Sample 2

1. Gehe zu:
   ```
   https://deine-n8n-url/webhook/business-card-extraction?sample=2
   ```

2. Prüfe die Response (sollte Gabi Graßnick Daten sein).

### 4.3 Test mit Upload (wenn KI konfiguriert)

1. Erstelle ein einfaches HTML-Formular:
   ```html
   <form action="https://deine-n8n-url/webhook/business-card-extraction" method="post" enctype="multipart/form-data">
     <input type="file" name="file" accept="image/*">
     <button>Upload</button>
   </form>
   ```

2. Lade eine Visitenkarte hoch.

3. Prüfe die Response.

---

## 🌐 Schritt 5: Website integrieren

### 5.1 n8n-URL in Website einfügen

1. Öffne: `kortex-n8n-modal.html`

2. Suche nach (Zeile ~361):
   ```html
   data-workflow-url="DEINE_N8N_WORKFLOW_URL_HIER"
   ```

3. Ersetze mit deiner n8n Production URL:
   ```html
   data-workflow-url="https://n8n2.kortex-system.de/webhook/business-card-extraction"
   ```

4. **WICHTIG:** Mache das bei allen 3 Vorkommen:
   - Sample 1 Card
   - Sample 2 Card
   - Upload Card

### 5.2 Button auf Startseite verknüpfen

1. Öffne deine Startseite: `index.html` (oder wo dein Button ist).

2. Gib dem Button eine ID:
   ```html
   <a id="btn-bizcard" href="#" ...>Visitenkarten-Extraktion</a>
   ```

3. Füge am Ende vor `</body>` hinzu:
   ```html
   <script>
   document.getElementById('btn-bizcard').addEventListener('click', function(e) {
     e.preventDefault();
     // Öffne Modal oder leite weiter zu kortex-n8n-modal.html
     window.location.href = '/kortex-n8n-modal.html';
     // ODER öffne Modal direkt (siehe Variante A/B in Integration Guide)
   });
   </script>
   ```

---

## ✅ Checkliste: Alles fertig?

### n8n-Seite:
- [ ] Workflow importiert
- [ ] Webhook konfiguriert
- [ ] "Continue Workflow" aktiviert
- [ ] Sample-URLs angepasst
- [ ] KI-Extraktion konfiguriert (ersetzt Placeholder)
- [ ] Workflow aktiviert
- [ ] Test mit Sample 1 erfolgreich
- [ ] Test mit Sample 2 erfolgreich
- [ ] Test mit Upload erfolgreich (wenn KI konfiguriert)

### Website-Seite:
- [ ] n8n-URL in kortex-n8n-modal.html eingefügt (3x)
- [ ] Button auf Startseite verknüpft
- [ ] Visitenkarten-Bilder hochgeladen (bc-1.jpg, bc-2.jpg)
- [ ] Lokal getestet
- [ ] Modal öffnet sich korrekt
- [ ] Sample 1 funktioniert
- [ ] Sample 2 funktioniert
- [ ] Upload funktioniert
- [ ] Ergebnisse erscheinen in Tabelle
- [ ] CSV-Download funktioniert
- [ ] JSON-Download funktioniert

---

## 🆘 Troubleshooting

### Problem: "Workflow läuft nicht"

**Lösung:**
- Prüfe ob Workflow aktiviert ist (oben rechts "Active" muss grün sein)
- Prüfe Webhook-URL ist korrekt
- Prüfe n8n-Logs für Fehler

### Problem: "Sample 1/2 lädt nicht"

**Lösung:**
- Prüfe URLs in "Lade Sample 1/2" Nodes
- Prüfe ob Bilder öffentlich erreichbar sind (im Browser öffnen)
- Prüfe CORS-Einstellungen

### Problem: "KI-Extraktion gibt Fehler"

**Lösung:**
- Prüfe KI-Credentials (Google Cloud, OpenAI API Key)
- Prüfe Quotas/Limits
- Prüfe n8n-Logs für detaillierte Fehlermeldungen

### Problem: "Website zeigt keine Ergebnisse"

**Lösung:**
- Prüfe Browser Console (F12) auf Fehler
- Prüfe ob postMessage funktioniert (Console Logs)
- Prüfe ob n8n-URL korrekt in Website eingefügt
- Prüfe ob Response-Format korrekt ist (muss `{type: "business-card-processed", payload: {...}}` sein)

### Problem: "Modal öffnet sich nicht"

**Lösung:**
- Prüfe ob Button-ID korrekt ist
- Prüfe ob JavaScript-Code eingefügt wurde
- Prüfe Browser Console auf JavaScript-Fehler

---

## 📞 Support

Bei Problemen:
1. Prüfe n8n Execution Logs (Workflows → Dein Workflow → Executions)
2. Prüfe Browser Console (F12)
3. Prüfe Network Tab für API-Calls
4. Prüfe diese Checkliste nochmal

---

## 🎉 Fertig!

Dein n8n-Workflow sollte jetzt funktionieren! 🚀

**Next Steps:**
1. Teste alle 3 Funktionen (Sample 1, Sample 2, Upload)
2. Passe Design an deine Marke an
3. Deploye Website live
4. Sammle User-Feedback

**Viel Erfolg!** ✨

