import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';

export const MyComplaintsPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Fetch up to 50 items so client-side filter and search are snappy
      const res = await complaintService.getMyComplaints(page, pageSize);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, pageSize]);

  // Client-side search and filtering across the fetched items
  const filteredComplaints = useMemo(() => {
    if (!data.content) return [];
    return data.content.filter((c) => {
      const matchSearch =
        !searchTerm.trim() ||
        c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.threatType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        selectedStatus === 'ALL' || c.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [data.content, searchTerm, selectedStatus]);

  // Summary counts
  const totalCount = data.totalElements || data.content?.length || 0;
  const inProgressCount = data.content?.filter((c) => ['IN_PROGRESS', 'UNDER_REVIEW'].includes(c.status)).length || 0;
  const resolvedCount = data.content?.filter((c) => c.status === 'RESOLVED').length || 0;

  const STATUS_TABS = [
    { label: 'All Cases', value: 'ALL' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Action Required', value: 'ADDITIONAL_INFO_REQUIRED' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER BANNER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Cyber Incident Reports</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Track and monitor the status of all cyber crime complaints submitted by your account.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchComplaints}
            className="btn btn-secondary"
            title="Refresh Complaints"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'spin-anim' : ''} /> Refresh
          </button>
          <Link to="/report" className="btn btn-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Report New Incident
          </Link>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid-3" style={{ gap: '16px' }}>
        <div className="card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{totalCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Incidents Filed</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Under Investigation</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{resolvedCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Successfully Resolved</div>
          </div>
        </div>
      </div>

      {/* SEARCH AND STATUS TABS */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* SEARCH BAR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by Complaint #, Incident Title, or Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFF',
                fontSize: '0.9rem'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* STATUS TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan-bright)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPLAINTS TABLE */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Retrieving incident records...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>
              No incidents found
            </div>
            <p style={{ fontSize: '0.85rem' }}>
              {searchTerm || selectedStatus !== 'ALL'
                ? 'Try adjusting your search query or status filter.'
                : "You haven't reported any cyber incidents yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Incident Title</th>
                    <th>Category</th>
                    <th>Threat Classification</th>
                    <th>Financial Impact</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Date Reported</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c.publicId}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan-bright)' }}>
                        {c.complaintNumber}
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.title}
                      </td>
                      <td>{c.category?.replace(/_/g, ' ')}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {c.threatType?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {c.financialLoss ? `${c.currency || 'USD'} ${Number(c.financialLoss).toLocaleString()}` : '$0.00'}
                      </td>
                      <td>
                        <SeverityBadge severity={c.severity} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {c.reportedAt ? new Date(c.reportedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <Link
                          to={`/complaints/${c.publicId}`}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.775rem', padding: '5px 12px' }}
                        >
                          View Case
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {data.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Page {data.pageNumber + 1} of {data.totalPages} ({data.totalElements} records)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={data.pageNumber === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="btn btn-secondary btn-sm"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    disabled={data.last}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
