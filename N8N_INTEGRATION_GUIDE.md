# 🔗 n8n Workflow Integration - Anleitung

## Übersicht

Diese Anleitung zeigt dir, wie du deine n8n-Workflows in die Kortex-Website integrierst.

---

## 📁 Dateien

- **`kortex-n8n-integration.html`** - Vollständige Demo-Seite mit beiden Workflows
- **`kortex-website-integration-snippet.html`** - Code-Snippets für bestehende Website
- **`example-website-integration.html`** - Beispiel mit iframe-Modal

---

## 🚀 Quick Start

### Schritt 1: n8n-Workflow-URLs holen

#### Für Business Card Extraction:
1. Öffne deinen n8n-Workflow
2. Finde den Node "User business card upload" (oder ähnlich)
3. Klicke auf den Node
4. Aktiviere "Test URL" oder "Production URL"
5. Kopiere die URL (z.B. `https://n8n.kortex.de/webhook/business-card-upload`)

#### Für Invoice Extraction:
- Bereits konfiguriert: `https://koretex-invoice-db.onrender.com/upload`

---

### Schritt 2: URLs in HTML einfügen

Öffne `kortex-n8n-integration.html` und suche nach Zeile **185**:

```html
<!-- Finde diese Zeile: -->
<a href="#" class="demo-card-link" 
   data-n8n-url="DEIN_N8N_VISITENKARTEN_URL_HIER" 
   data-title="Visitenkarten-Extraktion">
```

Ersetze `DEIN_N8N_VISITENKARTEN_URL_HIER` mit deiner echten n8n-URL:

```html
<!-- Ersetzen mit: -->
<a href="#" class="demo-card-link" 
   data-n8n-url="https://n8n.kortex.de/webhook/business-card-upload" 
   data-title="Visitenkarten-Extraktion">
```

---

### Schritt 3: Testen

1. Öffne `kortex-n8n-integration.html` im Browser
2. Klicke auf "Business Card Extraction"
3. Ein Pop-up sollte sich mit deinem n8n-Formular öffnen

---

## 🎨 Integration in bestehende Website

### Option A: Standalone-Seite (Empfohlen für Demo)

1. Lade `kortex-n8n-integration.html` auf deinen Webserver hoch
2. Verlinke von deiner Hauptseite darauf:
   ```html
   <a href="/kortex-n8n-integration.html">KI-Workflows testen</a>
   ```

### Option B: Code-Snippets in bestehende Seite einbauen

Verwende die Snippets aus `kortex-website-integration-snippet.html`:

#### HTML-Struktur (in deine index.html einfügen):

```html
<section id="workflows" style="padding: 4rem 2rem;">
  <h2>🚀 KI-Workflows</h2>
  
  <div class="demo-grid">
    <a href="#" class="demo-card-link" 
       data-n8n-url="https://deine-n8n-url.de/webhook/..." 
       data-title="Visitenkarten-Extraktion">
      <div class="demo-card">
        <h3>Business Card Extraction</h3>
        <p>Automated contact capture with AI</p>
        <span class="arrow-icon">→</span>
      </div>
    </a>
    
    <a href="#" class="demo-card-link" 
       data-n8n-url="https://koretex-invoice-db.onrender.com/upload" 
       data-title="Rechnungsdaten-Extraktion">
      <div class="demo-card">
        <h3>Invoice Data Extraction</h3>
        <p>AI-powered invoice processing</p>
        <span class="arrow-icon">→</span>
      </div>
    </a>
  </div>
</section>
```

#### CSS (in deine styles.css oder `<style>`-Block):

```css
.demo-card-link {
  text-decoration: none;
  display: block;
  margin-bottom: 20px;
}

.demo-card {
  background-color: #09182F; /* Kortex Navy */
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.demo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.demo-card h3 {
  margin: 0;
  font-size: 1.2em;
}

.demo-card p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #a0a0a0;
}

.arrow-icon {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
}
```

#### JavaScript (vor `</body>` einfügen):

```javascript
<script>
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.demo-card-link');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const n8nUrl = link.getAttribute('data-n8n-url');
      const demoTitle = link.getAttribute('data-title');
      
      if (!n8nUrl || n8nUrl.includes('DEIN_N8N')) {
        alert('Demo-URL ist noch nicht konfiguriert! Bitte füge den Link des n8n Formulars ein.');
        return;
      }
      
      const width = 600;
      const height = 800;
      const left = (screen.width / 2) - (width / 2);
      const top = (screen.height / 2) - (height / 2);
      
      window.open(
        n8nUrl, 
        demoTitle, 
        `scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    });
  });
});
</script>
```

---

## 🎯 n8n-Workflow vorbereiten

### Für optimale Integration sollte dein n8n-Workflow:

1. **Webhook/Form Node** haben mit aktivierter Test/Production URL
2. **CORS aktiviert** haben (in n8n Webhook-Einstellungen)
3. **Öffentlich zugänglich** sein (keine Authentication für Demo)

### Empfohlene n8n-Workflow-Struktur:

```
1. Webhook/Form Node (User Upload)
   ↓
2. File Processing
   ↓
3. Google Vertex AI / Vision API
   ↓
4. Data Extraction
   ↓
5. Response zurück an User
```

---

## 🔧 Anpassungen

### Pop-up-Größe ändern:

In JavaScript (Zeile ~180):
```javascript
const width = 800;   // Breiter machen
const height = 900;  // Höher machen
```

### Styling an Kortex-Design anpassen:

Die Datei nutzt bereits Kortex-Farben:
- Navy: `#09182F`
- Blue: `#60a5fa`
- Purple: `#a78bfa`

---

## 🧪 Testing Checklist

- [ ] n8n-Workflow läuft und ist öffentlich erreichbar
- [ ] URL in HTML korrekt eingefügt (keine Platzhalter mehr)
- [ ] HTML-Datei im Browser geöffnet
- [ ] Auf "Business Card Extraction" geklickt
- [ ] Pop-up öffnet sich mit n8n-Formular
- [ ] Datei-Upload im n8n-Formular funktioniert
- [ ] Workflow verarbeitet Datei korrekt
- [ ] Auch "Invoice Data Extraction" getestet

---

## 📱 Mobile-Optimierung

Das Design ist bereits responsive. Auf mobilen Geräten:
- Cards stapeln sich vertikal
- Pop-ups öffnen sich im gleichen Tab (besseres Mobile UX)

---

## 🔒 Sicherheit

### Für Production:

1. **n8n Authentication aktivieren:**
   - In n8n: Webhook → Settings → Authentication
   - Bearer Token oder Basic Auth verwenden

2. **Rate Limiting:**
   - In n8n: Workflow Settings → Rate Limiting
   - Z.B. max 10 Requests pro Minute pro IP

3. **File Size Limits:**
   - In n8n Form Node: Max File Size auf 10MB setzen

---

## 🆘 Troubleshooting

### Problem: Pop-up öffnet sich nicht

**Lösung:** Browser-Pop-up-Blocker deaktivieren
- Chrome: Einstellungen → Datenschutz → Pop-ups erlauben
- Firefox: Einstellungen → Datenschutz → Pop-up-Fenster

### Problem: "Demo-URL ist noch nicht konfiguriert"

**Lösung:** Prüfe ob du die URL richtig ersetzt hast:
```html
❌ data-n8n-url="DEIN_N8N_VISITENKARTEN_URL_HIER"
✅ data-n8n-url="https://n8n.kortex.de/webhook/..."
```

### Problem: n8n-Formular lädt nicht

**Lösung:** 
1. Teste die n8n-URL direkt im Browser
2. Prüfe ob Workflow aktiviert ist
3. Prüfe CORS-Einstellungen in n8n

---

## 📊 Analytics (Optional)

### Google Analytics Integration:

Das JavaScript enthält bereits Analytics-Events:

```javascript
gtag('event', 'demo_opened', {
  'event_category': 'engagement',
  'event_label': demoTitle,
  'workflow_url': n8nUrl
});
```

Aktiviere dies in deiner Google Analytics Konfiguration.

---

## 🎉 Deployment

### GitHub Pages (kostenlos):

1. Committe die Dateien:
   ```bash
   git add kortex-n8n-integration.html
   git commit -m "Add n8n workflow integration"
   git push origin main
   ```

2. Aktiviere GitHub Pages:
   - Repository Settings → Pages
   - Source: main branch
   - Save

3. Deine Seite ist live unter:
   `https://yourusername.github.io/repo-name/kortex-n8n-integration.html`

### Netlify (kostenlos):

1. Drag & Drop `kortex-n8n-integration.html` auf netlify.com
2. Fertig! Automatische HTTPS.

---

## ✅ Fertig!

Du hast jetzt eine professionelle Demo-Seite mit beiden KI-Workflows! 🚀

**Next Steps:**
1. n8n-URL eintragen
2. Testen
3. Deployen
4. Feedback sammeln

---

## 📞 Support

Bei Fragen oder Problemen, prüfe:
1. Browser Console (F12) auf Fehler
2. n8n-Workflow ist aktiviert und öffentlich
3. Alle Platzhalter-URLs ersetzt

Viel Erfolg! 🎯


