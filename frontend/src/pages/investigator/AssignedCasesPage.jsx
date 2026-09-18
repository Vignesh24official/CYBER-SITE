import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investigationService } from '../../services/investigationService';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export const AssignedCasesPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const res = await investigationService.getAssignedCases(page, 15);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [page]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Assigned Investigation Cases</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          All active and completed cyber incident investigations assigned to you
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading assigned cases...</div>
        ) : data.content.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No assigned cases found.</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Complaint #</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Financial Impact</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Reported Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((c) => (
                    <tr key={c.publicId}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{c.complaintNumber}</td>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td>{c.category}</td>
                      <td style={{ fontWeight: 600 }}>{c.currency} {c.financialLoss}</td>
                      <td><SeverityBadge severity={c.severity} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.reportedAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/investigator/cases/${c.publicId}`} className="btn btn-cyan btn-sm">
                          Investigate
                        </Link>
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
    </div>
  );
};
