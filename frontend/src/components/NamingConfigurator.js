import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import EnvironmentSelector from './EnvironmentSelector';
export default function NamingConfigurator({ resourceType: initialResourceType, cloudProvider: initialCloudProvider, environment: initialEnvironment, config: initialConfig, onChange }) {
    const [resourceType, setResourceType] = useState(initialResourceType);
    const [cloudProvider, setCloudProvider] = useState(initialCloudProvider);
    const [environment, setEnvironment] = useState(initialEnvironment);
    const [config, setConfig] = useState(initialConfig || {
        name: 'Neue Konfiguration',
        resourceType: resourceType || 'vm',
        components: [],
        separator: '-',
        caseStyle: 'lowercase'
    });
    // Best Practice laden wenn ResourceType oder CloudProvider sich ändern
    useEffect(() => {
        if (resourceType && cloudProvider) {
            apiClient.getBestPractice(cloudProvider, resourceType)
                .then((bestPractice) => {
                if (bestPractice) {
                    const newConfig = {
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
    const updateConfig = (updates) => {
        const newConfig = { ...config, ...updates };
        setConfig(newConfig);
        onChange(newConfig);
    };
    const addComponent = () => {
        const newComponent = {
            name: `component${config.components.length + 1}`,
            value: '',
            required: false
        };
        updateConfig({
            components: [...config.components, newComponent]
        });
    };
    const updateComponent = (index, updates) => {
        const newComponents = [...config.components];
        newComponents[index] = { ...newComponents[index], ...updates };
        updateConfig({ components: newComponents });
    };
    const removeComponent = (index) => {
        const newComponents = config.components.filter((_, i) => i !== index);
        updateConfig({ components: newComponents });
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Naming-Konfiguration" }), _jsxs("div", { className: "mb-6", children: [_jsxs("label", { htmlFor: "config-name", className: "block text-sm font-medium text-gray-700 mb-2", children: ["Konfigurationsname ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { id: "config-name", type: "text", value: config.name, onChange: (e) => updateConfig({ name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "z.B. Azure VM Production Standard", required: true }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Geben Sie einen aussagekr\u00E4ftigen Namen f\u00FCr diese Konfiguration ein" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(ResourceTypeSelector, { value: resourceType, onChange: (rt) => {
                            setResourceType(rt);
                            updateConfig({ resourceType: rt });
                        } }), _jsx(CloudProviderSelector, { value: cloudProvider, onChange: (cp) => {
                            setCloudProvider(cp);
                            updateConfig({ cloudProvider: cp });
                        } }), _jsx(EnvironmentSelector, { value: environment, onChange: (env) => {
                            setEnvironment(env);
                            updateConfig({ environment: env });
                        } })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E4fix (optional)" }), _jsx("input", { type: "text", value: config.prefix || '', onChange: (e) => updateConfig({ prefix: e.target.value || undefined }), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "z.B. prod" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Suffix (optional)" }), _jsx("input", { type: "text", value: config.suffix || '', onChange: (e) => updateConfig({ suffix: e.target.value || undefined }), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "z.B. 01" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Trennzeichen" }), _jsx("input", { type: "text", value: config.separator, onChange: (e) => updateConfig({ separator: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", maxLength: 1, placeholder: "-" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Gro\u00DF-/Kleinschreibung" }), _jsxs("select", { value: config.caseStyle, onChange: (e) => updateConfig({ caseStyle: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "lowercase", children: "Kleinbuchstaben" }), _jsx("option", { value: "uppercase", children: "Gro\u00DFbuchstaben" }), _jsx("option", { value: "camelCase", children: "camelCase" }), _jsx("option", { value: "PascalCase", children: "PascalCase" }), _jsx("option", { value: "kebab-case", children: "kebab-case" })] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Komponenten" }), _jsx("button", { type: "button", onClick: addComponent, className: "px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600", children: "+ Komponente hinzuf\u00FCgen" })] }), _jsxs("div", { className: "space-y-2", children: [config.components.map((component, index) => (_jsxs("div", { className: "flex items-center gap-2 p-2 bg-gray-50 rounded", children: [_jsx("input", { type: "text", value: component.name, onChange: (e) => updateComponent(index, { name: e.target.value }), placeholder: "Komponentenname", className: "flex-1 px-2 py-1 border border-gray-300 rounded text-sm" }), _jsxs("label", { className: "flex items-center text-sm", children: [_jsx("input", { type: "checkbox", checked: component.required, onChange: (e) => updateComponent(index, { required: e.target.checked }), className: "mr-1" }), "Erforderlich"] }), _jsx("button", { type: "button", onClick: () => removeComponent(index), className: "px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600", children: "\u00D7" })] }, index))), config.components.length === 0 && (_jsx("p", { className: "text-sm text-gray-500", children: "Keine Komponenten definiert" }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Maximale Gesamtl\u00E4nge (optional)" }), _jsx("input", { type: "number", value: config.maxTotalLength || '', onChange: (e) => updateConfig({ maxTotalLength: e.target.value ? parseInt(e.target.value) : undefined }), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "z.B. 63" })] })] }));
}
