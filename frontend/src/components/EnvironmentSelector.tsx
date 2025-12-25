import { Environment } from '../types';
import { useI18n } from '../i18n/context';

interface EnvironmentSelectorProps {
  value?: Environment;
  onChange: (environment: Environment | undefined) => void;
  label?: string;
  allowNone?: boolean;
}

export default function EnvironmentSelector({
  value,
  onChange,
  label,
  allowNone = true
}: EnvironmentSelectorProps) {
  const { t } = useI18n();
  const environments: { value: Environment; label: string }[] = [
    { value: 'dev', label: t('environments.dev') },
    { value: 'test', label: t('environments.test') },
    { value: 'staging', label: t('environments.staging') },
    { value: 'prod', label: t('environments.prod') }
  ];

  return (
    <div className="mb-4">
      <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-2">
        {label || t('generator.environment')}
      </label>
      <select
        id="environment"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? (e.target.value as Environment) : undefined)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {allowNone && <option value="">{t('environments.none')}</option>}
        {environments.map((env) => (
          <option key={env.value} value={env.value}>
            {env.label}
          </option>
        ))}
      </select>
    </div>
  );
}

