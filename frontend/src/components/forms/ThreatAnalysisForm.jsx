import React, { useState } from 'react';
import { threatAnalysisService } from '../../services/threatAnalysisService';
import { useToast } from '../../context/ToastContext';
import { SeverityBadge } from '../common/Badge';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, Info } from 'lucide-react';

export const ThreatAnalysisForm = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { addToast } = useToast();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url || url.trim().length === 0) return;

    setLoading(true);
    try {
      const res = await threatAnalysisService.analyzeUrl(url);
      if (res.success && res.data) {
        setResult(res.data);
        addToast('URL heuristic analysis completed', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Threat analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search color="var(--accent-cyan)" /> Safe Heuristic URL Threat Analyzer
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Enter any suspicious link or domain name below to calculate its heuristic threat risk score based on SSL, Punycode, IP hostnames, non-standard ports, and credential harvesting keywords.
        </p>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. http://192.168.1.1/paypal/login-verify.php"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={loading} className="btn btn-cyan">
            {loading ? 'Analyzing...' : 'Scan URL'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card" style={{ borderLeft: '4px solid ' + (result.riskScore >= 60 ? 'var(--accent-rose)' : result.riskScore >= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)') }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: 'true' }}>Target Domain</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {result.domain || result.url}
              </h4>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: 'true' }}>Risk Level</div>
              <div style={{ marginTop: '4px' }}>
                <SeverityBadge severity={result.riskLevel} />
              </div>
            </div>
          </div>

          {/* Risk Score Progress Gauge */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Risk Score: {result.riskScore} / 100</span>
              <span style={{ color: result.riskScore >= 60 ? 'var(--accent-rose)' : result.riskScore >= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                {result.riskScore >= 60 ? 'HIGH / CRITICAL RISK' : result.riskScore >= 30 ? 'MODERATE RISK' : 'LOW RISK'}
              </span>
            </div>
            <div style={{ height: '10px', width: '100%', backgroundColor: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${result.riskScore}%`,
                  backgroundColor: result.riskScore >= 60 ? 'var(--accent-rose)' : result.riskScore >= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                  transition: 'width 0.4s ease-out',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Heuristic Evaluation Findings:</h5>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.findings.map((f, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="var(--accent-cyan)" />
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
