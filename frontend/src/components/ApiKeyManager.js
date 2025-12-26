import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export default function ApiKeyManager() {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKey, setNewKey] = useState(null);
    const [showNewKey, setShowNewKey] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    // Für Demo-Zwecke: Erstelle einen temporären API-Key für die Verwaltung
    // In Produktion sollte dies über ein Admin-Interface oder ersten Setup erfolgen
    const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('temp_api_key'));
    useEffect(() => {
        if (tempApiKey) {
            loadApiKeys();
        }
    }, [tempApiKey]);
    const loadApiKeys = async () => {
        if (!tempApiKey)
            return;
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            // Verwende tempApiKey für API-Calls
            const response = await fetch(`${API_BASE}/keys`, {
                headers: {
                    'X-API-Key': tempApiKey
                }
            });
            if (response.ok) {
                const data = await response.json();
                setApiKeys(data);
            }
            else if (response.status === 401) {
                // API-Key ungültig, entferne ihn
                localStorage.removeItem('temp_api_key');
                setTempApiKey(null);
            }
        }
        catch (error) {
            console.error('Fehler beim Laden der API-Keys:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCreateKey = async () => {
        if (!formData.name.trim()) {
            alert('Bitte geben Sie einen Namen für den API-Key ein');
            return;
        }
        setCreating(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': tempApiKey || ''
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description || undefined
                })
            });
            if (response.ok) {
                const data = await response.json();
                setNewKey(data);
                setShowNewKey(true);
                setFormData({ name: '', description: '' });
                await loadApiKeys();
            }
            else {
                const error = await response.json();
                alert(`Fehler: ${error.error || 'Unbekannter Fehler'}`);
            }
        }
        catch (error) {
            alert(`Fehler beim Erstellen: ${error.message}`);
        }
        finally {
            setCreating(false);
        }
    };
    const handleDeactivate = async (id) => {
        if (!confirm('Möchten Sie diesen API-Key wirklich deaktivieren?'))
            return;
        if (!tempApiKey)
            return;
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/keys/${id}/deactivate`, {
                method: 'PUT',
                headers: {
                    'X-API-Key': tempApiKey
                }
            });
            if (response.ok) {
                await loadApiKeys();
            }
            else {
                alert('Fehler beim Deaktivieren');
            }
        }
        catch (error) {
            alert('Fehler beim Deaktivieren');
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Möchten Sie diesen API-Key wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'))
            return;
        if (!tempApiKey)
            return;
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/keys/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': tempApiKey
                }
            });
            if (response.ok) {
                await loadApiKeys();
            }
            else {
                alert('Fehler beim Löschen');
            }
        }
        catch (error) {
            alert('Fehler beim Löschen');
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('API-Key in Zwischenablage kopiert!');
    };
    const handleCreateInitialKey = async () => {
        if (!formData.name.trim()) {
            alert('Bitte geben Sie einen Namen für den API-Key ein');
            return;
        }
        setCreating(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/keys/initial`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description || undefined
                })
            });
            if (response.ok) {
                const data = await response.json();
                setNewKey(data);
                setShowNewKey(true);
                // Speichere den Key als temp key für weitere Verwaltung
                localStorage.setItem('temp_api_key', data.key);
                setTempApiKey(data.key);
                setFormData({ name: '', description: '' });
                await loadApiKeys();
            }
            else {
                const error = await response.json();
                alert(`Fehler: ${error.error || 'Unbekannter Fehler'}`);
            }
        }
        catch (error) {
            alert(`Fehler beim Erstellen: ${error.message}`);
        }
        finally {
            setCreating(false);
        }
    };
    if (!tempApiKey) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "API-Keys verwalten" }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-md p-4 mb-4", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "Ersten API-Key erstellen" }), _jsx("p", { className: "text-blue-800 text-sm mb-4", children: "Erstellen Sie den ersten API-Key, um die API zu nutzen. Dieser Key kann dann verwendet werden, um weitere API-Keys zu erstellen und zu verwalten." }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "z.B. Initial Admin Key", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Beschreibung (optional)" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Beschreibung des API-Keys", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsx("button", { onClick: handleCreateInitialKey, disabled: creating, className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400", children: creating ? 'Erstelle...' : 'Ersten API-Key erstellen' })] })] }), _jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-md p-4", children: [_jsxs("p", { className: "text-sm text-yellow-800", children: [_jsx("strong", { children: "Hinweis:" }), " Falls bereits API-Keys existieren, m\u00FCssen Sie einen g\u00FCltigen API-Key eingeben, um weitere Keys zu verwalten."] }), _jsx("input", { type: "text", placeholder: "Bestehenden API-Key eingeben", className: "mt-2 w-full px-3 py-2 border border-gray-300 rounded-md", onKeyPress: (e) => {
                                if (e.key === 'Enter') {
                                    const key = e.target.value;
                                    if (key) {
                                        localStorage.setItem('temp_api_key', key);
                                        setTempApiKey(key);
                                    }
                                }
                            } })] })] }));
    }
    return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "API-Keys verwalten" }), _jsx("button", { onClick: () => {
                                localStorage.removeItem('temp_api_key');
                                setTempApiKey(null);
                            }, className: "px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm", children: "Admin-Key entfernen" })] }), _jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-md", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Neuen API-Key erstellen" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "z.B. Production API Key", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Beschreibung (optional)" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Beschreibung des API-Keys", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsx("button", { onClick: handleCreateKey, disabled: creating, className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400", children: creating ? 'Erstelle...' : 'API-Key erstellen' })] })] }), showNewKey && newKey && (_jsxs("div", { className: "mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-md", children: [_jsx("h3", { className: "font-semibold text-green-900 mb-2", children: "API-Key erfolgreich erstellt!" }), _jsxs("p", { className: "text-sm text-green-800 mb-3", children: [_jsx("strong", { children: "WICHTIG:" }), " Speichern Sie diesen API-Key sicher. Er wird nicht erneut angezeigt!"] }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("code", { className: "flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono", children: newKey.key }), _jsx("button", { onClick: () => copyToClipboard(newKey.key), className: "px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600", children: "Kopieren" })] }), _jsx("button", { onClick: () => {
                                setShowNewKey(false);
                                setNewKey(null);
                            }, className: "text-sm text-green-700 hover:text-green-900", children: "Schlie\u00DFen" })] })), loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Lade API-Keys..." })) : apiKeys.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Keine API-Keys vorhanden" })) : (_jsx("div", { className: "space-y-2", children: apiKeys.map((key) => (_jsx("div", { className: "p-4 border border-gray-200 rounded-md hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: key.name }), !key.isActive && (_jsx("span", { className: "px-2 py-1 text-xs bg-red-100 text-red-800 rounded", children: "Deaktiviert" }))] }), key.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: key.description })), _jsxs("div", { className: "text-xs text-gray-500 mt-2", children: ["Erstellt: ", new Date(key.createdAt).toLocaleDateString('de-DE'), key.lastUsedAt && (_jsxs(_Fragment, { children: [" \u2022 Zuletzt verwendet: ", new Date(key.lastUsedAt).toLocaleDateString('de-DE')] }))] })] }), _jsxs("div", { className: "flex gap-2", children: [key.isActive && (_jsx("button", { onClick: () => handleDeactivate(key.id), className: "px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600", children: "Deaktivieren" })), _jsx("button", { onClick: () => handleDelete(key.id), className: "px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600", children: "L\u00F6schen" })] })] }) }, key.id))) }))] }) }));
}
