import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, FileText, Search, User, ShieldAlert, 
  Users, BarChart3, Clock, Settings, BookOpen, Briefcase, Cpu, Globe, 
  HardDrive, Activity, Network, Terminal, CheckCircle2, ListFilter
} from 'lucide-react';

export const Sidebar = ({ type = 'admin' }) => {
  const adminLinks = [
    { to: '/admin', label: 'SOC Command Center', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users Directory', icon: Users },
    { to: '/admin/coordinators', label: 'Coordinators Roster', icon: Briefcase },
    { to: '/admin/complaints', label: 'Incident Records Grid', icon: ShieldAlert },
    { to: '/admin/reports', label: 'Analytics & Export', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'Audit Trail Logs', icon: Clock },
    { to: '/reconnaissance', label: 'Reconnaissance', icon: Cpu },
    { to: '/attack-surface', label: 'Attack Surface', icon: Globe },
    { to: '/assets', label: 'Monitored Assets', icon: HardDrive },
    { to: '/vulnerabilities', label: 'Vulnerabilities & CVEs', icon: AlertTriangle },
    { to: '/threat-intel', label: 'Threat Intelligence', icon: Activity },
    { to: '/network-topology', label: 'Network Topology', icon: Network },
    { to: '/terminal', label: 'Integrated CLI', icon: Terminal },
    { to: '/threat-analysis', label: 'URL Threat Analyzer', icon: Search },
    { to: '/profile', label: 'Administrator Profile', icon: User },
  ];

  const coordinatorLinks = [
    { to: '/coordinator', label: 'Coordinator Console', icon: LayoutDashboard },
    { to: '/coordinator/records', label: 'Assigned Records', icon: Briefcase },
    { to: '/coordinator/tasks', label: 'Pending Tasks', icon: ListFilter },
    { to: '/coordinator/completed', label: 'Completed Tasks', icon: CheckCircle2 },
    { to: '/threat-analysis', label: 'URL Threat Analyzer', icon: Search },
    { to: '/safety', label: 'Safety Resources', icon: BookOpen },
    { to: '/profile', label: 'Coordinator Profile', icon: User },
  ];

  const investigatorLinks = coordinatorLinks;

  const userLinks = [
    { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/complaints', label: 'My Records', icon: FileText },
    { to: '/report', label: 'Report Incident', icon: AlertTriangle },
    { to: '/threat-analysis', label: 'URL Analyzer', icon: Search },
    { to: '/safety', label: 'Safety Center', icon: BookOpen },
    { to: '/profile', label: 'Account Profile', icon: User },
  ];

  const links = type === 'admin' ? adminLinks : type === 'coordinator' ? coordinatorLinks : type === 'investigator' ? investigatorLinks : userLinks;

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: '#0b0e17',
        borderRight: '1px solid var(--border-color)',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minHeight: 'calc(100vh - var(--header-height))',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '4px 10px 12px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {type === 'admin' ? 'Cyber Intelligence SOC' : type === 'coordinator' || type === 'investigator' ? 'Coordinator Console' : 'Incident Portal'}
      </div>

      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/coordinator' || link.to === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#FFF' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-cyan-bright)' : '3px solid transparent',
              transition: 'var(--transition)',
            })}
          >
            <Icon size={16} color="var(--accent-cyan-bright)" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};
