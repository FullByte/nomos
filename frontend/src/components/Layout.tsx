import { ReactNode, useState } from 'react';
import NameGenerator from './NameGenerator';
import NameValidator from './NameValidator';
import ConfigManager from './ConfigManager';
import UsedNamesList from './UsedNamesList';
import ApiDocumentation from './ApiDocumentation';
import ApiKeyManager from './ApiKeyManager';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../i18n/context';

type View = 'home' | 'generate' | 'validate' | 'configs' | 'names' | 'api-docs' | 'api-keys';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const { t } = useI18n();

  const renderView = () => {
    switch (currentView) {
      case 'generate':
        return <NameGenerator />;
      case 'validate':
        return <NameValidator />;
      case 'configs':
        return <ConfigManager />;
      case 'names':
        return <UsedNamesList />;
      case 'api-docs':
        return <ApiDocumentation />;
      case 'api-keys':
        return <ApiKeyManager />;
      default:
        return children || (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
              <div className="flex items-center space-x-6 mb-4">
                <img 
                  src="/nomos.png" 
                  alt="Nomos" 
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
                <div>
                  <h1 className="text-4xl font-bold mb-3">{t('home.title')}</h1>
                  <p className="text-xl mb-2 text-blue-100">{t('home.subtitle')}</p>
                  <p className="text-blue-100">{t('home.description')}</p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.bestPractices.title')}</h2>
              <p className="text-gray-700 mb-6">{t('home.bestPractices.intro')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">{t('home.bestPractices.principles.consistency.title')}</h3>
                  <p className="text-sm text-blue-800">{t('home.bestPractices.principles.consistency.desc')}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">{t('home.bestPractices.principles.clarity.title')}</h3>
                  <p className="text-sm text-green-800">{t('home.bestPractices.principles.clarity.desc')}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-2">{t('home.bestPractices.principles.length.title')}</h3>
                  <p className="text-sm text-yellow-800">{t('home.bestPractices.principles.length.desc')}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">{t('home.bestPractices.principles.characters.title')}</h3>
                  <p className="text-sm text-purple-800">{t('home.bestPractices.principles.characters.desc')}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-2">{t('home.bestPractices.principles.structure.title')}</h3>
                  <p className="text-sm text-indigo-800">{t('home.bestPractices.principles.structure.desc')}</p>
                </div>
              </div>
            </div>

            {/* Tips & Tricks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.tips.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t(`home.tips.items.${index}.title`)}</h3>
                      <p className="text-sm text-gray-600">{t(`home.tips.items.${index}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.workflow.title')}</h2>
              <div className="space-y-4">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {t(`home.workflow.steps.${index}.step`)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{t(`home.workflow.steps.${index}.title`)}</h3>
                      <p className="text-sm text-gray-600">{t(`home.workflow.steps.${index}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.toolFeatures.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">{t(`home.toolFeatures.features.${index}.title`)}</h3>
                    <p className="text-sm text-blue-800">{t(`home.toolFeatures.features.${index}.desc`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.gettingStarted.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2 text-lg">{t(`home.gettingStarted.steps.${index}.title`)}</h3>
                    <p className="text-sm text-green-800 mb-4">{t(`home.gettingStarted.steps.${index}.desc`)}</p>
                    <button
                      onClick={() => {
                        if (index === 0) setCurrentView('generate');
                        else if (index === 1) setCurrentView('validate');
                        else setCurrentView('configs');
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                    >
                      {t(`home.gettingStarted.steps.${index}.action`)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/nomos.png" 
                alt="Nomos" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Nomos
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'home'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => setCurrentView('generate')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'generate'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.generate')}
                </button>
                <button
                  onClick={() => setCurrentView('validate')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'validate'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.validate')}
                </button>
                <button
                  onClick={() => setCurrentView('configs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'configs'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.configs')}
                </button>
                <button
                  onClick={() => setCurrentView('names')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'names'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.names')}
                </button>
                <button
                  onClick={() => setCurrentView('api-docs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'api-docs'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.apiDocs')}
                </button>
                <button
                  onClick={() => setCurrentView('api-keys')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'api-keys'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('nav.apiKeys')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
}

