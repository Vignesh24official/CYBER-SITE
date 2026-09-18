import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { investigationService } from '../../services/investigationService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { ArrowLeft, Download, Plus, Send, ShieldAlert, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

export const CaseInvestigationPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Note Form State
  const [note, setNote] = useState('');
  const [finding, setFinding] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Info Request Form State
  const [infoRequestNotes, setInfoRequestNotes] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Status Modal State
  const [newStatus, setNewStatus] = useState('UNDER_INVESTIGATION');
  const [statusReason, setStatusReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { addToast } = useToast();

  const fetchCase = async () => {
    try {
      const res = await investigationService.getCaseDetail(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load case details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note || note.trim().length === 0) return;

    setSubmittingNote(true);
    try {
      const res = await investigationService.addNote(id, {
        note,
        finding,
        actionTaken,
        recommendation,
      });
      if (res.success) {
        addToast('Investigation note logged successfully', 'success');
        setNote('');
        setFinding('');
        setActionTaken('');
        setRecommendation('');
        fetchCase();
      }
    } catch (err) {
      addToast(err.message || 'Failed to add note', 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleRequestInfo = async (e) => {
    e.preventDefault();
    if (!infoRequestNotes) return;

    try {
      const res = await investigationService.requestInfo(id, infoRequestNotes);
      if (res.success) {
        addToast('Request for additional information dispatched to victim', 'success');
        setShowInfoModal(false);
        fetchCase();
      }
    } catch (err) {
      addToast(err.message || 'Info request failed', 'error');
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await investigationService.updateStatus(id, {
        newStatus,
        reason: statusReason,
      });
      if (res.success) {
        addToast(`Case status updated to ${newStatus}`, 'success');
        setShowStatusModal(false);
        fetchCase();
      }
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading investigator workbench...</div>;
  }

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <h3>Case Not Found</h3>
        <Link to="/investigator/cases" className="btn btn-secondary" style={{ marginTop: '16px' }}>Back to Cases</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Case Header */}
      <div>
        <Link to="/investigator/cases" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', marginBottom: '12px' }}>
          <ArrowLeft size={16} /> Back to Assigned Cases
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} />
              <SeverityBadge severity={complaint.severity} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>{complaint.title}</h2>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowInfoModal(true)} className="btn btn-secondary">
              <AlertTriangle size={16} /> Request Info
            </button>
            <button onClick={() => { setNewStatus(complaint.status); setShowStatusModal(true); }} className="btn btn-cyan">
              <CheckCircle2 size={16} /> Update Progress / Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Victim & Incident Dossier */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="card-title">Incident Dossier</h3>
          <div><strong>Victim/Reporter:</strong> {complaint.reporter?.fullName} ({complaint.reporter?.email})</div>
          <div><strong>Phone:</strong> {complaint.reporter?.phone || 'N/A'}</div>
          <div><strong>Category:</strong> {complaint.category}</div>
          <div><strong>Threat Type:</strong> {complaint.threatType}</div>
          <div><strong>Incident Date:</strong> {new Date(complaint.incidentDate).toLocaleString()}</div>
          <div><strong>Financial Loss:</strong> {complaint.currency} {complaint.financialLoss}</div>
          <div><strong>Suspicious URL:</strong> {complaint.suspiciousUrl ? <a href={complaint.suspiciousUrl} target="_blank" rel="noopener noreferrer">{complaint.suspiciousUrl}</a> : 'N/A'}</div>
          <div><strong>Attacker Info:</strong> {complaint.attackerInformation || 'None provided'}</div>
          <div>
            <strong>Description:</strong>
            <p style={{ marginTop: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {complaint.description}
            </p>
          </div>

          {complaint.userResponse && (
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-amber)', marginTop: '8px' }}>
              <strong style={{ color: 'var(--accent-amber)' }}>Victim Response Provided on {new Date(complaint.responseProvidedAt).toLocaleString()}:</strong>
              <p style={{ marginTop: '4px', fontSize: '0.85rem' }}>{complaint.userResponse}</p>
            </div>
          )}
        </div>

        {/* Evidence Artifacts */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Attached Evidence Artifacts</h3>
          {complaint.evidenceFiles?.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No evidence files attached by victim.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {complaint.evidenceFiles?.map((f) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.originalFilename}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      MIME: {f.mimeType} | Size: {(f.fileSize / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <a href={evidenceService.getDownloadUrl(f.id)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Investigation Notes & Finding Submission */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Add Investigation Finding / Note</h3>

        <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              Investigation Note *
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record forensic observation, domain lookup, bank trace, or communication notes..."
              required
            />
          </div>

          <div className="grid-3">
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Finding
              </label>
              <input
                type="text"
                value={finding}
                onChange={(e) => setFinding(e.target.value)}
                placeholder="e.g. Confirmed phishing domain hosted on offshore IP"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Action Taken
              </label>
              <input
                type="text"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="e.g. Dispatched domain takedown request to host"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Recommendation
              </label>
              <input
                type="text"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="e.g. Freeze target bank account via nodal bank officer"
              />
            </div>
          </div>

          <button type="submit" disabled={submittingNote} className="btn btn-cyan" style={{ alignSelf: 'flex-start' }}>
            <Plus size={16} /> Save Investigation Note
          </button>
        </form>
      </div>

      {/* Historical Note Logs */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Investigation Activity & Case Log</h3>
        {complaint.investigationNotes?.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No investigation notes logged yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {complaint.investigationNotes?.map((n) => (
              <div key={n.id} style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                    Officer {n.investigatorName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{n.note}</p>
                {n.finding && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Finding:</strong> {n.finding}</div>}
                {n.actionTaken && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Action Taken:</strong> {n.actionTaken}</div>}
                {n.recommendation && <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}><strong>Recommendation:</strong> {n.recommendation}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Request Modal */}
      {showInfoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Request Information from Victim
            </h3>
            <form onSubmit={handleRequestInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Specific Details Required
                </label>
                <textarea
                  rows={4}
                  value={infoRequestNotes}
                  onChange={(e) => setInfoRequestNotes(e.target.value)}
                  placeholder="e.g. Please upload bank transaction statement showing transaction reference number..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowInfoModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Update Investigation Case Status
            </h3>
            <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Target Status
                </label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                  <option value="WAITING_FOR_INFORMATION">WAITING_FOR_INFORMATION</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Reason / Summary Notes
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Summary of status transition..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowStatusModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan">
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
