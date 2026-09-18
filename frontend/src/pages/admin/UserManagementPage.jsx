import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Users, UserCheck, Shield, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

export const UserManagementPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(roleFilter, page, 15);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleStatusToggle = async (user, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await adminService.updateUserStatus(user.publicId, nextStatus);
      if (res.success) {
        addToast(`Updated user account status to ${nextStatus}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      const res = await adminService.updateUserRole(user.publicId, newRole);
      if (res.success) {
        addToast(`Updated user role to ${newRole}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Role update failed', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Platform Users & Access Control</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage registered accounts, roles, and suspension controls
          </p>
        </div>

        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }} style={{ width: '200px' }}>
          <option value="">All Roles</option>
          <option value="ROLE_USER">Users</option>
          <option value="ROLE_INVESTIGATOR">Investigators</option>
          <option value="ROLE_ADMIN">Admins</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</div>
        ) : data.content.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Account Status</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((u) => (
                    <tr key={u.publicId}>
                      <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                        >
                          <option value="ROLE_USER">ROLE_USER</option>
                          <option value="ROLE_INVESTIGATOR">ROLE_INVESTIGATOR</option>
                          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: u.accountStatus === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: u.accountStatus === 'ACTIVE' ? '#34D399' : '#F87171',
                          }}
                        >
                          {u.accountStatus}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleStatusToggle(u, u.accountStatus)}
                          className={u.accountStatus === 'ACTIVE' ? 'btn btn-danger btn-sm' : 'btn btn-cyan btn-sm'}
                        >
                          {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
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
