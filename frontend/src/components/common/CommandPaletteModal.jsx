import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Shield, Terminal, Network, AlertTriangle, Cpu, Globe, 
  FileText, ShieldAlert, ArrowRight, CornerDownLeft, X, Activity, HardDrive
} from 'lucide-react';

export const CommandPaletteModal = ({ isOpen, onClose, onOpenTerminal }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled externally or passed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commandItems = [
    // Views
    { category: 'Navigation Views', label: 'SOC Command Center Overview', icon: Shield, type: 'nav', action: '/admin' },
    { category: 'Navigation Views', label: 'Reconnaissance & Security Testing Workspace', icon: Cpu, type: 'nav', action: '/reconnaissance' },
    { category: 'Navigation Views', label: 'Attack Surface & Asset Exposure Map', icon: Globe, type: 'nav', action: '/attack-surface' },
    { category: 'Navigation Views', label: 'Asset Inventory & Monitoring', icon: HardDrive, type: 'nav', action: '/assets' },
    { category: 'Navigation Views', label: 'Vulnerability Management & CVE Database', icon: AlertTriangle, type: 'nav', action: '/vulnerabilities' },
    { category: 'Navigation Views', label: 'Threat Intelligence & IOC Feeds', icon: Activity, type: 'nav', action: '/threat-intel' },
    { category: 'Navigation Views', label: 'Network Topology Map', icon: Network, type: 'nav', action: '/network-topology' },
    { category: 'Navigation Views', label: 'Integrated CLI Terminal', icon: Terminal, type: 'nav', action: '/terminal' },
    { category: 'Navigation Views', label: 'Incident Complaints Management', icon: ShieldAlert, type: 'nav', action: '/admin/complaints' },
    { category: 'Navigation Views', label: 'SOC Audit Trail Logs', icon: FileText, type: 'nav', action: '/admin/audit-logs' },

    // Assets & IPs
    { category: 'Monitored Assets', label: 'srv-prod-db-01 (10.0.4.15) - PostgreSQL Database', icon: HardDrive, type: 'asset', action: '/assets?search=srv-prod-db-01' },
    { category: 'Monitored Assets', label: 'api.cybershield.org (10.0.1.5) - Public Gateway', icon: Globe, type: 'asset', action: '/assets?search=api.cybershield.org' },
    { category: 'Monitored Assets', label: 'fw-edge-01 (10.0.0.1) - Palo Alto WAF Firewall', icon: Network, type: 'asset', action: '/assets?search=fw-edge-01' },

    // CVEs & Threats
    { category: 'Vulnerabilities', label: 'CVE-2024-3094 - XZ Utils Remote Code Execution (CVSS 10.0)', icon: AlertTriangle, type: 'cve', action: '/vulnerabilities?cve=CVE-2024-3094' },
    { category: 'Vulnerabilities', label: 'CVE-2023-4863 - WebP Buffer Overflow (CVSS 8.8)', icon: AlertTriangle, type: 'cve', action: '/vulnerabilities?cve=CVE-2023-4863' },
    { category: 'Threat Intelligence', label: 'IOC 185.220.101.5 - Tor Exit Node / Botnet C2', icon: Activity, type: 'ioc', action: '/threat-intel?search=185.220.101.5' },

    // Actions
    { category: 'Security Actions', label: 'Open Terminal Drawer (Ctrl+~)', icon: Terminal, type: 'action', action: 'toggle_terminal' },
    { category: 'Security Actions', label: 'Launch Active Recon Scan', icon: Cpu, type: 'action', action: '/reconnaissance?action=new' },
  ];

  const filteredItems = commandItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    onClose();
    if (item.action === 'toggle_terminal') {
      if (onOpenTerminal) onOpenTerminal();
    } else if (typeof item.action === 'string') {
      navigate(item.action);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(7, 9, 14, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#111622',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(6, 182, 212, 0.15)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', gap: '12px' }}>
          <Search size={20} color="var(--accent-cyan-bright)" />
          <input
            type="text"
            placeholder="Search assets, vulnerabilities, CVEs, IPs, domains, pages, commands..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              fontSize: '1rem',
              color: '#FFF',
              padding: 0,
            }}
          />
          <span style={{ fontSize: '0.725rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            ESC
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px 12px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No matching assets, CVEs, or commands found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                    transition: 'all 0.1s ease',
                    marginBottom: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      padding: '6px', 
                      borderRadius: '6px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? 'var(--accent-cyan-bright)' : 'var(--text-secondary)'
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: isSelected ? '#FFF' : 'var(--text-primary)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isSelected ? 'var(--accent-cyan-bright)' : 'var(--text-muted)' }}>
                    <span style={{ fontSize: '0.75rem' }}>Select</span>
                    <CornerDownLeft size={12} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0b0e17', 
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span><strong style={{ color: '#FFF' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: '#FFF' }}>↵</strong> Select</span>
            <span><strong style={{ color: '#FFF' }}>ESC</strong> Close</span>
          </div>
          <span style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
            CyberShield Command Palette v2.4
          </span>
        </div>
      </div>
    </div>
  );
};
