import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { CaseChatRoom } from '../../components/chat/CaseChatRoom';
import {
  ArrowLeft,
  Download,
  Send,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  Shield,
  ShieldCheck,
  ExternalLink,
  User,
  Printer,
  MessageSquare,
  Award,
  ChevronDown,
} from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [infoResponseText, setInfoResponseText] = useState('');
  const [submittingInfo, setSubmittingInfo] = useState(false);
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'chat'

  const { showSuccess, showError } = useToast();

  const fetchDetail = async () => {
    try {
      const res = await complaintService.getComplaint(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      }
    } catch (err) {
      showError(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleProvideInfo = async (e) => {
    e.preventDefault();
    if (!infoResponseText || infoResponseText.trim().length === 0) return;

    setSubmittingInfo(true);
    try {
      const res = await complaintService.provideInfoResponse(id, infoResponseText);
      if (res.success) {
        showSuccess('Information submitted successfully. Case status updated.');
        setInfoResponseText('');
        fetchDetail();
      }
    } catch (err) {
      showError(err.message || 'Failed to submit response');
    } finally {
      setSubmittingInfo(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
        Loading security case data...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <h3>Complaint Not Found</h3>
        <Link to="/complaints" className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Back to My Complaints
        </Link>
      </div>
    );
  }

  const stages = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Review' },
    { key: 'VALIDATED', label: 'Validated' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'UNDER_INVESTIGATION', label: 'Investigation' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const getStageIndex = (st) => {
    const idx = stages.findIndex((s) => s.key === st);
    if (idx >= 0) return idx;
    if (st === 'WAITING_FOR_INFORMATION') return 4;
    return 0;
  };

  const currentStageIdx = getStageIndex(complaint.status);
  const isResolved = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' || Boolean(complaint.resolutionVerdict);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div>
        <Link
          to="/complaints"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            marginBottom: '16px',
            color: 'var(--accent-cyan-bright)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to My Complaints
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--accent-cyan-bright)' }}>
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} />
              <SeverityBadge severity={complaint.severity} />
              {isResolved && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(16,185,129,0.2)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={12} /> Case Completed
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px', color: '#FFF' }}>{complaint.title}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <CyberShieldSecurityPulse statusText={`CASE STATUS: ${complaint.status}`} compact={true} />
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Filed: {new Date(complaint.reportedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR BUTTONS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => setActiveView('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeView === 'overview' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeView === 'overview' ? '3px solid var(--accent-cyan)' : '3px solid transparent',
            color: activeView === 'overview' ? '#FFF' : 'var(--text-muted)',
            fontWeight: activeView === 'overview' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <FileText size={16} /> Case Overview & Resolution Dossier
        </button>

        <button
          type="button"
          onClick={() => setActiveView('chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeView === 'chat' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeView === 'chat' ? '3px solid #38bdf8' : '3px solid transparent',
            color: activeView === 'chat' ? '#38bdf8' : 'var(--text-muted)',
            fontWeight: activeView === 'chat' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <MessageSquare size={16} /> Secure Chat with Investigator
        </button>
      </div>

      {/* CHAT ROOM VIEW */}
      {activeView === 'chat' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>
              Direct Encrypted Communication with Investigator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Ask questions about your case status, submit additional transaction receipts, or receive advice from the assigned officer.
            </p>
          </div>
          <CaseChatRoom
            complaintPublicId={complaint.publicId}
            complaintNumber={complaint.complaintNumber}
            assignedInvestigator={complaint.assignedInvestigator}
            reporterName={complaint.reporter?.fullName}
          />
        </div>
      )}

      {/* OVERVIEW VIEW */}
      {activeView === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* OFFICIAL CASE RESOLUTION REPORT & CERTIFICATE (WHEN RESOLVED) */}
          {isResolved && (
            <div
              className="card"
              style={{
                padding: '28px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: '16px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
              }}
            >
              {/* Report Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '18px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(16,185,129,0.25)',
                      border: '2px solid #10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                    }}
                  >
                    <Award size={26} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(16,185,129,0.3)',
                          color: '#34d399',
                          fontWeight: 800,
                          fontFamily: 'monospace',
                        }}
                      >
                        OFFICIAL VERDICT ISSUED
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Resolved on {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', marginTop: '4px' }}>
                      Cyber Defense Investigation Resolution Report
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                  >
                    <Printer size={14} /> Print Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('chat')}
                    className="btn btn-cyan btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                  >
                    <MessageSquare size={14} /> Message Investigator
                  </button>
                </div>
              </div>

              {/* Resolution Verdict Banner */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(0,0,0,0.35)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #10b981',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Conclusive Determination / Case Verdict
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan-bright)', marginTop: '4px' }}>
                  {complaint.resolutionVerdict || 'Investigation Concluded Successfully'}
                </div>
              </div>

              {/* Resolution Sections Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {complaint.resolutionSummary && (
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                      Investigation Findings & Forensic Summary:
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '8px' }}>
                      {complaint.resolutionSummary}
                    </p>
                  </div>
                )}

                {complaint.actionsTakenSummary && (
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                      Enforcement Actions & Mitigations Executed by Cyber Cell:
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '8px' }}>
                      {complaint.actionsTakenSummary}
                    </p>
                  </div>
                )}

                {complaint.citizenGuidance && (
                  <div
                    style={{
                      padding: '16px 18px',
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan-bright)', marginBottom: '6px' }}>
                      Citizen Safety Guidance & Next Steps:
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {complaint.citizenGuidance}
                    </p>
                  </div>
                )}

                {/* Assigned Investigator Sign-Off */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Assigned Officer: <strong style={{ color: '#FFF' }}>{complaint.assignedInvestigator?.fullName || 'Cyber Crime SOC Team'}</strong> ({complaint.assignedInvestigator?.email || 'soc@cybershield.org'})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> Authenticated by CyberShield Defense Platform
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISUAL INCIDENT TIMELINE TRACKER */}
          <div className="card" style={{ padding: '24px 28px' }}>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Incident Triage Progress Tracker</h3>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: '8px', position: 'relative' }}>
              {stages.map((stg, idx) => {
                const isCompleted = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--accent-cyan-bright)' : isCompleted ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255,255,255,0.08)',
                        border: isCurrent ? '2px solid #FFF' : isCompleted ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                        color: isCurrent || isCompleted ? '#FFF' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '0.725rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--accent-cyan-bright)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {stg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Information Request Alert Banner (if investigator needs info) */}
          {complaint.status === 'WAITING_FOR_INFORMATION' && (
            <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)', backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} /> Action Required: Additional Details Requested
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                The assigned security officer requested additional details to proceed with your investigation.
              </p>

              <form onSubmit={handleProvideInfo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  rows={4}
                  value={infoResponseText}
                  onChange={(e) => setInfoResponseText(e.target.value)}
                  placeholder="Type your response or additional details here..."
                  required
                  style={{ padding: '12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
                <button type="submit" disabled={submittingInfo} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>
                  <Send size={16} /> Submit Additional Details
                </button>
              </form>
            </div>
          )}

          <div className="grid-2">
            {/* Incident Summary Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 className="card-title">Case Metadata</h3>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Category:</strong> <span style={{ color: 'var(--accent-cyan-bright)' }}>{complaint.category}</span>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Threat Vector:</strong> {complaint.threatType}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Incident Time:</strong> {new Date(complaint.incidentDate).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Location:</strong> {complaint.location || 'Online / Remote'}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Financial Loss:</strong> ₹ {complaint.financialLoss} {complaint.currency || 'INR'}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Suspicious URL:</strong>{' '}
                {complaint.suspiciousUrl ? (
                  <a href={complaint.suspiciousUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan-bright)' }}>
                    {complaint.suspiciousUrl} <ExternalLink size={12} />
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Description:</strong>
                <p style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6, backgroundColor: 'var(--bg-dark)', padding: '14px', borderRadius: '8px' }}>
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Audit Status History */}
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '20px' }}>Audit Log & Status History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-color)' }}>
                {complaint.statusHistory?.map((h, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-27px',
                        top: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-cyan-bright)',
                      }}
                    />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>
                      {h.oldStatus ? `${h.oldStatus} → ${h.newStatus}` : h.newStatus}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      Updated by {h.changedByName} on {new Date(h.createdAt).toLocaleString()}
                    </div>
                    {h.reason && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic', backgroundColor: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px' }}>
                        "{h.reason}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence Files List */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Attached Evidence Files</h3>
            {complaint.evidenceFiles?.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No evidence files attached to this complaint.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {complaint.evidenceFiles?.map((f) => (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{f.originalFilename}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        SHA-256: <code>{f.checksum?.substring(0, 24)}...</code>
                      </div>
                    </div>
                    <a
                      href={evidenceService.getDownloadUrl(f.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <Download size={14} /> Download File
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Chat Callout Banner */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              background: 'linear-gradient(90deg, rgba(6,182,212,0.1) 0%, rgba(15,23,42,0.8) 100%)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '12px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(6,182,212,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan-bright)',
                }}
              >
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
                  Need to speak with your assigned cyber investigator?
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  The secure encrypted case chat room is available for questions, status checks, and updates.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('chat')}
              className="btn btn-cyan"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageSquare size={16} /> Open Case Chat Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
