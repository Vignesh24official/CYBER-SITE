import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { ArrowLeft, Download, Send, AlertTriangle, FileText, CheckCircle2, Clock, Shield, ExternalLink, User } from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [infoResponseText, setInfoResponseText] = useState('');
  const [submittingInfo, setSubmittingInfo] = useState(false);

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

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Loading security case data...</div>;
  }

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <h3>Complaint Not Found</h3>
        <Link to="/complaints" className="btn btn-secondary" style={{ marginTop: '16px' }}>Back to My Complaints</Link>
      </div>
    );
  }

  const stages = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'RECEIVED', label: 'Received' },
    { key: 'INITIAL_REVIEW', label: 'Initial Review' },
    { key: 'CLASSIFIED', label: 'Classified' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'UNDER_INVESTIGATION', label: 'Investigation' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const getStageIndex = (st) => {
    const idx = stages.findIndex((s) => s.key === st);
    return idx >= 0 ? idx : 0;
  };

  const currentStageIdx = getStageIndex(complaint.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <Link to="/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', marginBottom: '16px', color: 'var(--accent-cyan-bright)', textDecoration: 'none' }}>
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
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px', color: '#FFF' }}>{complaint.title}</h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <CyberShieldSecurityPulse statusText={`CASE STATUS: ${complaint.status}`} compact={true} />
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'monospace' }}>
              Filed: {new Date(complaint.reportedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

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

      {/* Information Request Alert Banner */}
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
          <div style={{ fontSize: '0.9rem' }}><strong>Category:</strong> <span style={{ color: 'var(--accent-cyan-bright)' }}>{complaint.category}</span></div>
          <div style={{ fontSize: '0.9rem' }}><strong>Threat Vector:</strong> {complaint.threatType}</div>
          <div style={{ fontSize: '0.9rem' }}><strong>Incident Time:</strong> {new Date(complaint.incidentDate).toLocaleString()}</div>
          <div style={{ fontSize: '0.9rem' }}><strong>Location:</strong> {complaint.location || 'Online / Remote'}</div>
          <div style={{ fontSize: '0.9rem' }}><strong>Financial Loss:</strong> ₹ {complaint.financialLoss} INR</div>
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
    </div>
  );
};
