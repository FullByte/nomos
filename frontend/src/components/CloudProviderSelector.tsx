import { useState, useEffect } from 'react';
import { CloudProvider } from '../types';
import { apiClient } from '../utils/api';
import { useI18n } from '../i18n/context';

interface CloudProviderSelectorProps {
  value?: CloudProvider;
  onChange: (provider: CloudProvider | undefined) => void;
  label?: string;
  allowNone?: boolean;
}

export default function CloudProviderSelector({
  value,
  onChange,
  label,
  allowNone = true
}: CloudProviderSelectorProps) {
  const { t } = useI18n();
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getCloudProviders()
      .then((data) => {
        setProviders(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Cloud Providers:', error);
        setProviders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const providerLabels: Record<CloudProvider, string> = {
    'azure': t('providers.azure'),
    'aws': t('providers.aws'),
    'gcp': t('providers.gcp'),
    'on-premise': t('providers.onPremise')
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label || t('generator.cloudProvider')}
        </label>
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor="cloud-provider" className="block text-sm font-medium text-gray-700 mb-2">
        {label || t('generator.cloudProvider')}
      </label>
      <select
        id="cloud-provider"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? (e.target.value as CloudProvider) : undefined)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {allowNone && <option value="">{t('providers.none')}</option>}
        {providers.map((provider) => (
          <option key={provider} value={provider}>
            {providerLabels[provider]}
          </option>
        ))}
      </select>
    </div>
  );
}

