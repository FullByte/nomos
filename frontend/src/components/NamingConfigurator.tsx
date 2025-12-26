import { useState, useEffect } from 'react';
import { NamingConfig, NamingComponent, ResourceType, CloudProvider, Environment } from '../types';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import EnvironmentSelector from './EnvironmentSelector';

interface NamingConfiguratorProps {
  resourceType?: ResourceType;
  cloudProvider?: CloudProvider;
  environment?: Environment;
  config?: NamingConfig;
  onChange: (config: NamingConfig) => void;
}

export default function NamingConfigurator({
  resourceType: initialResourceType,
  cloudProvider: initialCloudProvider,
  environment: initialEnvironment,
  config: initialConfig,
  onChange
}: NamingConfiguratorProps) {
  const [resourceType, setResourceType] = useState<ResourceType | undefined>(initialResourceType);
  const [cloudProvider, setCloudProvider] = useState<CloudProvider | undefined>(initialCloudProvider);
  const [environment, setEnvironment] = useState<Environment | undefined>(initialEnvironment);
  const [config, setConfig] = useState<NamingConfig>(
    initialConfig || {
      name: 'Neue Konfiguration',
      resourceType: resourceType || 'vm',
      components: [],
      separator: '-',
      caseStyle: 'lowercase'
    }
  );

  // Best Practice laden wenn ResourceType oder CloudProvider sich ändern
  useEffect(() => {
    if (resourceType && cloudProvider) {
      apiClient.getBestPractice(cloudProvider, resourceType)
        .then((bestPractice) => {
          if (bestPractice && Array.isArray(bestPractice.recommendedComponents)) {
            const newConfig: NamingConfig = {
              name: `${cloudProvider} ${resourceType} Standard`,
              resourceType,
              cloudProvider,
              environment,
              components: bestPractice.recommendedComponents.map(comp => ({
                name: comp,
                value: '',
                required: comp === 'env' || comp === 'resource'
              })),
              separator: bestPractice.separator,
              caseStyle: bestPractice.caseStyle,
              maxTotalLength: bestPractice.maxLength
            };
            setConfig(newConfig);
            onChange(newConfig);
          }
        })
        .catch(console.error);
    }
  }, [resourceType, cloudProvider, environment]);

  const updateConfig = (updates: Partial<NamingConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onChange(newConfig);
  };

  const addComponent = () => {
    const newComponent: NamingComponent = {
      name: `component${config.components.length + 1}`,
      value: '',
      required: false
    };
    updateConfig({
      components: [...config.components, newComponent]
    });
  };

  const updateComponent = (index: number, updates: Partial<NamingComponent>) => {
    const newComponents = [...config.components];
    newComponents[index] = { ...newComponents[index], ...updates };
    updateConfig({ components: newComponents });
  };

  const removeComponent = (index: number) => {
    const newComponents = config.components.filter((_, i) => i !== index);
    updateConfig({ components: newComponents });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Naming-Konfiguration</h3>

      <div className="mb-6">
        <label htmlFor="config-name" className="block text-sm font-medium text-gray-700 mb-2">
          Konfigurationsname <span className="text-red-500">*</span>
        </label>
        <input
          id="config-name"
          type="text"
          value={config.name}
          onChange={(e) => updateConfig({ name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="z.B. Azure VM Production Standard"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Geben Sie einen aussagekräftigen Namen für diese Konfiguration ein
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ResourceTypeSelector
          value={resourceType}
          onChange={(rt) => {
            setResourceType(rt);
            updateConfig({ resourceType: rt });
          }}
        />
        <CloudProviderSelector
          value={cloudProvider}
          onChange={(cp) => {
            setCloudProvider(cp);
            updateConfig({ cloudProvider: cp });
          }}
        />
        <EnvironmentSelector
          value={environment}
          onChange={(env) => {
            setEnvironment(env);
            updateConfig({ environment: env });
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Präfix (optional)
          </label>
          <input
            type="text"
            value={config.prefix || ''}
            onChange={(e) => updateConfig({ prefix: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="z.B. prod"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suffix (optional)
          </label>
          <input
            type="text"
            value={config.suffix || ''}
            onChange={(e) => updateConfig({ suffix: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="z.B. 01"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trennzeichen
          </label>
          <input
            type="text"
            value={config.separator}
            onChange={(e) => updateConfig({ separator: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={1}
            placeholder="-"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Groß-/Kleinschreibung
          </label>
          <select
            value={config.caseStyle}
            onChange={(e) => updateConfig({ caseStyle: e.target.value as NamingConfig['caseStyle'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lowercase">Kleinbuchstaben</option>
            <option value="uppercase">Großbuchstaben</option>
            <option value="camelCase">camelCase</option>
            <option value="PascalCase">PascalCase</option>
            <option value="kebab-case">kebab-case</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Komponenten
          </label>
          <button
            type="button"
            onClick={addComponent}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Komponente hinzufügen
          </button>
        </div>
        <div className="space-y-2">
          {Array.isArray(config.components) && config.components.map((component, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <input
                type="text"
                value={component.name}
                onChange={(e) => updateComponent(index, { name: e.target.value })}
                placeholder="Komponentenname"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={component.required}
                  onChange={(e) => updateComponent(index, { required: e.target.checked })}
                  className="mr-1"
                />
                Erforderlich
              </label>
              <button
                type="button"
                onClick={() => removeComponent(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {(!Array.isArray(config.components) || config.components.length === 0) && (
            <p className="text-sm text-gray-500">Keine Komponenten definiert</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximale Gesamtlänge (optional)
        </label>
        <input
          type="number"
          value={config.maxTotalLength || ''}
          onChange={(e) => updateConfig({ maxTotalLength: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z.B. 63"
        />
      </div>
    </div>
  );
}

