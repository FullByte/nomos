import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from '../i18n/context';
export default function EnvironmentSelector({ value, onChange, label, allowNone = true }) {
    const { t } = useI18n();
    const environments = [
        { value: 'dev', label: t('environments.dev') },
        { value: 'test', label: t('environments.test') },
        { value: 'staging', label: t('environments.staging') },
        { value: 'prod', label: t('environments.prod') }
    ];
    return (_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "environment", className: "block text-sm font-medium text-gray-700 mb-2", children: label || t('generator.environment') }), _jsxs("select", { id: "environment", value: value || '', onChange: (e) => onChange(e.target.value ? e.target.value : undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [allowNone && _jsx("option", { value: "", children: t('environments.none') }), environments.map((env) => (_jsx("option", { value: env.value, children: env.label }, env.value)))] })] }));
}
