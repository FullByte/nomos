import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
const I18nContext = createContext(undefined);
export function I18nProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved && ['de', 'en', 'fr'].includes(saved) ? saved : 'de';
    });
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);
    const setLanguage = (lang) => {
        setLanguageState(lang);
    };
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            }
            else {
                // Fallback zu Deutsch wenn Übersetzung fehlt
                value = translations.de;
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && k2 in value) {
                        value = value[k2];
                    }
                    else {
                        return key; // Key zurückgeben wenn nicht gefunden
                    }
                }
                break;
            }
        }
        return typeof value === 'string' ? value : key;
    };
    return (_jsx(I18nContext.Provider, { value: { language, setLanguage, t }, children: children }));
}
export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}
