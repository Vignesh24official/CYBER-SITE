import React from 'react';
import { ThreatAnalysisForm } from '../../components/forms/ThreatAnalysisForm';

export const UrlAnalysisPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>URL Threat Risk Analyzer</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Evaluate suspicious links and domains using automated heuristic security pattern scoring
        </p>
      </div>

      <ThreatAnalysisForm />
    </div>
  );
};
