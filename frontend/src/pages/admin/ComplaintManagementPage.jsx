import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { Search, Filter, ShieldAlert, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComplaintManagementPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [category, setCategory] = useState('');

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [investigators, setInvestigators] = useState([]);
  const [selectedInvestigator, setSelectedInvestigator] = useState('');

  const [newStatus, setNewStatus] = useState('UNDER_REVIEW');
  const [newSeverity, setNewSeverity] = useState('MEDIUM');
  const [statusReason, setStatusReason] = useState('');

  const { addToast } = useToast();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        search,
        status,
        severity,
        category,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };
      const res = await adminService.getComplaints(params);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, status, severity, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchComplaints();
  };

  const openAssignModal = async (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignModal(true);
    try {
      const res = await adminService.getInvestigators();
      if (res.success && res.data) {
        setInvestigators(res.data);
        if (res.data.length > 0) {
          setSelectedInvestigator(res.data[0].publicId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewSeverity(complaint.severity);
    setStatusReason('');
    setShowStatusModal(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedInvestigator) return;

    try {
      const res = await adminService.assignInvestigator(selectedComplaint.publicId, {
        investigatorPublicId: selectedInvestigator,
      });
      if (res.success) {
        addToast(`Assigned ${selectedComplaint.complaintNumber} to investigator`, 'success');
        setShowAssignModal(false);
        fetchComplaints();
      }
    } catch (err) {
      addToast(err.message || 'Assignment failed', 'error');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      const res = await adminService.updateStatus(selectedComplaint.publicId, {
        newStatus,
        severity: newSeverity,
        reason: statusReason,
      });
      if (res.success) {
        addToast(`Updated status for ${selectedComplaint.complaintNumber}`, 'success');
        setShowStatusModal(false);
        fetchComplaints();
      }
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Incident Triage Grid</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Server-side filtered cybersecurity complaints, investigator assignment, and severity triage
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search title, description, or CS-2026-XXXXXX..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '1 1 240px' }}
          />

          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} style={{ flex: '0 1 180px' }}>
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="VALIDATED">Validated</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="WAITING_FOR_INFORMATION">Info Required</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(0); }} style={{ flex: '0 1 150px' }}>
            <option value="">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <button type="submit" className="btn btn-cyan">
            <Search size={16} /> Filter
          </button>
        </form>
      </div>

      {/* Main Grid */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>Filtering incidents...</div>
        ) : data.content.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No matching incidents found.</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Complaint #</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Investigator</th>
                    <th>Reported</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((c) => (
                    <tr key={c.publicId}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{c.complaintNumber}</td>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td>{c.category}</td>
                      <td><SeverityBadge severity={c.severity} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td style={{ color: c.assignedInvestigatorName === 'Unassigned' ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                        {c.assignedInvestigatorName}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.reportedAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openAssignModal(c)} className="btn btn-secondary btn-sm" title="Assign Investigator">
                            <UserCheck size={14} />
                          </button>
                          <button onClick={() => openStatusModal(c)} className="btn btn-secondary btn-sm" title="Update Status">
                            <ShieldAlert size={14} />
                          </button>
                          <Link to={`/admin/complaints/${c.publicId}`} className="btn btn-secondary btn-sm">
                            Detail
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Page {data.pageNumber + 1} of {data.totalPages}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button disabled={data.pageNumber === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="btn btn-secondary btn-sm">
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button disabled={data.last} onClick={() => setPage((p) => p + 1)} className="btn btn-secondary btn-sm">
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Assign Case {selectedComplaint.complaintNumber}
            </h3>

            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Select Cyber Investigator
                </label>
                <select value={selectedInvestigator} onChange={(e) => setSelectedInvestigator(e.target.value)}>
                  {investigators.map((inv) => (
                    <option key={inv.publicId} value={inv.publicId}>
                      {inv.fullName} ({inv.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAssignModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan">
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Update Triage Status: {selectedComplaint.complaintNumber}
            </h3>

            <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Target Complaint Status
                </label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="VALIDATED">VALIDATED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                  <option value="WAITING_FOR_INFORMATION">WAITING_FOR_INFORMATION</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Incident Severity Risk
                </label>
                <select value={newSeverity} onChange={(e) => setNewSeverity(e.target.value)}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Transition Notes / Reason
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Reason for state transition..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
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
