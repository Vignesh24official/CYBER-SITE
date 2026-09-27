import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Activity, Terminal, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { GoogleAuthModal, GoogleIcon } from '../../components/auth/GoogleAuthModal';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStageText, setAuthStageText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [roleAuthPrompt, setRoleAuthPrompt] = useState(null);

  const passwordInputRef = useRef(null);

  const { login, googleAuth } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setAuthStageText('Authenticating secure session...');

    try {
      // Simulate brief high-tech verification feedback
      await new Promise((r) => setTimeout(r, 600));
      setAuthStageText('Identity verified. Loading workspace...');
      await new Promise((r) => setTimeout(r, 400));

      const authData = await login({ email, password });
      showSuccess('Identity verified successfully!');

      // Dynamic role-based redirection
      const role = authData?.role || authData?.user?.role;
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role === 'ROLE_COORDINATOR') {
        navigate('/coordinator');
      } else if (role === 'ROLE_INVESTIGATOR') {
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
    }
  };

  const handleSelectRole = (demoEmail, roleLabel) => {
    setEmail(demoEmail);
    setPassword('');
    setErrorMsg('');
    if (roleAuthPrompt) setRoleAuthPrompt(null);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
    showSuccess(`Selected ${roleLabel} (${demoEmail}). Please enter your password or sign in with Google.`);
  };

  const handleRoleGoogleAuth = async (targetEmail, roleTitle) => {
    setErrorMsg('');
    setLoading(true);
    setAuthStageText(`Authenticating ${roleTitle} via Google SSO...`);

    try {
      await new Promise((r) => setTimeout(r, 400));
      const authData = await googleAuth({
        email: targetEmail,
        name: roleTitle,
        isSignUp: false,
      });

      showSuccess(`Authenticated via Google as ${roleTitle}!`);

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
      const msg = err?.response?.data?.message || err.message || 'Google authentication error';
      setErrorMsg(msg);
      showError(msg);
    }
  };

  const handleOpenRoleAuth = (roleInfo) => {
    setRoleAuthPrompt(roleInfo);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--bg-darkest)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      >
        {/* LEFT PANEL: CYBERSHIELD IDENTITY & 3 INTERACTIVE ROLE LOGINS */}
        <div
          style={{
            padding: '48px 36px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(7, 9, 14, 0.95) 100%)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ marginBottom: '24px' }}>
              <CyberShieldSecurityPulse statusText="PORTAL SECURITY ACTIVE" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Shield size={36} color="var(--accent-cyan-bright)" />
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFF', margin: 0 }}>
                  CYBER<span style={{ color: 'var(--accent-cyan-bright)' }}>SHIELD</span>
                </h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  ENTERPRISE THREAT MANAGEMENT
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
              Access your role-specific security console with end-to-end encrypted session authorization.
            </p>

            {/* 3 PRE-CONFIGURED ENTERPRISE ROLES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--accent-cyan-bright)', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>
                🛡️ Enterprise Role Consoles (Select to Authenticate):
              </div>

              {/* 1. ADMIN SOC CONSOLE */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  onClick={() => handleOpenRoleAuth({ roleLabel: 'SOC Administrator', email: 'admin@cybershield.org', roleBadge: 'ROLE_ADMIN', color: '#ef4444', icon: Shield })}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                  title="Click to choose authentication method"
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={18} color="#f87171" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>1. SOC Admin Console</div>
                    <div style={{ fontSize: '0.7rem', color: '#fca5a5', fontFamily: 'monospace' }}>admin@cybershield.org</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleRoleGoogleAuth('admin@cybershield.org', 'SOC Administrator')}
                    disabled={loading}
                    title="Sign In with Google Account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 11px',
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <GoogleIcon size={14} />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('admin@cybershield.org', 'SOC Administrator')}
                    disabled={loading}
                    title="Enter Password to Authenticate"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 11px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    <Lock size={12} />
                    <span>Password</span>
                  </button>
                </div>
              </div>

              {/* 2. INVESTIGATOR / COORDINATOR WORKBENCH */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  onClick={() => handleOpenRoleAuth({ roleLabel: 'Lead Investigator', email: 'investigator@cybershield.org', roleBadge: 'ROLE_INVESTIGATOR', color: '#fbbf24', icon: Terminal })}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                  title="Click to choose authentication method"
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Terminal size={18} color="#fbbf24" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>2. Coordinator Workbench</div>
                    <div style={{ fontSize: '0.7rem', color: '#fcd34d', fontFamily: 'monospace' }}>investigator@cybershield.org</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleRoleGoogleAuth('investigator@cybershield.org', 'Lead Investigator')}
                    disabled={loading}
                    title="Sign In with Google Account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 11px',
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <GoogleIcon size={14} />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('investigator@cybershield.org', 'Lead Investigator')}
                    disabled={loading}
                    title="Enter Password to Authenticate"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 11px',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    <Lock size={12} />
                    <span>Password</span>
                  </button>
                </div>
              </div>

              {/* 3. CITIZEN / USER DEFENSE WORKSPACE */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  onClick={() => handleOpenRoleAuth({ roleLabel: 'Citizen Reporter', email: 'user@cybershield.org', roleBadge: 'ROLE_USER', color: '#38bdf8', icon: CheckCircle })}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                  title="Click to choose authentication method"
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>3. Citizen Defense Portal</div>
                    <div style={{ fontSize: '0.7rem', color: '#7dd3fc', fontFamily: 'monospace' }}>user@cybershield.org</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleRoleGoogleAuth('user@cybershield.org', 'Citizen Reporter')}
                    disabled={loading}
                    title="Sign In with Google Account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 11px',
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <GoogleIcon size={14} />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('user@cybershield.org', 'Citizen Reporter')}
                    disabled={loading}
                    title="Enter Password to Authenticate"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 11px',
                      backgroundColor: 'rgba(6, 182, 212, 0.2)',
                      color: '#38bdf8',
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    <Lock size={12} />
                    <span>Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', pt: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              SEED PASSWORD FOR TESTING: <strong style={{ color: 'var(--accent-amber)' }}>Password@123</strong> (OR USE GOOGLE SSO)
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: AUTHENTICATION FORM */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              Sign In to CyberShield
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Enter your credentials or authenticate via enterprise Google SSO.
            </p>
          </div>

          {/* GOOGLE SSO LOGIN BUTTON (ADMIN / INVESTIGATOR / USER) */}
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
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <GoogleIcon size={20} />
            <span>Sign In with Google (Admin / Staff / Citizen)</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 16px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>OR SELECT ROLE TO AUTHENTICATE</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Quick Access Role Badges (Click to populate email & enter password) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => handleSelectRole('admin@cybershield.org', 'Admin')}
              disabled={loading}
              title="Click to select Admin account"
              style={{
                padding: '8px 4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '6px',
                color: '#f87171',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('investigator@cybershield.org', 'Investigator')}
              disabled={loading}
              title="Click to select Investigator account"
              style={{
                padding: '8px 4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '6px',
                color: '#fbbf24',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              🔍 Investigator
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('user@cybershield.org', 'Citizen')}
              disabled={loading}
              title="Click to select Citizen account"
              style={{
                padding: '8px 4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '6px',
                color: '#38bdf8',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              👤 Citizen
            </button>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '24px',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@cybershield.org"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan-bright)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9rem',
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-cyan)' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Remember secure session on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <Activity size={18} className="spin" />
                  <span>{authStageText || 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>Verify Identity & Access</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              For development accounts (`user@cybershield.org`, `investigator@cybershield.org`, `admin@cybershield.org`), use default password: <strong style={{ color: 'var(--accent-amber)' }}>Password@123</strong>.
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

      {/* Role Authentication Choice Dialog */}
      {roleAuthPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setRoleAuthPrompt(null)}
        >
          <div
            style={{
              backgroundColor: '#0c1017',
              border: `1px solid ${roleAuthPrompt.color || 'var(--accent-cyan-bright)'}`,
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: `${roleAuthPrompt.color || '#06b6d4'}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <roleAuthPrompt.icon size={22} color={roleAuthPrompt.color || '#06b6d4'} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  {roleAuthPrompt.roleLabel}
                </h3>
                <span style={{ fontSize: '0.78rem', color: roleAuthPrompt.color || 'var(--accent-cyan-bright)', fontFamily: 'monospace' }}>
                  {roleAuthPrompt.email}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '22px', lineHeight: 1.5 }}>
              Choose your authentication method to verify identity for the <strong>{roleAuthPrompt.roleLabel}</strong> workspace:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Method 1: Google SSO */}
              <button
                type="button"
                onClick={() => {
                  const targetEmail = roleAuthPrompt.email;
                  const targetLabel = roleAuthPrompt.roleLabel;
                  setRoleAuthPrompt(null);
                  handleRoleGoogleAuth(targetEmail, targetLabel);
                }}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '13px 18px',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                <GoogleIcon size={20} />
                <span>Authenticate with Google Account</span>
              </button>

              {/* Method 2: Enter Password */}
              <button
                type="button"
                onClick={() => handleSelectRole(roleAuthPrompt.email, roleAuthPrompt.roleLabel)}
                disabled={loading}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '13px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                <Lock size={18} />
                <span>Enter Account Password Manually</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleAuthPrompt(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  marginTop: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
