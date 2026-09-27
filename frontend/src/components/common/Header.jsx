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
  Compass
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
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [utcTime, setUtcTime] = useState('');

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
        style={{
          backgroundColor: '#020409',
          borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
          padding: '4px 24px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={11} color="var(--accent-cyan)" />
            <span>ZULU TIME: <strong style={{ color: '#f8fafc' }}>{utcTime}</strong></span>
          </div>

          <div style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="ribbon-geo">
            <Compass size={11} color="#34d399" />
            <span>GEO-ORBIT: <strong style={{ color: '#94a3b8' }}>37.7749° N, 122.4194° W</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            title="Toggle synthesized sci-fi HUD audio effects"
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>SFX: {soundEnabled ? 'ACTIVE' : 'MUTED'}</span>
          </button>

          <span style={{ color: 'var(--accent-cyan-bright)' }}>GRID REV 4.12</span>
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
              display: 'none',
              alignItems: 'center',
              gap: '24px',
            }}
            className="header-nav-links"
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Quick Intel Search Trigger */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              setCommandPaletteOpen(true);
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(9, 14, 28, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              padding: '7px 14px',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              transition: 'var(--transition)',
              cursor: 'pointer',
            }}
          >
            <Search size={15} color="var(--accent-cyan)" />
            <span style={{ display: 'inline', fontSize: '0.8rem' }}>Intel Search</span>
            <kbd
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

          {isAuthenticated ? (
            <>
              <NotificationBell />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user?.fullName}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '0.675rem', 
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
                  <Link 
                    to="/admin" 
                    className="btn btn-secondary btn-sm" 
                    title="SOC Admin Console"
                    onMouseEnter={() => cyberAudio.playHover()}
                    onClick={() => cyberAudio.playClick()}
                  >
                    <ShieldAlert size={14} color="var(--accent-cyan)" /> Admin Console
                  </Link>
                )}

                {isCoordinator && !isAdmin && (
                  <Link 
                    to="/coordinator" 
                    className="btn btn-secondary btn-sm" 
                    title="Coordinator Console"
                    onMouseEnter={() => cyberAudio.playHover()}
                    onClick={() => cyberAudio.playClick()}
                  >
                    <LayoutDashboard size={14} color="var(--accent-cyan)" /> Coordinator
                  </Link>
                )}

                {!isAdmin && !isCoordinator && (
                  <Link 
                    to="/dashboard" 
                    className="btn btn-secondary btn-sm" 
                    title="User Workspace"
                    onMouseEnter={() => cyberAudio.playHover()}
                    onClick={() => cyberAudio.playClick()}
                  >
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
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/login" 
                className="btn btn-secondary btn-sm"
                onMouseEnter={() => cyberAudio.playHover()}
                onClick={() => cyberAudio.playClick()}
                style={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '7px 16px',
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/report" 
                className="btn btn-primary btn-sm"
                onMouseEnter={() => cyberAudio.playHover()}
                onClick={() => cyberAudio.playClick()}
                style={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '7px 18px',
                  boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)',
                }}
              >
                <AlertTriangle size={14} /> Report Incident
              </Link>
            </div>
          )}
        </div>
      </header>

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
      `}</style>
    </>
  );
};
