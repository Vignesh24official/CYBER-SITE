import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Globe,
  Radio,
  FileSearch,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Download,
  Share2,
  ExternalLink,
  Lock,
  Zap,
} from 'lucide-react';

export const HackingSoftwareHub = ({ complaint, onExportToNote, onSendToChat }) => {
  const [activeTool, setActiveTool] = useState('nmap');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);

  // Nmap tool state
  const cleanUrl = complaint?.suspiciousUrl
    ? complaint.suspiciousUrl.replace(/^https?:\/\//i, '').split('/')[0]
    : 'target-suspicious-host.net';
  const [targetHost, setTargetHost] = useState(cleanUrl);
  const [scanProfile, setScanProfile] = useState('vuln');

  // Evidence tool state
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  // OSINT tool state
  const [osintTarget, setOsintTarget] = useState(complaint?.attackerInformation || 'scammer_upi_id@bank');

  const runSimulatedScan = () => {
    setScanning(true);
    setScanProgress(15);
    setScanCompleted(false);

    setTimeout(() => setScanProgress(45), 400);
    setTimeout(() => setScanProgress(75), 800);
    setTimeout(() => {
      setScanProgress(100);
      setScanning(false);
      setScanCompleted(true);
    }, 1200);
  };

  const handleExportFinding = (title, finding, actionTaken, recommendation) => {
    if (onExportToNote) {
      onExportToNote({
        note: `[HACKING SOFTWARE HUB - ${title.toUpperCase()}]\nTarget: ${targetHost}\n\n${finding}`,
        finding: finding,
        actionTaken: actionTaken,
        recommendation: recommendation,
      });
    }
  };

  const handleShareToChat = (title, payload) => {
    if (onSendToChat) {
      onSendToChat({
        name: `${title.toLowerCase().replace(/\s+/g, '_')}_report.txt`,
        data: payload,
      });
    }
  };

  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card, #111827)',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Software Hub Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, rgba(168,85,247,0.12) 0%, rgba(6,182,212,0.08) 100%)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid #c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF' }}>
                Cyber Forensic & Ethical Hacking Tool Suite
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(168,85,247,0.2)',
                  color: '#d8b4fe',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                SOC HUB v3.2
              </span>
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Assessing attack vectors, observables, and telemetry for Case {complaint?.complaintNumber}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={runSimulatedScan}
          disabled={scanning}
          className="btn btn-cyan"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <Zap size={15} /> {scanning ? `Assessing Target (${scanProgress}%)...` : 'Execute Tool Scan'}
        </button>
      </div>

      {/* Tool Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(15,23,42,0.7)',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'nmap', label: 'Nmap Port Recon', icon: Radio },
          { id: 'whois', label: 'Whois & Geo-IP Tracer', icon: Globe },
          { id: 'phishing', label: 'Phishing URL Engine', icon: ShieldAlert },
          { id: 'hash', label: 'Evidence Hash & Malware Scanner', icon: FileSearch },
          { id: 'wireshark', label: 'Wireshark Packet Stream', icon: Layers },
          { id: 'osint', label: 'Attacker OSINT & Financial Trail', icon: Search },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                setActiveTool(tool.id);
                setScanCompleted(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: isActive ? 'rgba(6,182,212,0.12)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: isActive ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tool.label}
            </button>
          );
        })}
      </div>

      {/* Tool Content Body */}
      <div style={{ padding: '24px' }}>
        {/* TOOL 1: NMAP PORT & VULNERABILITY RECON */}
        {activeTool === 'nmap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Target Host / IP Observable
                </label>
                <input
                  type="text"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  placeholder="e.g. suspicious-bank-login.xyz"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Nmap Recon Profile
                </label>
                <select
                  value={scanProfile}
                  onChange={(e) => setScanProfile(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="vuln">Comprehensive CVE Vulnerability & Service Banner Scan (-sV -sC -Pn)</option>
                  <option value="quick">Fast Top 100 Port Discovery (-F)</option>
                  <option value="full">Intense Stealth Port Audit (-p- -T4)</option>
                </select>
              </div>
            </div>

            {/* Scan Output Card */}
            <div style={{ background: '#070b12', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={16} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>
                    Nmap Scan Results: {targetHost} (Resolved IP: 198.51.100.42)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() =>
                      handleExportFinding(
                        'Nmap Port Recon',
                        `Confirmed open ports on ${targetHost} (198.51.100.42): Port 21 (vsftpd backdoor), Port 80/443 (Phishing reverse proxy), Port 8080 (Credential Harvester C2).`,
                        'Executed Nmap service fingerprinting; confirmed active phishing infrastructure hosted on offshore bulletproof server.',
                        'Dispatch immediate abuse notice to upstream hosting provider and block domain on national cyber firewall.'
                      )
                    }
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <FileCode size={13} /> Export to Finding
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleShareToChat(
                        'Nmap_Port_Scan',
                        `NMAP SCAN REPORT FOR ${targetHost} (198.51.100.42)\n21/tcp   OPEN  ftp   vsftpd 2.3.4 (BACKDOOR VULNERABLE)\n80/tcp   OPEN  http  nginx/1.18.0 (Phishing proxy)\n443/tcp  OPEN  https Let's Encrypt (CN mismatch)\n8080/tcp OPEN  http-proxy Trojan C2 Panel\nRisk Index: 96/100 CRITICAL`
                      )
                    }
                    className="btn btn-cyan btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Share2 size={13} /> Send to Chat
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { port: '21/TCP', service: 'FTP (vsftpd 2.3.4)', status: 'VULNERABLE', risk: 'HIGH', desc: 'Backdoor command execution flaw' },
                  { port: '80/TCP', service: 'HTTP (nginx 1.18)', status: 'ACTIVE', risk: 'HIGH', desc: 'Phishing reverse proxy harvester' },
                  { port: '443/TCP', service: 'HTTPS (SSL/TLS)', status: 'ACTIVE', risk: 'MEDIUM', desc: 'SSL certificate host mismatch' },
                  { port: '8080/TCP', service: 'HTTP-Alt (Trojan C2)', status: 'MALICIOUS', risk: 'CRITICAL', desc: 'C2 Command & Control panel' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: item.risk === 'CRITICAL' || item.risk === 'HIGH' ? '3px solid #ef4444' : '3px solid #f59e0b',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{item.port}</strong>
                      <span
                        style={{
                          fontSize: '0.675rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: item.risk === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: item.risk === 'CRITICAL' ? '#f87171' : '#fbbf24',
                          fontWeight: 700,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginTop: '4px' }}>{item.service}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: WHOIS & IP GEO-TRACKER */}
        {activeTool === 'whois' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  WHOIS Registrar & Autonomous System (ASN) Intelligence
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Target Domain: <span style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{targetHost}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() =>
                    handleExportFinding(
                      'WHOIS Recon',
                      `Domain ${targetHost} registered 34 days ago via NameCheap, Inc. using privacy proxy. IP 198.51.100.42 belongs to AS49812 (Offshore Bulletproof Cloud Ltd) located in Reykjavik, Iceland.`,
                      'Contacted registrar abuse desk (abuse@namecheap.com) with statutory complaint dossier.',
                      'Recommend ISP DNS sinkhole and national threat registry blacklisting.'
                    )
                  }
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <FileCode size={13} /> Export to Finding
                </button>
              </div>
            </div>

            <div className="grid-3">
              <div className="card" style={{ padding: '16px', background: '#0a0f1d' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registrar</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginTop: '4px' }}>NameCheap, Inc.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>IANA ID: 1068</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>abuse@namecheap.com</div>
              </div>

              <div className="card" style={{ padding: '16px', background: '#0a0f1d' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Domain Age</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171', marginTop: '4px' }}>34 Days (High Risk)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Registered: 2026-08-14</div>
                <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>Newly Created Domain Flag</div>
              </div>

              <div className="card" style={{ padding: '16px', background: '#0a0f1d' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hosting Datacenter</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginTop: '4px' }}>AS49812 Offshore Cloud</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Reykjavik, Iceland (IS)</div>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>Bulletproof Hosting Provider</div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: PHISHING HEURISTIC ENGINE */}
        {activeTool === 'phishing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  Phishing & Homograph URL Threat Analysis
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Evaluates SSL encryption, entropy, domain impersonation, and harvest forms.
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleExportFinding(
                    'Phishing URL Engine',
                    `Target URL evaluated with Phishing Risk Score 96/100 (CRITICAL). Detected Punycode Cyrillic homograph impersonating legitimate bank domain. Form fields actively harvest debit card numbers and OTPs.`,
                    'Documented fake login interface screenshots and submitted domain for browser-level phishing warnings (Google Safe Browsing & Microsoft SmartScreen).',
                    'Advise victim to verify banking credentials were not reused on any other service.'
                  )
                }
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                <FileCode size={13} /> Export to Finding
              </button>
            </div>

            <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} /> Phishing Threat Score: 96 / 100 (CRITICAL MALICIOUS)
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#fca5a5' }}>CATEGORY: CREDENTIAL HARVESTER</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0 }}>
                This URL mimics official banking portals using deceptive visual elements. The login form transmits entered credentials over plain unencrypted proxy backchannel.
              </p>
            </div>
          </div>
        )}

        {/* TOOL 4: EVIDENCE FILE HASH & MALWARE SCANNER */}
        {activeTool === 'hash' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  Cryptographic Integrity & VirusTotal Threat Signature Engine
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Verify evidence file SHA-256 hashes and cross-reference known threat repositories.
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleExportFinding(
                    'Evidence File Hash Scan',
                    `Evidence artifact verified with SHA-256 integrity match. Signature scan matched known Trojan.GenericKD / Android RAT APK installer embedded in receipt document.`,
                    'Evidence file quarantined and forensic signature logged in chain-of-custody vault.',
                    'Advise victim to perform malware scan on phone/PC and uninstall any remote support tools (AnyDesk, TeamViewer).'
                  )
                }
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                <FileCode size={13} /> Export to Finding
              </button>
            </div>

            {complaint?.evidenceFiles?.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                No evidence files uploaded by citizen for this case.
              </div>
            ) : (
              complaint?.evidenceFiles?.map((file, idx) => (
                <div key={file.id} style={{ padding: '16px', background: '#0a0f1d', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>{file.originalFilename}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '4px' }}>
                        SHA-256: <code style={{ color: 'var(--accent-cyan)' }}>{file.checksum}</code>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Size: {(file.fileSize / 1024).toFixed(1)} KB | MIME: {file.mimeType}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid #10b981', fontWeight: 700 }}>
                        INTEGRITY VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TOOL 5: WIRESHARK PACKET STREAM */}
        {activeTool === 'wireshark' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  Simulated PCAP Network Traffic Stream (Wireshark / TCPDump)
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Inspecting live TCP conversation between victim host and attacker C2 endpoint.
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleExportFinding(
                    'Network Packet Analysis',
                    `Captured 5 packets demonstrating HTTP POST credential exfiltration to offshore C2 (198.51.100.42). Decoded payload confirmed transmission of victim netbanking session cookies and authorization token.`,
                    'Isolated packet payload and preserved PCAP forensic trace for law enforcement escalation.',
                    'Request victim immediately invalidate netbanking sessions and reset profile password.'
                  )
                }
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                <FileCode size={13} /> Export to Finding
              </button>
            </div>

            <div style={{ background: '#050811', border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 100px 140px 140px 80px 1fr', padding: '8px 12px', background: '#0f172a', fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                <span>No.</span>
                <span>Time</span>
                <span>Source</span>
                <span>Destination</span>
                <span>Protocol</span>
                <span>Info</span>
              </div>

              {[
                { no: 1, time: '0.000000', src: '192.168.1.84', dst: '8.8.8.8', proto: 'DNS', info: `Standard query 0x1842 A ${targetHost}` },
                { no: 2, time: '0.024182', src: '8.8.8.8', dst: '192.168.1.84', proto: 'DNS', info: `Standard query response A 198.51.100.42` },
                { no: 3, time: '0.048912', src: '192.168.1.84', dst: '198.51.100.42', proto: 'TCP', info: '49210 -> 443 [SYN] Seq=0 Win=64240 Len=0' },
                { no: 4, time: '0.089201', src: '198.51.100.42', dst: '192.168.1.84', proto: 'TCP', info: '443 -> 49210 [SYN, ACK] Seq=0 Ack=1 Win=65160' },
                { no: 5, time: '0.124580', src: '192.168.1.84', dst: '198.51.100.42', proto: 'HTTP', info: 'POST /harvest-credentials HTTP/1.1 (Payload: Exfiltrated VPA Token)' },
              ].map((pkt) => (
                <div
                  key={pkt.no}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 100px 140px 140px 80px 1fr',
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: pkt.proto === 'HTTP' ? '#f87171' : pkt.proto === 'DNS' ? '#38bdf8' : '#e2e8f0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: pkt.proto === 'HTTP' ? 'rgba(239,68,68,0.06)' : 'transparent',
                  }}
                >
                  <span>{pkt.no}</span>
                  <span>{pkt.time}</span>
                  <span>{pkt.src}</span>
                  <span>{pkt.dst}</span>
                  <span style={{ fontWeight: 700 }}>{pkt.proto}</span>
                  <span>{pkt.info}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOL 6: ATTACKER OSINT & FINANCIAL TRAIL */}
        {activeTool === 'osint' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  Attacker Identity & Financial Money Mule Trail Tracer
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Trace suspect phone numbers, UPI VPAs, banking nodal IFSC, or crypto wallets.
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleExportFinding(
                    'Financial Mule & OSINT Trace',
                    `Target payment handle (${osintTarget}) mapped to designated payment aggregator nodal gateway. Recipient account opened in suburban branch and identified in 4 prior cyber fraud cases. Account flagged for mule activity.`,
                    'Dispatched statutory urgent lien / freeze notice to designated nodal officer under Cyber Crime Triage protocol.',
                    'Advise victim to submit official FIR copy to their home branch for chargeback processing.'
                  )
                }
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                <FileCode size={13} /> Export to Finding
              </button>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Attacker Observable (UPI / Bank Account / Phone / Handle)
                </label>
                <input
                  type="text"
                  value={osintTarget}
                  onChange={(e) => setOsintTarget(e.target.value)}
                  placeholder="Enter UPI VPA, account number, or attacker phone..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={runSimulatedScan}
                  className="btn btn-cyan"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Search size={15} /> Trace Financial Trail & Nodal Bank
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '18px', background: '#0a0f1d' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>
                Money Mule Network Correlation Findings
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <div>
                  <strong>Identified Routing Gateway:</strong> <span style={{ color: 'var(--accent-cyan)' }}>National Payment Gateway (UPI Switch)</span>
                </div>
                <div>
                  <strong>Associated Fraud Incidents:</strong> <span style={{ color: '#f87171', fontWeight: 700 }}>4 Complaints Linked in Regional SOC Grid</span>
                </div>
                <div>
                  <strong>Account Risk Assessment:</strong> <span style={{ color: '#f87171', fontWeight: 700 }}>SUSPECTED MONEY MULE INTERMEDIARY</span>
                </div>
                <div>
                  <strong>Nodal Action Available:</strong> Immediate Statutory Freeze Request (Section 91 CrPC / IT Act 2000)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
