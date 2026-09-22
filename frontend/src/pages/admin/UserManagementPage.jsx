import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { 
  Users, UserCheck, Shield, Lock, ChevronLeft, ChevronRight, 
  Search, Filter, Plus, Edit2, Trash2, Key, RefreshCw, X, AlertTriangle, CheckCircle 
} from 'lucide-react';

export const UserManagementPage = () => {
  const [data, setData] = useState({ content: [], totalPages: 0, pageNumber: 0, totalElements: 0 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states for create
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Password@123',
    role: 'ROLE_USER',
    accountStatus: 'ACTIVE',
  });

  // Form states for edit
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'ROLE_USER',
    accountStatus: 'ACTIVE',
  });

  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchStats = async () => {
    try {
      const res = await adminService.getUserStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (ignored) {}
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        size: 15,
        sortBy,
        sortDir,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      showError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, roleFilter, statusFilter, sortBy, sortDir]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleStatusToggle = async (user, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await adminService.updateUserStatus(user.publicId, nextStatus);
      if (res.success) {
        showSuccess(`Account status updated to ${nextStatus}`);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showError(err.message || 'Status update failed');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await adminService.createUser(createForm);
      if (res.success) {
        showSuccess(`User ${createForm.fullName} created successfully`);
        setShowCreateModal(false);
        setCreateForm({
          fullName: '',
          email: '',
          phone: '',
          password: 'Password@123',
          role: 'ROLE_USER',
          accountStatus: 'ACTIVE',
        });
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showError(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      accountStatus: user.accountStatus,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const res = await adminService.updateUser(selectedUser.publicId, editForm);
      if (res.success) {
        showSuccess(`User details updated successfully`);
        setShowEditModal(false);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showError(err.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${user.fullName}" (${user.email})?`)) {
      return;
    }
    try {
      const res = await adminService.deleteUser(user.publicId);
      if (res.success) {
        showSuccess(`User account deleted successfully`);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showError(err.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async (user) => {
    const newPass = window.prompt(`Enter new password for ${user.fullName}:`, 'Password@123');
    if (!newPass) return;
    if (newPass.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }
    try {
      const res = await adminService.resetPassword(user.publicId, newPass);
      if (res.success) {
        showSuccess(`Password reset successfully for ${user.email}`);
      }
    } catch (err) {
      showError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            Platform Users & Access Control Directory
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comprehensive management of platform accounts, roles, security privileges, and suspension controls
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Account
        </button>
      </div>

      {/* STATS ROW */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Accounts</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>{stats.totalUsers}</span>
          </div>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Accounts</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>{stats.activeUsers}</span>
          </div>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Coordinators & Staff</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan-bright)', marginTop: '4px' }}>{stats.coordinatorsCount}</span>
          </div>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Citizen Users</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#93c5fd', marginTop: '4px' }}>{stats.citizensCount}</span>
          </div>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Suspended / Locked</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '4px' }}>{stats.suspendedUsers + stats.lockedUsers}</span>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', maxWidth: '420px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
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
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
            style={{ padding: '8px 12px', fontSize: '0.825rem', width: 'auto' }}
          >
            <option value="">All Roles</option>
            <option value="ROLE_USER">Citizen Users</option>
            <option value="ROLE_COORDINATOR">Coordinators</option>
            <option value="ROLE_INVESTIGATOR">Investigators</option>
            <option value="ROLE_ADMIN">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            style={{ padding: '8px 12px', fontSize: '0.825rem', width: 'auto' }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="LOCKED">Locked</option>
          </select>

          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split('-');
              setSortBy(sb);
              setSortDir(sd);
              setPage(0);
            }}
            style={{ padding: '8px 12px', fontSize: '0.825rem', width: 'auto' }}
          >
            <option value="createdAt-desc">Newest Registered</option>
            <option value="createdAt-asc">Oldest Registered</option>
            <option value="fullName-asc">Name (A-Z)</option>
            <option value="fullName-desc">Name (Z-A)</option>
            <option value="lastLoginAt-desc">Recent Logins</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading platform users...
          </div>
        ) : data.content.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No platform users found matching the query.
          </div>
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
                    <th>Last Active</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((u) => (
                    <tr key={u.publicId}>
                      <td style={{ fontWeight: 600, color: '#FFF' }}>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            backgroundColor:
                              u.role === 'ROLE_ADMIN'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : u.role === 'ROLE_COORDINATOR' || u.role === 'ROLE_INVESTIGATOR'
                                ? 'rgba(6, 182, 212, 0.15)'
                                : 'rgba(255, 255, 255, 0.08)',
                            color:
                              u.role === 'ROLE_ADMIN'
                                ? '#f87171'
                                : u.role === 'ROLE_COORDINATOR' || u.role === 'ROLE_INVESTIGATOR'
                                ? 'var(--accent-cyan-bright)'
                                : 'var(--text-secondary)',
                            border: `1px solid ${
                              u.role === 'ROLE_ADMIN'
                                ? 'rgba(239, 68, 68, 0.3)'
                                : u.role === 'ROLE_COORDINATOR' || u.role === 'ROLE_INVESTIGATOR'
                                ? 'rgba(6, 182, 212, 0.3)'
                                : 'rgba(255, 255, 255, 0.15)'
                            }`,
                          }}
                        >
                          {u.role.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor:
                              u.accountStatus === 'ACTIVE'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            color: u.accountStatus === 'ACTIVE' ? '#34d399' : '#f87171',
                            border: `1px solid ${
                              u.accountStatus === 'ACTIVE'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : 'rgba(239, 68, 68, 0.3)'
                            }`,
                          }}
                        >
                          {u.accountStatus}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleStatusToggle(u, u.accountStatus)}
                            className={u.accountStatus === 'ACTIVE' ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                            title={u.accountStatus === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                          >
                            {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            onClick={() => openEditModal(u)}
                            className="btn btn-secondary btn-sm"
                            title="Edit User"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => handleResetPassword(u)}
                            className="btn btn-secondary btn-sm"
                            title="Reset Password"
                          >
                            <Key size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#f87171' }}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
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
                  Page {data.pageNumber + 1} of {data.totalPages} ({data.totalElements} accounts)
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

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#0f1420',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
                Create New Platform Account
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="e.g. Alice Vance"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="alice@cybershield.org"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+1-555-0100"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Role *
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="ROLE_USER">Citizen User</option>
                    <option value="ROLE_COORDINATOR">Case Coordinator</option>
                    <option value="ROLE_INVESTIGATOR">SOC Investigator</option>
                    <option value="ROLE_ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Initial Status *
                  </label>
                  <select
                    value={createForm.accountStatus}
                    onChange={(e) => setCreateForm({ ...createForm, accountStatus: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Initial Password *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Min 8 characters"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditModal && selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#0f1420',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
                Edit Account Details
              </h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Role *
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="ROLE_USER">Citizen User</option>
                    <option value="ROLE_COORDINATOR">Case Coordinator</option>
                    <option value="ROLE_INVESTIGATOR">SOC Investigator</option>
                    <option value="ROLE_ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Account Status *
                  </label>
                  <select
                    value={editForm.accountStatus}
                    onChange={(e) => setEditForm({ ...editForm, accountStatus: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="LOCKED">LOCKED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
