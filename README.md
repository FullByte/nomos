# Nomos

**NOMOS – enforces rules**

Ein System zur Durchsetzung von Naming-Regeln für IT-Ressourcen. Nomos validiert und erzwingt konsistente Namenskonventionen basierend auf Best Practices von Azure, AWS, GCP und On-Premise-Umgebungen.

## Features

- 🎯 **Name-Generierung**: Erstelle konforme Namen basierend auf Best Practices
- ✅ **Name-Validierung**: Prüfe bestehende Namen auf Konformität
- ⚙️ **Konfigurierbare Regeln**: Passe Naming-Konventionen an deine Anforderungen an
- 💾 **Datenbank-Integration**: Speichere und verwalte bereits genutzte Namen in SQLite
- 📚 **Best Practices Guidance**: Erhalte kontextbezogene Hinweise basierend auf Cloud-Provider und Ressourcentyp

## Technologie-Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Datenbank**: SQLite3

## Installation

```bash
# Root-Abhängigkeiten installieren
npm install

# Frontend-Abhängigkeiten installieren
cd frontend && npm install && cd ..

# Backend-Abhängigkeiten installieren
cd backend && npm install && cd ..
```

## Entwicklung

```bash
# Frontend und Backend gleichzeitig starten (aus Root-Verzeichnis)
npm run dev

# Oder einzeln:
npm run dev:frontend  # Frontend auf Port 3000
npm run dev:backend   # Backend auf Port 3001
```

Die Anwendung ist dann verfügbar unter:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API-Dokumentation (Swagger): http://localhost:3001/api-docs

## Build

```bash
npm run build
```

## Verwendung

### Name generieren

1. Navigieren Sie zu "Name generieren"
2. Wählen Sie Ressourcentyp, Cloud-Provider und Umgebung
3. Konfigurieren Sie die Naming-Regeln (oder verwenden Sie die Best Practices)
4. Geben Sie die Komponenten-Werte ein
5. Klicken Sie auf "Namen generieren"
6. Speichern Sie gewünschte Namen in der Datenbank

### Name validieren

1. Navigieren Sie zu "Name validieren"
2. Geben Sie den zu prüfenden Namen ein
3. Wählen Sie Ressourcentyp und Cloud-Provider
4. Klicken Sie auf "Name validieren"
5. Prüfen Sie die Ergebnisse auf Fehler und Warnungen

### Konfigurationen verwalten

1. Navigieren Sie zu "Konfigurationen"
2. Erstellen Sie neue oder bearbeiten Sie bestehende Konfigurationen
3. Speichern Sie Konfigurationen für die spätere Verwendung

### Verwendete Namen verwalten

1. Navigieren Sie zu "Verwendete Namen"
2. Filtern Sie nach Ressourcentyp, Cloud-Provider oder Umgebung
3. Exportieren Sie die Liste als CSV
4. Löschen Sie nicht mehr benötigte Namen

## Unterstützte Ressourcentypen

- VMs / Compute Instances
- Storage Accounts / Buckets
- Netzwerk-Ressourcen (VPC, Subnets, etc.)
- Datenbanken
- Load Balancer
- Firewalls
- VPNs
- Clients
- Server
- Hardware
- Resource Groups
- Functions / Lambda
- Container / Kubernetes
- Und mehr...

## Cloud-Provider

- Microsoft Azure
- Amazon Web Services (AWS)
- Google Cloud Platform (GCP)
- On-Premise

## API-Dokumentation

Die vollständige API-Dokumentation ist verfügbar unter:
- **Interaktive Swagger-Dokumentation**: http://localhost:3001/api-docs
- **API-Dokumentation (Markdown)**: Siehe [API.md](API.md)

### Schnellstart

#### Namen generieren
```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "resourceType": "vm",
    "cloudProvider": "azure",
    "environment": "prod",
    "components": {
      "env": "prod",
      "location": "weu",
      "resource": "web",
      "instance": "01"
    }
  }'
```

#### Namen validieren
```bash
curl -X POST http://localhost:3001/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "prod-weu-vm-web-01",
    "resourceType": "vm",
    "cloudProvider": "azure"
  }'
```

### Haupt-API-Endpunkte

- **Name-Generierung**: `POST /api/generate`
- **Name-Validierung**: `POST /api/validate`
- **Konfigurationen**: `GET|POST|PUT|DELETE /api/configs`
- **Namen**: `GET|POST|PUT|DELETE /api/names`
- **Best Practices**: `GET /api/best-practices`
- **Resource Types**: `GET /api/resource-types`
- **Cloud Providers**: `GET /api/cloud-providers`

Für detaillierte Informationen siehe [API.md](API.md) oder die interaktive Swagger-Dokumentation.

## Datenbank

Die SQLite-Datenbank wird automatisch im `backend/data/` Verzeichnis erstellt. Sie enthält:
- `used_names`: Bereits genutzte Namen
- `naming_configs`: Gespeicherte Naming-Konfigurationen
- `best_practices`: Best Practices Referenzen

## Lizenz

MIT

