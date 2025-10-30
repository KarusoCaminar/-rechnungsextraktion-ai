# 🎯 Komplette Setup-Anleitung - Business Card Extraction Demo

## 📋 Was brauchst du?

1. ✅ n8n Account (Cloud oder Self-Hosted)
2. ✅ Zwei Visitenkarten-Bilder (bc-1.jpg, bc-2.jpg)
3. ✅ KI-Credentials (Google Cloud, OpenAI, oder dein eigener Service)
4. ✅ GitHub Account (für Website-Hosting, optional)

**Dauer:** 15-20 Minuten  
**Schwierigkeit:** Mit dieser Anleitung: Einfach! ✨

---

## 🚀 Schritt 1: Visitenkarten-Bilder hochladen

### Option A: GitHub Pages (Empfohlen)

1. Gehe zu deinem GitHub Repo: `karusocaminar/koretex-website`

2. Navigiere zu: `samples/` Ordner (oder erstelle ihn)

3. Lade hoch:
   - `bc-1.jpg` (Oliver Krause Visitenkarte)
   - `bc-2.jpg` (Gabi Graßnick Visitenkarte)

4. Die URLs sind dann:
   - `https://karusocaminar.github.io/koretex-website/samples/bc-1.jpg`
   - `https://karusocaminar.github.io/koretex-website/samples/bc-2.jpg`

### Option B: Eigener Webserver

1. Lade die Bilder auf deinen Webserver hoch

2. Notiere dir die öffentlichen URLs

---

## 🔧 Schritt 2: n8n Workflow einrichten

### 2.1 Workflow importieren

1. Öffne n8n: `https://n8n2.kortex-system.de`

2. Klicke **"Workflows"** → **"Import from File"**

3. Wähle: **`n8n-business-card-workflow.json`**

4. Klicke **"Import"**

✅ Workflow ist jetzt importiert!

### 2.2 Webhook konfigurieren

1. Klicke auf **"Business Card Upload"** Node (ganz links)

2. **WICHTIG:** Klicke auf **"⚙️ Options"**:
   - ✅ **"Continue Workflow after Webhook Response"** aktivieren
   - ✅ **"Binary Data"** aktivieren

3. Klicke **"Execute Node"** → Kopiere die **Production URL**

📝 **Notiere:** `https://n8n2.kortex-system.de/webhook/business-card-extraction`

### 2.3 Sample-URLs anpassen

1. **"Lade Sample 1"** Node:
   - URL: `https://karusocaminar.github.io/koretex-website/samples/bc-1.jpg`
   - (Oder deine eigene URL)

2. **"Lade Sample 2"** Node:
   - URL: `https://karusocaminar.github.io/koretex-website/samples/bc-2.jpg`

### 2.4 KI-Extraktion konfigurieren

**⚠️ WICHTIG:** Der "KI-Extraktion (PLACEHOLDER)" Node muss ersetzt werden!

#### Schnell-Lösung (für Demo ohne echte KI):

1. Lass den Placeholder erstmal so → Funktioniert mit Demo-Daten

2. Später ersetzen durch deine KI (Google Vision, GPT-4o, etc.)

#### Voll-Lösung (mit echter KI):

Siehe: `N8N_SETUP_ANLEITUNG.md` → Schritt 2.3

### 2.5 Workflow aktivieren

1. Klicke oben rechts **"Active"** → **"Activate"**

✅ Workflow läuft!

---

## 🌐 Schritt 3: Website einrichten

### 3.1 n8n-URL einfügen

1. Öffne: `kortex-n8n-modal.html`

2. Suche nach (3x):
   ```html
   data-workflow-url="DEINE_N8N_WORKFLOW_URL_HIER"
   ```

3. Ersetze mit deiner n8n-URL:
   ```html
   data-workflow-url="https://n8n2.kortex-system.de/webhook/business-card-extraction"
   ```

4. **3x ersetzen:**
   - Zeile ~361: Sample 1 Card
   - Zeile ~375: Sample 2 Card  
   - Zeile ~390: Upload Card

### 3.2 Button auf Startseite verknüpfen

1. Öffne deine Startseite: `index.html`

2. Finde den Button "Visitenkarten-Extraktion"

3. Gib ihm eine ID:
   ```html
   <a id="btn-bizcard" href="#" ...>Visitenkarten-Extraktion</a>
   ```

4. Füge vor `</body>` hinzu:
   ```html
   <script>
   document.getElementById('btn-bizcard')?.addEventListener('click', function(e) {
     e.preventDefault();
     window.location.href = '/kortex-n8n-modal.html';
   });
   </script>
   ```

---

## 🧪 Schritt 4: Testen

### 4.1 Lokaler Test

1. Öffne `kortex-n8n-modal.html` im Browser

2. Klicke **"Business Card – Sample 1"**
   - Modal sollte sich öffnen
   - n8n-Workflow sollte laufen
   - Ergebnisse sollten in Tabelle erscheinen

3. Klicke **"Business Card – Sample 2"**
   - Gleicher Ablauf

4. Klicke **"Eigene Visitenkarte hochladen"**
   - n8n-Formular sollte sich öffnen
   - Upload testen

### 4.2 Live-Test

1. Deploye Website (GitHub Pages, Netlify, etc.)

2. Teste von Live-URL

---

## ✅ Finale Checkliste

### n8n:
- [ ] Workflow importiert
- [ ] "Continue Workflow" aktiviert
- [ ] Sample-URLs angepasst
- [ ] KI konfiguriert (oder Placeholder für Demo)
- [ ] Workflow aktiviert
- [ ] Production URL kopiert

### Website:
- [ ] n8n-URL eingefügt (3x)
- [ ] Button verknüpft
- [ ] Bilder hochgeladen
- [ ] Lokal getestet
- [ ] Modal funktioniert
- [ ] Tabelle zeigt Ergebnisse
- [ ] CSV-Download funktioniert
- [ ] JSON-Download funktioniert

### Deployment:
- [ ] Website deployed (GitHub Pages/Netlify)
- [ ] Live getestet
- [ ] Mobile getestet

---

## 🎉 Fertig!

Deine Demo ist jetzt production-ready! 🚀

**Was funktioniert:**
- ✅ Klick auf Button → Modal öffnet sich
- ✅ Sample 1/2 → Extraktion läuft
- ✅ Upload → Eigene Visitenkarte hochladen
- ✅ Ergebnisse → Tabelle + CSV/JSON Download

**Next Steps:**
1. KI-Extraktion implementieren (wenn noch nicht geschehen)
2. Design-Feinabstimmung
3. Analytics aktivieren (optional)
4. User-Feedback sammeln

**Viel Erfolg!** ✨

---

## 📞 Hilfe bei Problemen?

1. **Browser Console prüfen** (F12)
2. **n8n Execution Logs prüfen**
3. **Diese Checkliste durchgehen**
4. **Siehe:** `N8N_SETUP_ANLEITUNG.md` → Troubleshooting

