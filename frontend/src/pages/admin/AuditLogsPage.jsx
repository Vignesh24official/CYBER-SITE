import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Clock, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

export const AuditLogsPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAuditLogs(page, 20);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        addToast(err.message || 'Failed to load audit logs', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Immutable System Audit Log</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Traceable audit trail capturing logins, status transitions, investigator assignments, evidence uploads, and admin actions
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading audit logs...</div>
        ) : data.content.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs recorded yet.</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Entity ID</th>
                    <th>Description</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((log) => (
                    <tr key={log.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{log.action}</td>
                      <td>{log.entityType || 'SYSTEM'}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.entityId || 'N/A'}</td>
                      <td style={{ fontSize: '0.85rem' }}>{log.description}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.ipAddress || '127.0.0.1'}</td>
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
