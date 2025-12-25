import { useState, useEffect } from 'react';
import { NamingConfig, ResourceType, CloudProvider } from '../types';
import { apiClient } from '../utils/api';
import NamingConfigurator from './NamingConfigurator';

export default function ConfigManager() {
  const [configs, setConfigs] = useState<NamingConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<NamingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Fehler beim Laden der Konfigurationen:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: NamingConfig) => {
    if (!config.name || config.name.trim() === '') {
      alert('Bitte geben Sie einen Namen für die Konfiguration ein');
      return;
    }

    setSaving(true);
    try {
      if (config.id) {
        await apiClient.updateConfig(config.id, config);
      } else {
        await apiClient.saveConfig(config);
      }
      await loadConfigs();
      alert('Konfiguration gespeichert');
      setSelectedConfig(null);
    } catch (error: any) {
      alert(`Fehler beim Speichern: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Möchten Sie diese Konfiguration wirklich löschen?')) return;
    
    try {
      await apiClient.deleteConfig(id);
      await loadConfigs();
      if (selectedConfig?.id === id) {
        setSelectedConfig(null);
      }
    } catch (error: any) {
      alert(`Fehler beim Löschen: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleNewConfig = () => {
    setSelectedConfig({
      name: 'Neue Konfiguration',
      resourceType: 'vm',
      components: [],
      separator: '-',
      caseStyle: 'lowercase'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Konfigurationen verwalten</h2>
          <button
            onClick={handleNewConfig}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Neue Konfiguration
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Lade Konfigurationen...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Keine Konfigurationen vorhanden</div>
        ) : (
          <div className="space-y-2">
            {configs.map((config) => (
              <div
                key={config.id}
                className={`p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  selectedConfig?.id === config.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedConfig(config)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-500">
                      {config.resourceType} • {config.cloudProvider || 'Alle Provider'} • {config.environment || 'Alle Umgebungen'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {config.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Standard
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        config.id && handleDelete(config.id);
                      }}
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

      {selectedConfig && (
        <div>
          <NamingConfigurator
            resourceType={selectedConfig.resourceType}
            cloudProvider={selectedConfig.cloudProvider}
            environment={selectedConfig.environment}
            config={selectedConfig}
            onChange={(config) => setSelectedConfig(config)}
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleSave(selectedConfig)}
              disabled={saving}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              {saving ? 'Speichere...' : 'Speichern'}
            </button>
            <button
              onClick={() => setSelectedConfig(null)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

