import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { ArrowLeft, Download, ShieldAlert, UserCheck, Clock, FileText } from 'lucide-react';

export const AdminComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  const fetchDetail = async () => {
    try {
      const res = await adminService.getComplaintDetail(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading SOC incident profile...</div>;
  }

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <h3>Incident Record Not Found</h3>
        <Link to="/admin/complaints" className="btn btn-secondary" style={{ marginTop: '16px' }}>Back to Grid</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <Link to="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', marginBottom: '12px' }}>
          <ArrowLeft size={16} /> Back to Incident Grid
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
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
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="card-title">Incident Record Summary</h3>
          <div><strong>Victim/Reporter:</strong> {complaint.reporter?.fullName} ({complaint.reporter?.email})</div>
          <div><strong>Category:</strong> {complaint.category} ({complaint.threatType})</div>
          <div><strong>Incident Date:</strong> {new Date(complaint.incidentDate).toLocaleString()}</div>
          <div><strong>Financial Loss:</strong> {complaint.currency} {complaint.financialLoss}</div>
          <div><strong>Assigned Investigator:</strong> {complaint.assignedInvestigator ? `${complaint.assignedInvestigator.fullName} (${complaint.assignedInvestigator.email})` : 'Unassigned'}</div>
          <div><strong>Suspicious Link:</strong> {complaint.suspiciousUrl ? <a href={complaint.suspiciousUrl} target="_blank" rel="noopener noreferrer">{complaint.suspiciousUrl}</a> : 'N/A'}</div>
          <div>
            <strong>Description:</strong>
            <p style={{ marginTop: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {complaint.description}
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>Audit Status History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-color)' }}>
            {complaint.statusHistory?.map((h, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {h.oldStatus ? `${h.oldStatus} → ${h.newStatus}` : h.newStatus}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  By {h.changedByName} on {new Date(h.createdAt).toLocaleString()}
                </div>
                {h.reason && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                    "{h.reason}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investigation Log Notes */}
      <div className="card">
        <h3 className="card-title">Investigator Findings & Action Log</h3>
        {complaint.investigationNotes?.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No investigation notes logged yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {complaint.investigationNotes?.map((note) => (
              <div key={note.id} style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                    Officer {note.investigatorName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{note.note}</p>
                {note.finding && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Finding:</strong> {note.finding}</div>}
                {note.actionTaken && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Action Taken:</strong> {note.actionTaken}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence Files List */}
      <div className="card">
        <h3 className="card-title">Evidence Artifacts</h3>
        {complaint.evidenceFiles?.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No evidence files attached.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {complaint.evidenceFiles?.map((f) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.originalFilename}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    SHA-256 Checksum: <code style={{ fontSize: '0.7rem' }}>{f.checksum}</code>
                  </div>
                </div>
                <a href={evidenceService.getDownloadUrl(f.id)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
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
