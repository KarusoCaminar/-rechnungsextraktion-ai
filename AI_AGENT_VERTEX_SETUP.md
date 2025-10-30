# 🤖 AI Agent Node - Google Vertex AI Setup

## 📋 Übersicht

Diese Anleitung zeigt dir, wie du den **AI Agent Node** in n8n mit **Google Vertex AI Gemini** konfigurierst.

---

## 🚀 Schritt 1: Workflow importieren

1. Öffne n8n: `https://n8n2.kortex-system.de`

2. Gehe zu: **Workflows** → **Import from File**

3. Wähle: **`n8n-business-card-workflow-vertex.json`**

4. Klicke **"Import"**

✅ Workflow ist jetzt importiert!

---

## ⚙️ Schritt 2: AI Agent Node konfigurieren

### 2.1 AI Agent Node öffnen

1. Klicke auf den Node **"AI Agent - Vertex AI"** (in der Mitte des Workflows)

2. Das Konfigurations-Panel öffnet sich rechts

### 2.2 Chat Model hinzufügen

1. **Im unteren Bereich** des Panels siehst du:
   - **Chat Model *** (mit Stern = Pflichtfeld!)
   - Memory
   - Tool

2. Klicke auf **"+"** unter **"Chat Model *"**

3. Ein neues Panel öffnet sich: **"Add Chat Model"**

4. **Wähle:** **"Google Vertex AI"** (oder "Google Gemini")

### 2.3 Google Vertex AI konfigurieren

Im **"Add Chat Model"** Panel:

1. **Name:** z.B. `Vertex AI Gemini 1.5 Pro`

2. **Model:** Wähle eines der folgenden:
   - `gemini-1.5-pro` (Beste Qualität, langsamer)
   - `gemini-1.5-flash` (Schneller, gut genug)
   - `gemini-pro` (Ältere Version)

3. **Location:** Wähle deine Region:
   - `us-central1` (USA)
   - `europe-west1` (Europa)
   - `asia-southeast1` (Asien)

4. **Project ID:** Dein Google Cloud Project ID
   - Beispiel: `kortex-ai-123456`

5. **Credentials:** Wähle deine Google API Credentials
   - Falls noch nicht vorhanden: Klicke **"Create New"**
   - Service Account Email: aus deiner JSON
   - Private Key: aus deiner JSON
   - Project ID: aus deiner JSON

6. **Temperature:** `0.3` (für strukturierte Extraktion)

7. **Max Tokens:** `2048` (Standard)

8. Klicke **"Save"**

### 2.4 AI Agent Parameter prüfen

Zurück im **"AI Agent"** Node Panel:

1. **Parameters Tab:**
   - ✅ Prompt sollte bereits eingetragen sein
   - ✅ Attachments sollten bereits konfiguriert sein (für das Bild)

2. **Settings Tab:**
   - **Always Output Data:** Off (Standard)
   - **Execute Once:** Off
   - **Retry On Fail:** On (empfohlen)

3. **Chat Model:**
   - ✅ Sollte jetzt dein Vertex AI Model zeigen
   - Klicke drauf, um zu prüfen/ändern

### 2.5 Require Specific Output Format (Optional)

1. Im **Parameters Tab:**

2. Aktiviere **"Require Specific Output Format"**

3. Format:
```json
{
  "name": "string",
  "company": "string",
  "email": "string",
  "phone": "string",
  "phone_office": "string",
  "address": "string",
  "city": "string",
  "website": "string",
  "job_title": "string"
}
```

---

## 🔧 Schritt 3: Webhook Node konfigurieren

1. Klicke auf **"Business Card Upload"** Node (ganz links)

2. **WICHTIG:** Klicke auf **"⚙️ Options"**:
   - ✅ **"Continue Workflow after Webhook Response"** aktivieren
   - ✅ **"Binary Data"** aktivieren
   - **Binary Property Name:** `file`

3. Klicke **"Save"**

---

## 📥 Schritt 4: Sample-URLs anpassen

1. **"Lade Sample 1"** Node:
   - URL: `https://karusocaminar.github.io/koretex-website/samples/bc-1.jpg`
   - (Oder deine eigene URL)

2. **"Lade Sample 2"** Node:
   - URL: `https://karusocaminar.github.io/koretex-website/samples/bc-2.jpg`

---

## 🧪 Schritt 5: Testen

### 5.1 Test mit Sample 1

1. Klicke auf **"Execute Workflow"** (oben rechts)

2. Klicke auf **"Business Card Upload"** Node

3. Klicke **"Test URL"** oder füge Query-Parameter hinzu:
   ```
   ?sample=1
   ```

4. Klicke **"Execute Node"**

5. Der Workflow sollte durchlaufen:
   - ✅ Sample 1 wird geladen
   - ✅ Bild wird zu Base64 konvertiert
   - ✅ AI Agent analysiert das Bild
   - ✅ Ergebnisse werden geparst
   - ✅ Response wird formatiert

6. Prüfe die **Execution Logs:**
   - Klicke auf **"AI Agent - Vertex AI"** Node
   - Prüfe die **Output** Daten
   - Sollte JSON mit Kontaktdaten enthalten

### 5.2 Troubleshooting

**Problem: "Chat Model not configured"**

**Lösung:**
- Klicke auf **"AI Agent - Vertex AI"** Node
- Klicke auf **"+"** unter **"Chat Model *"**
- Füge Google Vertex AI hinzu (siehe Schritt 2.3)

**Problem: "Credentials not found"**

**Lösung:**
- Gehe zu: **Settings** → **Credentials**
- Füge **Google API Credentials** hinzu
- Nutze deine Service Account JSON

**Problem: "Binary data missing"**

**Lösung:**
- Prüfe **"Konvertiere zu Base64"** Node
- Prüfe Binary Property Name ist `file`
- Prüfe Sample-URLs laden korrekt

**Problem: "AI Agent gibt keinen Output"**

**Lösung:**
- Prüfe **Settings Tab** → **"Always Output Data"** → Aktivieren
- Prüfe **Execution Logs** für Fehlermeldungen
- Prüfe **Chat Model** ist korrekt konfiguriert

---

## ✅ Checkliste

### AI Agent Node:
- [ ] Workflow importiert
- [ ] Chat Model hinzugefügt (Google Vertex AI)
- [ ] Model ausgewählt (gemini-1.5-pro oder flash)
- [ ] Location ausgewählt (us-central1, etc.)
- [ ] Project ID eingetragen
- [ ] Google API Credentials konfiguriert
- [ ] Prompt ist korrekt
- [ ] Attachments sind konfiguriert
- [ ] Test mit Sample 1 erfolgreich
- [ ] Test mit Sample 2 erfolgreich
- [ ] Test mit Upload erfolgreich

---

## 🎯 Workflow-Struktur

```
1. Business Card Upload (Webhook)
   ↓
2. Ist Sample? → Nein → Sample 1/2 laden
   ↓
3. Setze Sample-Info
   ↓
4. Konvertiere zu Base64
   ↓
5. AI Agent - Vertex AI (Gemini)
   ↓
6. Parse AI Agent Response
   ↓
7. Formatiere für Website
   ↓
8. Antwort an Website
```

---

## 💡 Tipps

### Bessere Extraktion

1. **Require Specific Output Format** aktivieren (siehe Schritt 2.5)
   - Erzwingt strukturiertes JSON
   - Reduziert Parsing-Fehler

2. **Temperature** auf `0.3` setzen
   - Für strukturierte Extraktion
   - Weniger "kreative" Antworten

3. **Max Tokens** auf `2048` oder höher
   - Für detaillierte Extraktionen

### Performance

- **gemini-1.5-flash** für schnellere Ergebnisse
- **gemini-1.5-pro** für bessere Qualität

---

## 📞 Hilfe bei Problemen?

1. **Execution Logs prüfen** (Workflows → Dein Workflow → Executions)
2. **AI Agent Output prüfen** (nach Execution)
3. **Browser Console prüfen** (falls Website-Integration)
4. **Diese Checkliste durchgehen**

---

## 🎉 Fertig!

Dein AI Agent Node sollte jetzt mit Google Vertex AI funktionieren! 🚀

**Next Steps:**
1. Workflow aktivieren
2. Production URL kopieren
3. Website integrieren
4. Testen & deployen

**Viel Erfolg!** ✨

