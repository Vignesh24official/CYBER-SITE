import React, { useState } from 'react';
import { Cpu, Play, Square, RefreshCw, Shield, Terminal, CheckCircle2, AlertTriangle, Activity, Clock, Layers } from 'lucide-react';

export const ReconnaissancePage = () => {
  const [selectedTarget, setSelectedTarget] = useState('10.0.4.0/24');
  const [scanType, setScanType] = useState('FULL_AUDIT');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(68);

  const targets = [
    { id: '10.0.4.0/24', name: 'Database & Backend Subnet (10.0.4.0/24)', assets: 8 },
    { id: 'api.cybershield.org', name: 'Public API Gateway Edge (api.cybershield.org)', assets: 3 },
    { id: 'prod-cluster-us-east', name: 'Kubernetes Production Cluster (US-East)', assets: 16 }
  ];

  const findings = [
    { id: 'FIND-01', severity: 'CRITICAL', title: 'CVE-2024-3094 - OpenSSHd Backdoor Intercepted', host: '10.0.4.15', port: '22/TCP' },
    { id: 'FIND-02', severity: 'HIGH', title: 'Unauthenticated PostgreSQL Admin Port Exposed', host: '10.0.4.15', port: '5432/TCP' },
    { id: 'FIND-03', severity: 'MEDIUM', title: 'Weak TLS 1.1 Cipher Suite Supported', host: '10.0.1.5', port: '443/TCP' },
    { id: 'FIND-04', severity: 'LOW', title: 'HTTP Server Version Information Disclosure (Nginx 1.24)', host: '10.0.1.5', port: '80/TCP' },
    { id: 'FIND-05', severity: 'INFORMATIONAL', title: 'ICMP Echo Ping Response Enabled', host: '10.0.0.1', port: 'ICMP' }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setProgress(15);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsScanning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1420' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={24} color="var(--accent-cyan-bright)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>Security Operations & Reconnaissance Workspace</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Authorized penetration testing, port discovery, vulnerability auditing & live scan execution
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontFamily: 'monospace' }}>
            SCOPE AUTHORIZED
          </span>
        </div>
      </div>

      {/* Target & Controls Setup Panel */}
      <div className="grid-main-side">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-header" style={{ marginBottom: 0 }}>
            <span className="card-title">Target & Scan Parameters</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              PROBE: sensor-soc-us-east-01
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Select Scope Target
              </label>
              <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
                {targets.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Recon Profile
              </label>
              <select value={scanType} onChange={(e) => setScanType(e.target.value)}>
                <option value="FULL_AUDIT">Full Vulnerability Audit & Port Scan</option>
                <option value="STEALTH_SYN">Stealth SYN Scan (-sS)</option>
                <option value="WEBP_DAST">Web Application DAST Probe</option>
                <option value="CVE_EXPLOIT_CHECK">CVE Exposure & Version Verification</option>
              </select>
            </div>
          </div>

          {/* Live Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {isScanning ? 'Scan executing on target...' : 'Scan Idle / Completed'}
              </span>
              <span className="font-mono" style={{ color: 'var(--accent-cyan-bright)' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#0b0e17', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--accent-cyan-bright)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {!isScanning ? (
              <button onClick={handleStartScan} className="btn btn-primary">
                <Play size={14} /> Start Recon Scan
              </button>
            ) : (
              <button onClick={() => setIsScanning(false)} className="btn btn-danger">
                <Square size={14} /> Abort Scan Task
              </button>
            )}
            <button className="btn btn-secondary">
              <RefreshCw size={14} /> Reset Target Scope
            </button>
          </div>
        </div>

        {/* Live Telemetry Summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0b0e17' }}>
          <span className="card-title" style={{ fontSize: '0.9rem' }}>Scan Telemetry</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hosts Up</span>
              <span className="font-mono" style={{ color: '#34d399' }}>8 / 8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Open Ports</span>
              <span className="font-mono" style={{ color: '#FFF' }}>14 Ports</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Critical Flags</span>
              <span className="font-mono" style={{ color: '#f87171' }}>1 CVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Packet Speed</span>
              <span className="font-mono" style={{ color: 'var(--accent-cyan-bright)' }}>1,250 pps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Findings Breakdown Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFF' }}>Discovered Findings & Severity Classification</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 Findings Identified</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Severity</th>
                <th>Finding Description</th>
                <th>Target Host</th>
                <th>Port / Surface</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {findings.map(item => (
                <tr key={item.id}>
                  <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.id}</td>
                  <td>
                    <span className={`sev-badge ${item.severity === 'CRITICAL' ? 'sev-critical' : item.severity === 'HIGH' ? 'sev-high' : item.severity === 'MEDIUM' ? 'sev-medium' : item.severity === 'LOW' ? 'sev-low' : 'sev-info'}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, color: '#FFF' }}>{item.title}</td>
                  <td className="font-mono" style={{ color: 'var(--accent-cyan-bright)' }}>{item.host}</td>
                  <td className="font-mono" style={{ fontSize: '0.8rem' }}>{item.port}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
