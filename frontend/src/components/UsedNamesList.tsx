import { useState, useEffect, useRef } from 'react';
import { NameRecord, ResourceType, CloudProvider, Environment } from '../types';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import EnvironmentSelector from './EnvironmentSelector';

export default function UsedNamesList() {
  const [names, setNames] = useState<NameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<{
    resourceType?: ResourceType;
    cloudProvider?: CloudProvider;
    environment?: Environment;
  }>({});

  useEffect(() => {
    loadNames();
  }, [filters]);

  const loadNames = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getNames(filters);
      setNames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fehler beim Laden der Namen:', error);
      setNames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Möchten Sie diesen Namen wirklich löschen?')) return;
    
    try {
      await apiClient.deleteName(id);
      loadNames();
    } catch (error: any) {
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

  const parseCSV = (csvText: string): NameRecord[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV-Datei ist leer oder enthält keine Daten');
    }

    // Header-Zeile überspringen
    const dataLines = lines.slice(1);
    const records: NameRecord[] = [];

    for (const line of dataLines) {
      // Einfaches CSV-Parsing (unterstützt keine Anführungszeichen mit Kommas)
      const values = line.split(',').map(v => v.trim());
      
      if (values.length < 2 || !values[0]) {
        continue; // Überspringe ungültige Zeilen
      }

      records.push({
        name: values[0],
        resourceType: values[1] as ResourceType,
        environment: values[2] ? (values[2] as Environment) : undefined,
        cloudProvider: values[3] ? (values[3] as CloudProvider) : undefined,
      });
    }

    return records;
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      const errors: string[] = [];

      // Importiere jeden Datensatz einzeln
      for (const record of records) {
        try {
          await apiClient.addName(record);
          successCount++;
        } catch (error: any) {
          errorCount++;
          if (error.response?.status === 409) {
            errors.push(`"${record.name}" existiert bereits`);
          } else {
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
      } else if (errors.length > 0) {
        setImportError(`Einige Namen konnten nicht importiert werden: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
      }
    } catch (error: any) {
      setImportError(error.message || 'Fehler beim Importieren der CSV-Datei');
      console.error('Import-Fehler:', error);
    } finally {
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verwendete Namen</h2>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            disabled={importing}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {importing ? 'Importiere...' : 'Import CSV'}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={loadNames}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Aktualisieren
          </button>
        </div>
      </div>

      {importError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {importError}
        </div>
      )}

      {importSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          {importSuccess}
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">CSV-Import Format</h3>
        <p className="text-sm text-blue-800 mb-2">
          Die CSV-Datei sollte folgendes Format haben (erste Zeile ist Header):
        </p>
        <code className="text-xs bg-blue-100 px-2 py-1 rounded block">
          Name,Ressourcentyp,Umgebung,Cloud-Provider
        </code>
        <p className="text-xs text-blue-700 mt-2">
          Beispiel: <code className="bg-blue-100 px-1 rounded">prod-weu-vm-web-01,vm,prod,azure</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ResourceTypeSelector
          value={filters.resourceType}
          onChange={(rt) => setFilters({ ...filters, resourceType: rt })}
        />
        <CloudProviderSelector
          value={filters.cloudProvider}
          onChange={(cp) => setFilters({ ...filters, cloudProvider: cp })}
        />
        <EnvironmentSelector
          value={filters.environment}
          onChange={(env) => setFilters({ ...filters, environment: env })}
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Lade Namen...</div>
      ) : names.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Keine Namen gefunden</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ressourcentyp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Umgebung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cloud-Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Erstellt am
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {names.map((name) => (
                <tr key={name.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-gray-900">{name.name}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {name.resourceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {name.environment || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {name.cloudProvider || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {name.createdAt ? new Date(name.createdAt).toLocaleDateString('de-DE') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => name.id && handleDelete(name.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

