import React, { useState } from 'react';
import { threatAnalysisService } from '../../services/threatAnalysisService';
import { analyzeUrlThreat } from '../../services/urlThreatEngine';
import { useToast } from '../../context/ToastContext';
import { SeverityBadge } from '../common/Badge';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, Info, Zap } from 'lucide-react';

export const ThreatAnalysisForm = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { addToast } = useToast();

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!url || url.trim().length === 0) return;

    setLoading(true);
    const clientAnalysis = analyzeUrlThreat(url);

    try {
      const res = await threatAnalysisService.analyzeUrl(url);
      if (res.success && res.data) {
        // Merge backend response with deep client keyword heuristics
        const merged = {
          ...res.data,
          matchedWords: clientAnalysis?.matchedWords || [],
          hasIllegalWords: clientAnalysis?.hasIllegalWords || false,
          category: clientAnalysis?.category || 'Heuristic Indicator',
          riskScore: clientAnalysis?.hasIllegalWords ? Math.max(res.data.riskScore, clientAnalysis.score) : res.data.riskScore,
        };
        setResult(merged);
        addToast('URL threat reconnaissance completed', 'success');
      } else {
        setResult(clientAnalysis);
        addToast('Local heuristic analysis completed', 'success');
      }
    } catch {
      // Seamlessly fall back to rich client-side threat engine
      setResult(clientAnalysis);
      addToast('Local heuristic threat analysis completed', 'info');
    } finally {
      setLoading(false);
    }
  };

  const sampleUrls = [
    { label: 'malware-c2-botnet.ru/lockbit-leak', isThreat: true },
    { label: 'darkweb-carding-forum.onion/dumps', isThreat: true },
    { label: 'bank-kyc-verify.xyz/credentialtheft', isThreat: true },
    { label: 'https://cybershield.org/safety-hub', isThreat: false },
    { label: 'https://github.com/about', isThreat: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search color="var(--accent-cyan)" /> Safe Heuristic URL Threat Analyzer
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Enter any suspicious link or domain name below to calculate its heuristic threat risk score based on 200+ illegal cybercrime keywords (ransomware, darkweb, exploits, carding, phishing), SSL encryption, and IP routing.
        </p>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. http://darkweb-hacker-market.onion/carding-dumps"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={loading || !url.trim()} className="btn btn-cyan">
            {loading ? 'Analyzing...' : 'Scan URL'}
          </button>
        </form>

        {/* Quick Click Samples */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Quick test examples:</span>
          {sampleUrls.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => { setUrl(sample.label); }}
              style={{
                background: sample.isThreat ? 'rgba(255, 0, 60, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: sample.isThreat ? '1px solid rgba(255, 0, 60, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '6px',
                padding: '4px 9px',
                color: sample.isThreat ? '#ff4d6d' : '#34d399',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>{sample.label}</span>
              <span style={{ fontSize: '0.66rem', opacity: 0.85, fontWeight: 700 }}>
                ({sample.isThreat ? 'HIGH RISK' : 'LOW RISK'})
              </span>
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="card" style={{ borderLeft: '4px solid ' + (result.riskScore >= 60 ? 'var(--accent-rose)' : result.riskScore >= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)') }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Indicator</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {result.domain || result.url || result.indicator}
              </h4>
              {result.category && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan-bright)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  Classification: <strong>{result.category}</strong>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Level</div>
              <div style={{ marginTop: '4px' }}>
                <SeverityBadge severity={result.riskLevel || (result.riskScore >= 80 ? 'CRITICAL' : result.riskScore >= 60 ? 'HIGH' : result.riskScore >= 30 ? 'MEDIUM' : 'LOW')} />
              </div>
            </div>
          </div>

          {/* Risk Score Progress Gauge */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              <span>Risk Probability: {result.riskScore}%</span>
              <span style={{ color: result.riskScore >= 60 ? 'var(--accent-rose)' : result.riskScore >= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                {result.riskScore >= 60 ? 'HIGH / CRITICAL RISK' : result.riskScore >= 30 ? 'MODERATE RISK' : 'LOW RISK / SAFE'}
              </span>
            </div>
            <div style={{ height: '10px', width: '100%', backgroundColor: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${result.riskScore}%`,
                  backgroundColor: result.riskScore >= 60 ? 'var(--accent-rose)' : result.riskScore >= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                  boxShadow: result.riskScore >= 60 ? '0 0 12px var(--accent-rose)' : '0 0 12px var(--accent-emerald)',
                  transition: 'width 0.4s ease-out',
                }}
              />
            </div>
          </div>

          {/* Matched Illegal Keywords Alert Banner */}
          {result.matchedWords && result.matchedWords.length > 0 ? (
            <div
              style={{
                marginBottom: '20px',
                padding: '14px 16px',
                backgroundColor: 'rgba(255, 0, 60, 0.12)',
                border: '1px solid rgba(255, 0, 60, 0.4)',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#ff4d6d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertTriangle size={16} color="#ff003c" />
                DETECTED ILLEGAL ADVERSARY KEYWORDS ({result.matchedWords.length}) — ELEVATED TO HIGH RISK:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.matchedWords.map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 0, 60, 0.25)',
                      border: '1px solid #ff003c',
                      borderRadius: '5px',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      boxShadow: '0 0 8px rgba(255, 0, 60, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span style={{ color: '#ff003c' }}>⚠</span> {kw}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px 16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ShieldCheck size={20} color="#34d399" />
              <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
                Zero illegal keywords, ransomware payloads, or darkweb vectors detected. Indicator evaluated as <strong>LOW RISK ({result.riskScore}%)</strong>.
              </span>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Heuristic Evaluation Findings:</h5>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.findings && result.findings.map((f, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="var(--accent-cyan)" />
            {result.disclaimer || 'Heuristic URL analysis engine. Does not replace formal antivirus or threat intelligence scanning.'}
          </div>
        </div>
      )}
    </div>
  );
};
