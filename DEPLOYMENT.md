# Deployment-Anleitung für Railway

Diese Anleitung beschreibt, wie die Nomos Anwendung vollständig auf Railway deployed wird - sowohl Frontend als auch Backend als separate Services.

## Voraussetzungen

- GitHub Repository erstellt
- Railway Account (kostenlos)

## Schritt 1: GitHub Repository vorbereiten

1. Alle Änderungen committen und pushen:
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

## Schritt 2: Backend-Service auf Railway erstellen

1. Gehe zu [railway.app](https://railway.app) und melde dich an
2. Klicke auf "New Project"
3. Wähle "Deploy from GitHub repo"
4. Wähle dein Repository aus
5. **Wichtig**: Im Railway Dashboard:
   - Gehe zu "Settings" → "Root Directory"
   - Setze Root Directory auf: `backend`
   - Gehe zu "Settings" → "Build Command"
   - Setze Build Command auf: `npm install && npm run build`
   - Gehe zu "Settings" → "Start Command"
   - Setze Start Command auf: `npm start`
6. Gehe zu "Variables" und füge hinzu:
   - `NODE_ENV=production`
   - `FRONTEND_URL` (wird später gesetzt, nachdem Frontend deployed ist)
7. **Persistenter Speicher (optional, aber empfohlen)**:
   - Im Railway Dashboard: Klicke auf deinen Backend-Service
   - Im Service-Dashboard findest du einen Tab/Button "Volumes" oder "Storage"
   - Falls verfügbar, klicke auf "Add Volume" oder "Create Volume"
   - Konfiguriere:
     - Mount Path: `/app/data`
     - Größe: 1GB (oder nach Bedarf)
   - Dies speichert die SQLite-Datenbank persistent
   - **Hinweis**: Volumes sind nicht in allen Railway-Regionen verfügbar (z.B. nicht in "Metal"-Regionen). Falls nicht verfügbar, siehe Option B.
8. Notiere dir die Railway URL (z.B. `https://nomos-backend-production.up.railway.app`)

## Schritt 3: Frontend-Service auf Railway erstellen

1. Im gleichen Railway Project, klicke auf "New Service"
2. Wähle "GitHub Repo" und wähle das gleiche Repository
3. **Wichtig**: Im Railway Dashboard:
   - Gehe zu "Settings" → "Root Directory"
   - Setze Root Directory auf: `frontend`
   - Gehe zu "Settings" → "Build Command"
   - Setze Build Command auf: `npm install && npm run build`
   - Gehe zu "Settings" → "Start Command"
   - Setze Start Command auf: `npx serve -s dist -l $PORT`
   - **ODER** verwende einen statischen Service:
     - Gehe zu "Settings" → "Service Type"
     - Wähle "Static Site" (falls verfügbar)
4. Gehe zu "Variables" und füge hinzu:
   - `VITE_API_URL=https://deine-backend-url.railway.app/api`
   - (Ersetze `deine-backend-url` mit deiner tatsächlichen Backend Railway URL)
5. Notiere dir die Frontend Railway URL (z.B. `https://nomos-frontend-production.up.railway.app`)

## Schritt 4: CORS konfigurieren

1. Gehe zum Backend-Service in Railway
2. Gehe zu "Variables"
3. Aktualisiere `FRONTEND_URL` mit deiner Frontend Railway URL:
   - `FRONTEND_URL=https://deine-frontend-url.railway.app`
4. Railway wird automatisch neu deployen

## Schritt 5: Automatisches Deployment

Beide Services deployen automatisch bei jedem Push auf den `main` Branch.

## Environment Variables Übersicht

### Railway (Backend Service)
- `PORT` - Wird automatisch von Railway gesetzt
- `NODE_ENV=production`
- `FRONTEND_URL` - Deine Railway Frontend URL

### Railway (Frontend Service)
- `VITE_API_URL` - Deine Railway Backend URL mit `/api` Suffix

## Troubleshooting

### Backend startet nicht
- Prüfe die Railway Logs
- Stelle sicher, dass `backend/package.json` korrekt ist
- Prüfe, ob das Volume für `/app/data` gemountet ist (falls verwendet)

### Frontend kann Backend nicht erreichen
- Prüfe, ob `VITE_API_URL` im Frontend-Service korrekt gesetzt ist
- Prüfe CORS-Einstellungen im Backend
- Stelle sicher, dass `FRONTEND_URL` im Backend-Service gesetzt ist
- Prüfe, ob beide Services laufen (siehe Railway Dashboard)

### CORS-Fehler
- Stelle sicher, dass `FRONTEND_URL` im Backend-Service mit der exakten Frontend Railway URL übereinstimmt
- Prüfe, ob das Backend läuft (Health Check: `https://deine-backend-url.railway.app/health`)
- Stelle sicher, dass beide URLs mit `https://` beginnen

### Build-Fehler
- Prüfe die Railway Build-Logs
- Stelle sicher, dass alle Dependencies in `package.json` korrekt sind
- Prüfe, ob TypeScript-Kompilierung erfolgreich ist (`npm run build` lokal testen)

### npm ci Fehler (Workspace-Probleme)
- **Fehler**: `npm ci can only install packages when your package.json and package-lock.json are in sync`
- **Ursache**: Railway verwendet `npm ci`, aber bei Workspace-Setups ist die Root `package-lock.json` nicht mit den einzelnen Services synchronisiert
- **Lösung**: Die `nixpacks.toml` Dateien wurden erstellt, um `npm install` statt `npm ci` zu verwenden:
  - `backend/nixpacks.toml` - für Backend-Service
  - `frontend/nixpacks.toml` - für Frontend-Service
- Falls das Problem weiterhin besteht:
  - Stelle sicher, dass die entsprechenden `nixpacks.toml` Dateien vorhanden sind
  - Prüfe, ob das Root Directory in Railway korrekt gesetzt ist (`backend` bzw. `frontend`)

## Nützliche Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Railway Pricing: https://railway.app/pricing

## Vorteile von Railway

- ✅ Alles an einem Ort verwaltet (Frontend + Backend)
- ✅ Einfaches Setup und Konfiguration (keine Code-Anpassungen nötig)
- ✅ Konsistente Umgebung für Frontend und Backend
- ✅ Einfacheres Troubleshooting
- ✅ SQLite funktioniert direkt (mit Volume oder Postgres)
- ✅ Automatisches Deployment bei Git-Push
- ✅ Kostenloser Plan verfügbar
