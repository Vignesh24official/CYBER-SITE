import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Activity, User, Search, Key, ShieldAlert, CheckCircle2, RefreshCw, RotateCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { GoogleAuthModal, GoogleIcon } from '../../components/auth/GoogleAuthModal';
import { cyberAudio } from '../../services/cyberAudio';

const ROLES = [
  {
    id: 'citizen',
    label: 'Citizen User',
    title: 'Citizen Reporter Portal',
    badge: 'PUBLIC ACCESS',
    icon: User,
    color: '#00f0ff',
    borderColor: 'rgba(0, 240, 255, 0.45)',
    bgGlow: 'rgba(0, 240, 255, 0.12)',
    defaultEmail: 'user@cybershield.org',
    description: 'Report cyber crimes, track incident investigations, and verify threat vectors.',
    requiresCode: false,
  },
  {
    id: 'investigator',
    label: 'Investigator',
    title: 'Cyber Investigator Console',
    badge: 'CLEARANCE LEVEL 2',
    icon: Search,
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    bgGlow: 'rgba(245, 158, 11, 0.12)',
    defaultEmail: 'investigator@cybershield.org',
    description: 'Case investigation, forensic analysis, evidence processing, and threat docket.',
    requiresCode: true,
    expectedCode: 'SUB',
  },
  {
    id: 'admin',
    label: 'SOC Admin',
    title: 'SOC Root Administration',
    badge: 'ROOT CLEARANCE',
    icon: ShieldAlert,
    color: '#ff003c',
    borderColor: 'rgba(255, 0, 60, 0.5)',
    bgGlow: 'rgba(255, 0, 60, 0.14)',
    defaultEmail: 'admin@cybershield.org',
    description: 'Full defense grid management, attack surface control, and system audit logs.',
    requiresCode: true,
    expectedCode: 'MAIN',
  },
];

const generateCaptcha = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [email, setEmail] = useState('user@cybershield.org');
  const [password, setPassword] = useState('password123');
  const [secretCode, setSecretCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStageText, setAuthStageText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // 20-Second Auto-Rotating CAPTCHA State (For all roles)
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptcha());
  const [prevCaptchaCode, setPrevCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaTimeLeft, setCaptchaTimeLeft] = useState(20);
  const [captchaKey, setCaptchaKey] = useState(0);

  const passwordInputRef = useRef(null);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const activeRoleData = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const refreshCaptcha = useCallback(() => {
    cyberAudio.playClick();
    setPrevCaptchaCode(captchaCode);
    setCaptchaCode(generateCaptcha());
    setCaptchaTimeLeft(20);
    setCaptchaKey((k) => k + 1);
  }, [captchaCode]);

  // 20-second automatic CAPTCHA rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCaptchaTimeLeft((prev) => {
        if (prev <= 1) {
          setCaptchaCode((curr) => {
            setPrevCaptchaCode(curr);
            return generateCaptcha();
          });
          setCaptchaKey((k) => k + 1);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectRole = (roleId) => {
    cyberAudio.playClick();
    setSelectedRole(roleId);
    setErrorMsg('');
    setSecretCode('');
    setCaptchaInput('');
    const target = ROLES.find((r) => r.id === roleId);
    if (target) {
      setEmail(target.defaultEmail);
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    // 0. CAPTCHA Verification (Mandatory across all roles)
    const normalizedCaptcha = captchaInput.trim().toUpperCase();
    if (!normalizedCaptcha) {
      cyberAudio.playAlarm();
      const err = 'SECURITY ALERT: Please write the CAPTCHA code before authenticating.';
      setErrorMsg(err);
      showError(err);
      return;
    }

    const isValidCaptcha =
      normalizedCaptcha === captchaCode.toUpperCase() ||
      (captchaTimeLeft >= 18 && prevCaptchaCode && normalizedCaptcha === prevCaptchaCode.toUpperCase());

    if (!isValidCaptcha) {
      cyberAudio.playAlarm();
      const err = 'SECURITY ALERT: Invalid or expired CAPTCHA code! A new security CAPTCHA has been generated.';
      setErrorMsg(err);
      showError(err);
      setPrevCaptchaCode(captchaCode);
      setCaptchaCode(generateCaptcha());
      setCaptchaTimeLeft(20);
      setCaptchaKey((k) => k + 1);
      setCaptchaInput('');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const isAdminAccount = selectedRole === 'admin' || trimmedEmail === 'admin@cybershield.org';
    const isInvestigatorAccount = selectedRole === 'investigator' || trimmedEmail === 'investigator@cybershield.org' || trimmedEmail === 'coordinator@cybershield.org';

    // 1. Check Secret Code for Admin: code must be MAIN
    if (isAdminAccount) {
      if (!secretCode || secretCode.trim().toUpperCase() !== 'MAIN') {
        cyberAudio.playAlarm();
        const err = 'ACCESS DENIED: Invalid Admin security code! Authorized clearance code is required.';
        setErrorMsg(err);
        showError(err);
        return;
      }
    }

    // 2. Check Secret Code for Investigator: code must be SUB
    if (isInvestigatorAccount) {
      if (!secretCode || secretCode.trim().toUpperCase() !== 'SUB') {
        cyberAudio.playAlarm();
        const err = 'ACCESS DENIED: Invalid Investigator security code! Authorized clearance code is required.';
        setErrorMsg(err);
        showError(err);
        return;
      }
    }

    setErrorMsg('');
    setLoading(true);
    setAuthStageText(`Verifying ${activeRoleData.label} clearance...`);

    try {
      await new Promise((r) => setTimeout(r, 450));
      setAuthStageText('Cryptographic authorization confirmed...');
      await new Promise((r) => setTimeout(r, 350));

      const authData = await login({ email, password });
      showSuccess(`Clearance granted! Welcome, ${authData?.fullName || email}!`);

      const role = authData?.role || authData?.user?.role;
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role === 'ROLE_COORDINATOR' || role === 'ROLE_INVESTIGATOR') {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setAuthStageText('');
      const msg = err?.response?.data?.message || err.message || 'Invalid security credentials';
      setErrorMsg(msg);
      showError(msg);
      cyberAudio.playAlarm();
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-grid-container">
        {/* LEFT PANEL: 3 DISTINCT ROLES & TELEMETRY */}
        <div className="auth-panel-left">
          <div>
            <div style={{ marginBottom: '24px' }}>
              <CyberShieldSecurityPulse statusText="SCARY HACKER PORTAL // DEFCON 1 ACTIVE" threat={true} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 0, 60, 0.2)',
                  border: '1.5px solid #ff003c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255, 0, 60, 0.5)',
                }}
              >
                <Shield size={24} color="#ff003c" style={{ filter: 'drop-shadow(0 0 6px #ff003c)' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFF', margin: 0 }}>
                  CYBER<span style={{ color: '#ff003c', textShadow: '0 0 12px #ff003c' }}>SHIELD</span>
                </h2>
                <span style={{ fontSize: '0.7rem', color: '#ff4d6d', fontFamily: 'monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
                  ROLE SEPARATION // ZERO-TRUST CLEARANCE
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Select your designated role to enter the secure portal. Higher clearance tiers require cryptographic authorization keys.
            </p>

            {/* 3 ROLE OVERVIEW CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                const IconComp = role.icon;
                return (
                  <div
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    style={{
                      backgroundColor: isSelected ? role.bgGlow : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? `2px solid ${role.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 25px ${role.bgGlow}` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: `${role.color}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: role.color,
                        boxShadow: `0 0 12px ${role.color}33`,
                      }}
                    >
                      <IconComp size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                          {role.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontFamily: 'monospace',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: `${role.color}25`,
                            color: role.color,
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {role.badge}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {role.description}
                      </div>

                      {role.requiresCode && (
                        <div style={{ marginTop: '6px', fontSize: '0.72rem', color: role.color, fontFamily: 'monospace', fontWeight: 700 }}>
                          🔒 Secret Clearance Code Required
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              SECURITY POLICY: <span style={{ color: '#38bdf8' }}>ENFORCED</span>
            </div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#34d399' }}>
              ● 3 TIER DISPATCH READY
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 3 ROLE TABS + AUTHENTICATION FORM */}
        <div className="auth-panel-right">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
              Sign In to CyberShield
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Choose your role below to authenticate with designated security credentials.
            </p>
          </div>

          {/* 3 ROLE SEPARATION TABS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            {ROLES.map((role) => {
              const isActive = selectedRole === role.id;
              const IconComp = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? role.bgGlow : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? `2px solid ${role.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive ? `0 0 20px ${role.bgGlow}` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? `${role.color}33` : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? role.color : '#94a3b8',
                    }}
                  >
                    <IconComp size={18} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isActive ? '#ffffff' : '#cbd5e1' }}>
                    {role.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? `${role.color}33` : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? role.color : '#64748b',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                    }}
                  >
                    {role.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* GOOGLE SSO LOGIN BUTTON */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 18px',
              backgroundColor: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <GoogleIcon size={19} />
            <span>Sign In with Google ({activeRoleData.label})</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 18px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              OR SIGN IN AS {activeRoleData.label.toUpperCase()}
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '20px',
                animation: 'shake 0.3s ease',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan-bright)', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SECRET CODE FIELD FOR ADMIN (MAIN) & INVESTIGATOR (SUB) */}
            {activeRoleData.requiresCode && (
              <div
                style={{
                  padding: '14px',
                  backgroundColor: `${activeRoleData.color}0f`,
                  border: `1px solid ${activeRoleData.color}55`,
                  borderRadius: '10px',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: activeRoleData.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={15} />
                    <span>{selectedRole === 'admin' ? 'ADMIN ROOT CODE' : 'INVESTIGATOR CODE'} (REQUIRED)</span>
                  </label>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: activeRoleData.color,
                      backgroundColor: `${activeRoleData.color}22`,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    SECURE CLEARANCE
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <Key size={17} color={activeRoleData.color} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                    placeholder="Enter secret clearance code"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: `1px solid ${activeRoleData.color}66`,
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                  {selectedRole === 'admin'
                    ? 'Root security clearance code is required to authorize Administrator access.'
                    : 'Clearance security code is required to authorize Investigator access.'}
                </div>
              </div>
            )}

            {/* WRITE CAPTCHA SECURITY SECTION (FOR EVERY ROLE, ROTATES EVERY 20 SEC) */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                border: `1px solid ${
                  captchaInput.trim().toUpperCase() === captchaCode
                    ? 'rgba(0, 255, 136, 0.6)'
                    : 'rgba(255, 255, 255, 0.12)'
                }`,
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.25s ease',
              }}
            >
              {/* Header with Title & 20s Timer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Shield size={14} color={activeRoleData.color} />
                  <span>WRITE THE CAPTCHA</span>
                  <span style={{ fontSize: '0.65rem', color: '#ff003c', fontWeight: 800 }}>*REQUIRED</span>
                </label>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: captchaTimeLeft <= 4 ? '#ff003c' : 'var(--accent-cyan-bright)',
                    backgroundColor: captchaTimeLeft <= 4 ? 'rgba(255, 0, 60, 0.15)' : 'rgba(0, 240, 255, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${
                      captchaTimeLeft <= 4 ? 'rgba(255, 0, 60, 0.35)' : 'rgba(0, 240, 255, 0.25)'
                    }`,
                  }}
                  title="CAPTCHA auto-refreshes every 20 seconds"
                >
                  <RefreshCw size={11} className={captchaTimeLeft <= 3 ? 'spin' : ''} />
                  <span>CHANGES IN {captchaTimeLeft}s</span>
                </div>
              </div>

              {/* Interactive Captcha Row: Display Box + Refresh Button + Write Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Visual Captcha Display Box */}
                <div
                  style={{
                    position: 'relative',
                    width: '140px',
                    height: '42px',
                    flexShrink: 0,
                    backgroundColor: '#050c18',
                    border: '1px solid rgba(0, 240, 255, 0.35)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {/* SVG Distorted Characters & Scanline Noise */}
                  <svg
                    width="140"
                    height="42"
                    viewBox="0 0 140 42"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  >
                    {/* Background Noise Grid */}
                    <pattern id="captcha-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.75" fill="rgba(0, 240, 255, 0.18)" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#captcha-grid)" />

                    {/* Interference lines */}
                    <path
                      d="M 5 20 Q 35 6, 70 24 T 135 18"
                      stroke="rgba(0, 240, 255, 0.45)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <line
                      x1="6"
                      y1="28"
                      x2="134"
                      y2="14"
                      stroke="rgba(255, 0, 60, 0.35)"
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="128"
                      y2="34"
                      stroke="rgba(250, 204, 21, 0.3)"
                      strokeWidth="1"
                    />

                    {/* Character glyphs with randomized rotations & cybersecurity palette */}
                    {captchaCode.split('').map((char, idx) => {
                      const colors = ['#00f0ff', '#39ff14', '#f59e0b', '#ff0055', '#a855f7', '#38bdf8'];
                      const charColor = colors[(idx + captchaKey) % colors.length];
                      const xPos = 12 + idx * 20;
                      const yPos = 27 + ((idx % 2 === 0 ? 2 : -2));
                      const rot = (idx % 2 === 0 ? 9 : -11) + ((idx * 3) % 7) - 3;
                      return (
                        <text
                          key={`${idx}-${char}`}
                          x={xPos}
                          y={yPos}
                          fill={charColor}
                          fontSize="18"
                          fontWeight="900"
                          fontFamily="monospace"
                          transform={`rotate(${rot}, ${xPos}, ${yPos})`}
                          style={{
                            textShadow: `0 0 6px ${charColor}`,
                            letterSpacing: '1px',
                          }}
                        >
                          {char}
                        </text>
                      );
                    })}
                  </svg>

                  {/* Manual Refresh Button overlaid on the right edge */}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    title="Generate new CAPTCHA immediately"
                    style={{
                      position: 'absolute',
                      right: '3px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: 'var(--accent-cyan-bright)',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 240, 255, 0.25)';
                      e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <RotateCw size={12} />
                  </button>
                </div>

                {/* Write Captcha Input Field */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase().slice(0, 6))}
                    placeholder="Write CAPTCHA"
                    maxLength={6}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 32px 10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: `1px solid ${
                        captchaInput.trim().toUpperCase() === captchaCode
                          ? '#00ff88'
                          : 'var(--border-color)'
                      }`,
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      fontWeight: 700,
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      boxShadow:
                        captchaInput.trim().toUpperCase() === captchaCode
                          ? '0 0 10px rgba(0, 255, 136, 0.3)'
                          : 'none',
                    }}
                  />
                  {captchaInput.trim().toUpperCase() === captchaCode && (
                    <CheckCircle2
                      size={16}
                      color="#00ff88"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* 20-Second Countdown Progress Bar */}
              <div
                style={{
                  height: '2px',
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '1px',
                  overflow: 'hidden',
                  marginTop: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(captchaTimeLeft / 20) * 100}%`,
                    backgroundColor: captchaTimeLeft <= 4 ? '#ff003c' : activeRoleData.color,
                    transition: 'width 1s linear, background-color 0.3s ease',
                    boxShadow: `0 0 6px ${captchaTimeLeft <= 4 ? '#ff003c' : activeRoleData.color}`,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px',
                  fontSize: '0.67rem',
                  color: '#64748b',
                }}
              >
                <span>Write the 6-character code shown on left</span>
                <span>Auto-changes every 20s</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.94rem',
                fontWeight: 800,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: activeRoleData.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: `0 0 25px ${activeRoleData.color}55`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => cyberAudio.playHover()}
            >
              {loading ? (
                <>
                  <Activity size={18} className="spin" />
                  <span>{authStageText || 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>Authenticate {activeRoleData.label} Access</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Don't have a CyberShield account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan-bright)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '440px',
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Reset Security Credentials</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              To reset your credentials, please contact your SOC administrator or verify with your assigned clearance credentials.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Google SSO Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        mode="login"
      />
    </div>
  );
};
