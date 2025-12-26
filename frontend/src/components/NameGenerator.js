import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import EnvironmentSelector from './EnvironmentSelector';
import NamingConfigurator from './NamingConfigurator';
import GuidancePanel from './GuidancePanel';
import { useI18n } from '../i18n/context';
export default function NameGenerator() {
    const { t } = useI18n();
    const [resourceType, setResourceType] = useState('');
    const [cloudProvider, setCloudProvider] = useState();
    const [environment, setEnvironment] = useState();
    const [config, setConfig] = useState(null);
    const [components, setComponents] = useState({});
    const [generatedNames, setGeneratedNames] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleGenerate = async () => {
        if (!resourceType || !config) {
            setError('Bitte wählen Sie einen Ressourcentyp und konfigurieren Sie die Naming-Regeln');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const request = {
                resourceType: resourceType,
                cloudProvider: cloudProvider,
                environment: environment,
                components,
                customConfig: config
            };
            const response = await apiClient.generateNames(request);
            setGeneratedNames(response);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Fehler bei der Generierung');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleComponentChange = (componentName, value) => {
        setComponents(prev => ({
            ...prev,
            [componentName]: value
        }));
    };
    const handleSaveName = async (name) => {
        try {
            await apiClient.addName({
                name,
                resourceType: resourceType,
                cloudProvider: cloudProvider,
                environment: environment
            });
            alert(`${t('generator.nameSaved')}: "${name}"`);
        }
        catch (err) {
            alert(`Fehler beim Speichern: ${err.response?.data?.error || err.message}`);
        }
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: t('generator.title') }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(ResourceTypeSelector, { value: resourceType, onChange: (rt) => {
                                setResourceType(rt);
                                setComponents({});
                            }, label: t('generator.resourceType') }), _jsx(CloudProviderSelector, { value: cloudProvider, onChange: setCloudProvider, label: t('generator.cloudProvider') }), _jsx(EnvironmentSelector, { value: environment, onChange: setEnvironment, label: t('generator.environment') })] }), resourceType && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-6", children: _jsx(GuidancePanel, { resourceType: resourceType, cloudProvider: cloudProvider }) }), _jsx(NamingConfigurator, { resourceType: resourceType, cloudProvider: cloudProvider, environment: environment, onChange: (newConfig) => {
                                setConfig(newConfig);
                                // Komponenten-Werte zurücksetzen wenn sich die Komponenten-Struktur ändert
                                const newComponents = {};
                                newConfig.components.forEach(comp => {
                                    if (components[comp.name]) {
                                        newComponents[comp.name] = components[comp.name];
                                    }
                                });
                                setComponents(newComponents);
                            } }), config && config.components.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: t('generator.componentValues') }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: config.components.map((component) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [component.name, component.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), _jsx("input", { type: "text", value: components[component.name] || '', onChange: (e) => handleComponentChange(component.name, e.target.value), placeholder: `z.B. ${component.examples?.[0] || 'wert'}`, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", required: component.required })] }, component.name))) })] })), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: handleGenerate, disabled: loading || !config || config.components.length === 0, className: "px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed", children: loading ? t('generator.generating') : t('generator.generate') }) }), error && (_jsx("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700", children: error })), generatedNames && (_jsxs("div", { className: "mt-6 p-4 bg-green-50 border border-green-200 rounded-md", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: t('generator.generatedNames') }), _jsx("div", { className: "space-y-2", children: generatedNames.names.map((name, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white rounded border border-gray-200", children: [_jsx("code", { className: "text-lg font-mono text-gray-900", children: name }), _jsx("button", { onClick: () => handleSaveName(name), className: "px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600", children: t('generator.saveName') })] }, index))) }), generatedNames.warnings && generatedNames.warnings.length > 0 && (_jsxs("div", { className: "mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm", children: [_jsx("strong", { children: "Warnungen:" }), _jsx("ul", { className: "list-disc list-inside mt-1", children: generatedNames.warnings.map((warning, index) => (_jsx("li", { children: warning }, index))) })] }))] }))] }))] }) }));
}
