import React, { useState } from 'react';
import { Activity, ShieldAlert, Globe, Hash, Cpu, Search, ExternalLink, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export const ThreatIntelPage = () => {
  const [activeTab, setActiveTab] = useState('IOCS');
  const [searchQuery, setSearchQuery] = useState('');

  const threatActors = [
    {
      name: 'APT29 (Cozy Bear / Midnight Blizzard)',
      origin: 'State-Sponsored (Eastern Europe)',
      motivation: 'Espionage & Intelligence Gathering',
      targets: 'Government, Defense, Finance, Cloud Infrastructure',
      confidence: 98,
      level: 'CRITICAL',
      iocs: 142,
      lastSeen: '12 mins ago',
      tactics: ['Spearphishing', 'Token Theft', 'OAuth Impersonation', 'Supply Chain Compromise']
    },
    {
      name: 'Lazarus Group (HIDDEN COBRA)',
      origin: 'State-Sponsored (East Asia)',
      motivation: 'Financial Heists & Crypto Theft',
      targets: 'Crypto Exchanges, Banking SWIFT, Defense Tech',
      confidence: 94,
      level: 'CRITICAL',
      iocs: 209,
      lastSeen: '1 hour ago',
      tactics: ['Custom Malware Droppers', 'Trojanized Cleaners', 'Cross-Platform Exploits']
    },
    {
      name: 'FIN7 (Carbanak / Elbrus)',
      origin: 'Organized Cybercrime',
      motivation: 'Financial Gain & Ransom Extortion',
      targets: 'E-Commerce, POS Systems, Enterprise SaaS',
      confidence: 91,
      level: 'HIGH',
      iocs: 88,
      lastSeen: '3 hours ago',
      tactics: ['Malicious LNK Files', 'POWERTRASH Loaders', 'Ransomware Deployment']
    }
  ];

  const iocList = [
    {
      indicator: '185.220.101.5',
      type: 'IPv4 Address',
      category: 'Tor Exit Node / Botnet C2',
      confidence: '98% (Critical)',
      campaign: 'Operation DarkViper',
      firstSeen: '2026-08-12',
      status: 'ACTIVE_BLOCK'
    },
    {
      indicator: 'malware-update-cdn.org',
      type: 'Domain Name',
      category: 'Phishing Credential Harvester',
      confidence: '95% (High)',
      campaign: 'Credential Harvesting Wave 4',
      firstSeen: '2026-09-01',
      status: 'DNS_SINKHOLED'
    },
    {
      indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      type: 'SHA-256 Hash',
      category: 'Cobalt Strike Beacon Stager',
      confidence: '99% (Critical)',
      campaign: 'Red Team Emulation / APT29',
      firstSeen: '2026-09-08',
      status: 'EDR_QUARANTINED'
    },
    {
      indicator: '194.26.29.112',
      type: 'IPv4 Address',
      category: 'QakBot C2 Infrastructure',
      confidence: '92% (High)',
      campaign: 'QakBot Banking Malware',
      firstSeen: '2026-09-04',
      status: 'ACTIVE_BLOCK'
    }
  ];

  const malwareFamilies = [
    { name: 'Cobalt Strike', category: 'C2 Framework / Post-Exploitation', severity: 'CRITICAL', signatures: 1240 },
    { name: 'LockBit 3.0', category: 'Ransomware-as-a-Service (RaaS)', severity: 'CRITICAL', signatures: 890 },
    { name: 'QakBot (QBot)', category: 'Banking Trojan & Loader', severity: 'HIGH', signatures: 450 },
    { name: 'DarkGate', category: 'Stealer & Remote Access Trojan', severity: 'HIGH', signatures: 310 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1420' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} color="var(--accent-cyan-bright)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>Cyber Threat Intelligence Command</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time adversary profiling, Indicators of Compromise (IOCs) & automated threat telemetry
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="card" style={{ padding: '8px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan-bright)' }}>1,492</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active IOCs</div>
          </div>
          <div className="card" style={{ padding: '8px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>99.4%</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'IOCS', label: 'Indicators of Compromise (IOCs)' },
            { id: 'ACTORS', label: 'Threat Actors (APTs)' },
            { id: 'MALWARE', label: 'Malware Catalog' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ width: '280px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search IP, domain, hash, actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Tab Content 1: IOCs */}
      {activeTab === 'IOCS' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Type</th>
                <th>Category</th>
                <th>Confidence Level</th>
                <th>Campaign</th>
                <th>First Seen</th>
                <th>Enforcement Status</th>
              </tr>
            </thead>
            <tbody>
              {iocList.map((ioc, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="font-mono" style={{ color: 'var(--accent-cyan-bright)', fontWeight: 600 }}>
                      {ioc.indicator}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ioc.type}</span>
                  </td>
                  <td>{ioc.category}</td>
                  <td>
                    <span style={{ color: '#f87171', fontWeight: 600, fontSize: '0.8rem' }}>{ioc.confidence}</span>
                  </td>
                  <td>{ioc.campaign}</td>
                  <td className="font-mono" style={{ fontSize: '0.775rem' }}>{ioc.firstSeen}</td>
                  <td>
                    <span className="sev-badge sev-critical">
                      {ioc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 2: Threat Actors */}
      {activeTab === 'ACTORS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {threatActors.map((actor, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '3px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>{actor.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{actor.origin}</span>
                </div>
                <span className="sev-badge sev-critical">{actor.level}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Primary Motivation: </span>
                  <span style={{ color: '#FFF' }}>{actor.motivation}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Target Sectors: </span>
                  <span style={{ color: '#FFF' }}>{actor.targets}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Confidence Rating: </span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{actor.confidence}% Match</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Observed TTPs (MITRE ATT&CK)</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {actor.tactics.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#0b0e17', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--accent-cyan)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Malware Families */}
      {activeTab === 'MALWARE' && (
        <div className="grid-2">
          {malwareFamilies.map((m, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{m.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.category}</p>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px', display: 'inline-block' }}>
                  {m.signatures} YARA Signatures Active
                </span>
              </div>
              <span className={`sev-badge ${m.severity === 'CRITICAL' ? 'sev-critical' : 'sev-high'}`}>
                {m.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
