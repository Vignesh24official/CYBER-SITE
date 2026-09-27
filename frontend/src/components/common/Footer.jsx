import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldCheck, Lock, Activity, FileCheck, ExternalLink, AlertTriangle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#040711',
        borderTop: '1px solid rgba(56, 189, 248, 0.15)',
        padding: '60px 24px 32px',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(600px, 90vw)',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 242, 254, 0.6) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.5)',
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Top Header Row with Status Beacon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={22} color="#00f2fe" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                CYBER<span style={{ color: 'var(--accent-cyan)' }}>SHIELD</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                DEFENSE · INVESTIGATION · EVIDENCE CRYPTOGRAPHY
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
              }}
            >
              <span className="status-dot status-dot-active" />
              <span>ALL SOC NODES OPERATIONAL · 99.99% SLA</span>
            </div>

            <Link
              to="/report"
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <AlertTriangle size={13} /> Emergency Report
            </Link>
          </div>
        </div>

        {/* 4 Multi-Column Navigation */}
        <div className="footer-nav-grid">
          {/* Column 1: Platform & SOC */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              SOC Core Platform
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/report" style={{ color: 'var(--text-secondary)' }}>5-Step Incident Wizard</Link></li>
              <li><Link to="/threat-analysis" style={{ color: 'var(--text-secondary)' }}>URL & Threat Analyzer</Link></li>
              <li><a href="#workflow" style={{ color: 'var(--text-secondary)' }}>Automated Heuristic Triage</a></li>
              <li><a href="#cockpit" style={{ color: 'var(--text-secondary)' }}>SOC Command Cockpit</a></li>
              <li><Link to="/login" style={{ color: 'var(--text-secondary)' }}>Investigator Workbench</Link></li>
            </ul>
          </div>

          {/* Column 2: Threat Spectrum */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Threat Spectrum
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#threat-vectors" style={{ color: 'var(--text-secondary)' }}>Phishing & Credential Harvest</a></li>
              <li><a href="#threat-vectors" style={{ color: 'var(--text-secondary)' }}>Financial Fraud & UPI Traps</a></li>
              <li><a href="#threat-vectors" style={{ color: 'var(--text-secondary)' }}>Ransomware & Trojan Infiltration</a></li>
              <li><a href="#threat-vectors" style={{ color: 'var(--text-secondary)' }}>Corporate Data Breaches</a></li>
              <li><a href="#threat-vectors" style={{ color: 'var(--text-secondary)' }}>Identity Theft & Impersonation</a></li>
            </ul>
          </div>

          {/* Column 3: Resources & Safety */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Safety & Intel
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/safety" style={{ color: 'var(--text-secondary)' }}>Safety Knowledge Hub</Link></li>
              <li><Link to="/safety" style={{ color: 'var(--text-secondary)' }}>Incident Response Guides</Link></li>
              <li><a href="#telemetry" style={{ color: 'var(--text-secondary)' }}>Live Telemetry Indicators</a></li>
              <li><Link to="/login" style={{ color: 'var(--text-secondary)' }}>SOC Coordinator Portal</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-secondary)' }}>Create Citizen Account</Link></li>
            </ul>
          </div>

          {/* Column 4: Compliance & Architecture */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Security & Standards
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Lock size={14} color="var(--accent-cyan)" />
                <span>AES-256 GCM File Encryption</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} color="#34d399" />
                <span>NIST SP 800-61 Rev. 2 Aligned</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <FileCheck size={14} color="#fbbf24" />
                <span>SHA-256 Cryptographic Evidence Seal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Activity size={14} color="#a855f7" />
                <span>Zero-Trust Role-Based Access Control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Legal Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} CyberShield Security Systems. All rights reserved. Built for National & Enterprise Cyber Defense.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }}>Security Disclosure</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }}>System Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
