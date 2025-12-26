import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { useI18n } from '../i18n/context';
export default function CloudProviderSelector({ value, onChange, label, allowNone = true }) {
    const { t } = useI18n();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        apiClient.getCloudProviders()
            .then(setProviders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const providerLabels = {
        'azure': t('providers.azure'),
        'aws': t('providers.aws'),
        'gcp': t('providers.gcp'),
        'on-premise': t('providers.onPremise')
    };
    if (loading) {
        return (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label || t('generator.cloudProvider') }), _jsx("div", { className: "text-gray-500", children: t('common.loading') })] }));
    }
    return (_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "cloud-provider", className: "block text-sm font-medium text-gray-700 mb-2", children: label || t('generator.cloudProvider') }), _jsxs("select", { id: "cloud-provider", value: value || '', onChange: (e) => onChange(e.target.value ? e.target.value : undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [allowNone && _jsx("option", { value: "", children: t('providers.none') }), providers.map((provider) => (_jsx("option", { value: provider, children: providerLabels[provider] }, provider)))] })] }));
}
