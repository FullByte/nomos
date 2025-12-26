import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import EnvironmentSelector from './EnvironmentSelector';
export default function UsedNamesList() {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(null);
    const fileInputRef = useRef(null);
    const [filters, setFilters] = useState({});
    useEffect(() => {
        loadNames();
    }, [filters]);
    const loadNames = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getNames(filters);
            setNames(data);
        }
        catch (error) {
            console.error('Fehler beim Laden der Namen:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Möchten Sie diesen Namen wirklich löschen?'))
            return;
        try {
            await apiClient.deleteName(id);
            loadNames();
        }
        catch (error) {
            alert(`Fehler beim Löschen: ${error.response?.data?.error || error.message}`);
        }
    };
    const handleExport = () => {
        const csv = [
            ['Name', 'Ressourcentyp', 'Umgebung', 'Cloud-Provider', 'Erstellt am'].join(','),
            ...names.map(n => [
                n.name,
                n.resourceType,
                n.environment || '',
                n.cloudProvider || '',
                n.createdAt || ''
            ].join(','))
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `used-names-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const parseCSV = (csvText) => {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV-Datei ist leer oder enthält keine Daten');
        }
        // Header-Zeile überspringen
        const dataLines = lines.slice(1);
        const records = [];
        for (const line of dataLines) {
            // Einfaches CSV-Parsing (unterstützt keine Anführungszeichen mit Kommas)
            const values = line.split(',').map(v => v.trim());
            if (values.length < 2 || !values[0]) {
                continue; // Überspringe ungültige Zeilen
            }
            records.push({
                name: values[0],
                resourceType: values[1],
                environment: values[2] ? values[2] : undefined,
                cloudProvider: values[3] ? values[3] : undefined,
            });
        }
        return records;
    };
    const handleImport = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        setImporting(true);
        setImportError(null);
        setImportSuccess(null);
        try {
            const text = await file.text();
            const records = parseCSV(text);
            if (records.length === 0) {
                throw new Error('Keine gültigen Datensätze in der CSV-Datei gefunden');
            }
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            // Importiere jeden Datensatz einzeln
            for (const record of records) {
                try {
                    await apiClient.addName(record);
                    successCount++;
                }
                catch (error) {
                    errorCount++;
                    if (error.response?.status === 409) {
                        errors.push(`"${record.name}" existiert bereits`);
                    }
                    else {
                        errors.push(`"${record.name}": ${error.response?.data?.error || error.message}`);
                    }
                }
            }
            if (successCount > 0) {
                setImportSuccess(`${successCount} Namen erfolgreich importiert${errorCount > 0 ? `, ${errorCount} Fehler` : ''}`);
                await loadNames();
            }
            if (errorCount > 0 && successCount === 0) {
                throw new Error(`Import fehlgeschlagen: ${errors.slice(0, 5).join(', ')}${errors.length > 5 ? '...' : ''}`);
            }
            else if (errors.length > 0) {
                setImportError(`Einige Namen konnten nicht importiert werden: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
            }
        }
        catch (error) {
            setImportError(error.message || 'Fehler beim Importieren der CSV-Datei');
            console.error('Import-Fehler:', error);
        }
        finally {
            setImporting(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Verwendete Namen" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: ".csv", onChange: handleImport, className: "hidden" }), _jsx("button", { onClick: handleImportClick, disabled: importing, className: "px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed", children: importing ? 'Importiere...' : 'Import CSV' }), _jsx("button", { onClick: handleExport, className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600", children: "Export CSV" }), _jsx("button", { onClick: loadNames, className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600", children: "Aktualisieren" })] })] }), importError && (_jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700", children: importError })), importSuccess && (_jsx("div", { className: "mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700", children: importSuccess })), _jsxs("div", { className: "mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: [_jsx("h3", { className: "text-sm font-semibold text-blue-900 mb-2", children: "CSV-Import Format" }), _jsx("p", { className: "text-sm text-blue-800 mb-2", children: "Die CSV-Datei sollte folgendes Format haben (erste Zeile ist Header):" }), _jsx("code", { className: "text-xs bg-blue-100 px-2 py-1 rounded block", children: "Name,Ressourcentyp,Umgebung,Cloud-Provider" }), _jsxs("p", { className: "text-xs text-blue-700 mt-2", children: ["Beispiel: ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "prod-weu-vm-web-01,vm,prod,azure" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(ResourceTypeSelector, { value: filters.resourceType, onChange: (rt) => setFilters({ ...filters, resourceType: rt }) }), _jsx(CloudProviderSelector, { value: filters.cloudProvider, onChange: (cp) => setFilters({ ...filters, cloudProvider: cp }) }), _jsx(EnvironmentSelector, { value: filters.environment, onChange: (env) => setFilters({ ...filters, environment: env }) })] }), loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Lade Namen..." })) : names.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Keine Namen gefunden" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Ressourcentyp" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Umgebung" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cloud-Provider" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Erstellt am" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Aktionen" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: names.map((name) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("code", { className: "text-sm font-mono text-gray-900", children: name.name }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: name.resourceType }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: name.environment || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: name.cloudProvider || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: name.createdAt ? new Date(name.createdAt).toLocaleDateString('de-DE') : '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsx("button", { onClick: () => name.id && handleDelete(name.id), className: "text-red-600 hover:text-red-900", children: "L\u00F6schen" }) })] }, name.id))) })] }) }))] }));
}
