import { useState } from 'react';
import { ValidateNameRequest, ValidateNameResponse } from '../types';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import { useI18n } from '../i18n/context';

export default function NameValidator() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [resourceType, setResourceType] = useState<string>('');
  const [cloudProvider, setCloudProvider] = useState<string | undefined>();
  const [validationResult, setValidationResult] = useState<ValidateNameResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!name || !resourceType) {
      setError('Bitte geben Sie einen Namen und wählen Sie einen Ressourcentyp');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: ValidateNameRequest = {
        name,
        resourceType: resourceType as any,
        cloudProvider: cloudProvider as any
      };

      const response = await apiClient.validateName(request);
      setValidationResult(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler bei der Validierung');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('validator.title')}</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-2">
            {t('validator.nameInput')}
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
            placeholder="z.B. prod-weu-vm-web-01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceTypeSelector
            value={resourceType as any}
            onChange={(rt) => setResourceType(rt)}
          />
          <CloudProviderSelector
            value={cloudProvider as any}
            onChange={setCloudProvider}
          />
        </div>
      </div>

      <button
        onClick={handleValidate}
        disabled={loading || !name || !resourceType}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? t('validator.validating') : t('validator.validate')}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {validationResult && (
        <div className={`mt-6 p-4 rounded-md border ${
          validationResult.valid
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-3">
            {validationResult.valid ? (
              <>
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900">{t('validator.valid')}</h3>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="text-lg font-semibold text-red-900">{t('validator.invalid')}</h3>
              </>
            )}
          </div>

          {validationResult.errors && validationResult.errors.length > 0 && (
            <div className="mb-3">
              <strong className="text-red-900">{t('validator.errors')}</strong>
              <ul className="list-disc list-inside mt-1 text-red-800">
                {validationResult.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.warnings && validationResult.warnings.length > 0 && (
            <div className="mb-3">
              <strong className="text-yellow-900">{t('validator.warnings')}</strong>
              <ul className="list-disc list-inside mt-1 text-yellow-800">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.isDuplicate && (
            <div className="mt-3 p-2 bg-yellow-100 rounded text-yellow-900">
              <strong>{t('common.loading')}:</strong> {t('validator.duplicate')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

