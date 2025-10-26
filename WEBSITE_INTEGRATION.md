# 🌐 Website Integration Guide

## Integration der Rechnungsextraktion in Ihre Website

Diese Anleitung zeigt Ihnen, wie Sie die Rechnungsextraktion-App als interaktiven Workflow in Ihre Website einbinden können (wie "Invoice Data Extraction" auf Ihrer Demo-Seite).

---

## 🎯 Ziel

Die App soll als **clickbarer Workflow** auf Ihrer Website verfügbar sein:
- Benutzer klickt auf "Invoice Data Extraction" Button
- Ein Modal/Overlay öffnet sich mit der Invoice-Upload-Oberfläche
- Benutzer kann direkt Rechnungen hochladen und verarbeiten
- Alles nahtlos integriert in Ihre bestehende Website

---

## 📋 Voraussetzungen

1. ✅ App deployed auf Replit (siehe `DEPLOYMENT.md`)
2. ✅ Google Cloud Credentials konfiguriert
3. ✅ PostgreSQL Database aktiv
4. ✅ Ihre Website läuft (z.B. `http://localhost:8000`)

---

## 🚀 Option 1: iFrame Integration (Empfohlen)

### Schritt 1: CORS aktivieren

Die App muss CORS konfigurieren, um von Ihrer Website aus erreichbar zu sein.

**Fügen Sie in `server/index.ts` CORS-Middleware hinzu:**

```typescript
// Add this after app initialization (line 5)
import cors from 'cors';

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8000', 'http://127.0.0.1:8000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Installation:**
```bash
npm install cors
npm install --save-dev @types/cors
```

**Replit Secret hinzufügen:**
- Key: `ALLOWED_ORIGINS`
- Value: `http://localhost:8000,https://ihre-website.com`

### Schritt 2: iFrame Code für Ihre Website

**Vollbild Modal-Variante (empfohlen):**

```html
<!-- In Ihrer index.html -->
<style>
  #invoice-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    backdrop-filter: blur(5px);
  }
  
  #invoice-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #invoice-iframe-container {
    position: relative;
    width: 95%;
    height: 95%;
    max-width: 1400px;
    max-height: 900px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
  
  #invoice-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #ef4444;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
    line-height: 1;
    z-index: 10001;
    transition: background 0.2s;
  }
  
  #invoice-close-btn:hover {
    background: #dc2626;
  }
  
  #invoice-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .invoice-trigger-btn {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    padding: 16px 32px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .invoice-trigger-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  }
</style>

<!-- Modal Container -->
<div id="invoice-modal">
  <div id="invoice-iframe-container">
    <button id="invoice-close-btn" aria-label="Schließen">&times;</button>
    <iframe 
      id="invoice-iframe"
      title="Rechnungsextraktion"
      allow="camera; microphone; clipboard-write"
    ></iframe>
  </div>
</div>

<!-- Trigger Button (ersetzen Sie Ihren bestehenden Button) -->
<button class="invoice-trigger-btn" onclick="openInvoiceExtractor()">
  <span>📄</span> Invoice Data Extraction
</button>

<script>
  // Configuration
  const INVOICE_APP_URL = 'https://your-repl-name.repl.co'; // ← Ihre Replit URL
  
  // Open modal
  function openInvoiceExtractor() {
    const modal = document.getElementById('invoice-modal');
    const iframe = document.getElementById('invoice-iframe');
    
    // Load iframe only when opened (performance optimization)
    if (!iframe.src) {
      iframe.src = INVOICE_APP_URL + '/upload';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }
  
  // Close modal
  function closeInvoiceExtractor() {
    const modal = document.getElementById('invoice-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
  
  // Event listeners
  document.getElementById('invoice-close-btn').addEventListener('click', closeInvoiceExtractor);
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeInvoiceExtractor();
    }
  });
  
  // Close on background click
  document.getElementById('invoice-modal').addEventListener('click', (e) => {
    if (e.target.id === 'invoice-modal') {
      closeInvoiceExtractor();
    }
  });
  
  // Listen for messages from iframe (optional - for advanced integration)
  window.addEventListener('message', (event) => {
    // Security check
    if (event.origin !== INVOICE_APP_URL) return;
    
    // Handle events from the invoice app
    if (event.data.type === 'invoice-processed') {
      console.log('Invoice processed:', event.data.invoice);
      // You can show a notification or update your UI
    }
    
    if (event.data.type === 'close-requested') {
      closeInvoiceExtractor();
    }
  });
</script>
```

### Schritt 3: App URL konfigurieren

Nach dem Replit-Deployment:
1. Kopieren Sie Ihre Replit URL (z.B. `https://rechnungsextraktion-username.repl.co`)
2. Ersetzen Sie `INVOICE_APP_URL` im obigen Code

---

## 🎨 Option 2: Popup-Fenster Integration

Wenn Sie lieber ein neues Browser-Fenster öffnen möchten:

```html
<button onclick="openInvoicePopup()">
  📄 Invoice Data Extraction
</button>

<script>
  function openInvoicePopup() {
    const width = 1200;
    const height = 800;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(
      'https://your-repl-name.repl.co/upload',
      'InvoiceExtractor',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no`
    );
  }
</script>
```

---

## 🔗 Option 3: Direkter Link

Einfachste Variante - direkter Link zur App:

```html
<a href="https://your-repl-name.repl.co/upload" target="_blank" class="invoice-link-btn">
  📄 Invoice Data Extraction →
</a>
```

---

## 🎯 Styling-Anpassungen (Optional)

### App-Branding anpassen

Um die App an Ihre Website anzupassen, können Sie CSS-Variablen nutzen:

**In `client/src/index.css` (Zeile 8-50):**

```css
:root {
  /* Passen Sie diese Farben an Ihre Marke an */
  --primary: 220 90% 56%;        /* Ihr Hauptfarbe */
  --primary-foreground: 0 0% 100%;
  
  /* Optional: Weitere Anpassungen */
  --radius: 0.5rem;               /* Ecken-Rundung */
}
```

### Logo austauschen

Ersetzen Sie `client/public/favicon.png` mit Ihrem Logo.

---

## 📱 Responsive Design

Die App ist bereits responsive, aber für optimale iFrame-Integration:

```css
@media (max-width: 768px) {
  #invoice-iframe-container {
    width: 100% !important;
    height: 100% !important;
    border-radius: 0 !important;
  }
}
```

---

## 🔒 Sicherheit & Best Practices

### CORS korrekt konfigurieren

```bash
# In Replit Secrets
ALLOWED_ORIGINS=https://ihre-website.com,https://www.ihre-website.com
```

### Rate Limiting (empfohlen)

Installieren Sie `express-rate-limit`:

```bash
npm install express-rate-limit
```

```typescript
// In server/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // Max 100 Anfragen pro IP
});

app.use('/api/', limiter);
```

---

## 📊 Analytics & Tracking (Optional)

### Iframe-Events an Parent senden

**In der Invoice-App (`client/src/pages/upload.tsx`):**

```typescript
// Nach erfolgreichem Upload
window.parent.postMessage({
  type: 'invoice-processed',
  invoice: {
    id: invoice.id,
    fileName: invoice.fileName,
    status: invoice.status
  }
}, '*'); // In Produktion: Spezifische Origin angeben
```

**In Ihrer Website:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'invoice-processed') {
    // Google Analytics Event
    gtag('event', 'invoice_extraction', {
      'invoice_id': event.data.invoice.id,
      'file_name': event.data.invoice.fileName
    });
  }
});
```

---

## 🧪 Testing

### Lokales Testing

1. Starten Sie Ihre Invoice-App:
```bash
npm run dev  # Port 5000
```

2. Starten Sie Ihre Website:
```bash
# Im Website-Verzeichnis
python -m http.server 8000  # oder Ihr Server
```

3. Öffnen Sie: `http://localhost:8000`
4. Testen Sie den "Invoice Data Extraction" Button

---

## 🌐 Production Deployment Checklist

- [ ] App auf Replit deployed
- [ ] `GOOGLE_CLOUD_CREDENTIALS` Secret gesetzt
- [ ] `DATABASE_URL` konfiguriert (automatisch bei Replit)
- [ ] `ALLOWED_ORIGINS` Secret mit Ihrer Website-Domain gesetzt
- [ ] CORS aktiviert im Code
- [ ] iFrame Code in Ihre Website integriert
- [ ] Replit URL im iFrame Code aktualisiert
- [ ] Test: Button klicken → App öffnet sich
- [ ] Test: Rechnung hochladen → Extraktion funktioniert
- [ ] Test: Schließen-Button funktioniert
- [ ] Mobile Ansicht getestet

---

## 💡 Tipps

### Performance-Optimierung

```javascript
// Iframe nur bei Bedarf laden (lazy loading)
function openInvoiceExtractor() {
  const iframe = document.getElementById('invoice-iframe');
  if (!iframe.src) {
    iframe.src = INVOICE_APP_URL + '/upload';
  }
  // ... rest
}
```

### Preload für schnelleres Öffnen

```html
<!-- In Ihrer index.html <head> -->
<link rel="preconnect" href="https://your-repl-name.repl.co">
<link rel="dns-prefetch" href="https://your-repl-name.repl.co">
```

---

## 🆘 Troubleshooting

### iFrame lädt nicht
- ✅ CORS korrekt konfiguriert?
- ✅ `ALLOWED_ORIGINS` enthält Ihre Website-Domain?
- ✅ Replit App läuft?

### "Not allowed by CORS" Fehler
```bash
# Prüfen Sie Replit Secrets:
ALLOWED_ORIGINS=http://localhost:8000,https://ihre-website.com
```

### Button funktioniert nicht
- Öffnen Sie Browser DevTools (F12) → Console
- Prüfen Sie auf JavaScript-Fehler
- Verifizieren Sie `INVOICE_APP_URL` Variable

---

## 📞 Support

Bei Problemen:
1. Prüfen Sie Browser Console (F12)
2. Prüfen Sie Replit Logs
3. Testen Sie die App direkt: `https://your-repl-name.repl.co`

---

## ✅ Fertig!

Ihre Rechnungsextraktion sollte jetzt perfekt in Ihre Website integriert sein! 🎉

**Next Steps:**
1. Design an Ihre Marke anpassen
2. Analytics einrichten
3. Benutzer-Feedback sammeln

