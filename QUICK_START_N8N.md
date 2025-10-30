# ⚡ Quick Start - Kortex n8n Integration

## 🎯 Ziel

Business Card Extraction mit Workflow-Visualisierung in 5 Minuten auf deiner Website!

---

## 📋 3-Schritte-Setup

### Schritt 1: n8n vorbereiten (2 Min)

1. Öffne deinen n8n-Workflow: `Website-Demo_Visitenkarten_v2`

2. Klicke auf Node: **"User business card upload"**

3. **Settings (⚙️) → Node Options:**
   ```
   ✅ Continue Workflow after Webhook Response
   ```
   **Das ist die wichtigste Einstellung für die Visualisierung!**

4. Kopiere die URL:
   ```
   Beispiel: https://n8n.kortex.de/webhook/business-card-upload
   ```

---

### Schritt 2: URL einfügen (1 Min)

Öffne: **`kortex-n8n-modal.html`**

Gehe zu **Zeile 361** und ersetze:

```html
<!-- VORHER: -->
data-workflow-url="DEINE_N8N_WORKFLOW_URL_HIER"

<!-- NACHHER: -->
data-workflow-url="https://n8n.kortex.de/webhook/business-card-upload"
```

**Speichern!**

---

### Schritt 3: Testen (2 Min)

1. Öffne `kortex-n8n-modal.html` im Browser

2. Klicke auf **"Business Card Extraction"**

3. Modal öffnet sich → Upload eine Visitenkarte

4. ✨ Workflow-Visualisierung erscheint

**Fertig!** 🎉

---

## 🎨 Was passiert automatisch?

Das JavaScript erweitert deine URL automatisch:

```javascript
// Deine URL:
https://n8n.kortex.de/webhook/business-card-upload

// Wird zu:
https://n8n.kortex.de/webhook/business-card-upload?modal=true&visualize=true

// modal=true      → Optimiert für Modal
// visualize=true  → Zeigt Workflow-Execution
```

---

## 🚀 Deployen

### GitHub Pages (Kostenlos):

```bash
git add kortex-n8n-modal.html
git commit -m "Add n8n workflow with visualization"
git push origin main

# In GitHub: Settings → Pages → Enable
# Live unter: https://username.github.io/repo/kortex-n8n-modal.html
```

### Netlify (Kostenlos):

1. Drag & Drop `kortex-n8n-modal.html` auf [netlify.com](https://netlify.com)
2. Fertig!

---

## ✅ Checkliste

**Vor dem Testen:**
- [ ] n8n Workflow ist "Active"
- [ ] "Continue Workflow" aktiviert
- [ ] URL in HTML eingefügt (Zeile 361)
- [ ] Datei gespeichert

**Nach dem Testen:**
- [ ] Modal öffnet sich
- [ ] Formular wird geladen
- [ ] Upload funktioniert
- [ ] Workflow-Visualisierung erscheint
- [ ] Daten werden extrahiert

**Vor Production:**
- [ ] Browser-Test (Chrome, Firefox)
- [ ] Mobile-Test (Smartphone)
- [ ] Keine Console-Errors (F12)
- [ ] Deployed & live getestet

---

## 📁 Welche Datei verwenden?

| Datei | Empfohlen | Grund |
|-------|-----------|-------|
| `kortex-n8n-modal.html` | ⭐ **JA** | Modal-Overlay, keine Pop-up-Blocker |
| `kortex-n8n-integration.html` | ⚠️ Alternativ | Pop-up-Fenster, kann geblockt werden |
| `kortex-website-integration-snippet.html` | 📝 Snippets | Zum Einbauen in bestehende Seite |

---

## 🆘 Probleme?

### "Demo-URL ist noch nicht konfiguriert"
→ Zeile 361 prüfen, Platzhalter ersetzen

### Modal öffnet sich, aber leer
→ n8n Workflow "Active"? CORS aktiviert?

### Keine Workflow-Visualisierung
→ "Continue Workflow" aktiviert? (Schritt 1, Punkt 3)

### Upload funktioniert nicht
→ File zu groß? Nur .jpg, .png, .pdf (max 10 MB)

---

## 📖 Mehr Details?

- **Vollständige Anleitung:** `KORTEX_INTEGRATION_FINAL.md`
- **n8n-Setup:** `N8N_SETUP_GUIDE.md`
- **Integration-Details:** `N8N_INTEGRATION_GUIDE.md`

---

## 🎯 Das war's!

Du hast jetzt:
- ✅ Elegante Demo-Seite mit Kortex-Design
- ✅ Modal-Integration (keine Pop-up-Blocker)
- ✅ Workflow-Visualisierung in Echtzeit
- ✅ Responsive & Mobile-optimiert

**Hauptdatei:**
```
kortex-n8n-modal.html
```

**Zeile 361:**
```html
data-workflow-url="https://deine-n8n-url.de/webhook/..."
```

**Viel Erfolg!** 🚀


