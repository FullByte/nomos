import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
export default function GuidancePanel({ resourceType, cloudProvider }) {
    const [bestPractice, setBestPractice] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (cloudProvider && resourceType) {
            setLoading(true);
            apiClient.getBestPractice(cloudProvider, resourceType)
                .then(setBestPractice)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
        else {
            setBestPractice(null);
        }
    }, [cloudProvider, resourceType]);
    if (!cloudProvider || !resourceType) {
        return null;
    }
    if (loading) {
        return (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-md p-4", children: _jsx("p", { className: "text-blue-800", children: "Lade Best Practices..." }) }));
    }
    if (!bestPractice) {
        return (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-md p-4", children: _jsx("p", { className: "text-yellow-800", children: "Keine Best Practices f\u00FCr diese Kombination verf\u00FCgbar" }) }));
    }
    return (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-md p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900 mb-2", children: "Best Practices Guidance" }), _jsxs("div", { className: "space-y-2 text-sm text-blue-800", children: [_jsxs("div", { children: [_jsx("strong", { children: "Maximale L\u00E4nge:" }), " ", bestPractice.maxLength, " Zeichen"] }), _jsxs("div", { children: [_jsx("strong", { children: "Erlaubte Zeichen:" }), " ", bestPractice.allowedChars] }), _jsxs("div", { children: [_jsx("strong", { children: "Empfohlene Komponenten:" }), " ", bestPractice.recommendedComponents.join(', ')] }), _jsxs("div", { children: [_jsx("strong", { children: "Trennzeichen:" }), " \"", bestPractice.separator, "\""] }), _jsxs("div", { children: [_jsx("strong", { children: "Gro\u00DF-/Kleinschreibung:" }), " ", bestPractice.caseStyle] }), bestPractice.examples && bestPractice.examples.length > 0 && (_jsxs("div", { children: [_jsx("strong", { children: "Beispiele:" }), _jsx("ul", { className: "list-disc list-inside mt-1", children: bestPractice.examples.map((example, index) => (_jsx("li", { className: "font-mono", children: example }, index))) })] })), bestPractice.notes && (_jsxs("div", { className: "mt-2 p-2 bg-blue-100 rounded", children: [_jsx("strong", { children: "Hinweis:" }), " ", bestPractice.notes] }))] })] }));
}
