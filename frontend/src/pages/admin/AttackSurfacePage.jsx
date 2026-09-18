import React from 'react';
import { Globe, Shield, AlertTriangle, Cpu, HardDrive, CheckCircle2, RefreshCw } from 'lucide-react';

export const AttackSurfacePage = () => {
  const attackSurfaces = [
    { name: 'Public API Gateway (api.cybershield.org)', type: 'Web Endpoint', exposedPorts: '80/TCP, 443/TCP', riskScore: 'Low (2.4)', status: 'PROTECTED' },
    { name: 'SSH Bastion Host (srv-prod-auth-01)', type: 'Linux Server', exposedPorts: '22/TCP', riskScore: 'Critical (9.8)', status: 'EXPOSED_CVE' },
    { name: 'Database Cluster (srv-prod-db-01)', type: 'PostgreSQL DB', exposedPorts: '5432/TCP', riskScore: 'High (7.5)', status: 'WARNING' },
    { name: 'Corporate VPN Gateway', type: 'Network Appliance', exposedPorts: '1194/UDP, 443/TCP', riskScore: 'Low (1.8)', status: 'PROTECTED' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1420' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={24} color="var(--accent-cyan-bright)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>Attack Surface & Asset Exposure Map</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Continuous external exposure monitoring, port discovery & attack vector tracking
          </p>
        </div>

        <button className="btn btn-secondary btn-sm">
          <RefreshCw size={12} /> Scan Exposure
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Attack Surface Name</th>
              <th>Asset Category</th>
              <th>Exposed Ports</th>
              <th>Risk Score</th>
              <th>Security State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attackSurfaces.map((item, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: '#FFF' }}>{item.name}</td>
                <td>{item.type}</td>
                <td className="font-mono" style={{ color: 'var(--accent-cyan-bright)' }}>{item.exposedPorts}</td>
                <td className="font-mono" style={{ color: item.riskScore.includes('Critical') ? '#f87171' : item.riskScore.includes('High') ? '#fb923c' : '#34d399' }}>
                  {item.riskScore}
                </td>
                <td>
                  <span className={`sev-badge ${item.status === 'EXPOSED_CVE' ? 'sev-critical' : item.status === 'WARNING' ? 'sev-medium' : 'sev-low'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm">Audit Surface</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
