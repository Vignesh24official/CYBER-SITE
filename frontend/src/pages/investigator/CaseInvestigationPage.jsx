import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { investigationService } from '../../services/investigationService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { LinuxForensicTerminal } from '../../components/investigator/LinuxForensicTerminal';
import { HackingSoftwareHub } from '../../components/investigator/HackingSoftwareHub';
import { CaseChatRoom } from '../../components/chat/CaseChatRoom';
import {
  ArrowLeft,
  Download,
  Plus,
  Send,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Terminal,
  Cpu,
  MessageSquare,
  Award,
  Check,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const CaseInvestigationPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'terminal' | 'hub' | 'chat'

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

  // Case Resolution Modal State
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [submittingResolution, setSubmittingResolution] = useState(false);
  const [resolutionVerdict, setResolutionVerdict] = useState('PHISHING_TAKEDOWN_CONFIRMED');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [actionsTakenSummary, setActionsTakenSummary] = useState('');
  const [citizenGuidance, setCitizenGuidance] = useState('');
  const [resolutionBadge, setResolutionBadge] = useState('VERIFIED_RESOLVED');

  // Chat attachment bridge
  const [chatAttachment, setChatAttachment] = useState(null);

  const { addToast, showSuccess, showError } = useToast();

  const notifySuccess = (msg) => {
    if (showSuccess) showSuccess(msg);
    else if (addToast) addToast(msg, 'success');
  };

  const notifyError = (msg) => {
    if (showError) showError(msg);
    else if (addToast) addToast(msg, 'error');
  };

  const fetchCase = async () => {
    try {
      const res = await investigationService.getCaseDetail(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      }
    } catch (err) {
      notifyError(err.message || 'Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleAddNote = async (e) => {
    if (e) e.preventDefault();
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
        notifySuccess('Investigation note logged successfully');
        setNote('');
        setFinding('');
        setActionTaken('');
        setRecommendation('');
        fetchCase();
      }
    } catch (err) {
      notifyError(err.message || 'Failed to add note');
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
        notifySuccess('Request for additional information dispatched to citizen');
        setShowInfoModal(false);
        setInfoRequestNotes('');
        fetchCase();
      }
    } catch (err) {
      notifyError(err.message || 'Info request failed');
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
        notifySuccess(`Case status updated to ${newStatus}`);
        setShowStatusModal(false);
        fetchCase();
      }
    } catch (err) {
      notifyError(err.message || 'Status update failed');
    }
  };

  const handleOpenResolutionModal = () => {
    const cleanUrl = complaint?.suspiciousUrl || 'suspect domain';
    setResolutionVerdict('PHISHING_TAKEDOWN_CONFIRMED');
    setResolutionSummary(
      `Forensic examination concluded for incident ${complaint?.complaintNumber}. Analysis of observables on ${cleanUrl} confirmed active threat vectors matching incident reports. Threat infrastructure was mapped to an offshore hosting node.`
    );
    setActionsTakenSummary(
      `1. Dispatched statutory takedown notice to hosting registrar and ISP.\n2. Injected threat IOCs into regional cyber warning grid.\n3. Issued formal nodal banking freeze alert for identified recipient accounts.`
    );
    setCitizenGuidance(
      `1. Invalidate and reset all banking and portal passwords immediately.\n2. Enable hardware or app-based 2-Factor Authentication (TOTP).\n3. Retain this official resolution report for presentation to your bank or insurance provider.\n4. Avoid clicking links in unverified SMS or email notifications.`
    );
    setResolutionBadge('VERIFIED_RESOLVED');
    setShowResolutionModal(true);
  };

  const handleResolveCaseSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionVerdict || !resolutionSummary.trim()) {
      notifyError('Please complete the verdict and resolution summary');
      return;
    }

    setSubmittingResolution(true);
    try {
      const res = await investigationService.resolveCase(id, {
        resolutionVerdict,
        resolutionSummary: resolutionSummary.trim(),
        actionsTakenSummary: actionsTakenSummary.trim(),
        citizenGuidance: citizenGuidance.trim(),
        resolutionBadge,
      });

      if (res.success) {
        notifySuccess('Case concluded! Official resolution report dispatched to citizen website.');
        setShowResolutionModal(false);
        fetchCase();
      }
    } catch (err) {
      notifyError(err.message || 'Failed to submit resolution');
    } finally {
      setSubmittingResolution(false);
    }
  };

  const handleTerminalExportNote = (data) => {
    setNote(data.note || '');
    setFinding(data.finding || '');
    setActionTaken(data.actionTaken || '');
    setRecommendation(data.recommendation || '');
    setActiveTab('dossier');
    notifySuccess('Forensic output transferred to Note form. Review and click "Save Note".');
  };

  const handleTerminalExportChat = (data) => {
    setChatAttachment(data);
    setActiveTab('chat');
    notifySuccess('Forensic log attached to chat channel. Review and click Send.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Case Header & Quick Actions */}
      <div>
        <Link to="/investigator/cases" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', marginBottom: '12px', color: 'var(--accent-cyan)' }}>
          <ArrowLeft size={16} /> Back to Assigned Cases
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} />
              <SeverityBadge severity={complaint.severity} />
              {complaint.resolutionVerdict && (
                <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> Case Resolved
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '6px', color: '#FFF' }}>{complaint.title}</h2>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowInfoModal(true)} className="btn btn-secondary">
              <AlertTriangle size={15} /> Request Info
            </button>
            <button onClick={() => { setNewStatus(complaint.status); setShowStatusModal(true); }} className="btn btn-secondary">
              <CheckCircle2 size={15} /> Progress / Status
            </button>
            {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
              <button onClick={handleOpenResolutionModal} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderColor: '#10b981' }}>
                <Award size={16} /> Conclude & Send Result to Citizen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* WORKSPACE TAB SWITCHER */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '2px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('dossier')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'dossier' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'dossier' ? '3px solid var(--accent-cyan)' : '3px solid transparent',
            color: activeTab === 'dossier' ? '#FFF' : 'var(--text-muted)',
            fontWeight: activeTab === 'dossier' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <FileText size={16} /> Incident Dossier & Notes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terminal')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'terminal' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'terminal' ? '3px solid #22c55e' : '3px solid transparent',
            color: activeTab === 'terminal' ? '#22c55e' : 'var(--text-muted)',
            fontWeight: activeTab === 'terminal' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Terminal size={16} /> Linux Forensic Terminal
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hub')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'hub' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'hub' ? '3px solid #c084fc' : '3px solid transparent',
            color: activeTab === 'hub' ? '#c084fc' : 'var(--text-muted)',
            fontWeight: activeTab === 'hub' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Cpu size={16} /> Hacking Software Hub
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'chat' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'chat' ? '3px solid var(--accent-cyan)' : '3px solid transparent',
            color: activeTab === 'chat' ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: activeTab === 'chat' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <MessageSquare size={16} /> Citizen Secure Chat Room
        </button>
      </div>

      {/* RESOLUTION SUMMARY BANNER (IF ALREADY RESOLVED) */}
      {complaint.resolutionVerdict && (
        <div
          className="card"
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                Official Resolution Dispatched to Citizen
              </h3>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Resolved: {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'Recently'}
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
            <strong>Verdict:</strong> <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{complaint.resolutionVerdict}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, whiteSpace: 'pre-wrap' }}>
            {complaint.resolutionSummary}
          </p>
        </div>
      )}

      {/* TAB 1: INCIDENT DOSSIER & NOTES */}
      {activeTab === 'dossier' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              <div>
                <strong>Suspicious URL:</strong>{' '}
                {complaint.suspiciousUrl ? (
                  <a href={complaint.suspiciousUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>
                    {complaint.suspiciousUrl} <ExternalLink size={12} />
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
              <div><strong>Attacker Info:</strong> {complaint.attackerInformation || 'None provided'}</div>
              <div>
                <strong>Description:</strong>
                <p style={{ marginTop: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', background: 'var(--bg-dark)', padding: '12px', borderRadius: '6px' }}>
                  {complaint.description}
                </p>
              </div>

              {complaint.userResponse && (
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-amber)', marginTop: '8px' }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Citizen Response Provided on {new Date(complaint.responseProvidedAt).toLocaleString()}:</strong>
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
                        <div style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                          SHA-256: {f.checksum?.substring(0, 24)}...
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
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Add Formal Case Note / Finding</h3>

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
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Investigation Activity & Forensic Log</h3>
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
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{n.note}</p>
                    {n.finding && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Finding:</strong> {n.finding}</div>}
                    {n.actionTaken && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Action Taken:</strong> {n.actionTaken}</div>}
                    {n.recommendation && <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}><strong>Recommendation:</strong> {n.recommendation}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LINUX FORENSIC TERMINAL */}
      {activeTab === 'terminal' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Interactive Kali Linux Cyber Forensic Terminal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Execute cyber reconnaissance, port audits, cryptographic evidence checksums, and network packet traces directly in your case workspace.
            </p>
          </div>
          <LinuxForensicTerminal
            complaint={complaint}
            onExportToNote={handleTerminalExportNote}
            onSendToChat={handleTerminalExportChat}
          />
        </div>
      )}

      {/* TAB 3: HACKING SOFTWARE HUB */}
      {activeTab === 'hub' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Cyber Forensic & Ethical Hacking Tool Suite</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Assessing targets, inspecting evidence files, simulating packet captures, and tracing money mule networks for Case {complaint.complaintNumber}.
            </p>
          </div>
          <HackingSoftwareHub
            complaint={complaint}
            onExportToNote={handleTerminalExportNote}
            onSendToChat={handleTerminalExportChat}
          />
        </div>
      )}

      {/* TAB 4: CITIZEN SECURE CHAT ROOM */}
      {activeTab === 'chat' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Direct Encrypted Citizen Communication Channel</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Communicate directly with {complaint.reporter?.fullName} to request information, verify transactions, and provide updates.
            </p>
          </div>
          <CaseChatRoom
            complaintPublicId={complaint.publicId}
            complaintNumber={complaint.complaintNumber}
            assignedInvestigator={complaint.assignedInvestigator}
            reporterName={complaint.reporter?.fullName}
            initialAttachment={chatAttachment}
          />
        </div>
      )}

      {/* CASE RESOLUTION MODAL */}
      {showResolutionModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  Conclude Case & Dispatch Result to Citizen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResolutionModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              This action will conclude the investigation, transition status to <strong>RESOLVED</strong>, and publish an official Resolution Report directly onto the citizen's case tracking page.
            </p>

            <form onSubmit={handleResolveCaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                  Official Case Verdict *
                </label>
                <select
                  value={resolutionVerdict}
                  onChange={(e) => setResolutionVerdict(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  required
                >
                  <option value="PHISHING_TAKEDOWN_CONFIRMED">Phishing Infrastructure Neutralized & Domain Takedown Executed</option>
                  <option value="FINANCIAL_FRAUD_TRACED_FREEZE_NOTICE">Financial Fraud Traced & Nodal Freeze Dispatched</option>
                  <option value="ACCOUNT_TAKEOVER_RECOVERED">Compromised Account Secured & Credentials Restored</option>
                  <option value="MALWARE_PAYLOAD_NEUTRALIZED">Malware Payload Isolated, Quarantined & Neutralized</option>
                  <option value="EXTORTION_IDENTITY_MITIGATED">Cyber Harassment / Impersonation Accounts Removed</option>
                  <option value="INSUFFICIENT_EVIDENCE_CLOSED">Investigation Concluded - Inconclusive Malicious Artifacts</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                  Executive Resolution Summary *
                </label>
                <textarea
                  rows={4}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Detail the root cause, attacker MO, and findings uncovered during forensics..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                  Enforcement & Mitigations Executed
                </label>
                <textarea
                  rows={3}
                  value={actionsTakenSummary}
                  onChange={(e) => setActionsTakenSummary(e.target.value)}
                  placeholder="e.g. Domain registrar abuse notice served; bank nodal officer alerted to freeze destination VPA..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                  Citizen Safety Guidance & Instructions
                </label>
                <textarea
                  rows={3}
                  value={citizenGuidance}
                  onChange={(e) => setCitizenGuidance(e.target.value)}
                  placeholder="Provide clear recovery steps, password change advice, or bank dispute reference instructions..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowResolutionModal(false)}
                  className="btn btn-secondary"
                  disabled={submittingResolution}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingResolution}
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderColor: '#10b981' }}
                >
                  <Award size={16} /> {submittingResolution ? 'Publishing Resolution...' : 'Dispatch Result to Citizen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Request Modal */}
      {showInfoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Request Information from Citizen
            </h3>
            <form onSubmit={handleRequestInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Message to Citizen *
                </label>
                <textarea
                  rows={4}
                  value={infoRequestNotes}
                  onChange={(e) => setInfoRequestNotes(e.target.value)}
                  placeholder="Specify exactly what screenshots, bank reference numbers, or transaction logs are needed..."
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowInfoModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan">
                  <Send size={16} /> Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Update Case Status
            </h3>
            <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  New Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                  <option value="WAITING_FOR_INFORMATION">WAITING_FOR_INFORMATION</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Reason for Transition *
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Log the operational justification for changing the case status..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
