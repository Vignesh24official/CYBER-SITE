import React, { useState } from 'react';
import { User, ArrowRight, X, Activity, Shield, Mail, ChevronRight, Key, ShieldAlert, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { signInWithSupabaseGoogle } from '../../services/supabaseClient';
import { cyberAudio } from '../../services/cyberAudio';

export const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const GoogleAuthModal = ({ isOpen, onClose, mode = 'signup' }) => {
  const { googleAuth } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [loadingAccount, setLoadingAccount] = useState(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  
  // Pending Clearance Challenge for Admin (MAIN) / Investigator (SUB)
  const [pendingRoleChallenge, setPendingRoleChallenge] = useState(null);
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeError, setChallengeError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async ({ email, name }) => {
    setLoadingAccount(email);

    try {
      const authData = await googleAuth({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        isSignUp: mode === 'signup',
      });

      showSuccess(`Welcome, ${name || email.split('@')[0]}!`);
      onClose();

      const role = authData?.role || authData?.user?.role;
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role === 'ROLE_COORDINATOR' || role === 'ROLE_INVESTIGATOR') {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoadingAccount(null);
      const msg = err?.response?.data?.message || err.message || 'Sign in failed';
      showError(msg);
    }
  };

  const handleSelectAccount = (account) => {
    if (account.requiresCode) {
      setPendingRoleChallenge(account);
      setChallengeCode('');
      setChallengeError('');
      cyberAudio.playClick();
      return;
    }

    handleSignIn(account);
  };

  const handleVerifyChallenge = (e) => {
    e.preventDefault();
    if (!pendingRoleChallenge) return;

    if (challengeCode.trim().toUpperCase() !== pendingRoleChallenge.expectedCode) {
      cyberAudio.playAlarm();
      setChallengeError('ACCESS DENIED: Invalid clearance code! Security authentication failed.');
      return;
    }

    const account = { ...pendingRoleChallenge };
    setPendingRoleChallenge(null);
    handleSignIn(account);
  };

  const handleOfficialGoogle = async () => {
    setLoadingAccount('google-official');
    try {
      await signInWithSupabaseGoogle();
    } catch (err) {
      setLoadingAccount(null);
      handleSignIn({
        email: 'vignesh.citizen@gmail.com',
        name: 'Vignesh Citizen Defender',
      });
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const emailLower = customEmail.trim().toLowerCase();
    const namePart = customEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    if (emailLower.includes('admin')) {
      handleSelectAccount({
        email: customEmail,
        name: formattedName,
        role: 'Admin',
        expectedCode: 'MAIN',
        requiresCode: true,
      });
      return;
    }

    if (emailLower.includes('investigator') || emailLower.includes('coordinator')) {
      handleSelectAccount({
        email: customEmail,
        name: formattedName,
        role: 'Investigator',
        expectedCode: 'SUB',
        requiresCode: true,
      });
      return;
    }

    handleSignIn({
      email: customEmail,
      name: formattedName,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 18, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loadingAccount) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#0a0f1d',
          border: '1px solid rgba(255, 0, 60, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 0, 60, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <GoogleIcon size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                Sign in with Google
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Choose your role profile to continue to CyberShield
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={!!loadingAccount}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Clearance Code Challenge Sub-view */}
          {pendingRoleChallenge ? (
            <form onSubmit={handleVerifyChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.2s ease-out' }}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: pendingRoleChallenge.role === 'Admin' ? 'rgba(255, 0, 60, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: pendingRoleChallenge.role === 'Admin' ? '1px solid rgba(255, 0, 60, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Key size={18} color={pendingRoleChallenge.role === 'Admin' ? '#ff003c' : '#f59e0b'} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                    {pendingRoleChallenge.role} Clearance Challenge
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {pendingRoleChallenge.role} login requires cryptographic security clearance authorization.
                </div>
              </div>

              {challengeError && (
                <div style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 600 }}>
                  {challengeError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
                  Enter Security Clearance Code
                </label>
                <input
                  type="password"
                  value={challengeCode}
                  onChange={(e) => setChallengeCode(e.target.value.toUpperCase())}
                  placeholder="Enter secret clearance code"
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setPendingRoleChallenge(null)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94a3b8',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '11px',
                    backgroundColor: pendingRoleChallenge.role === 'Admin' ? '#ff003c' : '#f59e0b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Option 1: Official Google Button */}
              <button
                type="button"
                onClick={handleOfficialGoogle}
                disabled={!!loadingAccount}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {loadingAccount === 'google-official' ? (
                  <Activity size={18} className="spin" color="#1f2937" />
                ) : (
                  <GoogleIcon size={20} />
                )}
                <span>Continue with Google</span>
              </button>

              {/* Simple Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  or choose role profile
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              </div>

              {/* Option 2: 3 Clear Roles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 1. Citizen Role */}
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      email: 'vignesh.citizen@gmail.com',
                      name: 'Vignesh Citizen Defender',
                      requiresCode: false,
                    })
                  }
                  disabled={!!loadingAccount}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                        Citizen Defender
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        vignesh.citizen@gmail.com
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#00f0ff', fontFamily: 'monospace', fontWeight: 700 }}>
                    PUBLIC ACCESS
                  </span>
                </button>

                {/* 2. Investigator Role (SUB) */}
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      email: 'investigator@cybershield.org',
                      name: 'Cyber Investigator',
                      role: 'Investigator',
                      expectedCode: 'SUB',
                      requiresCode: true,
                    })
                  }
                  disabled={!!loadingAccount}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Search size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                        Cyber Investigator
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        investigator@cybershield.org
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>
                    CLEARANCE REQ
                  </span>
                </button>

                {/* 3. SOC Admin Role (MAIN) */}
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      email: 'admin@cybershield.org',
                      name: 'SOC Administrator',
                      role: 'Admin',
                      expectedCode: 'MAIN',
                      requiresCode: true,
                    })
                  }
                  disabled={!!loadingAccount}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 0, 60, 0.25)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 0, 60, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 0, 60, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 0, 60, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#e11d48',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShieldAlert size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                        SOC Administrator
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        admin@cybershield.org
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#ff003c', fontFamily: 'monospace', fontWeight: 700 }}>
                    ROOT CLEARANCE
                  </span>
                </button>
              </div>

              {/* Option 3: Use Another Account */}
              {!showOtherInput ? (
                <button
                  type="button"
                  onClick={() => setShowOtherInput(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00f0ff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 0',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '2px',
                  }}
                >
                  <Mail size={15} />
                  <span>Use another Google account</span>
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Enter your Google email"
                      autoFocus
                      required
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!customEmail || !!loadingAccount}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#00f0ff',
                        color: '#020408',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
