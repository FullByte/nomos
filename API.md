# API-Dokumentation

Die Nomos API bietet Endpunkte zur Validierung und Verwaltung von IT-Ressourcen-Namen basierend auf durchgesetzten Naming-Regeln.

## Base URL

```
http://localhost:3001/api
```

## Authentifizierung

Aktuell ist keine Authentifizierung erforderlich.

## Endpunkte

### Resource Types

#### Liste aller Ressourcentypen abrufen

```http
GET /api/resource-types
```

**Response:**
```json
[
  "vm",
  "storage",
  "network",
  "database",
  "load-balancer",
  "firewall",
  "vpn",
  "client",
  "server",
  "hardware",
  "resource-group",
  "function",
  "container",
  "kubernetes",
  "other"
]
```

### Cloud Providers

#### Liste aller Cloud-Provider abrufen

```http
GET /api/cloud-providers
```

**Response:**
```json
["azure", "aws", "gcp", "on-premise"]
```

### Best Practices

#### Alle Best Practices abrufen

```http
GET /api/best-practices
```

#### Best Practices nach Provider abrufen

```http
GET /api/best-practices?provider=azure
```

#### Spezifische Best Practice abrufen

```http
GET /api/best-practices?provider=azure&resourceType=vm
```

**Response:**
```json
{
  "provider": "azure",
  "resourceType": "vm",
  "maxLength": 15,
  "allowedChars": "a-z0-9-",
  "recommendedComponents": ["env", "location", "resource", "instance"],
  "separator": "-",
  "caseStyle": "lowercase",
  "examples": ["prod-weu-vm-web-01", "dev-eus-vm-db-02"],
  "notes": "Azure VMs: Max 15 Zeichen, nur Kleinbuchstaben, Zahlen und Bindestriche"
}
```

### Name Generierung

#### Namen generieren

```http
POST /api/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "vm",
  "cloudProvider": "azure",
  "environment": "prod",
  "components": {
    "env": "prod",
    "location": "weu",
    "resource": "web",
    "instance": "01"
  },
  "configId": 1,
  "customConfig": {
    "separator": "-",
    "caseStyle": "lowercase"
  }
}
```

**Response:**
```json
{
  "names": [
    "prod-weu-web-01",
    "prod-weu-web-02",
    "prod-weu-web-03"
  ],
  "config": {
    "name": "Azure VM Standard",
    "resourceType": "vm",
    "cloudProvider": "azure",
    "components": [...],
    "separator": "-",
    "caseStyle": "lowercase"
  },
  "warnings": []
}
```

### Name Validierung

#### Namen validieren

```http
POST /api/validate
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "prod-weu-vm-web-01",
  "resourceType": "vm",
  "cloudProvider": "azure",
  "configId": 1
}
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "matchesConfig": true,
  "isDuplicate": false
}
```

**Fehler-Response:**
```json
{
  "valid": false,
  "errors": [
    "Name überschreitet maximale Länge von 15 Zeichen",
    "Name existiert bereits in der Datenbank"
  ],
  "warnings": [
    "Name sollte in Kleinbuchstaben sein"
  ],
  "isDuplicate": true
}
```

### Konfigurationen

#### Alle Konfigurationen abrufen

```http
GET /api/configs
GET /api/configs?resourceType=vm
GET /api/configs?cloudProvider=azure
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Azure VM Production",
    "resourceType": "vm",
    "cloudProvider": "azure",
    "environment": "prod",
    "components": [
      {
        "name": "env",
        "value": "",
        "required": true
      },
      {
        "name": "location",
        "value": "",
        "required": true
      }
    ],
    "separator": "-",
    "prefix": "",
    "suffix": "",
    "maxTotalLength": 15,
    "caseStyle": "lowercase",
    "isDefault": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Konfiguration nach ID abrufen

```http
GET /api/configs/:id
```

#### Neue Konfiguration speichern

```http
POST /api/configs
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Meine Custom Konfiguration",
  "resourceType": "vm",
  "cloudProvider": "azure",
  "environment": "prod",
  "components": [
    {
      "name": "env",
      "value": "",
      "required": true
    },
    {
      "name": "resource",
      "value": "",
      "required": true
    }
  ],
  "separator": "-",
  "caseStyle": "lowercase",
  "maxTotalLength": 63,
  "isDefault": false
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Meine Custom Konfiguration",
  "resourceType": "vm",
  "cloudProvider": "azure",
  "environment": "prod",
  "components": [...],
  "separator": "-",
  "caseStyle": "lowercase",
  "maxTotalLength": 63,
  "isDefault": false,
  "createdAt": "2024-01-15T11:00:00Z"
}
```

#### Konfiguration aktualisieren

```http
PUT /api/configs/:id
Content-Type: application/json
```

**Request Body:** (gleiches Format wie POST)

#### Konfiguration löschen

```http
DELETE /api/configs/:id
```

**Response:** 204 No Content

### Namen (Used Names)

#### Alle Namen abrufen

```http
GET /api/names
GET /api/names?resourceType=vm
GET /api/names?cloudProvider=azure
GET /api/names?environment=prod
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "prod-weu-vm-web-01",
    "resourceType": "vm",
    "environment": "prod",
    "cloudProvider": "azure",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

#### Namen nach ID abrufen

```http
GET /api/names/:id
```

#### Neuen Namen hinzufügen

```http
POST /api/names
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "prod-weu-vm-web-01",
  "resourceType": "vm",
  "environment": "prod",
  "cloudProvider": "azure"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "prod-weu-vm-web-01",
  "resourceType": "vm",
  "environment": "prod",
  "cloudProvider": "azure",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Fehler-Response (409 Conflict):**
```json
{
  "error": "Name existiert bereits"
}
```

#### Namen aktualisieren

```http
PUT /api/names/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "prod-weu-vm-web-01-updated",
  "resourceType": "vm",
  "environment": "prod",
  "cloudProvider": "azure"
}
```

#### Namen löschen

```http
DELETE /api/names/:id
```

**Response:** 204 No Content

## Fehlerbehandlung

### HTTP Status Codes

- `200 OK` - Erfolgreiche Anfrage
- `201 Created` - Ressource erfolgreich erstellt
- `204 No Content` - Erfolgreiche Löschung
- `400 Bad Request` - Ungültige Anfrage (fehlende oder ungültige Parameter)
- `404 Not Found` - Ressource nicht gefunden
- `409 Conflict` - Konflikt (z.B. Name existiert bereits)
- `500 Internal Server Error` - Serverfehler

### Fehler-Response Format

```json
{
  "error": "Fehlermeldung"
}
```

## Beispiele

### cURL

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

#### Namen hinzufügen

```bash
curl -X POST http://localhost:3001/api/names \
  -H "Content-Type: application/json" \
  -d '{
    "name": "prod-weu-vm-web-01",
    "resourceType": "vm",
    "environment": "prod",
    "cloudProvider": "azure"
  }'
```

### JavaScript/TypeScript

```javascript
const API_BASE = 'http://localhost:3001/api';

// Namen generieren
async function generateName() {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resourceType: 'vm',
      cloudProvider: 'azure',
      environment: 'prod',
      components: {
        env: 'prod',
        location: 'weu',
        resource: 'web',
        instance: '01'
      }
    })
  });
  
  const data = await response.json();
  console.log('Generierte Namen:', data.names);
}

// Namen validieren
async function validateName(name) {
  const response = await fetch(`${API_BASE}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      resourceType: 'vm',
      cloudProvider: 'azure'
    })
  });
  
  const data = await response.json();
  return data.valid;
}
```

### Python

```python
import requests

API_BASE = "http://localhost:3001/api"

# Namen generieren
def generate_name():
    response = requests.post(
        f"{API_BASE}/generate",
        json={
            "resourceType": "vm",
            "cloudProvider": "azure",
            "environment": "prod",
            "components": {
                "env": "prod",
                "location": "weu",
                "resource": "web",
                "instance": "01"
            }
        }
    )
    data = response.json()
    print("Generierte Namen:", data["names"])

# Namen validieren
def validate_name(name):
    response = requests.post(
        f"{API_BASE}/validate",
        json={
            "name": name,
            "resourceType": "vm",
            "cloudProvider": "azure"
        }
    )
    data = response.json()
    return data["valid"]
```

## Rate Limiting

Aktuell gibt es keine Rate Limits. Für Produktionsumgebungen sollten Rate Limits implementiert werden.

## Versionierung

Die aktuelle API-Version ist v1. Zukünftige Versionierungen können über URL-Pfade (`/api/v1/`, `/api/v2/`) oder Header implementiert werden.


