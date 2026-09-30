import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  User, 
  ShieldAlert, 
  LayoutDashboard, 
  Search, 
  AlertTriangle,
  Radio,
  BookOpen,
  Layers,
  Activity,
  Cpu,
  Volume2,
  VolumeX,
  Clock,
  Compass,
  Menu,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { CommandPaletteModal } from './CommandPaletteModal';
import { cyberAudio } from '../../services/cyberAudio';

export const Header = () => {
  const { user, isAuthenticated, logout, isAdmin, isCoordinator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const [justBreached, setJustBreached] = useState(false);
  const [portalBreached, setPortalBreached] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (location.pathname !== '/') return true;
    try {
      const navEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
      const isReload = navEntry ? navEntry.type === 'reload' : window.performance?.navigation?.type === 1;
      if (isReload) return false;
      return sessionStorage.getItem('cybershield_portal_breached') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onBreach = () => {
      setPortalBreached(true);
      setJustBreached(true);
    };
    const onReopen = () => {
      try {
        localStorage.removeItem('cybershield_portal_breached');
        sessionStorage.removeItem('cybershield_portal_breached');
      } catch (e) {
        console.error(e);
      }
      setPortalBreached(false);
      setJustBreached(false);
    };
    window.addEventListener('cybershield-portal-breached', onBreach);
    window.addEventListener('cybershield-reopen-portal', onReopen);
    return () => {
      window.removeEventListener('cybershield-portal-breached', onBreach);
      window.removeEventListener('cybershield-reopen-portal', onReopen);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setPortalBreached(true);
    }
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Live UTC Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.setMuted(!nextState);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isPublicPage = location.pathname === '/' || location.pathname.startsWith('/safety');

  return (
    <div className={justBreached ? 'portal-header-slide' : ''}>
      {/* TACTICAL TOP TELEMETRY RIBBON - SCARY HACKER WARFARE */}
      <div
        className="telemetry-ribbon"
        style={{
          backgroundColor: '#020307',
          borderBottom: '1px solid rgba(255, 0, 60, 0.35)',
          padding: '4px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          zIndex: 101,
          position: 'relative',
          boxShadow: '0 0 20px rgba(255, 0, 60, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={11} color="#00f0ff" />
            <span>ZULU: <strong style={{ color: '#f8fafc' }}>{utcTime}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="ribbon-defcon">
            <AlertTriangle size={11} color="#ff003c" />
            <span>DEFCON: <strong style={{ color: '#ff003c', textShadow: '0 0 8px #ff003c', animation: 'pulse-glow-red 1.2s infinite' }}>1 [OMEGA INTRUSION]</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="ribbon-geo">
            <Radio size={11} color="#00f0ff" />
            <span>RED CELL: <strong style={{ color: '#ff4d6d' }}>ACTIVE</strong> // BLUE SHIELD: <strong style={{ color: '#00f0ff' }}>ENGAGED</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="ribbon-dlp">
            <Lock size={11} color="#ff003c" />
            <span>DLP: <strong style={{ color: '#ff003c', letterSpacing: '0.5px' }}>COPY/PASTE/SCREENSHOT LOCKED</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Cyber SFX Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: soundEnabled ? 'rgba(255, 0, 60, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: soundEnabled ? '1px solid #ff003c' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '2px 8px',
              color: soundEnabled ? '#ff4d6d' : 'var(--text-muted)',
              fontSize: '0.66rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
              boxShadow: soundEnabled ? '0 0 10px rgba(255, 0, 60, 0.4)' : 'none',
            }}
            title="Toggle synthesized HUD audio effects"
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>SFX: {soundEnabled ? 'ARMED' : 'MUTED'}</span>
          </button>

          {/* Re-enter Portal Trigger */}
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              try {
                localStorage.removeItem('cybershield_portal_breached');
                sessionStorage.removeItem('cybershield_portal_breached');
              } catch (e) {
                console.error(e);
              }
              if (location.pathname !== '/') {
                navigate('/');
              }
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('cybershield-reopen-portal'));
              }, 50);
            }}
            style={{
              background: 'rgba(255, 0, 60, 0.15)',
              border: '1px solid rgba(255, 0, 60, 0.4)',
              borderRadius: '4px',
              padding: '2px 8px',
              color: '#ff4d6d',
              fontSize: '0.66rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
            title="Re-open the Scary Cyber Entry Portal"
          >
            <ShieldAlert size={12} color="#ff003c" />
            <span>PORTAL GATEWAY</span>
          </button>

          <span className="ribbon-grid-ver" style={{ color: '#00f0ff', fontFamily: 'monospace', fontWeight: 700 }}>WARFARE_GRID_v2.0</span>
        </div>
      </div>

      <header
        style={{
          height: 'var(--header-height, 68px)',
          backgroundColor: scrolled ? 'rgba(3, 5, 12, 0.96)' : 'rgba(5, 8, 18, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 0, 60, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 35px -10px rgba(0,0,0,0.9), 0 0 25px rgba(255, 0, 60, 0.15)',
        }}
      >
        {/* LEFT: Compact Cyber Logo Anchor */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none',
            flexShrink: 0,
          }}
          onMouseEnter={() => cyberAudio.playHover()}
          onClick={() => cyberAudio.playClick()}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.35) 0%, rgba(8, 12, 24, 0.95) 50%, rgba(0, 240, 255, 0.3) 100%)',
              border: '1.5px solid #ff003c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(255, 0, 60, 0.5)',
              flexShrink: 0,
            }}
          >
            <Shield size={20} color="#ff003c" style={{ filter: 'drop-shadow(0 0 6px #ff003c)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span 
                style={{ 
                  fontWeight: 900, 
                  fontSize: '1.2rem', 
                  letterSpacing: '-0.02em', 
                  fontFamily: 'var(--font-heading)',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                CYBER<span style={{ color: '#ff003c', textShadow: '0 0 10px #ff003c' }}>SHIELD</span>
              </span>
              <span 
                style={{ 
                  fontSize: '0.6rem', 
                  color: '#00f0ff', 
                  border: '1px solid rgba(0, 240, 255, 0.4)', 
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  borderRadius: '4px', 
                  padding: '1px 5px', 
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                PORTAL
              </span>
            </div>
            <span 
              className="brand-sub-title"
              style={{ 
                fontSize: '0.6rem', 
                color: '#ff4d6d', 
                letterSpacing: '0.12em', 
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginTop: '-2px',
                whiteSpace: 'nowrap',
              }}
            >
              RED // BLUE SOC
            </span>
          </div>
        </Link>

        {/* CENTER: Clean, Non-wrapping Public Navigation Links */}
        {isPublicPage && (
          <nav
            className="header-nav-links desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: '0 16px',
              flexShrink: 0,
            }}
          >
            {[
              { name: 'Command HUD', href: '#platform' },
              { name: 'Threat Matrix', href: '#threat-vectors' },
              { name: 'Hacker CLI', href: '#cli-terminal' },
              { name: 'Triage Lifecycle', href: '#workflow' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  cyberAudio.playHover();
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 60, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 0, 60, 0.35)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 0, 60, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {item.name}
              </a>
            ))}

            <Link
              to="/safety"
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#cbd5e1',
                padding: '6px 12px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition: 'all 0.18s ease',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                cyberAudio.playHover();
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.35)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 240, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Safety Hub
            </Link>
          </nav>
        )}

        {/* RIGHT: User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Desktop Auth Controls */}
          <div className="desktop-auth-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <NotificationBell />

                {/* Streamlined User Identity Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(255, 0, 60, 0.1)',
                    border: '1px solid rgba(255, 0, 60, 0.35)',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="status-dot status-dot-critical" style={{ width: '6px', height: '6px' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      color: '#ff4d6d',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(255, 0, 60, 0.25)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                    }}
                  >
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.78rem',
                      gap: '5px',
                      borderColor: 'rgba(255, 0, 60, 0.4)',
                      color: '#f87171',
                      whiteSpace: 'nowrap',
                    }}
                    title="SOC Admin Console"
                  >
                    <ShieldAlert size={13} color="#ff003c" /> Admin
                  </Link>
                )}

                {isCoordinator && !isAdmin && (
                  <Link
                    to="/coordinator"
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.78rem',
                      gap: '5px',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      color: '#38bdf8',
                      whiteSpace: 'nowrap',
                    }}
                    title="Coordinator Console"
                  >
                    <LayoutDashboard size={13} color="#00f0ff" /> Coordinator
                  </Link>
                )}

                {!isAdmin && !isCoordinator && (
                  <Link
                    to="/dashboard"
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.78rem',
                      gap: '5px',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      color: '#38bdf8',
                      whiteSpace: 'nowrap',
                    }}
                    title="User Workspace"
                  >
                    <LayoutDashboard size={13} color="#00f0ff" /> Dashboard
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="btn btn-ghost btn-sm" 
                  title="Logout"
                  style={{
                    padding: '6px 8px',
                    color: 'var(--text-muted)',
                    borderRadius: '6px',
                  }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    padding: '6px 14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/report"
                  className="btn btn-danger btn-sm"
                  style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '6px 14px',
                    whiteSpace: 'nowrap',
                    gap: '5px',
                  }}
                >
                  <AlertTriangle size={13} /> Report
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Drawer"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: mobileMenuOpen ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255, 255, 255, 0.06)',
              border: mobileMenuOpen ? '1px solid var(--accent-cyan-bright)' : '1px solid rgba(255, 255, 255, 0.12)',
              color: mobileMenuOpen ? 'var(--accent-cyan-bright)' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            position: 'fixed',
            top: 'calc(var(--header-height, 64px) + 28px)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99,
            overflowY: 'auto',
            padding: '24px 20px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderBottom: '2px solid rgba(0, 242, 254, 0.3)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Emergency Report Incident Hero Button in Drawer */}
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            }}
          >
            <AlertTriangle size={18} />
            <span>REPORT CYBER INCIDENT NOW</span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan-bright)', letterSpacing: '0.08em', marginBottom: '4px' }}>
              MAIN NAVIGATION
            </div>

            <a
              href="/#platform"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#FFF',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <Shield size={18} color="var(--accent-cyan)" />
              <span>Command Cockpit HUD</span>
            </a>

            <a
              href="/#threat-vectors"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#FFF',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <Activity size={18} color="#f59e0b" />
              <span>Threat Spectrum & Vectors</span>
            </a>

            <a
              href="/#cli-terminal"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#FFF',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <Cpu size={18} color="var(--accent-cyan-bright)" />
              <span>Hacker CLI Terminal</span>
            </a>

            <a
              href="/#workflow"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#FFF',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <Layers size={18} color="#34d399" />
              <span>Triage & Investigation Lifecycle</span>
            </a>

            <Link
              to="/safety"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#FFF',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <BookOpen size={18} color="#38bdf8" />
              <span>Safety Knowledge Hub</span>
            </Link>
          </div>

          {/* User Account / Auth Section in Drawer */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              ACCOUNT & WORKSPACES
            </div>

            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'rgba(6, 182, 212, 0.08)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem' }}>{user?.fullName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan-bright)', fontFamily: 'var(--font-mono)' }}>{user?.email}</div>
                  </div>
                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--accent-cyan-bright)', color: '#000', fontWeight: 800 }}>
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                </div>

                {isAdmin && (
                  <>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <ShieldAlert size={16} color="var(--accent-cyan)" /> SOC Command Center
                    </Link>
                    <Link to="/admin/complaints" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Layers size={16} /> Incident Records Grid
                    </Link>
                    <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <User size={16} /> Users & Roles Directory
                    </Link>
                    <Link to="/threat-intel" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Activity size={16} /> Live Threat Intelligence
                    </Link>
                    <Link to="/terminal" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Cpu size={16} /> Integrated CLI Shell
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <User size={16} /> Security Profile
                    </Link>
                  </>
                )}

                {isCoordinator && (
                  <>
                    <Link to="/coordinator" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <LayoutDashboard size={16} color="var(--accent-amber)" /> Coordinator Console
                    </Link>
                    <Link to="/coordinator/records" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Layers size={16} /> Assigned Case Records
                    </Link>
                    <Link to="/coordinator/tasks" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Activity size={16} /> Pending Triage Tasks
                    </Link>
                    <Link to="/threat-analysis" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Search size={16} /> URL & Threat Analyzer
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <User size={16} /> Investigator Profile
                    </Link>
                  </>
                )}

                {!isAdmin && !isCoordinator && (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <LayoutDashboard size={16} color="var(--accent-cyan-bright)" /> Citizen Dashboard
                    </Link>
                    <Link to="/complaints" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Layers size={16} /> My Filed Records
                    </Link>
                    <Link to="/report" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <AlertTriangle size={16} color="var(--accent-amber)" /> Report Cyber Incident
                    </Link>
                    <Link to="/threat-analysis" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <Search size={16} /> URL & Threat Analyzer
                    </Link>
                    <Link to="/safety" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <BookOpen size={16} /> Safety Knowledge Center
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', gap: '10px' }}>
                      <User size={16} /> Account Profile
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', color: '#f87171' }}
                >
                  <LogOut size={16} /> Terminate Secure Session
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center', padding: '12px' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '12px' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Command Palette Modal */}
      <CommandPaletteModal 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)}
        onOpenTerminal={() => { setCommandPaletteOpen(false); navigate('/terminal'); }}
      />

      <style>{`
        @media (min-width: 900px) {
          .header-nav-links {
            display: flex !important;
          }
          .ribbon-geo {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-nav-toggle {
            display: flex !important;
          }
          .desktop-auth-controls {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .intel-search-text, .intel-search-kbd, .ribbon-defcon, .ribbon-grid-ver {
            display: none !important;
          }
          .telemetry-ribbon {
            padding: 4px 12px !important;
          }
        }
        @media (max-width: 480px) {
          .brand-sub-title, .beacon-status-chip {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

