import { useState, useEffect } from 'react';

interface ApiKey {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  lastUsedAt?: string | null;
  isActive: boolean;
}

interface CreateApiKeyResponse {
  id: number;
  key: string;
  name: string;
  description?: string;
  createdAt: string;
  warning: string;
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<CreateApiKeyResponse | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Für Demo-Zwecke: Erstelle einen temporären API-Key für die Verwaltung
  // In Produktion sollte dies über ein Admin-Interface oder ersten Setup erfolgen
  const [tempApiKey, setTempApiKey] = useState<string | null>(
    localStorage.getItem('temp_api_key')
  );

  useEffect(() => {
    if (tempApiKey) {
      loadApiKeys();
    }
  }, [tempApiKey]);

  const loadApiKeys = async () => {
    if (!tempApiKey) return;
    
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      // Verwende tempApiKey für API-Calls
      const response = await fetch(`${API_BASE}/keys`, {
        headers: {
          'X-API-Key': tempApiKey
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      } else if (response.status === 401) {
        // API-Key ungültig, entferne ihn
        localStorage.removeItem('temp_api_key');
        setTempApiKey(null);
      }
    } catch (error) {
      console.error('Fehler beim Laden der API-Keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!formData.name.trim()) {
      alert('Bitte geben Sie einen Namen für den API-Key ein');
      return;
    }

    setCreating(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': tempApiKey || ''
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined
        })
      });

      if (response.ok) {
        const data: CreateApiKeyResponse = await response.json();
        setNewKey(data);
        setShowNewKey(true);
        setFormData({ name: '', description: '' });
        await loadApiKeys();
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.error || 'Unbekannter Fehler'}`);
      }
    } catch (error: any) {
      alert(`Fehler beim Erstellen: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('Möchten Sie diesen API-Key wirklich deaktivieren?')) return;
    if (!tempApiKey) return;

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/keys/${id}/deactivate`, {
        method: 'PUT',
        headers: {
          'X-API-Key': tempApiKey
        }
      });

      if (response.ok) {
        await loadApiKeys();
      } else {
        alert('Fehler beim Deaktivieren');
      }
    } catch (error) {
      alert('Fehler beim Deaktivieren');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Möchten Sie diesen API-Key wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    if (!tempApiKey) return;

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/keys/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': tempApiKey
        }
      });

      if (response.ok) {
        await loadApiKeys();
      } else {
        alert('Fehler beim Löschen');
      }
    } catch (error) {
      alert('Fehler beim Löschen');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('API-Key in Zwischenablage kopiert!');
  };

  const handleCreateInitialKey = async () => {
    if (!formData.name.trim()) {
      alert('Bitte geben Sie einen Namen für den API-Key ein');
      return;
    }

    setCreating(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/keys/initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined
        })
      });

      if (response.ok) {
        const data: CreateApiKeyResponse = await response.json();
        setNewKey(data);
        setShowNewKey(true);
        // Speichere den Key als temp key für weitere Verwaltung
        localStorage.setItem('temp_api_key', data.key);
        setTempApiKey(data.key);
        setFormData({ name: '', description: '' });
        await loadApiKeys();
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.error || 'Unbekannter Fehler'}`);
      }
    } catch (error: any) {
      alert(`Fehler beim Erstellen: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (!tempApiKey) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">API-Keys verwalten</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Ersten API-Key erstellen</h3>
          <p className="text-blue-800 text-sm mb-4">
            Erstellen Sie den ersten API-Key, um die API zu nutzen. Dieser Key kann dann verwendet werden,
            um weitere API-Keys zu erstellen und zu verwalten.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Initial Admin Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung (optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreibung des API-Keys"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleCreateInitialKey}
              disabled={creating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {creating ? 'Erstelle...' : 'Ersten API-Key erstellen'}
            </button>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Hinweis:</strong> Falls bereits API-Keys existieren, müssen Sie einen gültigen API-Key
            eingeben, um weitere Keys zu verwalten.
          </p>
          <input
            type="text"
            placeholder="Bestehenden API-Key eingeben"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const key = (e.target as HTMLInputElement).value;
                if (key) {
                  localStorage.setItem('temp_api_key', key);
                  setTempApiKey(key);
                }
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">API-Keys verwalten</h2>
          <button
            onClick={() => {
              localStorage.removeItem('temp_api_key');
              setTempApiKey(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
          >
            Admin-Key entfernen
          </button>
        </div>

        {/* Neuer API-Key Formular */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-900 mb-4">Neuen API-Key erstellen</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Production API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung (optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreibung des API-Keys"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleCreateKey}
              disabled={creating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {creating ? 'Erstelle...' : 'API-Key erstellen'}
            </button>
          </div>
        </div>

        {/* Neuer API-Key Anzeige */}
        {showNewKey && newKey && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-md">
            <h3 className="font-semibold text-green-900 mb-2">API-Key erfolgreich erstellt!</h3>
            <p className="text-sm text-green-800 mb-3">
              <strong>WICHTIG:</strong> Speichern Sie diesen API-Key sicher. Er wird nicht erneut angezeigt!
            </p>
            <div className="flex items-center gap-2 mb-2">
              <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono">
                {newKey.key}
              </code>
              <button
                onClick={() => copyToClipboard(newKey.key)}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Kopieren
              </button>
            </div>
            <button
              onClick={() => {
                setShowNewKey(false);
                setNewKey(null);
              }}
              className="text-sm text-green-700 hover:text-green-900"
            >
              Schließen
            </button>
          </div>
        )}

        {/* API-Keys Liste */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Lade API-Keys...</div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Keine API-Keys vorhanden</div>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{key.name}</h3>
                      {!key.isActive && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Deaktiviert
                        </span>
                      )}
                    </div>
                    {key.description && (
                      <p className="text-sm text-gray-600 mt-1">{key.description}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Erstellt: {new Date(key.createdAt).toLocaleDateString('de-DE')}
                      {key.lastUsedAt && (
                        <> • Zuletzt verwendet: {new Date(key.lastUsedAt).toLocaleDateString('de-DE')}</>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {key.isActive && (
                      <button
                        onClick={() => handleDeactivate(key.id)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Deaktivieren
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

