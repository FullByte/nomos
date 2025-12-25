import { useState, useEffect } from 'react';
import { ResourceType } from '../types';
import { apiClient } from '../utils/api';
import { useI18n } from '../i18n/context';

interface ResourceTypeSelectorProps {
  value?: ResourceType;
  onChange: (resourceType: ResourceType) => void;
  label?: string;
}

export default function ResourceTypeSelector({
  value,
  onChange,
  label
}: ResourceTypeSelectorProps) {
  const { t } = useI18n();
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getResourceTypes()
      .then(setResourceTypes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const resourceTypeLabels: Record<ResourceType, string> = {
    'vm': t('resourceTypes.vm'),
    'storage': t('resourceTypes.storage'),
    'network': t('resourceTypes.network'),
    'database': t('resourceTypes.database'),
    'load-balancer': t('resourceTypes.loadBalancer'),
    'firewall': t('resourceTypes.firewall'),
    'vpn': t('resourceTypes.vpn'),
    'client': t('resourceTypes.client'),
    'server': t('resourceTypes.server'),
    'hardware': t('resourceTypes.hardware'),
    'resource-group': t('resourceTypes.resourceGroup'),
    'function': t('resourceTypes.function'),
    'container': t('resourceTypes.container'),
    'kubernetes': t('resourceTypes.kubernetes'),
    'other': t('resourceTypes.other')
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label || t('generator.resourceType')}
        </label>
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor="resource-type" className="block text-sm font-medium text-gray-700 mb-2">
        {label || t('generator.resourceType')}
      </label>
      <select
        id="resource-type"
        value={value || ''}
        onChange={(e) => onChange(e.target.value as ResourceType)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">{t('common.loading')}</option>
        {resourceTypes.map((type) => (
          <option key={type} value={type}>
            {resourceTypeLabels[type] || type}
          </option>
        ))}
      </select>
    </div>
  );
}

