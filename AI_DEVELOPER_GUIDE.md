# AI Developer Guide - Ressourcen-Naming-Tool

Diese Anleitung hilft AI-Entwicklungstools (wie Cursor AI, GitHub Copilot, etc.) dabei, das Projekt zu verstehen und effektiv damit zu arbeiten.

## Projekt-Übersicht

Das **Ressourcen-Naming-Tool** ist eine Full-Stack Web-Anwendung zur Generierung und Validierung von IT-Ressourcen-Namen basierend auf Best Practices von Azure, AWS, GCP und On-Premise-Umgebungen.

### Hauptfunktionen
- **Name-Generierung**: Erstellt konforme Namen basierend auf konfigurierbaren Regeln und Best Practices
- **Name-Validierung**: Prüft Namen auf Konformität mit Best Practices und Duplikate
- **Konfigurations-Management**: Verwaltung von Naming-Konfigurationen
- **Datenbank-Integration**: SQLite-Datenbank für bereits genutzte Namen
- **API mit Authentifizierung**: REST-API mit API-Key-basierter Authentifizierung

## Technologie-Stack

### Frontend
- **Framework**: React 18 mit TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js mit Express
- **Language**: TypeScript
- **Datenbank**: SQLite3
- **API-Dokumentation**: Swagger/OpenAPI (swagger-ui-express, swagger-jsdoc)
- **Authentifizierung**: API-Key-basierte Authentifizierung

### Shared
- **Types**: Gemeinsame TypeScript-Typen in `shared/types.ts`

## Projektstruktur

```
naming-tool/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React-Komponenten
│   │   │   ├── Layout.tsx           # Hauptlayout mit Navigation
│   │   │   ├── NameGenerator.tsx    # Name-Generierung UI
│   │   │   ├── NameValidator.tsx    # Name-Validierung UI
│   │   │   ├── NamingConfigurator.tsx  # Konfigurations-Editor
│   │   │   ├── ConfigManager.tsx   # Konfigurations-Verwaltung
│   │   │   ├── UsedNamesList.tsx    # Liste verwendeter Namen
│   │   │   ├── ApiDocumentation.tsx  # API-Dokumentation UI
│   │   │   ├── ApiKeyManager.tsx    # API-Key-Verwaltung
│   │   │   ├── ResourceTypeSelector.tsx
│   │   │   ├── CloudProviderSelector.tsx
│   │   │   ├── EnvironmentSelector.tsx
│   │   │   └── GuidancePanel.tsx    # Best Practices Anzeige
│   │   ├── types/           # TypeScript-Typen (re-export von shared)
│   │   ├── utils/           # Utilities
│   │   │   └── api.ts       # API-Client (Axios)
│   │   ├── App.tsx          # Hauptkomponente
│   │   └── main.tsx         # Entry Point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                 # Express Backend
│   ├── src/
│   │   ├── routes/          # API-Routen
│   │   │   ├── naming.ts    # /api/generate, /api/validate
│   │   │   ├── config.ts    # /api/configs
│   │   │   ├── names.ts     # /api/names
│   │   │   └── apiKeys.ts   # /api/keys
│   │   ├── services/        # Business-Logik
│   │   │   ├── namingEngine.ts    # Name-Generierung & Validierung
│   │   │   └── bestPractices.ts   # Best Practices Service
│   │   ├── models/          # Datenbank-Models
│   │   │   ├── nameRecord.ts
│   │   │   └── apiKey.ts
│   │   ├── middleware/      # Express Middleware
│   │   │   └── auth.ts     # API-Key Authentifizierung
│   │   ├── database/        # Datenbank-Setup
│   │   │   ├── schema.sql  # SQL Schema
│   │   │   └── init.ts     # DB-Initialisierung
│   │   ├── swagger.ts       # Swagger/OpenAPI Setup
│   │   └── server.ts        # Express Server
│   ├── data/               # SQLite-Datenbank (wird erstellt)
│   └── package.json
│
├── shared/                  # Gemeinsame Dateien
│   └── types.ts            # TypeScript-Typen (von Frontend & Backend genutzt)
│
├── API.md                   # API-Dokumentation (Markdown)
├── README.md                # Projekt-README
└── package.json             # Root package.json (Workspaces)
```

## Wichtige Dateien und ihre Funktionen

### Frontend

#### `frontend/src/components/Layout.tsx`
- Hauptlayout-Komponente mit Navigation
- Verwaltet View-State (`home`, `generate`, `validate`, `configs`, `names`, `api-docs`, `api-keys`)
- Rendert entsprechende Komponenten basierend auf aktuellem View

#### `frontend/src/components/NameGenerator.tsx`
- UI für Name-Generierung
- Verwendet: `ResourceTypeSelector`, `CloudProviderSelector`, `EnvironmentSelector`, `NamingConfigurator`, `GuidancePanel`
- Ruft `/api/generate` auf
- Zeigt generierte Namen an und ermöglicht Speicherung

#### `frontend/src/utils/api.ts`
- Zentraler API-Client mit Axios
- Alle API-Calls gehen über diese Datei
- Base URL: `http://localhost:3001/api` (oder `VITE_API_URL`)

### Backend

#### `backend/src/server.ts`
- Express-Server Setup
- Middleware-Konfiguration (CORS, JSON)
- Route-Registrierung
- Swagger-Integration
- Server-Start mit DB-Initialisierung

#### `backend/src/services/namingEngine.ts`
- **Kern-Logik** für Name-Generierung und Validierung
- `generateName()`: Generiert Namen basierend auf Konfiguration
- `generateNames()`: Generiert mehrere Namen-Varianten
- `validateName()`: Validiert Namen gegen Best Practices
- `applyCaseStyle()`: Wendet Groß-/Kleinschreibung an

#### `backend/src/services/bestPractices.ts`
- Verwaltet Best Practices Daten
- Lädt Best Practices aus Datenbank oder verwendet Fallback-Daten
- Provider: `azure`, `aws`, `gcp`, `on-premise`

#### `backend/src/middleware/auth.ts`
- `requireApiKey`: Middleware zur API-Key-Validierung
- Prüft `X-API-Key` Header oder `apiKey` Query-Parameter
- Aktualisiert `last_used_at` bei erfolgreicher Authentifizierung

#### `backend/src/models/apiKey.ts`
- API-Key Model mit CRUD-Operationen
- `generateKey()`: Generiert neuen API-Key (Format: `nt_<hex>`)
- `hashKey()`: Erstellt SHA-256 Hash für Speicherung
- Keys werden als Hash gespeichert (Sicherheit)

## Datenbank-Schema

### Tabellen

1. **used_names**: Bereits genutzte Namen
   - `id`, `name` (UNIQUE), `resource_type`, `environment`, `cloud_provider`, `created_at`

2. **naming_configs**: Naming-Konfigurationen
   - `id`, `name`, `resource_type`, `cloud_provider`, `environment`, `config_json`, `is_default`, `created_at`

3. **best_practices**: Best Practices Referenzen
   - `id`, `provider`, `resource_type`, `rules_json`, `examples`, `created_at`
   - UNIQUE(provider, resource_type)

4. **api_keys**: API-Keys für Authentifizierung
   - `id`, `key_hash` (UNIQUE), `name`, `description`, `created_at`, `last_used_at`, `is_active`

## API-Endpunkte

### Authentifizierung
- **Alle Endpunkte** (außer `/health` und `/api/keys/initial`) erfordern API-Key
- Header: `X-API-Key: nt_<key>`
- Oder Query: `?apiKey=nt_<key>`

### Öffentliche Endpunkte
- `GET /health` - Health Check
- `POST /api/keys/initial` - Ersten API-Key erstellen (nur wenn keine Keys existieren)

### Geschützte Endpunkte
- `POST /api/generate` - Namen generieren
- `POST /api/validate` - Namen validieren
- `GET|POST|PUT|DELETE /api/configs` - Konfigurationen
- `GET|POST|PUT|DELETE /api/names` - Namen
- `GET /api/best-practices` - Best Practices
- `GET /api/resource-types` - Ressourcentypen
- `GET /api/cloud-providers` - Cloud-Provider
- `GET|POST|PUT|DELETE /api/keys` - API-Key-Verwaltung

## TypeScript-Typen (shared/types.ts)

### Wichtige Typen

```typescript
type CloudProvider = 'azure' | 'aws' | 'gcp' | 'on-premise';
type Environment = 'dev' | 'test' | 'staging' | 'prod';
type ResourceType = 'vm' | 'storage' | 'network' | 'database' | ...;

interface NamingConfig {
  id?: number;
  name: string;
  resourceType: ResourceType;
  cloudProvider?: CloudProvider;
  environment?: Environment;
  components: NamingComponent[];
  separator: string;
  prefix?: string;
  suffix?: string;
  maxTotalLength?: number;
  caseStyle: 'lowercase' | 'uppercase' | 'camelCase' | 'PascalCase' | 'kebab-case';
}

interface GenerateNameRequest {
  resourceType: ResourceType;
  cloudProvider?: CloudProvider;
  environment?: Environment;
  components: Record<string, string>;
  configId?: number;
  customConfig?: Partial<NamingConfig>;
}
```

## Entwicklungs-Workflow

### Setup
```bash
# Root-Abhängigkeiten
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### Entwicklung
```bash
# Beide gleichzeitig
npm run dev

# Oder einzeln
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 3001
```

### Build
```bash
npm run build
```

## Code-Konventionen

### Frontend
- **Komponenten**: PascalCase, Funktionskomponenten mit Hooks
- **Dateien**: PascalCase für Komponenten (`NameGenerator.tsx`)
- **Props**: TypeScript-Interfaces für Props
- **State**: `useState` für lokalen State
- **API-Calls**: Über `apiClient` aus `utils/api.ts`

### Backend
- **Dateien**: camelCase (`namingEngine.ts`)
- **Klassen**: PascalCase (`NamingEngine`)
- **Funktionen**: camelCase (`generateName`)
- **Routes**: Separate Dateien in `routes/`
- **Services**: Business-Logik in `services/`
- **Models**: Datenbank-Zugriff in `models/`

### Datenbank
- **Helper-Funktionen**: `dbRun`, `dbGet`, `dbAll` in `database/init.ts`
- **Promise-basiert**: Alle DB-Operationen sind async/await
- **Fehlerbehandlung**: Try-Catch in Route-Handlern

## Häufige Aufgaben

### Neuen API-Endpunkt hinzufügen

1. **Route erstellen** in `backend/src/routes/`
2. **Route registrieren** in `backend/src/server.ts`
3. **Authentifizierung hinzufügen**: `requireApiKey` Middleware
4. **Swagger-Dokumentation** in `backend/src/swagger.ts` (optional)

### Neue Frontend-Komponente hinzufügen

1. **Komponente erstellen** in `frontend/src/components/`
2. **Typen importieren** aus `../types`
3. **API-Calls** über `apiClient` aus `utils/api.ts`
4. **In Layout.tsx registrieren** (neuer View-Type und Case)

### Best Practice hinzufügen

1. **Daten hinzufügen** in `backend/src/services/bestPractices.ts` (DEFAULT_BEST_PRACTICES)
2. **Automatisch in DB** beim Server-Start (über `initializeDefaults()`)

### Datenbank-Schema ändern

1. **SQL ändern** in `backend/src/database/schema.sql`
2. **Model aktualisieren** in `backend/src/models/`
3. **Migration**: Datenbank manuell migrieren oder neu erstellen

## Wichtige Hinweise für AI-Tools

### ⚠️ Sicherheit
- **API-Keys werden als Hash gespeichert** - niemals im Klartext
- **Keine API-Keys in Code committen**
- **CORS** ist für Development konfiguriert

### 🔄 State Management
- **Kein globales State Management** (Redux, Zustand) - nur React Hooks
- **API-Client** ist zentralisiert in `utils/api.ts`
- **Keine direkten API-Calls** in Komponenten - immer über `apiClient`

### 📦 Abhängigkeiten
- **Workspaces**: Root `package.json` verwendet npm workspaces
- **Shared Types**: `shared/types.ts` wird von Frontend und Backend genutzt
- **TypeScript**: Strikte Typisierung überall

### 🗄️ Datenbank
- **SQLite**: Lokale Datei in `backend/data/naming-tool.db`
- **Keine ORM**: Direkte SQL-Queries mit `sqlite3`
- **Schema**: Wird automatisch beim ersten Start erstellt

### 🌐 API
- **RESTful**: Standard REST-Konventionen
- **JSON**: Alle Requests/Responses sind JSON
- **Fehler**: Immer im Format `{ error: string }`
- **Status Codes**: 200, 201, 204, 400, 401, 404, 409, 500

### 🎨 UI/UX
- **Tailwind CSS**: Utility-First CSS Framework
- **Responsive**: Mobile-First Design
- **Deutsche Sprache**: Alle UI-Texte auf Deutsch
- **Komponenten**: Wiederverwendbare, modulare Komponenten

## Debugging-Tipps

### Frontend
- **Browser Console**: React-Fehler werden dort angezeigt
- **Network Tab**: API-Calls prüfen
- **React DevTools**: Komponenten-State inspizieren

### Backend
- **Console Logs**: Server-Logs in Terminal
- **API-Dokumentation**: Swagger UI unter `/api-docs`
- **Datenbank**: SQLite-Datei direkt öffnen (z.B. DB Browser)

### Häufige Probleme

1. **CORS-Fehler**: Backend muss auf Port 3001 laufen
2. **API-Key-Fehler**: Prüfen ob Key im Header/Query vorhanden
3. **TypeScript-Fehler**: `shared/types.ts` muss korrekt importiert werden
4. **Datenbank-Fehler**: Prüfen ob `data/` Verzeichnis existiert

## Erweiterungen

### Neue Ressourcentypen hinzufügen
1. `shared/types.ts`: Zu `ResourceType` hinzufügen
2. `backend/src/services/bestPractices.ts`: Best Practice hinzufügen
3. `frontend/src/components/ResourceTypeSelector.tsx`: Label hinzufügen

### Neue Cloud-Provider hinzufügen
1. `shared/types.ts`: Zu `CloudProvider` hinzufügen
2. `backend/src/services/bestPractices.ts`: Best Practices hinzufügen
3. `frontend/src/components/CloudProviderSelector.tsx`: Label hinzufügen

## Testing

Aktuell keine automatisierten Tests. Für zukünftige Implementierung:
- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Playwright oder Cypress

## Deployment

### Frontend
- Build: `npm run build:frontend`
- Output: `frontend/dist/`
- Statische Dateien auf Webserver

### Backend
- Build: `npm run build:backend`
- Output: `backend/dist/`
- Node.js Server starten: `npm start`
- Datenbank: SQLite-Datei mitkopieren

## Weitere Ressourcen

- **API-Dokumentation**: `API.md`
- **README**: `README.md`
- **Swagger UI**: http://localhost:3001/api-docs (wenn Server läuft)

---

**Letzte Aktualisierung**: 2024
**Projekt-Version**: 1.0.0


