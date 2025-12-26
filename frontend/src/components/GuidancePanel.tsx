import { useState, useEffect } from 'react';
import { ResourceType, CloudProvider, BestPracticeRule } from '../types';
import { apiClient } from '../utils/api';

interface GuidancePanelProps {
  resourceType: ResourceType;
  cloudProvider?: CloudProvider;
}

export default function GuidancePanel({ resourceType, cloudProvider }: GuidancePanelProps) {
  const [bestPractice, setBestPractice] = useState<BestPracticeRule | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cloudProvider && resourceType) {
      setLoading(true);
      apiClient.getBestPractice(cloudProvider, resourceType)
        .then(setBestPractice)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setBestPractice(null);
    }
  }, [cloudProvider, resourceType]);

  if (!cloudProvider || !resourceType) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-blue-800">Lade Best Practices...</p>
      </div>
    );
  }

  if (!bestPractice) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800">Keine Best Practices für diese Kombination verfügbar</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Best Practices Guidance</h3>
      <div className="space-y-2 text-sm text-blue-800">
        <div>
          <strong>Maximale Länge:</strong> {bestPractice.maxLength} Zeichen
        </div>
        <div>
          <strong>Erlaubte Zeichen:</strong> {bestPractice.allowedChars}
        </div>
        <div>
          <strong>Empfohlene Komponenten:</strong> {Array.isArray(bestPractice.recommendedComponents) ? bestPractice.recommendedComponents.join(', ') : 'N/A'}
        </div>
        <div>
          <strong>Trennzeichen:</strong> "{bestPractice.separator}"
        </div>
        <div>
          <strong>Groß-/Kleinschreibung:</strong> {bestPractice.caseStyle}
        </div>
        {Array.isArray(bestPractice.examples) && bestPractice.examples.length > 0 && (
          <div>
            <strong>Beispiele:</strong>
            <ul className="list-disc list-inside mt-1">
              {bestPractice.examples.map((example, index) => (
                <li key={index} className="font-mono">{example}</li>
              ))}
            </ul>
          </div>
        )}
        {bestPractice.notes && (
          <div className="mt-2 p-2 bg-blue-100 rounded">
            <strong>Hinweis:</strong> {bestPractice.notes}
          </div>
        )}
      </div>
    </div>
  );
}

