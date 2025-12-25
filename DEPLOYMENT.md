# Deployment-Anleitung

Diese Anleitung beschreibt, wie die Nomos Anwendung auf Vercel (Frontend) und Railway (Backend) deployed wird.

## Voraussetzungen

- GitHub Repository erstellt
- Vercel Account (kostenlos)
- Railway Account (kostenlos)

## Schritt 1: GitHub Repository vorbereiten

1. Alle Änderungen committen und pushen:
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

## Schritt 2: Backend auf Railway deployen

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
   - `FRONTEND_URL=https://deine-frontend.vercel.app` (wird später gesetzt)
7. Gehe zu "Settings" → "Volumes" und erstelle ein Volume für:
   - Mount Path: `/app/data`
   - Dies speichert die SQLite-Datenbank persistent
8. Notiere dir die Railway URL (z.B. `https://nomos-production.up.railway.app`)

## Schritt 3: Frontend auf Vercel deployen

1. Gehe zu [vercel.com](https://vercel.com) und melde dich an
2. Klicke auf "Add New Project"
3. Wähle dein GitHub Repository aus
4. **Wichtig**: Konfiguriere das Projekt:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (automatisch erkannt)
   - Output Directory: `dist` (automatisch erkannt)
5. Gehe zu "Environment Variables" und füge hinzu:
   - `VITE_API_URL=https://deine-railway-url.railway.app/api`
   - (Ersetze `deine-railway-url` mit deiner tatsächlichen Railway URL)
6. Klicke auf "Deploy"
7. Notiere dir die Vercel URL (z.B. `https://nomos.vercel.app`)

## Schritt 4: CORS konfigurieren

1. Gehe zurück zu Railway
2. Gehe zu "Variables"
3. Aktualisiere `FRONTEND_URL` mit deiner Vercel URL:
   - `FRONTEND_URL=https://deine-vercel-url.vercel.app`
4. Railway wird automatisch neu deployen

## Schritt 5: Automatisches Deployment

Beide Plattformen deployen automatisch bei jedem Push auf den `main` Branch:

- **Railway**: Deployed automatisch bei Push
- **Vercel**: Deployed automatisch bei Push

## Environment Variables Übersicht

### Railway (Backend)
- `PORT` - Wird automatisch von Railway gesetzt
- `NODE_ENV=production`
- `FRONTEND_URL` - Deine Vercel Frontend URL

### Vercel (Frontend)
- `VITE_API_URL` - Deine Railway Backend URL mit `/api` Suffix

## Troubleshooting

### Backend startet nicht
- Prüfe die Railway Logs
- Stelle sicher, dass `backend/package.json` korrekt ist
- Prüfe, ob das Volume für `/app/data` gemountet ist

### Frontend kann Backend nicht erreichen
- Prüfe, ob `VITE_API_URL` in Vercel korrekt gesetzt ist
- Prüfe CORS-Einstellungen im Backend
- Stelle sicher, dass `FRONTEND_URL` in Railway gesetzt ist

### CORS-Fehler
- Stelle sicher, dass `FRONTEND_URL` in Railway mit der exakten Vercel URL übereinstimmt
- Prüfe, ob das Backend läuft (Health Check: `https://deine-railway-url.railway.app/health`)

## Nützliche Links

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

