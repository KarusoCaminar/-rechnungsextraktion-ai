# 🔧 n8n Workflow Setup für Kortex Website-Integration

## Übersicht

Diese Anleitung zeigt dir, wie du deinen n8n-Workflow (`Website-Demo_Visitenkarten_v2`) so konfigurierst, dass er optimal mit der Kortex-Website zusammenarbeitet und die **Workflow-Visualisierung** funktioniert.

---

## 🎯 Ziel

- Benutzer klickt auf "Business Card Extraction" Button
- Modal öffnet sich mit n8n-Formular
- **Workflow-Visualisierung** zeigt den Ablauf in Echtzeit
- Nahtlose Integration in die Website

---

## ✅ Voraussetzungen in n8n

### 1. Workflow-Node: "User business card upload"

Dieser Node ist dein Einstiegspunkt (Webhook/Form Node).

#### Wichtige Einstellungen:

**a) Node Options aktivieren:**
```
1. Klicke auf den "User business card upload" Node
2. Gehe zu "Node Options" (Zahnrad-Symbol)
3. Aktiviere: "Continue Workflow after Webhook Response"
```

**Warum?** Diese Einstellung sorgt dafür, dass:
- Der User sofort eine Antwort bekommt
- Der Workflow im Hintergrund weiterläuft
- Die Execution-Visualisierung sichtbar wird

**b) URL generieren:**
```
1. Im Node auf "Execute Node" oder "Test URL" klicken
2. Production URL aktivieren (wenn bereit)
3. URL kopieren - z.B.:
   https://n8n.kortex.de/webhook/business-card-upload
```

---

### 2. CORS-Einstellungen (wenn self-hosted)

Falls du n8n selbst hostest, aktiviere CORS:

**In deiner n8n-Umgebung:**
```bash
# docker-compose.yml oder .env
N8N_CORS_ENABLED=true
N8N_CORS_ORIGINS=https://karusocaminar.github.io,https://kortex.de
```

**Oder in n8n Cloud:**
- Automatisch aktiviert
- Keine Konfiguration nötig

---

## 📋 n8n Workflow-Struktur (Empfohlen)

```
┌─────────────────────────────┐
│ User business card upload   │ ← Webhook/Form Node
│ (Continue Workflow: ✅)     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Extract File Data           │ ← File verarbeiten
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Google Vision API /         │ ← OCR/AI Extraktion
│ Vertex AI                   │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Parse & Structure Data      │ ← Daten strukturieren
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Send to CRM / Database      │ ← Optional: Speichern
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Response to User            │ ← Finale Ausgabe
└─────────────────────────────┘
```

---

## 🌐 Website-Integration

### Schritt 1: n8n-URL in HTML einfügen

Öffne `kortex-n8n-modal.html` (Zeile ~361):

```html
<!-- VORHER: -->
<a href="#" class="demo-card-link" 
   data-workflow-url="DEINE_N8N_WORKFLOW_URL_HIER" 
   data-title="Kortex Visitenkarten Demo">

<!-- NACHHER: -->
<a href="#" class="demo-card-link" 
   data-workflow-url="https://n8n.kortex.de/webhook/business-card-upload" 
   data-title="Kortex Visitenkarten Demo">
```

### Schritt 2: Workflow-Visualisierung wird automatisch aktiviert

Das JavaScript fügt automatisch diese URL-Parameter hinzu:
- `?modal=true` - Optimiert für Modal-Darstellung
- `&visualize=true` - Zeigt Workflow-Execution

**Finale URL die geladen wird:**
```
https://n8n.kortex.de/webhook/business-card-upload?modal=true&visualize=true
```

---

## 🎨 Modal-Größe optimiert für Workflow-Visualisierung

Das Modal wurde für optimale Darstellung angepasst:

```css
#workflow-iframe-container {
  max-width: 1600px;  /* Breit genug für Workflow-Ansicht */
  max-height: 950px;  /* Hoch genug für alle Nodes */
}
```

---

## 🧪 Testing

### Lokales Testing (vor Production):

1. **n8n Workflow aktivieren:**
   ```
   n8n → Workflows → Dein Workflow → Active ✅
   ```

2. **Test URL verwenden:**
   ```html
   data-workflow-url="https://n8n.kortex.de/webhook-test/business-card-upload"
   ```

3. **Website öffnen:**
   ```bash
   # Lokal testen
   cd kortex-website
   python -m http.server 8000
   # Öffne: http://localhost:8000/kortex-n8n-modal.html
   ```

4. **Klicke auf "Business Card Extraction"**
   - Modal sollte sich öffnen
   - n8n-Formular wird geladen
   - Lade eine Visitenkarte hoch
   - Workflow-Visualisierung sollte erscheinen

---

## 🔍 Workflow-Visualisierung prüfen

### Was du sehen solltest:

1. **Formular-Ansicht:**
   - Upload-Bereich für Visitenkarte
   - Submit-Button

2. **Nach Upload:**
   - Loading-Indicator
   - Workflow-Execution-Ansicht (wenn "Continue Workflow" aktiv)
   - Schrittweise Anzeige jedes Nodes

3. **Ergebnis:**
   - Extrahierte Kontaktdaten
   - Strukturierte Ausgabe

### Troubleshooting Visualisierung:

**Problem:** Workflow-Visualisierung erscheint nicht

**Lösung:**
```
1. Node "User business card upload" öffnen
2. Settings → Node Options
3. ✅ "Continue Workflow after Webhook Response"
4. Save Workflow
5. Workflow neu aktivieren
```

---

## 🔒 Sicherheitseinstellungen (Production)

### 1. Rate Limiting in n8n

```javascript
// In n8n Webhook Settings
{
  "rateLimit": {
    "enabled": true,
    "maxRequests": 10,
    "windowMs": 60000  // 10 Requests pro Minute
  }
}
```

### 2. File Size Limits

```javascript
// In n8n Form/Webhook Node
{
  "options": {
    "maxFileSize": 10485760  // 10 MB
  }
}
```

### 3. Allowed File Types

```javascript
// In n8n Form Node
{
  "acceptedFileTypes": ".jpg,.jpeg,.png,.pdf"
}
```

---

## 📊 Analytics & Monitoring

### Google Analytics Integration (Optional)

Die Website sendet bereits Events:

```javascript
// Automatisch beim Öffnen
gtag('event', 'workflow_opened', {
  'event_category': 'engagement',
  'event_label': 'Kortex Visitenkarten Demo',
  'workflow_url': 'https://n8n.kortex.de/webhook/...'
});

// Beim Schließen
gtag('event', 'workflow_closed', {
  'event_category': 'engagement'
});
```

### n8n Execution Monitoring

```
n8n → Executions → Filter by Workflow
```

Hier siehst du:
- Alle Ausführungen
- Success/Error Rate
- Execution Time
- Input/Output Data

---

## 🚀 Production Deployment Checklist

### n8n-Seite:
- [ ] Workflow aktiv (`Active ✅`)
- [ ] "Continue Workflow after Webhook Response" aktiviert
- [ ] Production URL generiert
- [ ] CORS aktiviert (wenn self-hosted)
- [ ] Rate Limiting konfiguriert
- [ ] File Size Limits gesetzt
- [ ] Error Handling in Workflow vorhanden

### Website-Seite:
- [ ] n8n URL in HTML eingefügt (Zeile ~361)
- [ ] Keine Platzhalter mehr (`DEINE_N8N_...`)
- [ ] Modal-Größe optimiert (1600x950px)
- [ ] JavaScript lädt korrekt
- [ ] Lokaler Test erfolgreich
- [ ] Cross-Browser getestet (Chrome, Firefox, Safari)
- [ ] Mobile-Ansicht getestet

### Testing:
- [ ] Visitenkarte hochgeladen
- [ ] Workflow läuft durch
- [ ] Visualisierung erscheint
- [ ] Ergebnis wird angezeigt
- [ ] Modal schließt korrekt (X-Button & ESC)
- [ ] Keine Console-Errors

---

## 🆘 Häufige Probleme

### Problem 1: "Demo-URL ist noch nicht konfiguriert"

**Ursache:** Platzhalter nicht ersetzt

**Lösung:**
```html
❌ data-workflow-url="DEINE_N8N_WORKFLOW_URL_HIER"
✅ data-workflow-url="https://n8n.kortex.de/webhook/business-card-upload"
```

---

### Problem 2: Modal öffnet sich, aber n8n lädt nicht

**Ursache:** CORS-Fehler

**Lösung:**
```bash
# In n8n .env
N8N_CORS_ENABLED=true
N8N_CORS_ORIGINS=https://karusocaminar.github.io
```

**Prüfen:**
```javascript
// Browser Console (F12)
// Sollte keinen CORS-Error zeigen
```

---

### Problem 3: Workflow-Visualisierung erscheint nicht

**Ursache:** "Continue Workflow" nicht aktiviert

**Lösung:**
```
1. n8n → Workflow öffnen
2. "User business card upload" Node anklicken
3. Settings (Zahnrad) → Node Options
4. ✅ Continue Workflow after Webhook Response
5. Save & Activate
```

---

### Problem 4: Upload funktioniert nicht

**Ursache:** File Size zu groß oder falscher Typ

**Lösung:**
```javascript
// In n8n Form Node
Accepted File Types: .jpg,.jpeg,.png,.pdf
Max File Size: 10 MB
```

---

## 📱 Mobile-Optimierung

Das Modal ist bereits responsive:

```css
@media (max-width: 768px) {
  #workflow-iframe-container {
    width: 100%;
    height: 100%;
    border-radius: 0;  /* Fullscreen auf Mobile */
  }
}
```

**Mobile Testing:**
1. Öffne Website auf Smartphone
2. Tippe auf "Business Card Extraction"
3. Modal sollte Fullscreen sein
4. Upload sollte funktionieren
5. Schließen-Button sollte erreichbar sein

---

## 🎯 Best Practices

### 1. Error Handling in n8n

Füge einen Error-Handler hinzu:

```
Try/Catch Node um AI-Verarbeitung
↓
Bei Error: Freundliche Nachricht zurück
"Bitte versuchen Sie es erneut oder kontaktieren Sie uns."
```

### 2. Response-Optimierung

```javascript
// In n8n Response Node
{
  "success": true,
  "message": "Visitenkarte erfolgreich verarbeitet!",
  "data": {
    "name": "Max Mustermann",
    "email": "max@beispiel.de",
    "phone": "+49 123 456789"
  }
}
```

### 3. Loading-States

Die Website zeigt automatisch:
- Spinner beim Laden
- "Workflow wird geladen..."
- Smooth Animations

---

## ✅ Checkliste: Bereit für Demo

- [ ] n8n Workflow läuft stabil
- [ ] "Continue Workflow" ist aktiviert
- [ ] Production URL ist öffentlich
- [ ] Website-Code enthält richtige URL
- [ ] Modal öffnet sich korrekt
- [ ] Visualisierung funktioniert
- [ ] Upload & Verarbeitung erfolgreich
- [ ] Error Handling vorhanden
- [ ] Mobile getestet
- [ ] Analytics aktiv (optional)

---

## 🎉 Fertig!

Deine n8n-Workflow-Integration ist jetzt production-ready!

**Demo-Link:**
```
https://deine-website.de/kortex-n8n-modal.html
```

**n8n Workflow URL:**
```
https://n8n.kortex.de/webhook/business-card-upload?modal=true&visualize=true
```

---

## 📞 Support & Debugging

### Logs prüfen:

**n8n:**
```bash
# Docker Logs
docker logs n8n

# In n8n UI
Executions → View Details → Execution Data
```

**Website:**
```javascript
// Browser Console (F12)
// Sollte zeigen:
✅ Kortex n8n Modal Integration geladen
📊 Gefundene Demo-Cards: 2
🚀 Workflow geöffnet: Kortex Visitenkarten Demo
```

---

Viel Erfolg mit deiner Demo! 🚀


