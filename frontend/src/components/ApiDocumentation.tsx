import { useState } from 'react';

export default function ApiDocumentation() {
  const [activeTab, setActiveTab] = useState<'overview' | 'authentication' | 'endpoints' | 'examples'>('overview');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">API-Dokumentation</h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('authentication')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'authentication'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Authentifizierung
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'endpoints'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Endpunkte
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'examples'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Beispiele
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="prose max-w-none">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">API Base URL</h3>
                <code className="block p-3 bg-gray-100 rounded text-sm">
                  {API_BASE}
                </code>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Was ist die API?</h3>
                <p className="text-gray-700">
                  Die Ressourcen-Naming-Tool API ermöglicht es, IT-Ressourcen-Namen programmatisch zu generieren,
                  zu validieren und zu verwalten. Die API basiert auf Best Practices von Azure, AWS, GCP und On-Premise-Umgebungen.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hauptfunktionen</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Namen generieren basierend auf Konfigurationen und Best Practices</li>
                  <li>Namen validieren gegen Best Practices und Duplikate</li>
                  <li>Konfigurationen verwalten</li>
                  <li>Verwendete Namen verwalten</li>
                  <li>Best Practices abrufen</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Wichtig</h4>
                <p className="text-blue-800 text-sm">
                  Alle API-Endpunkte erfordern einen gültigen API-Key zur Authentifizierung.
                  Siehe den Tab "Authentifizierung" für Details.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'authentication' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">API-Key Authentifizierung</h3>
                <p className="text-gray-700 mb-4">
                  Alle API-Anfragen müssen mit einem gültigen API-Key authentifiziert werden.
                  API-Keys können über die "API-Keys verwalten" Seite erstellt werden.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">API-Key übergeben</h4>
                <p className="text-gray-700 mb-2">Es gibt zwei Möglichkeiten, den API-Key zu übergeben:</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">1. HTTP Header (empfohlen)</p>
                    <code className="block p-3 bg-gray-100 rounded text-sm">
                      X-API-Key: nt_ihr_api_key_hier
                    </code>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-1">2. Query Parameter</p>
                    <code className="block p-3 bg-gray-100 rounded text-sm">
                      ?apiKey=nt_ihr_api_key_hier
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Beispiel-Request mit Header</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST ${API_BASE}/generate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nt_ihr_api_key_hier" \\
  -d '{
    "resourceType": "vm",
    "cloudProvider": "azure",
    "components": {
      "env": "prod",
      "location": "weu",
      "resource": "web"
    }
  }'`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Beispiel-Request mit Query Parameter</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST "${API_BASE}/generate?apiKey=nt_ihr_api_key_hier" \\
  -H "Content-Type: application/json" \\
  -d '{
    "resourceType": "vm",
    "cloudProvider": "azure",
    "components": {
      "env": "prod",
      "location": "weu",
      "resource": "web"
    }
  }'`}
                </pre>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Sicherheitshinweise</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                  <li>Bewahren Sie Ihren API-Key sicher auf und teilen Sie ihn nicht</li>
                  <li>Verwenden Sie HTTPS in Produktionsumgebungen</li>
                  <li>Deaktivieren Sie nicht mehr benötigte API-Keys</li>
                  <li>API-Keys werden als Hash gespeichert und können nicht wiederhergestellt werden</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Name-Generierung</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <code className="text-sm font-mono">POST /api/generate</code>
                  <p className="text-gray-700 mt-2 text-sm">Generiert Namen basierend auf Konfiguration und Best Practices</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Name-Validierung</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <code className="text-sm font-mono">POST /api/validate</code>
                  <p className="text-gray-700 mt-2 text-sm">Validiert einen Namen gegen Best Practices und Duplikate</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Konfigurationen</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">GET /api/configs</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">POST /api/configs</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">PUT /api/configs/:id</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">DELETE /api/configs/:id</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Namen</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">GET /api/names</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">POST /api/names</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">PUT /api/names/:id</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">DELETE /api/names/:id</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <code className="text-sm font-mono">GET /api/best-practices</code>
                  <p className="text-gray-700 mt-2 text-sm">Abrufen von Best Practices (optional: ?provider=azure&resourceType=vm)</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Resource Types & Providers</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">GET /api/resource-types</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">GET /api/cloud-providers</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">cURL Beispiele</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Namen generieren</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST ${API_BASE}/generate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nt_ihr_api_key" \\
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
  }'`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Namen validieren</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST ${API_BASE}/validate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nt_ihr_api_key" \\
  -d '{
    "name": "prod-weu-vm-web-01",
    "resourceType": "vm",
    "cloudProvider": "azure"
  }'`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">JavaScript/TypeScript</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`const API_KEY = 'nt_ihr_api_key';
const API_BASE = '${API_BASE}';

// Namen generieren
async function generateName() {
  const response = await fetch(\`\${API_BASE}/generate\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
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
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Python</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import requests

API_KEY = 'nt_ihr_api_key'
API_BASE = '${API_BASE}'

# Namen generieren
def generate_name():
    response = requests.post(
        f"{API_BASE}/generate",
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
        },
        json={
            'resourceType': 'vm',
            'cloudProvider': 'azure',
            'environment': 'prod',
            'components': {
                'env': 'prod',
                'location': 'weu',
                'resource': 'web',
                'instance': '01'
            }
        }
    )
    data = response.json()
    print('Generierte Namen:', data['names'])`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


