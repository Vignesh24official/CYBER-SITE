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
  X
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
    <>
      {/* TACTICAL TOP TELEMETRY RIBBON */}
      <div
        className="telemetry-ribbon"
        style={{
          backgroundColor: '#020409',
          borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
          padding: '4px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          zIndex: 101,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={11} color="var(--accent-cyan)" />
            <span>ZULU: <strong style={{ color: '#f8fafc' }}>{utcTime}</strong></span>
          </div>

          <div style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="ribbon-geo">
            <Compass size={11} color="#34d399" />
            <span>GEO: <strong style={{ color: '#94a3b8' }}>37.77° N, 122.41° W</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="ribbon-defcon">
            <span>DEFCON: <strong style={{ color: '#fbbf24' }}>2 [GUARDED]</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Cyber SFX Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: soundEnabled ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: soundEnabled ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '2px 8px',
              color: soundEnabled ? '#00f2fe' : 'var(--text-muted)',
              fontSize: '0.66rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
            title="Toggle synthesized HUD audio effects"
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>SFX: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <span className="ribbon-grid-ver" style={{ color: 'var(--accent-cyan-bright)' }}>GRID 4.12</span>
        </div>
      </div>

      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: scrolled ? 'rgba(4, 7, 17, 0.94)' : 'rgba(7, 13, 28, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0, 242, 254, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.85)' : 'none',
        }}
      >
        {/* Brand Logo & Telemetry Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <Link 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              textDecoration: 'none',
              position: 'relative'
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            onClick={() => cyberAudio.playClick()}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.22) 0%, rgba(37, 99, 235, 0.25) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(0, 242, 254, 0.3)',
              }}
            >
              <Shield size={22} color="#00f2fe" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span 
                style={{ 
                  fontWeight: 900, 
                  fontSize: '1.25rem', 
                  letterSpacing: '-0.02em', 
                  fontFamily: 'var(--font-heading)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                CYBER<span style={{ color: 'var(--accent-cyan)', textShadow: '0 0 12px rgba(0, 242, 254, 0.6)' }}>SHIELD</span>
              </span>
              <span 
                className="brand-sub-title"
                style={{ 
                  fontSize: '0.62rem', 
                  color: 'var(--text-muted)', 
                  letterSpacing: '0.14em', 
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  marginTop: '-3px'
                }}
              >
                SOC THREAT INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Grid Status Beacon */}
          <div
            className="beacon-status-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: '#34d399',
            }}
          >
            <span className="status-dot status-dot-active" style={{ width: '6px', height: '6px' }} />
            <span>GRID ONLINE</span>
          </div>
        </div>

        {/* Public Navigation Links */}
        {isPublicPage && (
          <nav
            style={{
              gap: '24px',
            }}
            className="header-nav-links desktop-only"
          >
            <a 
              href="#platform" 
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              onMouseEnter={() => cyberAudio.playHover()}
            >
              Command HUD
            </a>
            <a 
              href="#threat-vectors" 
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              onMouseEnter={() => cyberAudio.playHover()}
            >
              Threat Matrix
            </a>
            <a 
              href="#cli-terminal" 
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              onMouseEnter={() => cyberAudio.playHover()}
            >
              Hacker CLI
            </a>
            <a 
              href="#workflow" 
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              onMouseEnter={() => cyberAudio.playHover()}
            >
              Triage Lifecycle
            </a>
            <Link 
              to="/safety" 
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              onMouseEnter={() => cyberAudio.playHover()}
            >
              Safety Hub
            </Link>
          </nav>
        )}

        {/* Right Menu Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Intel Search Trigger */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              setCommandPaletteOpen(true);
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="intel-search-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(9, 14, 28, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              padding: '7px 12px',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              transition: 'var(--transition)',
              cursor: 'pointer',
            }}
            title="Search Intel (Ctrl+K)"
          >
            <Search size={15} color="var(--accent-cyan)" />
            <span className="intel-search-text" style={{ fontSize: '0.8rem' }}>Intel Search</span>
            <kbd
              className="intel-search-kbd"
              style={{
                fontSize: '0.675rem',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--accent-cyan-bright)',
                fontFamily: 'var(--font-mono)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Ctrl+K
            </kbd>
          </button>

          {/* Desktop Auth Controls (Hidden on Mobile) */}
          <div className="desktop-auth-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <NotificationBell />

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '0.65rem', 
                      color: 'var(--accent-cyan)', 
                      textTransform: 'uppercase', 
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700 
                    }}
                  >
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                </div>

                {isAdmin && (
                  <Link to="/admin" className="btn btn-secondary btn-sm" title="SOC Admin Console">
                    <ShieldAlert size={14} color="var(--accent-cyan)" /> Admin
                  </Link>
                )}

                {isCoordinator && !isAdmin && (
                  <Link to="/coordinator" className="btn btn-secondary btn-sm" title="Coordinator Console">
                    <LayoutDashboard size={14} color="var(--accent-cyan)" /> Coordinator
                  </Link>
                )}

                {!isAdmin && !isCoordinator && (
                  <Link to="/dashboard" className="btn btn-secondary btn-sm" title="User Workspace">
                    <LayoutDashboard size={14} color="var(--accent-cyan)" /> Dashboard
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="btn btn-ghost btn-sm" 
                  title="Logout"
                  style={{ padding: '6px', color: 'var(--text-muted)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, fontSize: '0.85rem', padding: '6px 14px' }}>
                  Sign In
                </Link>
                <Link to="/report" className="btn btn-primary btn-sm" style={{ fontWeight: 700, fontSize: '0.85rem', padding: '6px 14px' }}>
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
    </>
  );
};

