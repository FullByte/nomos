import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { useI18n } from '../i18n/context';
export default function ResourceTypeSelector({ value, onChange, label }) {
    const { t } = useI18n();
    const [resourceTypes, setResourceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        apiClient.getResourceTypes()
            .then(setResourceTypes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const resourceTypeLabels = {
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
        return (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label || t('generator.resourceType') }), _jsx("div", { className: "text-gray-500", children: t('common.loading') })] }));
    }
    return (_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "resource-type", className: "block text-sm font-medium text-gray-700 mb-2", children: label || t('generator.resourceType') }), _jsxs("select", { id: "resource-type", value: value || '', onChange: (e) => onChange(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "", children: t('common.loading') }), resourceTypes.map((type) => (_jsx("option", { value: type, children: resourceTypeLabels[type] || type }, type)))] })] }));
}
