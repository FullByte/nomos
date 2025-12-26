import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function ApiDocumentation() {
    const [activeTab, setActiveTab] = useState('overview');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "API-Dokumentation" }), _jsx("div", { className: "border-b border-gray-200 mb-6", children: _jsxs("nav", { className: "-mb-px flex space-x-8", children: [_jsx("button", { onClick: () => setActiveTab('overview'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "\u00DCbersicht" }), _jsx("button", { onClick: () => setActiveTab('authentication'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'authentication'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "Authentifizierung" }), _jsx("button", { onClick: () => setActiveTab('endpoints'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'endpoints'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "Endpunkte" }), _jsx("button", { onClick: () => setActiveTab('examples'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'examples'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "Beispiele" })] }) }), _jsxs("div", { className: "prose max-w-none", children: [activeTab === 'overview' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "API Base URL" }), _jsx("code", { className: "block p-3 bg-gray-100 rounded text-sm", children: API_BASE })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Was ist die API?" }), _jsx("p", { className: "text-gray-700", children: "Die Ressourcen-Naming-Tool API erm\u00F6glicht es, IT-Ressourcen-Namen programmatisch zu generieren, zu validieren und zu verwalten. Die API basiert auf Best Practices von Azure, AWS, GCP und On-Premise-Umgebungen." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Hauptfunktionen" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-gray-700", children: [_jsx("li", { children: "Namen generieren basierend auf Konfigurationen und Best Practices" }), _jsx("li", { children: "Namen validieren gegen Best Practices und Duplikate" }), _jsx("li", { children: "Konfigurationen verwalten" }), _jsx("li", { children: "Verwendete Namen verwalten" }), _jsx("li", { children: "Best Practices abrufen" })] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-md p-4", children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-2", children: "Wichtig" }), _jsx("p", { className: "text-blue-800 text-sm", children: "Alle API-Endpunkte erfordern einen g\u00FCltigen API-Key zur Authentifizierung. Siehe den Tab \"Authentifizierung\" f\u00FCr Details." })] })] })), activeTab === 'authentication' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "API-Key Authentifizierung" }), _jsx("p", { className: "text-gray-700 mb-4", children: "Alle API-Anfragen m\u00FCssen mit einem g\u00FCltigen API-Key authentifiziert werden. API-Keys k\u00F6nnen \u00FCber die \"API-Keys verwalten\" Seite erstellt werden." })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "API-Key \u00FCbergeben" }), _jsx("p", { className: "text-gray-700 mb-2", children: "Es gibt zwei M\u00F6glichkeiten, den API-Key zu \u00FCbergeben:" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 mb-1", children: "1. HTTP Header (empfohlen)" }), _jsx("code", { className: "block p-3 bg-gray-100 rounded text-sm", children: "X-API-Key: nt_ihr_api_key_hier" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 mb-1", children: "2. Query Parameter" }), _jsx("code", { className: "block p-3 bg-gray-100 rounded text-sm", children: "?apiKey=nt_ihr_api_key_hier" })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Beispiel-Request mit Header" }), _jsx("pre", { className: "bg-gray-100 p-4 rounded text-sm overflow-x-auto", children: `curl -X POST ${API_BASE}/generate \\
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
  }'` })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Beispiel-Request mit Query Parameter" }), _jsx("pre", { className: "bg-gray-100 p-4 rounded text-sm overflow-x-auto", children: `curl -X POST "${API_BASE}/generate?apiKey=nt_ihr_api_key_hier" \\
  -H "Content-Type: application/json" \\
  -d '{
    "resourceType": "vm",
    "cloudProvider": "azure",
    "components": {
      "env": "prod",
      "location": "weu",
      "resource": "web"
    }
  }'` })] }), _jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-md p-4", children: [_jsx("h4", { className: "font-semibold text-yellow-900 mb-2", children: "Sicherheitshinweise" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-yellow-800 text-sm", children: [_jsx("li", { children: "Bewahren Sie Ihren API-Key sicher auf und teilen Sie ihn nicht" }), _jsx("li", { children: "Verwenden Sie HTTPS in Produktionsumgebungen" }), _jsx("li", { children: "Deaktivieren Sie nicht mehr ben\u00F6tigte API-Keys" }), _jsx("li", { children: "API-Keys werden als Hash gespeichert und k\u00F6nnen nicht wiederhergestellt werden" })] })] })] })), activeTab === 'endpoints' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Name-Generierung" }), _jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [_jsx("code", { className: "text-sm font-mono", children: "POST /api/generate" }), _jsx("p", { className: "text-gray-700 mt-2 text-sm", children: "Generiert Namen basierend auf Konfiguration und Best Practices" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Name-Validierung" }), _jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [_jsx("code", { className: "text-sm font-mono", children: "POST /api/validate" }), _jsx("p", { className: "text-gray-700 mt-2 text-sm", children: "Validiert einen Namen gegen Best Practices und Duplikate" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Konfigurationen" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "GET /api/configs" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "POST /api/configs" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "PUT /api/configs/:id" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "DELETE /api/configs/:id" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Namen" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "GET /api/names" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "POST /api/names" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "PUT /api/names/:id" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "DELETE /api/names/:id" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Best Practices" }), _jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [_jsx("code", { className: "text-sm font-mono", children: "GET /api/best-practices" }), _jsx("p", { className: "text-gray-700 mt-2 text-sm", children: "Abrufen von Best Practices (optional: ?provider=azure&resourceType=vm)" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Resource Types & Providers" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "GET /api/resource-types" }) }), _jsx("div", { className: "bg-gray-50 p-3 rounded", children: _jsx("code", { className: "text-sm font-mono", children: "GET /api/cloud-providers" }) })] })] })] })), activeTab === 'examples' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "cURL Beispiele" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Namen generieren" }), _jsx("pre", { className: "bg-gray-100 p-4 rounded text-sm overflow-x-auto", children: `curl -X POST ${API_BASE}/generate \\
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
  }'` })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Namen validieren" }), _jsx("pre", { className: "bg-gray-100 p-4 rounded text-sm overflow-x-auto", children: `curl -X POST ${API_BASE}/validate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nt_ihr_api_key" \\
  -d '{
    "name": "prod-weu-vm-web-01",
    "resourceType": "vm",
    "cloudProvider": "azure"
  }'` })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "JavaScript/TypeScript" }), _jsx("pre", { className: "bg-gray-100 p-4 rounded text-sm overflow-x-auto", children: `const API_KEY = 'nt_ihr_api_key';
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
}` })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Python" }), _jsx("pre", { className: "bg-gray-100 p-4 rounded text-sm overflow-x-auto", children: `import requests

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
    print('Generierte Namen:', data['names'])` })] })] }))] })] }) }));
}
