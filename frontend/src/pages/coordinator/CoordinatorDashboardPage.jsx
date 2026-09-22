import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coordinatorService } from '../../services/investigationService';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { 
  Briefcase, AlertTriangle, Clock, CheckCircle2, ChevronRight, 
  ShieldAlert, Activity, Search, ListFilter, ArrowRight 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const CoordinatorDashboardPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await coordinatorService.getAssignedCases(0, 50);
        if (res.success && res.data) {
          setCases(res.data.content || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const totalAssigned = cases.length;
  const pendingTasks = cases.filter((c) => c.status === 'ASSIGNED' || c.status === 'WAITING_FOR_INFORMATION').length;
  const inProgress = cases.filter((c) => c.status === 'UNDER_INVESTIGATION').length;
  const completed = cases.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const criticalHigh = cases.filter((c) => c.severity === 'CRITICAL' || c.severity === 'HIGH').length;

  const chartData = [
    { name: 'Pending Action', value: pendingTasks, color: '#f59e0b' },
    { name: 'Under Investigation', value: inProgress, color: '#06b6d4' },
    { name: 'Resolved / Closed', value: completed, color: '#10b981' },
    { name: 'Other Status', value: Math.max(0, totalAssigned - pendingTasks - inProgress - completed), color: '#64748b' }
  ].filter(d => d.value > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* HEADER BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(11, 14, 23, 0.98) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={28} color="var(--accent-cyan-bright)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF' }}>
                Incident Coordinator Console
              </h2>
              <CyberShieldSecurityPulse statusText="COORDINATOR DISPATCH ACTIVE" compact={true} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Centralized case allocation, forensic findings triage, user communication, and investigation resolution.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/coordinator/tasks" className="btn btn-secondary btn-sm">
            <ListFilter size={15} /> Pending Tasks ({pendingTasks})
          </Link>
          <Link to="/coordinator/records" className="btn btn-primary btn-sm">
            <Briefcase size={15} /> All Assigned Records ({totalAssigned})
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4">
        <StatCard title="Assigned Records" value={totalAssigned} icon={Briefcase} color="var(--accent-cyan-bright)" />
        <StatCard title="Pending Action / Info" value={pendingTasks} icon={Clock} color="var(--accent-amber)" />
        <StatCard title="In-Progress Inquiries" value={inProgress} icon={Activity} color="var(--accent-cyan)" />
        <StatCard title="Completed Cases" value={completed} icon={CheckCircle2} color="var(--accent-emerald)" />
      </div>

      {/* WORKLOAD DISTRIBUTION ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Status Distribution Donut Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title" style={{ fontSize: '0.95rem', marginBottom: '12px' }}>
            Case Lifecycle Status Distribution
          </h3>
          {totalAssigned === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No assigned cases to plot.
            </div>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111622', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            {chartData.map((d) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}:</span>
                <span style={{ fontWeight: 700, color: '#FFF' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority & Quick Actions Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '0.95rem', marginBottom: '12px' }}>
              Coordinator Quick Actions & Priorities
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              You have <strong style={{ color: 'var(--accent-rose)' }}>{criticalHigh}</strong> critical or high-severity cases requiring immediate review and forensic logging.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/coordinator/tasks"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  color: '#fbbf24',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <span>Triage Pending Information Requests ({pendingTasks})</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/threat-analysis"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: '8px',
                  color: 'var(--accent-cyan-bright)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <span>Launch URL Threat Heuristic Scanner</span>
                <Search size={16} />
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Note: All status transitions and forensic remarks are logged to immutable system audit trail.
            </span>
          </div>
        </div>
      </div>

      {/* RECENT ASSIGNED CASES TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 className="card-title">Recent Assigned Cases</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest cyber threat reports under your investigation management</p>
          </div>
          <Link to="/coordinator/records" className="btn btn-secondary btn-sm">
            View All Records
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading coordinator workspace...
          </div>
        ) : cases.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No assigned cases currently in your queue.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Complaint #</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Reporter</th>
                  <th>Financial Loss</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 8).map((c) => (
                  <tr key={c.publicId}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan-bright)' }}>
                      {c.complaintNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                    <td><SeverityBadge severity={c.severity} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: '0.85rem' }}>{c.reporterName}</td>
                    <td style={{ fontFamily: 'monospace', color: Number(c.financialLoss) > 0 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                      ₹ {c.financialLoss}
                    </td>
                    <td>
                      <Link to={`/coordinator/cases/${c.publicId}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>Inspect</span> <ChevronRight size={14} />
                      </Link>
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
