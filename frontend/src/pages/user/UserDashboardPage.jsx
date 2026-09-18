import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { Shield, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Info, Plus, Search, User, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export const UserDashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintService.getMyComplaints(0, 10);
        if (res.success && res.data) {
          setComplaints(res.data.content || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const underReview = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'RECEIVED' || c.status === 'INITIAL_REVIEW').length;
  const investigating = complaints.filter((c) => c.status === 'UNDER_INVESTIGATION' || c.status === 'ASSIGNED' || c.status === 'CLASSIFIED').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const rejected = complaints.filter((c) => c.status === 'REJECTED' || c.status === 'WAITING_FOR_INFORMATION').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* SECURITY STATUS BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(17, 22, 34, 0.95) 100%)',
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
            <ShieldCheck size={30} color="var(--accent-cyan-bright)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
                Security Workspace
              </h2>
              <CyberShieldSecurityPulse statusText="YOUR ACCOUNT IS PROTECTED" compact={true} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Real-time monitoring of your filed cyber threats, investigation progress, and security alerts.
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/report" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem', fontWeight: 700 }}>
            <Plus size={16} /> Report a Threat
          </Link>
          <Link to="/threat-analysis" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.875rem' }}>
            <Search size={16} /> Test URL Analyzer
          </Link>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid-4">
        <StatCard title="Total Reports" value={total} icon={FileText} color="var(--accent-cyan-bright)" />
        <StatCard title="Under Review" value={underReview} icon={Clock} color="var(--accent-amber)" />
        <StatCard title="Investigating" value={investigating} icon={ShieldAlert} color="var(--accent-cyan)" />
        <StatCard title="Resolved Cases" value={resolved} icon={CheckCircle2} color="var(--accent-emerald)" />
      </div>

      {/* RECENT INCIDENT ACTIVITY & TRACKING */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 className="card-title">Recent Incident Tracking</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monitor active investigation timelines and resolution status</p>
          </div>
          <Link to="/complaints" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>View All Reports</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Loading security records...
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px border-dashed var(--border-color)' }}>
            <Shield size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>No Incident Reports Recorded</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 20px' }}>
              You have not submitted any cybersecurity incident reports yet.
            </p>
            <Link to="/report" className="btn btn-primary btn-sm" style={{ padding: '10px 20px' }}>
              <Plus size={16} /> File Your First Cyber Report
            </Link>
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
                  <th>Reported Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.publicId}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan-bright)' }}>
                      {c.complaintNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                    <td><SeverityBadge severity={c.severity} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {new Date(c.reportedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/complaints/${c.publicId}`} className="btn btn-secondary btn-sm">
                        Track Case
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* THREAT AWARENESS & QUICK SECURITY ADVISORIES */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Threat Awareness Advisories</h3>
        <div className="grid-3">
          <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
              <AlertTriangle size={16} /> Phishing URL Vigilance
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Always verify domain names before submitting banking passwords or OTPs. Test suspicious links in CyberShield URL Analyzer.
            </p>
          </div>

          <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan-bright)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
              <ShieldCheck size={16} /> Secure Evidence Storage
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Attach clear screenshots, transaction receipts, and headers to speed up investigator triage and evidence verification.
            </p>
          </div>

          <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
              <CheckCircle2 size={16} /> Fast SLA Response
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Active investigations are reviewed by dedicated security officers with real-time audit logging and case escalation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
