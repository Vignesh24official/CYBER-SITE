import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, ShieldAlert, LayoutDashboard, Search, Terminal, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { CommandPaletteModal } from './CommandPaletteModal';
import { CyberShieldSecurityPulse } from './CyberShieldSecurityPulse';

export const Header = () => {
  const { user, isAuthenticated, logout, isAdmin, isInvestigator } = useAuth();
  const navigate = useNavigate();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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

  return (
    <>
      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: '#0b0e17',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand Logo & Security Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Shield size={26} color="var(--accent-cyan-bright)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#FFF' }}>
                CYBER<span style={{ color: 'var(--accent-cyan-bright)' }}>SHIELD</span>
              </span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginTop: '-4px', fontFamily: 'monospace' }}>
                SOC THREAT & INTELLIGENCE
              </span>
            </div>
          </Link>
          <CyberShieldSecurityPulse statusText="GRID ONLINE" compact={true} />
        </div>

        {/* Command Search Bar in Center */}
        <div
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#07090e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '6px 14px',
            width: '100%',
            maxWidth: '460px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Search size={15} color="var(--accent-cyan-bright)" />
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Search assets, vulnerabilities, CVEs, IPs, domains...
          </span>
          <span style={{ fontSize: '0.675rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Ctrl+K
          </span>
        </div>

        {/* Right Menu Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/safety" style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Safety Center
          </Link>

          {isAuthenticated ? (
            <>
              <NotificationBell />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '10px', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user?.fullName}
                  </span>
                  <span style={{ fontSize: '0.675rem', color: 'var(--accent-cyan-bright)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                </div>

                {isAdmin && (
                  <Link to="/admin" className="btn btn-secondary btn-sm" title="SOC Admin Dashboard">
                    <ShieldAlert size={14} /> SOC Admin
                  </Link>
                )}

                {isInvestigator && !isAdmin && (
                  <Link to="/investigator" className="btn btn-secondary btn-sm" title="Investigator Workbench">
                    <LayoutDashboard size={14} /> Workbench
                  </Link>
                )}

                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Report Incident
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
    </>
  );
};
