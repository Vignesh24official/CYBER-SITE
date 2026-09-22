import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { adminService } from '../../services/adminService';
import { StatCard } from '../../components/dashboard/StatCard';
import { SeverityPieChart, CategoryBarChart } from '../../components/dashboard/AnalyticsChart';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { NetworkTopology } from '../../components/common/NetworkTopology';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Clock, FileText, Download, Users, 
  Shield, Cpu, Terminal, Search, Activity, Globe, HardDrive, ArrowUpRight,
  UserCheck, Briefcase, RefreshCw, KeyRound
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const trafficData = [
    { time: '00:00', ingress: 420, egress: 210, threats: 2 },
    { time: '04:00', ingress: 380, egress: 190, threats: 1 },
    { time: '08:00', ingress: 950, egress: 540, threats: 8 },
    { time: '12:00', ingress: 1420, egress: 890, threats: 15 },
    { time: '16:00', ingress: 1280, egress: 760, threats: 9 },
    { time: '20:00', ingress: 890, egress: 430, threats: 4 }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, compRes, userRes] = await Promise.all([
        reportService.getAnalyticsSummary(),
        adminService.getComplaints({ page: 0, size: 6, sortBy: 'createdAt', sortDir: 'desc' }),
        adminService.getUserStats().catch(() => ({ success: false, data: null }))
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
      if (compRes.success && compRes.data) {
        setRecentComplaints(compRes.data.content || []);
      }
      if (userRes && userRes.success && userRes.data) {
        setUserStats(userRes.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', backgroundColor: '#0f1420', padding: '20px 24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={24} color="var(--accent-cyan-bright)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>SOC Command Center & Cyber Intelligence</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time security posture monitoring, threat telemetry, multi-role user directory & active incident triage
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={fetchData} className="btn btn-secondary btn-sm" title="Refresh Live Metrics">
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Refresh
          </button>
          <Link to="/terminal" className="btn btn-secondary btn-sm">
            <Terminal size={14} /> Integrated CLI
          </Link>
          <a href={reportService.getCsvExportUrl()} download className="btn btn-secondary btn-sm">
            <Download size={14} /> Export CSV
          </a>
          <Link to="/admin/complaints" className="btn btn-primary btn-sm">
            <ShieldAlert size={14} /> Triage Incidents
          </Link>
        </div>
      </div>

      {/* Security Posture Score & Main Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px' }}>
        {/* Posture Score Gauge Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#0b0e17' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Security Posture Score
          </span>
          <div style={{ margin: '14px 0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle 
                cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" strokeWidth="10"
                strokeDasharray="314" strokeDashoffset="40" strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', lineHeight: '1' }}>87</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>/ 100</span>
            </div>
          </div>
          <span className="sev-badge sev-low" style={{ fontSize: '0.725rem' }}>
            SECURE - ZERO TRUST ENFORCED
          </span>
        </div>

        {/* 4 Core Incident Stat Cards */}
        {summary && (
          <div className="grid-4">
            <StatCard title="Total Incidents" value={summary.totalIncidents} icon={FileText} color="var(--accent-cyan-bright)" />
            <StatCard title="Active Threats / Unreviewed" value={summary.newIncidents} icon={AlertTriangle} color="var(--accent-amber)" />
            <StatCard title="Critical CVE Exposures" value={summary.highRiskIncidents + summary.criticalIncidents} icon={ShieldAlert} color="var(--accent-rose)" />
            <StatCard title="Monitored Infrastructure" value="42 Assets" icon={HardDrive} color="var(--accent-emerald)" />
          </div>
        )}
      </div>

      {/* PLATFORM USER & ROSTER METRICS ROW */}
      {userStats && (
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} color="var(--accent-cyan-bright)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>
                Platform Multi-Role User Registry
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> Manage All Users
              </Link>
              <Link to="/admin/coordinators" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={14} /> Officer Roster
              </Link>
            </div>
          </div>

          <div className="grid-4" style={{ gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>{userStats.totalUsers ?? 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Registered Accounts</div>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>{userStats.coordinatorsCount ?? 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Coordinators & Investigators</div>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>{userStats.citizensCount ?? 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Registered Citizens / Users</div>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>{userStats.adminsCount ?? 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>System Administrators</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Topology Visualization */}
      <NetworkTopology />

      {/* Analytics Charts & Bandwidth Graphs */}
      {summary && (
        <div className="grid-2">
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '12px', fontSize: '0.95rem' }}>Vulnerability Risk Severity Breakdown</h3>
            <SeverityPieChart data={summary.severityBreakdown} />
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="card-title" style={{ marginBottom: '12px', fontSize: '0.95rem' }}>
              Network Activity & Threat Telemetry (Gbps)
            </h3>
            <div style={{ flex: 1, minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorIngress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#111622', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                  <Area type="monotone" dataKey="ingress" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIngress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Incidents Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Security Operations & Incident Triage</h3>
          <Link to="/admin/complaints" className="btn btn-secondary btn-sm">View Full Grid</Link>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading SOC queue...</div>
        ) : recentComplaints.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>No incidents logged.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Complaint #</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Reporter</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Investigator</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c.publicId}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan-bright)' }}>{c.complaintNumber}</td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.reporterName}</td>
                    <td><SeverityBadge severity={c.severity} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ color: c.assignedInvestigatorName === 'Unassigned' ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                      {c.assignedInvestigatorName}
                    </td>
                    <td>
                      <Link to={`/admin/complaints/${c.publicId}`} className="btn btn-secondary btn-sm">Triage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
