# 🔧 Google Vertex AI Setup für n8n Business Card Workflow

## 📋 Voraussetzungen

- ✅ Google Cloud Account mit aktiviertem Vertex AI
- ✅ Vertex AI API aktiviert
- ✅ Google Cloud Credentials (Service Account JSON)
- ✅ n8n Account (Self-hosted: https://n8n2.kortex-system.de)

---

## 🔑 Schritt 1: Google Cloud Credentials einrichten

### 1.1 Service Account erstellen

1. Gehe zu: [Google Cloud Console](https://console.cloud.google.com)

2. Navigiere zu: **IAM & Admin** → **Service Accounts**

3. Klicke **"Create Service Account"**

4. Name: z.B. `n8n-vertex-ai`

5. Klicke **"Create and Continue"**

6. Rolle: **"Vertex AI User"** oder **"Vertex AI Service Agent"**

7. Klicke **"Done"**

### 1.2 Service Account Key herunterladen

1. Klicke auf den erstellten Service Account

2. Gehe zu **"Keys"** Tab

3. Klicke **"Add Key"** → **"Create new key"**

4. Wähle **"JSON"**

5. Klicke **"Create"** → JSON-Datei wird heruntergeladen

📝 **Notiere dir:** Den Pfad zu dieser JSON-Datei!

---

## 🔧 Schritt 2: n8n Credentials konfigurieren

### Option A: Google API Credentials (n8n Standard)

1. Öffne n8n: `https://n8n2.kortex-system.de`

2. Gehe zu: **Settings** → **Credentials**

3. Klicke **"Add Credential"**

4. Suche nach: **"Google API"**

5. Konfiguration:
   - **Service Account Email:** Aus deiner JSON-Datei (z.B. `n8n-vertex-ai@project-id.iam.gserviceaccount.com`)
   - **Private Key:** Aus deiner JSON-Datei (ganzer `private_key` Wert)
   - **Project ID:** Aus deiner JSON-Datei (`project_id`)

6. Klicke **"Save"**

📝 **Notiere dir:** Die Credential-ID (wird später in Workflow benötigt)

### Option B: OAuth2 (Alternative)

1. Falls du OAuth2 nutzt, konfiguriere:
   - Client ID
   - Client Secret
   - Redirect URL

---

## 📥 Schritt 3: Workflow importieren

1. In n8n: **Workflows** → **Import from File**

2. Wähle: **`n8n-business-card-workflow-vertex.json`**

3. Klicke **"Import"**

---

## ⚙️ Schritt 4: Vertex AI Node konfigurieren

### 4.1 Credentials zuweisen

1. Klicke auf **"Vertex AI HTTP Request"** Node

2. Im rechten Panel: **"Credential for Google API"**

3. Wähle deine Google API Credentials aus

4. Klicke **"Save"**

### 4.2 Environment Variables setzen (Optional)

Falls du Environment Variables nutzt:

In n8n Settings → Environment Variables:
```
GOOGLE_CLOUD_PROJECT_ID=dein-project-id
VERTEX_AI_LOCATION=us-central1
```

**Oder:** Passe die URL direkt im Node an:
```
https://us-central1-aiplatform.googleapis.com/v1/projects/DEIN-PROJECT-ID/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent
```

### 4.3 Model anpassen

Im **"Vertex AI HTTP Request"** Node:

- **URL:** Ersetze `DEIN-PROJECT-ID` mit deinem Google Cloud Project ID
- **Location:** `us-central1` (oder deine Region: `europe-west1`, etc.)
- **Model:** `gemini-1.5-pro` (oder `gemini-1.5-flash` für schnellere/schlechtere Ergebnisse)

---

## 🧪 Schritt 5: Testen

### 5.1 Test mit Sample 1

1. Klicke auf **"Execute Workflow"**

2. Im **"Business Card Upload"** Node:

3. Klicke **"Test URL"** oder füge Query-Parameter hinzu:
   ```
   ?sample=1
   ```

4. Klicke **"Execute Node"**

5. Prüfe die Execution:
   - Workflow sollte durchlaufen
   - Vertex AI sollte das Bild analysieren
   - Ergebnisse sollten geparst werden

### 5.2 Prüfe Vertex AI Response

1. Klicke auf **"Vertex AI HTTP Request"** Node nach Execution

2. Prüfe die Response:
   ```json
   {
     "candidates": [{
       "content": {
         "parts": [{
           "text": "{\"name\": \"Oliver Krause\", ...}"
         }]
       }
     }]
   }
   ```

3. Falls Fehler:
   - Prüfe Credentials
   - Prüfe Project ID
   - Prüfe API Quota/Limits

---

## 🔧 Schritt 6: Troubleshooting

### Problem: "401 Unauthorized"

**Lösung:**
- Prüfe Google API Credentials
- Prüfe Service Account hat Vertex AI Permissions
- Prüfe JSON Key ist korrekt eingefügt

### Problem: "403 Forbidden"

**Lösung:**
- Prüfe Vertex AI API ist aktiviert
- Prüfe Billing ist aktiviert
- Prüfe Quota ist nicht überschritten

### Problem: "404 Not Found"

**Lösung:**
- Prüfe Project ID ist korrekt
- Prüfe Location ist korrekt (us-central1, europe-west1, etc.)
- Prüfe Model-Name ist korrekt (gemini-1.5-pro)

### Problem: "Response Parse Error"

**Lösung:**
- Prüfe "Parse Vertex AI Response" Node
- Prüfe ob JSON-Format in Response korrekt ist
- Prüfe Console-Logs für Details

### Problem: "Binary Data Missing"

**Lösung:**
- Prüfe "Konvertiere zu Base64" Node
- Prüfe Binary Property Name ist "file"
- Prüfe Sample-URLs laden korrekt

---

## 💰 Kosten & Quotas

### Vertex AI Gemini Pricing (Stand: 2025)

- **gemini-1.5-pro:** 
  - Input: $1.25 pro 1M Tokens
  - Output: $5.00 pro 1M Tokens
- **gemini-1.5-flash:**
  - Input: $0.075 pro 1M Tokens
  - Output: $0.30 pro 1M Tokens

**Pro Visitenkarte:** Ca. 1000-2000 Tokens ≈ $0.001-0.01

### Quotas

- Free Tier: 60 Requests/Minute
- Standard: Bis zu 1000 Requests/Minute (nach Request)

---

## ✅ Checkliste

### Google Cloud:
- [ ] Service Account erstellt
- [ ] Vertex AI User Rolle zugewiesen
- [ ] Service Account Key (JSON) heruntergeladen
- [ ] Vertex AI API aktiviert
- [ ] Billing aktiviert
- [ ] Quota überprüft

### n8n:
- [ ] Google API Credentials konfiguriert
- [ ] Credential-ID notiert
- [ ] Workflow importiert
- [ ] Vertex AI Node konfiguriert
- [ ] Project ID eingetragen
- [ ] Location eingetragen
- [ ] Model ausgewählt
- [ ] Test mit Sample 1 erfolgreich
- [ ] Test mit Sample 2 erfolgreich
- [ ] Test mit Upload erfolgreich

---

## 🎯 Nächste Schritte

1. Workflow aktivieren
2. Production URL kopieren
3. Website integrieren
4. Testen & deployen

**Viel Erfolg!** 🚀

