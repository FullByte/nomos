import { useState } from 'react';
import { GenerateNameRequest, GenerateNameResponse, NamingConfig } from '../types';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import EnvironmentSelector from './EnvironmentSelector';
import NamingConfigurator from './NamingConfigurator';
import GuidancePanel from './GuidancePanel';
import { useI18n } from '../i18n/context';

export default function NameGenerator() {
  const { t } = useI18n();
  const [resourceType, setResourceType] = useState<string>('');
  const [cloudProvider, setCloudProvider] = useState<string | undefined>();
  const [environment, setEnvironment] = useState<string | undefined>();
  const [config, setConfig] = useState<NamingConfig | null>(null);
  const [components, setComponents] = useState<Record<string, string>>({});
  const [generatedNames, setGeneratedNames] = useState<GenerateNameResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!resourceType || !config) {
      setError('Bitte wählen Sie einen Ressourcentyp und konfigurieren Sie die Naming-Regeln');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: GenerateNameRequest = {
        resourceType: resourceType as any,
        cloudProvider: cloudProvider as any,
        environment: environment as any,
        components,
        customConfig: config
      };

      const response = await apiClient.generateNames(request);
      setGeneratedNames(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler bei der Generierung');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComponentChange = (componentName: string, value: string) => {
    setComponents(prev => ({
      ...prev,
      [componentName]: value
    }));
  };

  const handleSaveName = async (name: string) => {
    try {
      await apiClient.addName({
        name,
        resourceType: resourceType as any,
        cloudProvider: cloudProvider as any,
        environment: environment as any
      });
      alert(`${t('generator.nameSaved')}: "${name}"`);
    } catch (err: any) {
      alert(`Fehler beim Speichern: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('generator.title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResourceTypeSelector
            value={resourceType as any}
            onChange={(rt) => {
              setResourceType(rt);
              setComponents({});
            }}
            label={t('generator.resourceType')}
          />
          <CloudProviderSelector
            value={cloudProvider as any}
            onChange={setCloudProvider}
            label={t('generator.cloudProvider')}
          />
          <EnvironmentSelector
            value={environment as any}
            onChange={setEnvironment}
            label={t('generator.environment')}
          />
        </div>

        {resourceType && (
          <>
            <div className="mb-6">
              <GuidancePanel
                resourceType={resourceType as any}
                cloudProvider={cloudProvider as any}
              />
            </div>

            <NamingConfigurator
              resourceType={resourceType as any}
              cloudProvider={cloudProvider as any}
              environment={environment as any}
              onChange={(newConfig) => {
                setConfig(newConfig);
                // Komponenten-Werte zurücksetzen wenn sich die Komponenten-Struktur ändert
                const newComponents: Record<string, string> = {};
                newConfig.components.forEach(comp => {
                  if (components[comp.name]) {
                    newComponents[comp.name] = components[comp.name];
                  }
                });
                setComponents(newComponents);
              }}
            />

            {config && Array.isArray(config.components) && config.components.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('generator.componentValues')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.components.map((component) => (
                    <div key={component.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {component.name}
                        {component.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type="text"
                        value={components[component.name] || ''}
                        onChange={(e) => handleComponentChange(component.name, e.target.value)}
                        placeholder={`z.B. ${component.examples?.[0] || 'wert'}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={component.required}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleGenerate}
                disabled={loading || !config || config.components.length === 0}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? t('generator.generating') : t('generator.generate')}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                {error}
              </div>
            )}

            {generatedNames && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('generator.generatedNames')}</h3>
                <div className="space-y-2">
                  {Array.isArray(generatedNames.names) && generatedNames.names.map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <code className="text-lg font-mono text-gray-900">{name}</code>
                      <button
                        onClick={() => handleSaveName(name)}
                        className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {t('generator.saveName')}
                      </button>
                    </div>
                  ))}
                </div>
                {Array.isArray(generatedNames.warnings) && generatedNames.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                    <strong>Warnungen:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {generatedNames.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

