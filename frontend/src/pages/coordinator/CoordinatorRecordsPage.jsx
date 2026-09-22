import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coordinatorService } from '../../services/investigationService';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { 
  Briefcase, Search, Filter, ChevronLeft, ChevronRight, 
  CheckCircle2, Clock, Activity, ShieldAlert, ArrowUpRight 
} from 'lucide-react';

export const CoordinatorRecordsPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('');
  const { showError } = useToast();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let statusParam = '';
      if (activeTab === 'PENDING') statusParam = 'WAITING_FOR_INFORMATION';
      else if (activeTab === 'IN_PROGRESS') statusParam = 'UNDER_INVESTIGATION';
      else if (activeTab === 'COMPLETED') statusParam = 'RESOLVED';

      const res = await coordinatorService.getAssignedCases(page, 15, search, statusParam);
      if (res.success && res.data) {
        let content = res.data.content || [];
        if (severityFilter) {
          content = content.filter((c) => c.severity === severityFilter);
        }
        setData({
          content,
          totalPages: res.data.totalPages || 1,
          pageNumber: res.data.pageNumber || 0,
          totalElements: res.data.totalElements || content.length,
        });
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch assigned records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, activeTab, severityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchRecords();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            Assigned Case Records & Inquiries
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Browse, search, and manage all cybersecurity incident cases allocated to your coordinator desk
          </p>
        </div>

        {/* Quick status tabs */}
        <div style={{ display: 'flex', backgroundColor: '#07090e', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', gap: '4px' }}>
          {[
            { id: 'ALL', label: 'All Assigned' },
            { id: 'PENDING', label: 'Pending Action' },
            { id: 'IN_PROGRESS', label: 'Under Investigation' },
            { id: 'COMPLETED', label: 'Resolved / Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(0); }}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'var(--accent-cyan-bright)' : 'transparent',
                color: activeTab === tab.id ? '#07090e' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '460px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by complaint #, incident title, or reporter..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#FFF',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setPage(0); }}
            style={{ padding: '8px 12px', fontSize: '0.825rem', width: 'auto' }}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading assigned records...
          </div>
        ) : data.content.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No incident records found matching the active criteria.
          </div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Complaint #</th>
                    <th>Incident Title</th>
                    <th>Category</th>
                    <th>Financial Impact</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Reported Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((c) => (
                    <tr key={c.publicId}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan-bright)' }}>
                        {c.complaintNumber}
                      </td>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                      <td style={{ fontWeight: 600, color: Number(c.financialLoss) > 0 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                        {c.currency} {c.financialLoss}
                      </td>
                      <td><SeverityBadge severity={c.severity} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>{c.reporterName}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(c.reportedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link
                          to={`/coordinator/cases/${c.publicId}`}
                          className="btn btn-cyan btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>Manage</span> <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Page {data.pageNumber + 1} of {data.totalPages}
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
                    disabled={data.pageNumber >= data.totalPages - 1}
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
