# 📦 Repository-Merge-Anleitung

## Aktueller Status

✅ **Alles ist online gepusht:**
- Remote: `https://github.com/KarusoCaminar/-rechnungsextraktion-ai.git`
- Branch: `main`
- Status: Clean (alle Änderungen sind committed und gepusht)

## Repository-Struktur

### Aktuelles Setup
```
rechnungsextraktion-ai-clean/
├── client/          ← Aktive Client-App
├── server/          ← Aktive Server-Logik
├── shared/          ← Geteiltes Schema
├── extracted_app/   ← ALT/BACKUP (kann gelöscht werden)
└── ...
```

### ⚠️ Wichtig: `extracted_app` Ordner
Der `extracted_app/` Ordner ist eine **alte Version/Backup** und wird aktuell im Git getrackt. Dies sollten wir aufräumen.

## Option 1: Alles in ein Hauptrepo verschieben ✅ (EMPFOHLEN)

### Schritt 1: Hauptrepo vorbereiten
```bash
# Im Hauptrepo
cd /pfad/zum/hauptrepo
git pull origin main  # Aktuellste Version holen
```

### Schritt 2: Diesen Ordner als Subfolder einfügen
```bash
# Option A: Als separater Ordner (z.B. "invoice-extractor")
# Kopieren Sie diesen Ordner ins Hauptrepo:
cp -r rechnungsextraktion-ai-clean /pfad/zum/hauptrepo/invoice-extractor

# ODER Option B: Inhalte direkt ins Hauptrepo
# Kopieren Sie nur die wichtigen Ordner:
# - client/
# - server/
# - shared/
# (OHNE extracted_app/)
```

### Schritt 3: extracted_app entfernen (AUFRÄUMEN)
```bash
# Im aktuellen Repo (rechnungsextraktion-ai-clean)
# extracted_app zu .gitignore hinzufügen (falls noch nicht vorhanden)
echo "extracted_app/" >> .gitignore

# Oder komplett entfernen aus Git:
git rm -r --cached extracted_app/
git commit -m "chore: Remove old extracted_app backup folder"
git push
```

### Schritt 4: Im Hauptrepo committen
```bash
cd /pfad/zum/hauptrepo
git add invoice-extractor/  # ODER die einzelnen Ordner
git commit -m "feat: Add invoice extraction app"
git push
```

## Option 2: Beide Repos behalten (Alternative)

Wenn Sie beide Repos getrennt behalten möchten:
- **Aktuelles Repo**: `-rechnungsextraktion-ai` (für Invoice-Extraktion)
- **Hauptrepo**: Separate Projekte

**Vorteil:** Klare Trennung, einfachere Deployments
**Nachteil:** Mehr Repos zu verwalten

## ✅ Empfehlung: Option 1

**Warum?**
1. Ein Repository ist einfacher zu verwalten
2. Alle Projekte an einem Ort
3. Einheitliche Versionierung
4. Einfacheres Deployment

**Wichtig:**
- `extracted_app/` Ordner ist **nicht mehr nötig** (alte Backup-Version)
- Kann sicher gelöscht/ignoriert werden

## Aufräumen-Checkliste

- [ ] `extracted_app/` aus Git entfernen
- [ ] `extracted_app/` zu `.gitignore` hinzufügen
- [ ] Alte/unbenutzte Dateien prüfen
- [ ] README aktualisieren
- [ ] Alles committen und pushen

## Nach dem Merge

Nach dem Verschieben ins Hauptrepo:
1. ✅ **Environment Variables** im Hauptrepo setzen
2. ✅ **Deployment-Config** anpassen (falls nötig)
3. ✅ **Dependencies** installieren: `npm install`
4. ✅ **Database Migration**: `npm run db:push`
5. ✅ **Testen**: `npm run dev`

---

**Fragen?** Die aktuelle Struktur funktioniert, aber zusammenführen ist sauberer! 🎯

