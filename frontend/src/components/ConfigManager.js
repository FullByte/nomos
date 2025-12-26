import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import NamingConfigurator from './NamingConfigurator';
export default function ConfigManager() {
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
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
        }
        catch (error) {
            console.error('Fehler beim Laden der Konfigurationen:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async (config) => {
        if (!config.name || config.name.trim() === '') {
            alert('Bitte geben Sie einen Namen für die Konfiguration ein');
            return;
        }
        setSaving(true);
        try {
            if (config.id) {
                await apiClient.updateConfig(config.id, config);
            }
            else {
                await apiClient.saveConfig(config);
            }
            await loadConfigs();
            alert('Konfiguration gespeichert');
            setSelectedConfig(null);
        }
        catch (error) {
            alert(`Fehler beim Speichern: ${error.response?.data?.error || error.message}`);
        }
        finally {
            setSaving(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Möchten Sie diese Konfiguration wirklich löschen?'))
            return;
        try {
            await apiClient.deleteConfig(id);
            await loadConfigs();
            if (selectedConfig?.id === id) {
                setSelectedConfig(null);
            }
        }
        catch (error) {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Konfigurationen verwalten" }), _jsx("button", { onClick: handleNewConfig, className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600", children: "Neue Konfiguration" })] }), loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Lade Konfigurationen..." })) : configs.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Keine Konfigurationen vorhanden" })) : (_jsx("div", { className: "space-y-2", children: configs.map((config) => (_jsx("div", { className: `p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedConfig?.id === config.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`, onClick: () => setSelectedConfig(config), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: config.name }), _jsxs("p", { className: "text-sm text-gray-500", children: [config.resourceType, " \u2022 ", config.cloudProvider || 'Alle Provider', " \u2022 ", config.environment || 'Alle Umgebungen'] })] }), _jsxs("div", { className: "flex gap-2", children: [config.isDefault && (_jsx("span", { className: "px-2 py-1 text-xs bg-green-100 text-green-800 rounded", children: "Standard" })), _jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    config.id && handleDelete(config.id);
                                                }, className: "px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600", children: "L\u00F6schen" })] })] }) }, config.id))) }))] }), selectedConfig && (_jsxs("div", { children: [_jsx(NamingConfigurator, { resourceType: selectedConfig.resourceType, cloudProvider: selectedConfig.cloudProvider, environment: selectedConfig.environment, config: selectedConfig, onChange: (config) => setSelectedConfig(config) }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx("button", { onClick: () => handleSave(selectedConfig), disabled: saving, className: "px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400", children: saving ? 'Speichere...' : 'Speichern' }), _jsx("button", { onClick: () => setSelectedConfig(null), className: "px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600", children: "Abbrechen" })] })] }))] }));
}
