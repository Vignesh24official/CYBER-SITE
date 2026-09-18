import React, { useState } from 'react';
import { Network, Shield, Server, Database, Smartphone, Globe, Cpu, AlertTriangle, Activity, RefreshCw } from 'lucide-react';

export const NetworkTopology = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { id: 'internet', label: 'Internet Gateway', ip: '185.220.101.5', type: 'cloud', icon: Globe, status: 'warning', threat: 'Inbound Scanning', x: 80, y: 150 },
    { id: 'firewall', label: 'Palo Alto WAF Firewall', ip: '10.0.0.1', type: 'firewall', icon: Shield, status: 'healthy', openPorts: '80, 443', x: 260, y: 150 },
    { id: 'gateway', label: 'API Microservices Gateway', ip: '10.0.1.5', type: 'server', icon: Server, status: 'healthy', openPorts: '443, 8080', x: 440, y: 90 },
    { id: 'sensor', label: 'SOC Security Probe', ip: '10.0.9.1', type: 'sensor', icon: Cpu, status: 'healthy', openPorts: '9090', x: 440, y: 220 },
    { id: 'app', label: 'Production App Cluster', ip: '10.0.2.10', type: 'server', icon: Server, status: 'healthy', openPorts: '8080, 8443', x: 620, y: 90 },
    { id: 'database', label: 'Primary DB (srv-prod-db-01)', ip: '10.0.4.15', type: 'database', icon: Database, status: 'critical', threat: 'CVE-2024-3094 Exposure', openPorts: '5432, 22', x: 800, y: 90 },
    { id: 'endpoint', label: 'Corporate Workstation-99', ip: '10.0.8.44', type: 'endpoint', icon: Smartphone, status: 'healthy', openPorts: '22', x: 620, y: 220 },
  ];

  const connections = [
    { from: 'internet', to: 'firewall', active: true },
    { from: 'firewall', to: 'gateway', active: true },
    { from: 'firewall', to: 'sensor', active: true },
    { from: 'gateway', to: 'app', active: true },
    { from: 'app', to: 'database', active: true, warning: true },
    { from: 'app', to: 'endpoint', active: false },
  ];

  const activeNode = selectedNode || nodes[5]; // Default to DB node

  const getNodeColor = (status) => {
    switch (status) {
      case 'critical': return '#f87171';
      case 'warning': return '#fbbf24';
      default: return '#34d399';
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1420' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Network size={20} color="var(--accent-cyan-bright)" />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFF' }}>Interactive Enterprise Network Topology</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time node telemetry, packet path flows & vulnerability flags</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot status-dot-active" /> Realtime Pulse
          </span>
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={12} /> Refresh Graph
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: '380px' }}>
        {/* SVG Canvas Topology Graph */}
        <div style={{ backgroundColor: '#07090e', position: 'relative', overflow: 'hidden', padding: '20px' }}>
          <svg style={{ width: '100%', height: '340px' }} viewBox="0 0 900 300">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="lineWarnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connection Lines */}
            {connections.map((conn, idx) => {
              const source = nodes.find(n => n.id === conn.from);
              const target = nodes.find(n => n.id === conn.to);
              if (!source || !target) return null;

              return (
                <g key={idx}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={conn.warning ? 'url(#lineWarnGrad)' : 'url(#lineGrad)'}
                    strokeWidth={conn.warning ? 2.5 : 1.5}
                    strokeDasharray={conn.warning ? '4,4' : 'none'}
                    opacity={0.6}
                  />
                  {conn.active && (
                    <circle r="3" fill={conn.warning ? '#ef4444' : '#06b6d4'}>
                      <animateMotion
                        path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                        dur={conn.warning ? '1.5s' : '3s'}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = activeNode.id === node.id;
              const color = getNodeColor(node.status);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r="24"
                    fill="#111622"
                    stroke={isSelected ? 'var(--accent-cyan-bright)' : 'rgba(255, 255, 255, 0.15)'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    style={{ filter: isSelected ? 'drop-shadow(0 0 10px rgba(6,182,212,0.4))' : 'none' }}
                  />
                  <circle r="4" cx="16" cy="-16" fill={color} />
                  <g transform="translate(-10, -10)">
                    <Icon size={20} color={isSelected ? 'var(--accent-cyan-bright)' : '#94a3b8'} />
                  </g>
                  <text
                    y="40"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                  <text
                    y="54"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {node.ip}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Panel */}
        <div style={{ backgroundColor: '#0f1420', borderLeft: '1px solid var(--border-color)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Node Telemetry
            </span>
            <span className={`sev-badge ${activeNode.status === 'critical' ? 'sev-critical' : activeNode.status === 'warning' ? 'sev-medium' : 'sev-low'}`}>
              {activeNode.status.toUpperCase()}
            </span>
          </div>

          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>{activeNode.label}</h4>
            <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan-bright)' }}>
              {activeNode.ip}
            </span>
          </div>

          {activeNode.threat && (
            <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} />
              <span>{activeNode.threat}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Asset Type</span>
              <span style={{ color: '#FFF', textTransform: 'uppercase' }}>{activeNode.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Open Ports</span>
              <span className="font-mono" style={{ color: '#FFF' }}>{activeNode.openPorts || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Bandwidth</span>
              <span className="font-mono" style={{ color: 'var(--accent-emerald)' }}>48.2 MB/s</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Probe Sensor</span>
              <span style={{ color: '#FFF' }}>sensor-soc-01</span>
            </div>
          </div>

          <button className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>
            <Activity size={14} /> Launch Recon Scan
          </button>
        </div>
      </div>
    </div>
  );
};
