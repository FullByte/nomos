import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { apiClient } from '../utils/api';
import ResourceTypeSelector from './ResourceTypeSelector';
import CloudProviderSelector from './CloudProviderSelector';
import { useI18n } from '../i18n/context';
export default function NameValidator() {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [resourceType, setResourceType] = useState('');
    const [cloudProvider, setCloudProvider] = useState();
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleValidate = async () => {
        if (!name || !resourceType) {
            setError('Bitte geben Sie einen Namen und wählen Sie einen Ressourcentyp');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const request = {
                name,
                resourceType: resourceType,
                cloudProvider: cloudProvider
            };
            const response = await apiClient.validateName(request);
            setValidationResult(response);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Fehler bei der Validierung');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: t('validator.title') }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name-input", className: "block text-sm font-medium text-gray-700 mb-2", children: t('validator.nameInput') }), _jsx("input", { id: "name-input", type: "text", value: name, onChange: (e) => setName(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleValidate(), placeholder: "z.B. prod-weu-vm-web-01", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(ResourceTypeSelector, { value: resourceType, onChange: (rt) => setResourceType(rt) }), _jsx(CloudProviderSelector, { value: cloudProvider, onChange: setCloudProvider })] })] }), _jsx("button", { onClick: handleValidate, disabled: loading || !name || !resourceType, className: "px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed", children: loading ? t('validator.validating') : t('validator.validate') }), error && (_jsx("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700", children: error })), validationResult && (_jsxs("div", { className: `mt-6 p-4 rounded-md border ${validationResult.valid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'}`, children: [_jsx("div", { className: "flex items-center mb-3", children: validationResult.valid ? (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-6 h-6 text-green-500 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), _jsx("h3", { className: "text-lg font-semibold text-green-900", children: t('validator.valid') })] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-6 h-6 text-red-500 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }), _jsx("h3", { className: "text-lg font-semibold text-red-900", children: t('validator.invalid') })] })) }), validationResult.errors && validationResult.errors.length > 0 && (_jsxs("div", { className: "mb-3", children: [_jsx("strong", { className: "text-red-900", children: t('validator.errors') }), _jsx("ul", { className: "list-disc list-inside mt-1 text-red-800", children: validationResult.errors.map((error, index) => (_jsx("li", { children: error }, index))) })] })), validationResult.warnings && validationResult.warnings.length > 0 && (_jsxs("div", { className: "mb-3", children: [_jsx("strong", { className: "text-yellow-900", children: t('validator.warnings') }), _jsx("ul", { className: "list-disc list-inside mt-1 text-yellow-800", children: validationResult.warnings.map((warning, index) => (_jsx("li", { children: warning }, index))) })] })), validationResult.isDuplicate && (_jsxs("div", { className: "mt-3 p-2 bg-yellow-100 rounded text-yellow-900", children: [_jsxs("strong", { children: [t('common.loading'), ":"] }), " ", t('validator.duplicate')] }))] }))] }));
}
