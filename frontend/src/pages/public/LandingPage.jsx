import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Users, 
  Activity, 
  Server, 
  Database,
  Key,
  Eye,
  Zap,
  Globe,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight,
  Terminal,
  Cpu,
  Fingerprint,
  FileCheck,
  AlertCircle,
  Sparkles,
  Share2,
  HardDrive,
  Crosshair,
  Wifi,
  Flame,
  RotateCw
} from 'lucide-react';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { CyberMatrixCanvas } from '../../components/common/CyberMatrixCanvas';
import { CyberHoloShield } from '../../components/common/CyberHoloShield';
import { CyberTextDecoder } from '../../components/common/CyberTextDecoder';
import { CyberThreatGlobe } from '../../components/common/CyberThreatGlobe';
import { HoloTiltCard } from '../../components/common/HoloTiltCard';
import { CyberTerminalWidget } from '../../components/common/CyberTerminalWidget';
import { cyberAudio } from '../../services/cyberAudio';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('globe'); // 'globe', 'radar', 'stream', 'crypto'
  const [vectorFilter, setVectorFilter] = useState('all');
  const [lifecycleStep, setLifecycleStep] = useState(1);

  const handleLaunchRole = async (email, targetPath) => {
    cyberAudio.playClick();
    try {
      await login({ email, password: 'Password@123' });
      navigate(targetPath);
    } catch (err) {
      navigate('/login');
    }
  };
  
  // Interactive Live Attack Simulation Mode State
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const triggerAttackSimulation = () => {
    if (isSimulatingAttack) return;
    setIsSimulatingAttack(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 700);
    setTimeout(() => setSimStep(3), 1500);
    setTimeout(() => setSimStep(4), 2400);
    setTimeout(() => {
      setSimStep(5);
      setTimeout(() => {
        setIsSimulatingAttack(false);
        setSimStep(0);
      }, 2000);
    }, 3200);
  };
  
  // Interactive Scanner State
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Live Decryptor Ticker Text
  const [decryptText, setDecryptText] = useState('0x8F9B24... DECRYPTING');
  useEffect(() => {
    const hexCodes = [
      '0x8F9B24 [AUTH_OK]', 
      '0xE4A109 [SEALED]', 
      '0x33F89C [AUDIT_PASS]', 
      '0xCC012A [ZERO_TRUST]', 
      '0x77B04D [ENCRYPTED]',
      '0xA109FF [AES-GCM-256]'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % hexCodes.length;
      setDecryptText(hexCodes[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Live Stats
  const [stats, setStats] = useState({
    totalComplaints: 2840,
    activeInvestigations: 24,
    resolvedCount: 2682,
    threatCategories: 12,
  });

  useEffect(() => {
    fetch('/api/v1/admin/reports/summary')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Public endpoint fallback');
      })
      .then((data) => {
        if (data && data.data) {
          setStats({
            totalComplaints: data.data.totalComplaints || 2840,
            activeInvestigations: data.data.investigatingComplaints || 24,
            resolvedCount: data.data.resolvedComplaints || 2682,
            threatCategories: 12,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Quick scanner simulation
  const handleScan = (e) => {
    e?.preventDefault();
    if (!scanInput.trim()) return;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const input = scanInput.toLowerCase();
      const isMalicious = input.includes('pay') || input.includes('bank') || input.includes('verify') || input.includes('update') || input.includes('.xyz') || input.includes('.online');
      
      setScanResult({
        indicator: scanInput,
        score: isMalicious ? 94 : 14,
        verdict: isMalicious ? 'CRITICAL THREAT DETECTED' : 'LOW RISK / UNFLAGGED',
        category: isMalicious ? 'Credential Phishing & Impersonation' : 'Standard Web Host',
        flags: isMalicious ? [
          'Domain registered < 7 days ago',
          'Punycode / Typosquatting vector match',
          'Heuristic form detects password interception',
          'Flagged in CyberShield Global Threat Blacklist'
        ] : [
          'Valid TLS certificate detected',
          'No malicious heuristics identified',
          'Clean historical telemetry record'
        ],
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      });
    }, 900);
  };

  const threatVectors = [
    { 
      id: 'phishing',
      category: 'social',
      title: 'Phishing & Impersonation', 
      icon: Globe, 
      desc: 'Deceptive spear-phishing links, credential harvesting portals, spoofed executive domains, and brand forgery.',
      severity: 'CRITICAL',
      sla: '< 15 mins',
      color: '#00f2fe'
    },
    { 
      id: 'fraud',
      category: 'financial',
      title: 'Online & Financial Fraud', 
      icon: Zap, 
      desc: 'Manipulated UPI QR code traps, unauthorized credit card charges, fake escrow stores, and digital wallet drains.',
      severity: 'CRITICAL',
      sla: '< 20 mins',
      color: '#f59e0b'
    },
    { 
      id: 'links',
      category: 'social',
      title: 'Malicious URLs & Shortlinks', 
      icon: Search, 
      desc: 'Obfuscated redirect chains, weaponized shortlinks, unencrypted gateways, and punycode domain spoofing.',
      severity: 'HIGH',
      sla: '< 30 mins',
      color: '#38bdf8'
    },
    { 
      id: 'compromise',
      category: 'identity',
      title: 'Account Takeover (ATO)', 
      icon: Lock, 
      desc: 'Credential stuffing bursts, brute-force breaches, session hijacking, and unauthorized multi-factor bypass.',
      severity: 'HIGH',
      sla: '< 45 mins',
      color: '#f43f5e'
    },
    { 
      id: 'identity',
      category: 'identity',
      title: 'Identity Theft & Doxxing', 
      icon: Users, 
      desc: 'Stolen government ID documents, fraudulent financial loan applications, and fabricated online persona profiling.',
      severity: 'HIGH',
      sla: '< 1 hr',
      color: '#a855f7'
    },
    { 
      id: 'malware',
      category: 'malware',
      title: 'Ransomware & Trojans', 
      icon: Server, 
      desc: 'Encrypted drive extortion payloads, backdoor persistence binaries, command-and-control (C2) bot communication.',
      severity: 'CRITICAL',
      sla: '< 10 mins',
      color: '#ef4444'
    },
    { 
      id: 'engineering',
      category: 'social',
      title: 'Social Engineering & Vishing', 
      icon: Radio, 
      desc: 'AI voice cloning scams, urgent coercion phone calls, IT support pretexting, and executive spoofing threats.',
      severity: 'ELEVATED',
      sla: '< 1.5 hrs',
      color: '#3b82f6'
    },
    { 
      id: 'intrusion',
      category: 'malware',
      title: 'Unauthorized Network Intrusion', 
      icon: Key, 
      desc: 'Lateral network pivoting, SMB exploits, unauthenticated API gateways, and privilege escalation vectors.',
      severity: 'CRITICAL',
      sla: '< 15 mins',
      color: '#f97316'
    },
    { 
      id: 'harassment',
      category: 'social',
      title: 'Cyber Stalking & Extortion', 
      icon: AlertTriangle, 
      desc: 'Targeted persistent digital intimidation, sextortion blackmail threats, and defamatory data dissemination.',
      severity: 'HIGH',
      sla: '< 45 mins',
      color: '#fb7185'
    },
    { 
      id: 'breach',
      category: 'malware',
      title: 'Corporate Data Exfiltration', 
      icon: Database, 
      desc: 'Publicly exposed S3 buckets, SQL database dump leaks, PII customer records for sale on dark web brokers.',
      severity: 'CRITICAL',
      sla: '< 15 mins',
      color: '#ec4899'
    },
    { 
      id: 'upi',
      category: 'financial',
      title: 'Banking & UPI Payment Hijack', 
      icon: Activity, 
      desc: 'Instant payment reversal fraud, forged banking receipts, malicious remote desktop utilities (AnyDesk/TeamViewer).',
      severity: 'CRITICAL',
      sla: '< 15 mins',
      color: '#10b981'
    },
    { 
      id: 'zeroday',
      category: 'malware',
      title: 'Zero-Day Vulnerability Exploits', 
      icon: ShieldCheck, 
      desc: 'Unpatched software zero-day CVE execution, memory corruption bugs, and advanced persistent threat (APT) attacks.',
      severity: 'CRITICAL',
      sla: '< 10 mins',
      color: '#00f2fe'
    },
  ];

  const filteredVectors = vectorFilter === 'all' 
    ? threatVectors 
    : threatVectors.filter(v => v.category === vectorFilter);

  const lifecycleStages = [
    {
      step: 1,
      badge: 'STAGE 01',
      title: 'Citizen Incident Intake',
      subtitle: 'Structured 5-Stage Guided Wizard',
      desc: 'Victims or security officers report incidents with automated attacker metadata tagging, suspect handles, financial loss metrics, and evidence attachment.',
      features: ['Automatic client IP & timestamp stamping', 'Multi-file evidence upload', 'SHA-256 cryptographic file hashing', 'Instant tracking ticket ID generation'],
      codePreview: {
        ticketId: 'CS-2026-9842',
        status: 'SUBMITTED',
        sha256Checksum: '9f83a2184e9c71b3e83921f...',
        payloadIntegrity: 'VERIFIED_IMMUTABLE'
      }
    },
    {
      step: 2,
      badge: 'STAGE 02',
      title: 'Automated Heuristic Triage',
      subtitle: 'Severity Classification & SLA Clock',
      desc: 'CyberShield heuristics analyze threat indicators against known attack vectors, calculate risk scores, and activate priority SLA clocks.',
      features: ['Heuristic threat categorization', 'Automated severity calculation (CRITICAL to LOW)', 'Duplicate incident clustering', 'Real-time alert dispatch to on-call SOC'],
      codePreview: {
        heuristicScore: 96,
        threatVector: 'PHISHING_CREDENTIAL_HARVEST',
        slaTarget: '15_MINUTES',
        clusterMatch: 'CAMPAIGN_ID_883'
      }
    },
    {
      step: 3,
      badge: 'STAGE 03',
      title: 'Investigator Workbench',
      subtitle: 'Forensic Review & Evidence Sealed',
      desc: 'Certified cyber investigators and coordinators analyze digital evidence, inspect IP telemetry, log investigation findings, and coordinate take-downs.',
      features: ['Dedicated Investigation Console', 'Cryptographic evidence chain of custody', 'Secure investigator private notes', 'Status escalation & assignment workflow'],
      codePreview: {
        investigator: 'Agent Sarah Jenkins (L3)',
        forensicAction: 'DOMAIN_QUARANTINE_INITIATED',
        evidenceCount: 3,
        evidenceStatus: 'COURT_ADMISSIBLE'
      }
    },
    {
      step: 4,
      badge: 'STAGE 04',
      title: 'Remediation & Immutable Audit',
      subtitle: 'Resolution Notice & Closed Loop',
      desc: 'Incident resolution findings are archived with full cryptographic audit logs. Reporter receives real-time updates and advisory guidance.',
      features: ['Immutable audit trail recorded in database', 'Real-time victim status notifications', 'Safety Center prevention advice', 'Threat intelligence indicator sharing'],
      codePreview: {
        finalStatus: 'RESOLVED',
        resolutionNotes: 'C2 Domain blocked via upstream registrar. Assets recovered.',
        auditRecordId: 'AUD-99124-ENCRYPTED',
        caseClosedTime: '2026-09-27T19:54:12Z'
      }
    }
  ];

  const currentStage = lifecycleStages.find(s => s.step === lifecycleStep) || lifecycleStages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '90px', paddingBottom: '90px', color: 'var(--text-primary)' }}>
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: NEXT-GEN CYBER COCKPIT WITH 3D GLOBE, LASERS, SCRAMBLER  */}
      {/* ========================================================================= */}
      <section
        id="platform"
        style={{
          position: 'relative',
          padding: '80px 24px 90px',
          overflow: 'hidden',
          background: isSimulatingAttack 
            ? 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(244, 63, 94, 0.22) 0%, rgba(14, 5, 10, 0.98) 75%)'
            : 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(0, 242, 254, 0.16) 0%, rgba(4, 7, 17, 0.98) 75%)',
          borderBottom: isSimulatingAttack ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(56, 189, 248, 0.15)',
          transition: 'background 0.5s ease, border-color 0.5s ease',
        }}
      >
        {/* INTERACTIVE 60FPS CYBER MATRIX CANVAS BACKGROUND */}
        <CyberMatrixCanvas opacity={0.65} />

        {/* CONTINUOUS MOVING CYBER LASER SCANNER BEAM */}
        <div className="cyber-laser-beam" />

        {/* Ambient Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />

        <div 
          style={{ 
            position: 'relative', 
            zIndex: 3, 
            maxWidth: '1280px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            alignItems: 'center',
            gap: '48px',
          }}
        >
          {/* Left Column: Bold Value Proposition with Hacker Text Decryptor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div 
                className="shimmer-badge cyber-floating-1"
                style={{ 
                  marginBottom: '16px',
                  backgroundColor: isSimulatingAttack ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 242, 254, 0.08)',
                  borderColor: isSimulatingAttack ? 'rgba(244, 63, 94, 0.5)' : 'rgba(0, 242, 254, 0.25)',
                  color: isSimulatingAttack ? '#fb7185' : 'var(--accent-cyan-bright)',
                }}
              >
                <Sparkles size={14} color={isSimulatingAttack ? '#fb7185' : '#00f2fe'} />
                <span>
                  <CyberTextDecoder text={isSimulatingAttack ? "DEFCON 1: ACTIVE ATTACK MITIGATION SIMULATION" : "AUTONOMOUS CYBER DEFENSE & TRIAGE 2.0"} />
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-0.035em',
                  fontFamily: 'var(--font-heading)',
                  color: '#ffffff',
                  marginBottom: '20px',
                }}
              >
                <CyberTextDecoder text="Defend. Report." /> <br />
                <span 
                  className="shimmer-text"
                  style={{ 
                    background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 50%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 35px rgba(0, 242, 254, 0.35)'
                  }}
                >
                  <CyberTextDecoder text="Investigate." />
                </span>{' '}
                <CyberTextDecoder text="Secure." />
              </h1>

              <p
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: '560px',
                }}
              >
                Enterprise cybersecurity incident reporting and threat management platform. Connects citizens, enterprise victims, and certified SOC investigators through an automated triage pipeline backed by SHA-256 evidence hashing and zero-trust audit verification.
              </p>
            </div>

            {/* Action Buttons & Unexpected Attack Simulator Trigger */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/report"
                className="btn btn-primary btn-lg"
                style={{
                  gap: '10px',
                  boxShadow: '0 0 30px rgba(0, 242, 254, 0.45)',
                }}
              >
                <AlertTriangle size={18} /> Report a Cyber Threat
              </Link>

              <button
                type="button"
                onClick={triggerAttackSimulation}
                disabled={isSimulatingAttack}
                className="btn btn-secondary btn-lg"
                style={{
                  gap: '10px',
                  backgroundColor: isSimulatingAttack ? 'rgba(244, 63, 94, 0.2)' : 'rgba(13, 22, 42, 0.7)',
                  borderColor: isSimulatingAttack ? 'rgba(244, 63, 94, 0.6)' : 'rgba(56, 189, 248, 0.2)',
                  color: isSimulatingAttack ? '#fb7185' : '#ffffff',
                  boxShadow: isSimulatingAttack ? '0 0 25px rgba(244, 63, 94, 0.4)' : 'none',
                }}
              >
                <Flame size={18} color={isSimulatingAttack ? '#fb7185' : '#f59e0b'} />
                <span>{isSimulatingAttack ? 'Simulation Active...' : 'Simulate Live Attack'}</span>
              </button>

              <Link
                to="/safety"
                className="btn btn-ghost"
                style={{ gap: '8px', fontSize: '0.95rem' }}
              >
                <ShieldCheck size={18} color="#34d399" /> Safety Hub <ChevronRight size={16} />
              </Link>
            </div>

            {/* 3 COMMAND WORKSPACES DIRECT ACCESS */}
            <div
              style={{
                backgroundColor: 'rgba(7, 13, 28, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.22)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginTop: '6px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={12} color="var(--accent-cyan)" />
                  <span>1-Click Launch: 3 Command Consoles</span>
                </span>
                <span style={{ fontSize: '0.64rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>Password: Password@123</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleLaunchRole('admin@cybershield.org', '/admin')}
                  className="card-interactive"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                  title="Launch SOC Admin Console"
                >
                  <Shield size={16} color="#f87171" />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>1. Admin Console</div>
                    <div style={{ fontSize: '0.64rem', color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>admin@cybershield.org</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchRole('investigator@cybershield.org', '/coordinator')}
                  className="card-interactive"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                  title="Launch Coordinator Workbench"
                >
                  <Terminal size={16} color="#fbbf24" />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>2. Coordinator</div>
                    <div style={{ fontSize: '0.64rem', color: '#fcd34d', fontFamily: 'var(--font-mono)' }}>investigator@cybershield.org</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchRole('user@cybershield.org', '/dashboard')}
                  className="card-interactive"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                  title="Launch Citizen Defense Workspace"
                >
                  <Users size={16} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>3. Citizen Workspace</div>
                    <div style={{ fontSize: '0.64rem', color: '#7dd3fc', fontFamily: 'var(--font-mono)' }}>user@cybershield.org</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Lock size={15} color="var(--accent-cyan)" />
                <span>SHA-256 Vault</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Clock size={15} color="#34d399" />
                <span>&lt; 20m Response SLA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Key size={15} color="#fbbf24" />
                <span>Zero-Trust RBAC</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Activity size={15} color="#a855f7" />
                <span>Live SOC Triage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Cyber SOC Cockpit Preview */}
          <div className="cyber-hud-container" style={{ position: 'relative' }}>
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />
            <div
              id="cockpit"
              className="cyber-border-beam"
              style={{
                background: 'rgba(9, 15, 30, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              border: isSimulatingAttack ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: isSimulatingAttack 
                ? '0 20px 60px -10px rgba(0, 0, 0, 0.9), 0 0 45px rgba(244, 63, 94, 0.35)'
                : '0 20px 60px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 242, 254, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            {/* Simulation Emergency Banner if Active */}
            {isSimulatingAttack && (
              <div
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid rgba(244, 63, 94, 0.5)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#fb7185',
                  animation: 'pulse-glow-red 1s infinite',
                }}
              >
                <span>⚠️ [INTRUSION SIMULATION ACTIVE]</span>
                <span>
                  {simStep === 1 && 'DDoS Volumetric Influx Inbound...'}
                  {simStep === 2 && 'Zero-Day Exploit Isolated'}
                  {simStep === 3 && 'Cryptographic Checksum Sealed'}
                  {simStep === 4 && 'Forensic Log Stamped'}
                  {simStep === 5 && '✅ 100% THREATS CONTAINED'}
                </span>
              </div>
            )}

            {/* Cockpit Header with Active Node & Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={18} color={isSimulatingAttack ? '#fb7185' : 'var(--accent-cyan)'} />
                <span style={{ fontSize: '0.825rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                  CYBERSHIELD SOC // LIVE TELEMETRY
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`status-dot ${isSimulatingAttack ? 'status-dot-critical' : 'status-dot-active'}`} style={{ width: '6px', height: '6px' }} />
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isSimulatingAttack ? '#fb7185' : '#34d399' }}>
                  {isSimulatingAttack ? 'DEFCON-1 ALERT' : 'NODE-ASIA-LIVE'}
                </span>
              </div>
            </div>

            {/* View Switcher Pills */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(4, 7, 17, 0.8)', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveTab('globe')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: activeTab === 'globe' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: activeTab === 'globe' ? '#00f2fe' : 'var(--text-muted)',
                  border: activeTab === 'globe' ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                3D GLOBE
              </button>
              <button
                onClick={() => setActiveTab('radar')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: activeTab === 'radar' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: activeTab === 'radar' ? '#00f2fe' : 'var(--text-muted)',
                  border: activeTab === 'radar' ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                RADAR SWEEP
              </button>
              <button
                onClick={() => setActiveTab('stream')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: activeTab === 'stream' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: activeTab === 'stream' ? '#00f2fe' : 'var(--text-muted)',
                  border: activeTab === 'stream' ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                LIVE STREAM
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: activeTab === 'crypto' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: activeTab === 'crypto' ? '#00f2fe' : 'var(--text-muted)',
                  border: activeTab === 'crypto' ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                HOLO VAULT
              </button>
            </div>

            {/* TAB CONTENT 0: 3D CYBER THREAT GLOBE */}
            {activeTab === 'globe' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <CyberThreatGlobe size={320} />
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                  <span>TRAJECTORY: <strong style={{ color: 'var(--accent-cyan)' }}>INTERCONTINENTAL</strong></span>
                  <span>LATENCY: <strong style={{ color: '#34d399' }}>18 ms</strong></span>
                  <span>ENCRYPTION: <strong style={{ color: '#fbbf24' }}>TLS 1.3</strong></span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 1: RADAR SWEEP WITH ANIMATED SONAR WAVES & ATTACK TRAJECTORIES */}
            {activeTab === 'radar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    position: 'relative',
                    height: '250px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(5, 9, 20, 0.95)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Concentric Radar Rings */}
                  <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.2)' }} />
                  <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', border: '1px solid rgba(56, 189, 248, 0.25)' }} />
                  <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(0, 242, 254, 0.4)' }} />
                  <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: 'rgba(56, 189, 248, 0.12)' }} />
                  <div style={{ position: 'absolute', height: '100%', width: '1px', backgroundColor: 'rgba(56, 189, 248, 0.12)' }} />

                  {/* Rotating Radar Sweep Line */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '110px',
                      height: '110px',
                      top: '15px',
                      left: 'calc(50% - 110px)',
                      background: 'conic-gradient(from 0deg, rgba(0, 242, 254, 0.45) 0deg, transparent 60deg)',
                      borderRadius: '100% 0 0 0',
                      transformOrigin: 'bottom right',
                      animation: 'radar-sweep-spin 3s linear infinite',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Central Defense Beacon with Pulsing Sonar Ring */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#00f2fe',
                      boxShadow: '0 0 15px #00f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '2px solid #00f2fe',
                        animation: 'sonar-shockwave 2.2s infinite',
                      }}
                    />
                  </div>

                  {/* Threat Blip 1: Ransomware with Expanding Shockwave */}
                  <div
                    title="Critical Ransomware payload blocked"
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: '65px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div style={{ position: 'relative', width: '10px', height: '10px' }}>
                      <span className="status-dot status-dot-critical" style={{ width: '10px', height: '10px' }} />
                      <div
                        style={{
                          position: 'absolute',
                          top: -3,
                          left: -3,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '1.5px solid #fb7185',
                          animation: 'sonar-shockwave 2s infinite',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#fb7185', background: 'rgba(244, 63, 94, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                      Ransomware [192.168.4.12]
                    </span>
                  </div>

                  {/* Threat Blip 2: Phishing */}
                  <div
                    title="Phishing vector detected"
                    style={{
                      position: 'absolute',
                      bottom: '50px',
                      left: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div style={{ position: 'relative', width: '10px', height: '10px' }}>
                      <span className="status-dot status-dot-warning" style={{ width: '10px', height: '10px' }} />
                      <div
                        style={{
                          position: 'absolute',
                          top: -3,
                          left: -3,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '1.5px solid #fbbf24',
                          animation: 'sonar-shockwave 2.4s infinite',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      Phishing Portal [Spoofed SSL]
                    </span>
                  </div>

                  {/* Threat Blip 3: Credential Trap Quarantined */}
                  <div
                    title="Mitigated attack"
                    style={{
                      position: 'absolute',
                      bottom: '36px',
                      right: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div style={{ position: 'relative', width: '10px', height: '10px' }}>
                      <span className="status-dot status-dot-active" style={{ width: '10px', height: '10px' }} />
                      <div
                        style={{
                          position: 'absolute',
                          top: -3,
                          left: -3,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '1.5px solid #34d399',
                          animation: 'sonar-shockwave 2.6s infinite',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      Credential Trap Quarantined
                    </span>
                  </div>
                </div>

                {/* Radar Metrics Footer */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: 'rgba(4, 7, 17, 0.7)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>THREAT INDEX</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>ELEVATED</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(4, 7, 17, 0.7)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SENSORS ACTIVE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>128 / 128</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(4, 7, 17, 0.7)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AVG TRIAGE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>14.2 min</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: LIVE INCIDENTS STREAM */}
            {activeTab === 'stream' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '300px' }}>
                {[
                  {
                    id: 'CS-8924',
                    title: 'UPI Payment Fraud / QR Code Manipulation',
                    time: '2 mins ago',
                    sev: 'sev-critical',
                    sevLabel: 'CRITICAL',
                    status: 'Investigator Assigned',
                    investigator: 'Officer Mehta',
                  },
                  {
                    id: 'CS-8923',
                    title: 'Executive Spear-Phishing Campaign (Spoofed Domain)',
                    time: '14 mins ago',
                    sev: 'sev-high',
                    sevLabel: 'HIGH',
                    status: 'Quarantine Active',
                    investigator: 'Analyst Sarah',
                  },
                  {
                    id: 'CS-8922',
                    title: 'Ransomware Extortion Note Uploaded',
                    time: '28 mins ago',
                    sev: 'sev-critical',
                    sevLabel: 'CRITICAL',
                    status: 'Payload Hashed (SHA-256)',
                    investigator: 'CERT Tier-3',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'rgba(4, 7, 17, 0.75)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan-bright)', fontWeight: 700 }}>
                        {item.id}
                      </span>
                      <span className={`sev-badge ${item.sev}`}>{item.sevLabel}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <span>{item.status} ({item.investigator})</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 3: EVIDENCE CRYPTOGRAPHY WITH HOLOGRAPHIC ROTATING SHIELD */}
            {activeTab === 'crypto' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '300px', alignItems: 'center' }}>
                <CyberHoloShield size={160} />

                <div style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(4, 7, 17, 0.75)', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.25)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    CRYPTOGRAPHIC EVIDENCE SEAL: SHA-256
                  </div>
                  <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', wordBreak: 'break-all', backgroundColor: '#070c18', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </div>
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>STATUS: <strong style={{ color: '#34d399' }}>SEALED_IMMUTABLE</strong></span>
                  <span>CIPHER: <strong style={{ color: 'var(--accent-cyan)' }}>AES-256-GCM</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC LIVE GLOBAL THREAT TICKER WITH MOVING DECRYPTOR CODE STREAM     */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: '#050914',
          borderTop: '1px solid rgba(56, 189, 248, 0.15)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          padding: '12px 0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
            whiteSpace: 'nowrap',
            animation: 'ticker-slide 28s linear infinite',
            width: 'max-content',
          }}
        >
          {[
            `🔐 [DECRYPTOR] ${decryptText}`,
            '🚨 [CRITICAL ALERT] Typosquatted Banking Phishing Domain Blocked: secure-bank-verify.xyz',
            '⚡ [SOC TRIAGE] Incident CS-9821 Triaged in 8.2 mins — Investigator Assigned',
            '🛡️ [HEURISTIC INTEL] 12 New Threat Signatures Synchronized Across Defense Grid',
            '🔐 [EVIDENCE VAULT] SHA-256 Cryptographic Integrity Verified: 0 Tamper Events',
            '🌐 [INCIDENT METRICS] 2,840+ Complaints Managed with 99.4% SLA Compliance',
            `🔐 [DECRYPTOR] ${decryptText}`,
            '🚨 [CRITICAL ALERT] Typosquatted Banking Phishing Domain Blocked: secure-bank-verify.xyz',
            '⚡ [SOC TRIAGE] Incident CS-9821 Triaged in 8.2 mins — Investigator Assigned',
          ].map((text, idx) => (
            <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <span>{text}</span>
              <span style={{ color: 'var(--accent-cyan)' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE QUICK THREAT INDICATOR / URL SCANNER                       */}
      {/* ========================================================================= */}
      <section
        id="scanner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          className="cyber-border-beam"
          style={{
            background: 'linear-gradient(135deg, rgba(9, 15, 30, 0.92) 0%, rgba(5, 9, 20, 0.98) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '16px',
            padding: '36px 32px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 242, 254, 0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Search size={14} /> LIVE THREAT RECONNAISSANCE SCANNER
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>
                <CyberTextDecoder text="Test Suspicious URLs, Domains, or IP Indicators" />
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Heuristic Real-Time Inspection
            </span>
          </div>

          {/* Scanner Input Form */}
          <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Enter suspicious link, domain, or IP (e.g. secure-login-verify.xyz)"
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(4, 7, 17, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#ffffff',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !scanInput.trim()}
              className="btn btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '0.95rem',
                opacity: isScanning || !scanInput.trim() ? 0.6 : 1,
              }}
            >
              {isScanning ? (
                <>
                  <Activity size={18} className="animate-spin" /> Scanning Heuristics...
                </>
              ) : (
                <>
                  <Zap size={18} /> Analyze Indicator
                </>
              )}
            </button>
          </form>

          {/* Quick Click Samples */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Quick test examples:</span>
            {[
              'paypal-security-update.xyz',
              'bank-kyc-verification.online',
              '185.220.101.5'
            ].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => { setScanInput(sample); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: 'var(--accent-cyan-bright)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Scan Results Display */}
          {scanResult && (
            <div
              style={{
                marginTop: '24px',
                padding: '20px',
                backgroundColor: 'rgba(4, 7, 17, 0.95)',
                borderRadius: '12px',
                border: scanResult.score > 50 ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      backgroundColor: scanResult.score > 50 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      border: scanResult.score > 50 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {scanResult.score > 50 ? (
                      <AlertCircle size={22} color="#fb7185" />
                    ) : (
                      <ShieldCheck size={22} color="#34d399" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: scanResult.score > 50 ? '#fb7185' : '#34d399' }}>
                      {scanResult.verdict} (Risk Score: {scanResult.score}/100)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Identified Category: {scanResult.category}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/report?evidence=${encodeURIComponent(scanResult.indicator)}`}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '8px', boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)' }}
                >
                  <AlertTriangle size={14} /> File Formal Incident Report
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '4px' }}>
                {scanResult.flags.map((flag, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: scanResult.score > 50 ? '#fb7185' : '#34d399' }}>•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SUPPORTED THREAT CATEGORIES & SPECTRUM MATRIX (HOLO 3D TILT CARDS)     */}
      {/* ========================================================================= */}
      <section
        id="threat-vectors"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
            THREAT SPECTRUM COVERAGE
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', color: '#ffffff' }}>
            <CyberTextDecoder text="12 Enterprise Cyber Attack Vectors" />
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0', fontSize: '1rem' }}>
            Hover over any vector to inspect 3D holographic telemetry and instant SLA triage protocols.
          </p>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
            {[
              { id: 'all', label: 'All Vectors (12)' },
              { id: 'financial', label: 'Financial & Fraud' },
              { id: 'malware', label: 'Malware & Exploits' },
              { id: 'social', label: 'Phishing & Social' },
              { id: 'identity', label: 'Identity & Access' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setVectorFilter(f.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  backgroundColor: vectorFilter === f.id ? 'rgba(0, 242, 254, 0.16)' : 'rgba(13, 22, 42, 0.7)',
                  color: vectorFilter === f.id ? '#00f2fe' : 'var(--text-secondary)',
                  border: vectorFilter === f.id ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vectors Grid with Holographic 3D Tilt Cards */}
        <div className="grid-3" style={{ gap: '20px' }}>
          {filteredVectors.map((vector) => {
            const IconComp = vector.icon;
            return (
              <HoloTiltCard
                key={vector.id}
                maxTilt={10}
                style={{
                  padding: '24px',
                  backgroundColor: 'rgba(11, 19, 36, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.18)',
                  borderRadius: '12px',
                  gap: '14px',
                  minHeight: '230px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 242, 254, 0.1)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp size={22} color={vector.color} />
                  </div>

                  <span className={`sev-badge ${vector.severity === 'CRITICAL' ? 'sev-critical' : vector.severity === 'HIGH' ? 'sev-high' : 'sev-medium'}`}>
                    {vector.severity}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                    {vector.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {vector.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Target SLA: <strong style={{ color: '#34d399' }}>{vector.sla}</strong>
                  </span>

                  <Link
                    to={`/report?type=${vector.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--accent-cyan-bright)',
                    }}
                  >
                    Report Vector <ChevronRight size={14} />
                  </Link>
                </div>
              </HoloTiltCard>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.5. INTERACTIVE LIVE HACKER TERMINAL & FORENSIC DISPATCH STATION         */}
      {/* ========================================================================= */}
      <section
        id="cli-terminal"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
            INTERACTIVE SHELL INTERFACE
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', color: '#ffffff' }}>
            <CyberTextDecoder text="Tactical SOC Analyst Command Shell" />
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0', fontSize: '1rem' }}>
            Type direct bash commands or click rapid audit triggers below to interactively test threat resolution and crypto validation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
          {/* Left: Interactive Live Terminal Widget */}
          <div className="cyber-hud-container">
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />
            <CyberTerminalWidget />
          </div>

          {/* Right: Real-Time Tactical Forensic Dispatch Station */}
          <div
            className="cyber-border-beam"
            style={{
              backgroundColor: 'rgba(9, 15, 30, 0.88)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
              position: 'relative',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                    TACTICAL DISPATCH STATION
                  </span>
                </div>
                <span className="status-dot status-dot-active" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'rgba(4, 7, 17, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FORENSIC INTEGRITY:</span>
                  <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>SHA-256 VERIFIED</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'rgba(4, 7, 17, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CERTIFIED ANALYSTS:</span>
                  <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>14 ON-DUTY (L1-L3)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'rgba(4, 7, 17, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIVE AIR-GAP VAULT:</span>
                  <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>ONLINE · AES-256</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/report"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem', gap: '8px' }}
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
              >
                <AlertTriangle size={16} /> Launch Guided Incident Intake
              </Link>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                Immutable chain of custody · Court-admissible forensic artifacts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE 4-STEP INCIDENT LIFECYCLE SIMULATOR                        */}
      {/* ========================================================================= */}
      <section
        id="workflow"
        style={{
          backgroundColor: '#050914',
          padding: '80px 24px',
          borderTop: '1px solid rgba(56, 189, 248, 0.12)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
              END-TO-END INCIDENT OPERATIONS
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', color: '#ffffff' }}>
              <CyberTextDecoder text="4-Step Incident Triage & Resolution Engine" />
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0' }}>
              Click each stage to inspect the real-time operational payload, evidentiary safeguards, and investigator actions.
            </p>
          </div>

          {/* Stage Tabs Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            {lifecycleStages.map((stage) => {
              const isSelected = stage.step === lifecycleStep;
              return (
                <div
                  key={stage.step}
                  onClick={() => setLifecycleStep(stage.step)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(0, 242, 254, 0.14)' : 'rgba(11, 19, 36, 0.7)',
                    border: isSelected ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#00f2fe' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {stage.badge}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                    {stage.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Inspection Panel */}
          <div
            className="cyber-border-beam"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px',
              backgroundColor: 'rgba(11, 19, 36, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              padding: '36px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Left: Stage Overview & Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                <span>{currentStage.badge}</span>
                <span>•</span>
                <span>{currentStage.subtitle}</span>
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {currentStage.title}
              </h3>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {currentStage.desc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                {currentStage.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Simulated Real-Time Audit Payload */}
            <div
              style={{
                backgroundColor: '#040711',
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan-bright)', fontWeight: 700 }}>
                  TELEMETRY_AUDIT_LOG_STREAM
                </span>
                <span style={{ fontSize: '0.7rem', color: '#34d399' }}>SEALED_HASH_MATCH</span>
              </div>

              <pre style={{ margin: 0, fontSize: '0.825rem', color: '#7dd3fc', lineHeight: 1.6, overflowX: 'auto' }}>
                {JSON.stringify(currentStage.codePreview, null, 2)}
              </pre>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                System: AES-256 GCM · SHA-256 Integrity Verification · Audit Trail ID #CS-AUDIT-992
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PLATFORM PERFORMANCE METRICS & LIVE COUNTERS                           */}
      {/* ========================================================================= */}
      <section
        id="telemetry"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          <div
            className="card cyber-floating-1"
            style={{
              padding: '30px 24px',
              textAlign: 'center',
              backgroundColor: 'rgba(11, 19, 36, 0.8)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
            }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {stats.totalComplaints}+
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
              Complaints Processed
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Across public and enterprise sectors
            </div>
          </div>

          <div
            className="card cyber-floating-2"
            style={{
              padding: '30px 24px',
              textAlign: 'center',
              backgroundColor: 'rgba(11, 19, 36, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              &lt; 20 min
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
              Average Triage SLA
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              From submission to investigator action
            </div>
          </div>

          <div
            className="card cyber-floating-1"
            style={{
              padding: '30px 24px',
              textAlign: 'center',
              backgroundColor: 'rgba(11, 19, 36, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              99.4%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
              Triage Accuracy
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Heuristic threat vector classification
            </div>
          </div>

          <div
            className="card cyber-floating-2"
            style={{
              padding: '30px 24px',
              textAlign: 'center',
              backgroundColor: 'rgba(11, 19, 36, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
            }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#a855f7', fontFamily: 'var(--font-mono)' }}>
              100%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
              Evidence Integrity
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Zero evidence tampering events recorded
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHY CYBERSHIELD: BENTO GRID CAPABILITIES (HOLO TILT CARDS)             */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
            WHY CYBERSHIELD?
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', color: '#ffffff' }}>
            <CyberTextDecoder text="Built for National Defense & Enterprise Resilience" />
          </h2>
        </div>

        <div className="grid-3" style={{ gap: '24px' }}>
          {[
            {
              icon: AlertTriangle,
              title: 'Guided Incident Intake Wizard',
              desc: 'Structured 5-step incident form with real-time field validation, attacker handle tagging, financial loss metrics, and instant tracking ticket generation.',
            },
            {
              icon: Eye,
              title: 'SOC Investigation Workbench',
              desc: 'Dedicated workbench for certified cyber investigators to evaluate forensic evidence, record encrypted notes, and coordinate remediation.',
            },
            {
              icon: Zap,
              title: 'Automated Heuristic Classification',
              desc: 'Instant threat severity calculation (CRITICAL, HIGH, MEDIUM, LOW) based on attack vectors, target infrastructure, and potential exposure.',
            },
            {
              icon: Lock,
              title: 'Cryptographic Evidence Vault',
              desc: 'Every file upload is assigned a SHA-256 cryptographic hash seal upon arrival to guarantee evidentiary integrity for legal proceedings.',
            },
            {
              icon: Activity,
              title: 'Real-Time Threat Intelligence',
              desc: 'Live telemetry indicators, unread status alerts, and instant investigator reassignment feeds keep all stakeholders synchronized.',
            },
            {
              icon: ShieldCheck,
              title: 'Full Lifecycle Audit Trail',
              desc: 'Strict immutable logging records every status change, note entry, and evidence download with exact user and timestamp attribution.',
            },
          ].map((item, idx) => {
            const IconC = item.icon;
            return (
              <HoloTiltCard
                key={idx}
                maxTilt={12}
                style={{
                  padding: '28px',
                  backgroundColor: 'rgba(11, 19, 36, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '220px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconC size={22} color="var(--accent-cyan)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </HoloTiltCard>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HIGH-IMPACT FINAL CALL TO ACTION                                       */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', width: '100%', textAlign: 'center' }}>
        <div
          className="cyber-border-beam"
          style={{
            padding: '60px 40px',
            background: 'radial-gradient(ellipse 90% 70% at 50% -20%, rgba(0, 242, 254, 0.22) 0%, rgba(7, 13, 28, 0.98) 80%)',
            borderRadius: '24px',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)',
            }}
          >
            <Shield size={32} color="#00f2fe" />
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '16px', color: '#ffffff' }}>
            <CyberTextDecoder text="Your report could stop the next major attack." />
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '620px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Submit suspicious activities, financial scams, or corporate intrusions. Our certified SOC investigators and automated triage engine act in minutes.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/report"
              className="btn btn-primary btn-lg"
              style={{
                padding: '16px 36px',
                fontSize: '1.05rem',
                gap: '10px',
                boxShadow: '0 0 35px rgba(0, 242, 254, 0.5)',
              }}
            >
              <AlertTriangle size={20} /> Report a Cyber Threat Now
            </Link>

            <Link
              to="/safety"
              className="btn btn-secondary btn-lg"
              style={{ padding: '16px 32px', fontSize: '1.05rem', gap: '10px' }}
            >
              <ShieldCheck size={20} color="#34d399" /> Explore Safety Knowledge Hub
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
