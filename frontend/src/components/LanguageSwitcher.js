import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useI18n } from '../i18n/context';
const languages = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];
export default function LanguageSwitcher() {
    const { language, setLanguage } = useI18n();
    return (_jsx("div", { className: "relative", children: _jsx("select", { value: language, onChange: (e) => setLanguage(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm", children: languages.map((lang) => (_jsxs("option", { value: lang.code, children: [lang.flag, " ", lang.label] }, lang.code))) }) }));
}
