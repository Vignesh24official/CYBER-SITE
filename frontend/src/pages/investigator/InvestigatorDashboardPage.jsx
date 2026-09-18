import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investigationService } from '../../services/investigationService';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { Briefcase, AlertTriangle, Clock, CheckCircle2, ChevronRight, Shield, ShieldAlert, Eye, Search, Activity } from 'lucide-react';

export const InvestigatorDashboardPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await investigationService.getAssignedCases(0, 15);
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
  const criticalHigh = cases.filter((c) => c.severity === 'CRITICAL' || c.severity === 'HIGH').length;
  const underInv = cases.filter((c) => c.status === 'UNDER_INVESTIGATION' || c.status === 'ASSIGNED').length;
  const waitingInfo = cases.filter((c) => c.status === 'WAITING_FOR_INFORMATION').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* HEADER BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(17, 22, 34, 0.95) 100%)',
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
            <ShieldAlert size={30} color="var(--accent-cyan-bright)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
                SOC Investigator Workbench
              </h2>
              <CyberShieldSecurityPulse statusText="INVESTIGATOR WORKSPACE ACTIVE" compact={true} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Active cyber crime investigations, forensic evidence analysis, and SLA tracking workbench.
            </p>
          </div>
        </div>

        <Link to="/investigator/cases" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem', fontWeight: 700 }}>
          <Briefcase size={16} /> Open All Cases ({totalAssigned})
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4">
        <StatCard title="Assigned Queue" value={totalAssigned} icon={Briefcase} color="var(--accent-cyan-bright)" />
        <StatCard title="Critical/High Cases" value={criticalHigh} icon={AlertTriangle} color="var(--accent-rose)" />
        <StatCard title="Active Investigations" value={underInv} icon={Activity} color="var(--accent-cyan)" />
        <StatCard title="Victim Info Pending" value={waitingInfo} icon={Clock} color="var(--accent-amber)" />
      </div>

      {/* ASSIGNED CASES QUEUE TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 className="card-title">Assigned Investigation Cases</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cases assigned for forensic triage and investigation</p>
          </div>
          <Link to="/investigator/cases" className="btn btn-secondary btn-sm">View Full Queue</Link>
        </div>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Loading investigator workspace...
          </div>
        ) : cases.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No assigned cases in your investigation queue.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Incident ID</th>
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
                {cases.map((c) => (
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
                      <Link to={`/investigator/cases/${c.publicId}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>Inspect Case</span> <ChevronRight size={14} />
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
