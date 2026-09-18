import React, { useState } from 'react';
import { AlertTriangle, Shield, Search, ExternalLink, CheckCircle, ShieldAlert, Cpu, Terminal, Copy } from 'lucide-react';

export const VulnerabilitiesPage = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const vulnerabilities = [
    {
      cve: 'CVE-2024-3094',
      cvss: 10.0,
      severity: 'CRITICAL',
      title: 'XZ Utils Liblzma Remote Code Execution Backdoor',
      asset: 'srv-prod-auth-01 (10.0.2.10)',
      surface: 'Port 22/TCP - OpenSSHd',
      detectedAt: '2026-09-10 14:22:01',
      status: 'OPEN',
      evidence: `0x00000000  55 48 89 e5 48 83 ec 20  e8 00 00 00 00 5d 48 8b  |UH..H.. .....]H.|
0x00000010  05 00 00 00 00 48 8d 3d  00 00 00 00 48 8d 35 00  |.....H.=....H.5.|
RSA_public_decrypt hook intercepted in liblzma.so.5.6.0`,
      remediation: 'Upgrade xz-utils / liblzma packages to version 5.6.2 or downgrade to 5.4.x immediately. Restart sshd service.',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-3094', 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-3094']
    },
    {
      cve: 'CVE-2023-4863',
      cvss: 8.8,
      severity: 'HIGH',
      title: 'Heap Buffer Overflow in WebP Image Format Library',
      asset: 'srv-app-web-02 (10.0.1.5)',
      surface: 'Web Gateway Image Proxy Endpoint',
      detectedAt: '2026-09-09 18:05:40',
      status: 'IN_PROGRESS',
      evidence: `[+] Crashed at libwebp BuildHuffmanTable() with invalid bit length 16 > MAX_ALLOWED (15).
Buffer overflow trigger payload length: 4096 bytes.`,
      remediation: 'Apply libwebp patch 1.3.2 across all image parsing worker containers.',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-4863']
    },
    {
      cve: 'CVE-2024-21626',
      cvss: 8.6,
      severity: 'HIGH',
      title: 'runc Container Breakout via WORKDIR File Descriptor Leak',
      asset: 'k8s-node-worker-04 (10.0.3.88)',
      surface: 'Docker Engine API Socket',
      detectedAt: '2026-09-08 09:12:15',
      status: 'OPEN',
      evidence: `process.cwd points to /sys/fs/cgroup/devices container mount.
Unclosed file descriptor /proc/self/fd/7 leaks host root filesystem path.`,
      remediation: 'Update runc binary to 1.1.12+ and restrict docker socket permissions.',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-21626']
    },
    {
      cve: 'CVE-2023-38606',
      cvss: 7.5,
      severity: 'HIGH',
      title: 'PostgreSQL Unauthenticated Remote Memory Leak',
      asset: 'srv-prod-db-01 (10.0.4.15)',
      surface: 'Port 5432/TCP - PostgreSQL Listener',
      detectedAt: '2026-09-07 22:30:00',
      status: 'OPEN',
      evidence: `SELECT * FROM pg_stat_activity triggered heap memory disclosure under high load.`,
      remediation: 'Restrict PostgreSQL port 5432 access exclusively to app microservice IP subnet 10.0.2.0/24.',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-38606']
    },
    {
      cve: 'CVE-2024-1086',
      cvss: 6.8,
      severity: 'MEDIUM',
      title: 'Linux Kernel netfilter Use-After-Free Privilege Escalation',
      asset: 'srv-prod-auth-01 (10.0.2.10)',
      surface: 'Local Kernel Netfilter Module',
      detectedAt: '2026-09-06 11:45:10',
      status: 'MITIGATED',
      evidence: `nft_verdict_init mishandles NF_DROP verdicts leading to double free.`,
      remediation: 'Kernel patch 6.6.21 applied. Reboot required.',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-1086']
    }
  ];

  const filtered = vulnerabilities.filter(v => {
    const matchesFilter = filter === 'ALL' || v.severity === filter;
    const matchesSearch = v.cve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.asset.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (cve) => {
    navigator.clipboard.writeText(cve);
    setCopiedId(cve);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1420' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>Enterprise Vulnerability Management</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automated CVE catalog, attack surface detection & threat mitigation tracking
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="card" style={{ padding: '8px 16px', textAlign: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>1</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Critical CVE</div>
          </div>
          <div className="card" style={{ padding: '8px 16px', textAlign: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fb923c' }}>3</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>High CVE</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`btn btn-sm ${filter === sev ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'monospace' }}
            >
              {sev}
            </button>
          ))}
        </div>

        <div style={{ width: '280px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search CVE ID, title, or asset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Vulnerability Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(item => (
          <div key={item.cve} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: item.severity === 'CRITICAL' ? '4px solid #f87171' : item.severity === 'HIGH' ? '4px solid #fb923c' : '4px solid #fbbf24' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan-bright)' }}>
                    {item.cve}
                  </span>
                  <button
                    onClick={() => handleCopy(item.cve)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Copy CVE ID"
                  >
                    {copiedId === item.cve ? <CheckCircle size={14} color="#34d399" /> : <Copy size={14} />}
                  </button>
                  <span className={`sev-badge ${item.severity === 'CRITICAL' ? 'sev-critical' : item.severity === 'HIGH' ? 'sev-high' : 'sev-medium'}`}>
                    CVSS {item.cvss} | {item.severity}
                  </span>
                  <span style={{ fontSize: '0.725rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: item.status === 'OPEN' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(52, 211, 153, 0.12)', color: item.status === 'OPEN' ? '#f87171' : '#34d399', fontFamily: 'monospace' }}>
                    {item.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFF' }}>{item.title}</h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Affected Asset</div>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                  {item.asset}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.825rem', backgroundColor: '#0b0e17', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Attack Surface: </span>
                <span className="font-mono" style={{ color: '#FFF' }}>{item.surface}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-muted)' }}>Detected: </span>
                <span className="font-mono" style={{ color: '#FFF' }}>{item.detectedAt}</span>
              </div>
            </div>

            {/* Evidence Block */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Technical Evidence Snippet
              </div>
              <pre className="font-mono" style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: '#07090e', border: '1px solid rgba(255,255,255,0.08)', color: '#34d399', fontSize: '0.775rem', overflowX: 'auto' }}>
                {item.evidence}
              </pre>
            </div>

            {/* Remediation Guidance */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', backgroundColor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '6px', fontSize: '0.825rem' }}>
              <Shield size={16} color="var(--accent-cyan-bright)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--accent-cyan-bright)' }}>Remediation Action: </strong>
                <span style={{ color: 'var(--text-primary)' }}>{item.remediation}</span>
              </div>
            </div>

            {/* Footer Reference Links */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {item.references.map((ref, i) => (
                  <a key={i} href={ref} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>NVD Ref #{i+1}</span>
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm">
                  <Terminal size={12} /> Run Patch Test
                </button>
                <button className="btn btn-primary btn-sm">
                  <ShieldAlert size={12} /> Create Triage Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
