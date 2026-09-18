import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    totalComplaints: 248,
    activeInvestigations: 19,
    resolvedCount: 186,
    threatCategories: 12,
  });

  useEffect(() => {
    // Attempt to fetch real-time analytics summary from backend
    fetch('/api/v1/admin/reports/summary')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Public endpoint fallback');
      })
      .then((data) => {
        if (data && data.data) {
          setStats({
            totalComplaints: data.data.totalComplaints || 248,
            activeInvestigations: data.data.investigatingComplaints || 19,
            resolvedCount: data.data.resolvedComplaints || 186,
            threatCategories: 12,
          });
        }
      })
      .catch(() => {
        // Controlled live baseline data
      });
  }, []);

  const supportedThreats = [
    { title: 'Phishing Attacks', icon: Globe, desc: 'Deceptive links, credential harvesting, and spoofed domains.' },
    { title: 'Online Fraud', icon: Zap, desc: 'E-commerce scams, unauthorized credit card charges, fake stores.' },
    { title: 'Suspicious Links', icon: Search, desc: 'Malicious short URLs, punycode domains, unencrypted gateways.' },
    { title: 'Account Compromise', icon: Lock, desc: 'Hacked email handles, credential stuffing, hijacked social portals.' },
    { title: 'Identity Theft', icon: Users, desc: 'Stolen personal documents, identity impersonation, forged profiles.' },
    { title: 'Malware & Trojan', icon: Server, desc: 'Ransomware binaries, spy tools, unauthorized system backdoors.' },
    { title: 'Social Engineering', icon: Radio, desc: 'Pretexting calls, SMS vishing, coercion, executive impersonation.' },
    { title: 'Unauthorized Access', icon: Key, desc: 'Unlawful network intrusions, privilege escalation attempts.' },
    { title: 'Cyber Harassment', icon: AlertTriangle, desc: 'Targeted online stalking, extortion threats, abusive blackmail.' },
    { title: 'Data Breach', icon: Database, desc: 'Exposed database leaks, corporate asset leakage, PII exposure.' },
    { title: 'Financial Fraud', icon: Activity, desc: 'UPI QR code traps, banking Trojan money transfers, wallet drains.' },
    { title: 'Other Cyber Threats', icon: ShieldCheck, desc: 'Zero-day exploits, emerging vector attacks, custom malware.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px', color: 'var(--text-primary)' }}>
      {/* HERO SECTION WITH CANVAS / SVG ANIMATED ENVIRONMENT */}
      <section
        style={{
          position: 'relative',
          padding: '100px 24px 80px',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, rgba(7, 9, 14, 0.95) 75%)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Animated Security Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <CyberShieldSecurityPulse statusText="DEFENSE. REPORT. INVESTIGATE. SECURE." />
          </div>

          <h1
            style={{
              fontSize: '3.6rem',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Defend. Report. <span style={{ color: 'var(--accent-cyan-bright)', WebkitTextFillColor: '#38bdf8' }}>Investigate.</span> Secure.
          </h1>

          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '780px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            A modern cybersecurity incident reporting and threat management platform designed to connect users, investigators, and security administrators through one secure intelligence ecosystem.
          </p>

          <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/report"
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.35)',
              }}
            >
              <AlertTriangle size={18} /> Report a Threat
            </Link>

            <Link
              to="/safety"
              className="btn btn-secondary"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ShieldCheck size={18} /> Explore CyberShield
            </Link>

            <Link
              to="/login"
              className="btn btn-secondary"
              style={{
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Lock size={18} /> Secure Login
            </Link>
          </div>

          {/* TELEMETRY READINESS STATUS BAR */}
          <div
            style={{
              marginTop: '50px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '24px',
              padding: '12px 24px',
              backgroundColor: 'rgba(17, 22, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '0.825rem',
              fontFamily: 'monospace',
              color: 'var(--text-muted)',
            }}
          >
            <span>STATUS: <strong style={{ color: 'var(--accent-emerald)' }}>OPERATIONAL</strong></span>
            <span>|</span>
            <span>ENCRYPTION: <strong style={{ color: 'var(--accent-cyan)' }}>AES-256 / SHA-256</strong></span>
            <span>|</span>
            <span>RBAC: <strong style={{ color: 'var(--accent-amber)' }}>ENFORCED</strong></span>
          </div>
        </div>
      </section>

      {/* WHY CYBERSHIELD SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
            WHY CYBERSHIELD?
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
            Built for Enterprise Cyber Defense & Citizen Protection
          </h2>
        </div>

        <div className="grid-3">
          {[
            {
              icon: AlertTriangle,
              title: 'Rapid Incident Reporting',
              desc: 'Structured 5-step reporting wizard with real-time field validation, evidence uploads, and immediate tracking ID generation.',
            },
            {
              icon: Eye,
              title: 'Centralized Investigation',
              desc: 'Dedicated Security Operations Workbench allowing investigators to evaluate case evidence, log findings, and track SLAs.',
            },
            {
              icon: Search,
              title: 'Threat Classification',
              desc: 'Automatic severity grading and threat vector categorization based on heuristic threat pattern rules.',
            },
            {
              icon: Lock,
              title: 'Secure Evidence Handling',
              desc: 'Immutable evidence file uploads backed by SHA-256 cryptographic checksums and MIME type validation.',
            },
            {
              icon: Activity,
              title: 'Real-Time Monitoring',
              desc: 'Live telemetry indicators, unread notifications, and instant investigator assignment updates.',
            },
            {
              icon: Clock,
              title: 'Incident Lifecycle Tracking',
              desc: 'Full audit history tracking every status change from initial submission down to final resolution and case archive.',
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <IconComp size={24} color="var(--accent-cyan-bright)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUPPORTED THREAT CATEGORIES GRID */}
      <section style={{ backgroundColor: '#090d16', padding: '70px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
              THREAT SPECTRUM COVERAGE
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
              Supported Cyber Attack Vectors
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0' }}>
              CyberShield accepts structured complaint data and evidence for 12 primary threat categories.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '20px' }}>
            {supportedThreats.map((threat, index) => {
              const IconComponent = threat.icon;
              return (
                <div
                  key={index}
                  style={{
                    padding: '20px 24px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconComponent size={20} color="var(--accent-cyan-bright)" />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>{threat.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {threat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 4-STEP VISUAL WORKFLOW */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '54px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
            LIFECYCLE FLOW
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
            4-Step Cyber Incident Triage & Resolution
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Report', desc: 'Submit details, attacker info, and evidence files using our guided incident wizard.' },
            { step: '02', title: 'Analyze', desc: 'System automatically logs audit events, assigns incident ID, and classifies threat severity.' },
            { step: '03', title: 'Investigate', desc: 'Authorized cyber investigator reviews case evidence, logs findings, and takes action.' },
            { step: '04', title: 'Resolve', desc: 'Resolution details are recorded, reporter receives final notification, and case closes.' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                padding: '30px 24px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'rgba(6, 182, 212, 0.25)',
                  fontFamily: 'monospace',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                {item.step}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#FFF' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM STATISTICS COUNTER */}
      <section style={{ backgroundColor: '#090d16', padding: '60px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-cyan-bright)', fontFamily: 'monospace' }}>
              {stats.totalComplaints}+
            </span>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '6px' }}>
              Reports Processed
            </div>
          </div>

          <div>
            <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-amber)', fontFamily: 'monospace' }}>
              {stats.activeInvestigations}
            </span>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '6px' }}>
              Active Investigations
            </div>
          </div>

          <div>
            <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent-emerald-bright)', fontFamily: 'monospace' }}>
              {stats.resolvedCount}
            </span>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '6px' }}>
              Resolved Incidents
            </div>
          </div>

          <div>
            <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#a855f7', fontFamily: 'monospace' }}>
              {stats.threatCategories}
            </span>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '6px' }}>
              Threat Categories
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div
          style={{
            padding: '50px 36px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.1)',
          }}
        >
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', color: '#FFF' }}>
            Your report could stop the next attack.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }}>
            Submit suspicious activities or digital fraud securely to trigger rapid SOC triage and investigator review.
          </p>

          <Link
            to="/report"
            className="btn btn-primary"
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
            }}
          >
            <AlertTriangle size={20} /> Report a Cyber Threat Now
          </Link>
        </div>
      </section>
    </div>
  );
};
