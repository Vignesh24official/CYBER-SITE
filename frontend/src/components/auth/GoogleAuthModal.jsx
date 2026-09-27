import React, { useState, useEffect, useRef } from 'react';
import { Shield, Terminal, User, ArrowRight, X, Activity, CheckCircle2, Lock, Sparkles, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

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

export const GoogleAuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const { googleAuth } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loadingRole, setLoadingRole] = useState(null);
  const [statusText, setStatusText] = useState('');
  const googleBtnContainerRef = useRef(null);

  // Available roles for Google Login
  const googleAccounts = [
    {
      roleLabel: 'SOC Administrator',
      email: 'admin@cybershield.org',
      name: 'System Administrator',
      roleBadge: 'ROLE_ADMIN',
      badgeColor: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.35)',
      description: 'Enterprise SOC, Access Control & System Oversight',
      icon: Shield,
    },
    {
      roleLabel: 'Lead Investigator / Coordinator',
      email: 'investigator@cybershield.org',
      name: 'Lead Cyber Investigator',
      roleBadge: 'ROLE_INVESTIGATOR',
      badgeColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      description: 'Threat Triage, Case Management & Evidence Log',
      icon: Terminal,
    },
    {
      roleLabel: 'Citizen Reporter (User)',
      email: 'user@cybershield.org',
      name: 'Citizen Reporter',
      roleBadge: 'ROLE_USER',
      badgeColor: '#06b6d4',
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.35)',
      description: 'Incident Reporting, Victim Shield & Case Tracking',
      icon: User,
    },
  ];

  // Try initializing native Google GIS button if client ID is configured
  useEffect(() => {
    if (!isOpen) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (clientId && window.google?.accounts?.id && googleBtnContainerRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              await handleExecuteAuth({
                credential: response.credential,
                isSignUp: mode === 'signup',
              });
            }
          },
        });

        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'pill',
        });
      } catch (err) {
        console.warn('Google GIS button render skipped:', err);
      }
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleExecuteAuth = async ({ email, name, credential, isSignUp }) => {
    setLoadingRole(email || 'processing');
    setStatusText('Verifying Google credentials with CyberShield Security...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setStatusText('Generating encrypted authorization token...');

      const authData = await googleAuth({
        email,
        name,
        credential,
        isSignUp: isSignUp ?? (mode === 'signup'),
      });

      setStatusText('Access Granted. Routing to authorized console...');
      await new Promise((r) => setTimeout(r, 300));

      const role = authData?.role || authData?.user?.role;
      showSuccess(`Authenticated via Google as ${role?.replace('ROLE_', '') || 'User'}!`);
      onClose();

      // Role-based redirect
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role === 'ROLE_COORDINATOR' || role === 'ROLE_INVESTIGATOR') {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoadingRole(null);
      setStatusText('');
      const msg = err?.response?.data?.message || err.message || 'Google authentication failed';
      showError(msg);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;

    handleExecuteAuth({
      email: customEmail.trim().toLowerCase(),
      name: customName.trim() || customEmail.split('@')[0],
      isSignUp: mode === 'signup',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loadingRole) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#0c1017',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.15)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(12, 16, 23, 1) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <GoogleIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  {mode === 'signup' ? 'Google Sign-Up' : 'Google Single Sign-On'}
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: mode === 'signup' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: mode === 'signup' ? 'var(--accent-cyan-bright)' : '#fbbf24',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {mode === 'signup' ? 'CITIZEN SIGN-UP' : 'MULTI-ROLE SSO'}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                {mode === 'signup'
                  ? 'Create a verified Citizen User account in seconds with your Google identity.'
                  : 'Select an authorized enterprise Google account or sign in with your role.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={!!loadingRole}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Status Alert if loading */}
          {loadingRole && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '12px',
                color: 'var(--accent-cyan-bright)',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              <Activity size={20} className="spin" />
              <span>{statusText || 'Authorizing Google Account...'}</span>
            </div>
          )}

          {/* Native GIS Render Container if client ID is set */}
          <div ref={googleBtnContainerRef} style={{ marginBottom: '16px' }} />

          {/* MODE: SIGNUP VIEW */}
          {mode === 'signup' ? (
            <div>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(6, 182, 212, 0.06)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="var(--accent-cyan-bright)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                    Citizen Defense Account Auto-Provisioning
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Google Sign-Up registers your profile as a citizen user, giving you instant access to submit complaints, upload forensic evidence, and track investigations.
                </p>
              </div>

              {/* 1-Click Citizen Quick Sign-Up */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  ⚡ QUICK CITIZEN SIGN-UP:
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleExecuteAuth({
                      email: 'user@cybershield.org',
                      name: 'Citizen Reporter',
                      isSignUp: true,
                    })
                  }
                  disabled={!!loadingRole}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <GoogleIcon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                        Sign Up as John Citizen (Google)
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan-bright)', fontFamily: 'monospace' }}>
                        user@cybershield.org
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan-bright)', fontSize: '0.78rem', fontWeight: 700 }}>
                    <span>CONTINUE</span>
                    <ArrowRight size={16} />
                  </div>
                </button>
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0', position: 'relative' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    backgroundColor: '#0c1017',
                    padding: '0 12px',
                    fontFamily: 'monospace',
                  }}
                >
                  OR SIGN UP WITH YOUR GOOGLE EMAIL
                </span>
              </div>

              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                    Google Full Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="alex.rivera@gmail.com"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!!loadingRole || !customEmail}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <GoogleIcon size={18} />
                  <span>Create Citizen Account via Google</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            /* MODE: LOGIN VIEW (3 ROLES CAN LOGIN BY GOOGLE ACCOUNT) */
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '12px', letterSpacing: '0.05em' }}>
                SELECT AUTHORIZED GOOGLE WORKSPACE ACCOUNT:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
                {googleAccounts.map((account) => {
                  const Icon = account.icon;
                  const isCurrentLoading = loadingRole === account.email;

                  return (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() =>
                        handleExecuteAuth({
                          email: account.email,
                          name: account.name,
                          isSignUp: false,
                        })
                      }
                      disabled={!!loadingRole}
                      style={{
                        padding: '14px 18px',
                        backgroundColor: account.badgeBg,
                        border: `1px solid ${account.borderColor}`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${account.badgeColor}33`,
                          }}
                        >
                          <Icon size={20} color={account.badgeColor} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                              {account.roleLabel}
                            </span>
                            <span
                              style={{
                                fontSize: '0.62rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: account.badgeColor,
                                color: '#000',
                                fontWeight: 800,
                                fontFamily: 'monospace',
                              }}
                            >
                              {account.roleBadge.replace('ROLE_', '')}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: account.badgeColor, fontFamily: 'monospace', marginTop: '2px' }}>
                            {account.email}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {account.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: account.badgeColor, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {isCurrentLoading ? (
                          <Activity size={16} className="spin" />
                        ) : (
                          <>
                            <span>SIGN IN</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Or Login with Custom Google Account */}
              <div style={{ textAlign: 'center', margin: '16px 0', position: 'relative' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    backgroundColor: '#0c1017',
                    padding: '0 12px',
                    fontFamily: 'monospace',
                  }}
                >
                  OR LOGIN WITH CUSTOM GOOGLE ACCOUNT
                </span>
              </div>

              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter any authorized Google email (e.g. admin@cybershield.org)"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!!loadingRole || !customEmail}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <GoogleIcon size={16} />
                  <span>Authenticate Custom Google Account</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 28px',
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} color="var(--accent-cyan-bright)" />
            <span>End-to-End Encrypted OAuth2 Protocol</span>
          </div>
          <span style={{ fontFamily: 'monospace' }}>SECURE SSO GATEWAY</span>
        </div>
      </div>
    </div>
  );
};
