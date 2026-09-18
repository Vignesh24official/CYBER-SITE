import React from 'react';
import { HardDrive, Server, Shield, CheckCircle2, AlertTriangle, Plus, Search } from 'lucide-react';

export const AssetsPage = () => {
  const assets = [
    { name: 'srv-prod-db-01', ip: '10.0.4.15', role: 'PostgreSQL Database', os: 'Ubuntu 22.04 LTS', sensor: 'sensor-soc-01', health: 'HEALTHY' },
    { name: 'api.cybershield.org', ip: '10.0.1.5', role: 'Nginx Reverse Proxy', os: 'Alpine Linux 3.19', sensor: 'sensor-soc-01', health: 'HEALTHY' },
    { name: 'srv-prod-auth-01', ip: '10.0.2.10', role: 'Authentication Service', os: 'Ubuntu 22.04 LTS', sensor: 'sensor-soc-02', health: 'WARNING' },
    { name: 'fw-edge-01', ip: '10.0.0.1', role: 'Palo Alto Enterprise Firewall', os: 'PAN-OS 10.2', sensor: 'sensor-soc-01', health: 'HEALTHY' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1420' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HardDrive size={24} color="var(--accent-cyan-bright)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>Monitored Infrastructure Assets</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Full inventory of servers, endpoints, gateways & security sensors under zero-trust monitoring
          </p>
        </div>

        <button className="btn btn-primary btn-sm">
          <Plus size={14} /> Add New Asset Scope
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Asset Hostname</th>
              <th>IP Address</th>
              <th>System Role</th>
              <th>Operating System</th>
              <th>Assigned Sensor</th>
              <th>Health Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: '#FFF' }}>{asset.name}</td>
                <td className="font-mono" style={{ color: 'var(--accent-cyan-bright)' }}>{asset.ip}</td>
                <td>{asset.role}</td>
                <td>{asset.os}</td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{asset.sensor}</td>
                <td>
                  <span className={`sev-badge ${asset.health === 'HEALTHY' ? 'sev-low' : 'sev-medium'}`}>
                    {asset.health}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
