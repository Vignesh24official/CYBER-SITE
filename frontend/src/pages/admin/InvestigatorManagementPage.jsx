import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import {
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  Plus,
  UserCheck,
  AlertCircle,
  Activity,
  X,
  Search,
  RefreshCw,
  KeyRound,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Award
} from 'lucide-react';

export const InvestigatorManagementPage = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Form state for provision
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Password@123',
    role: 'ROLE_COORDINATOR'
  });
  const [newPassword, setNewPassword] = useState('Password@123');
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCoordinators();
      if (res.success && res.data) {
        setOfficers(res.data);
      }
    } catch (err) {
      showError(err.message || 'Failed to load officer directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      showError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminService.createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      if (res.success) {
        showSuccess(`Security Officer ${formData.fullName} provisioned successfully!`);
        setShowCreateModal(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: 'Password@123',
          role: 'ROLE_COORDINATOR'
        });
        fetchOfficers();
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to provision officer.';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (officer) => {
    const nextStatus = officer.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await adminService.updateUserStatus(officer.publicId, nextStatus);
      if (res.success) {
        showSuccess(`Updated ${officer.fullName}'s status to ${nextStatus}`);
        fetchOfficers();
      }
    } catch (err) {
      showError(err.message || 'Status update failed');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedOfficer || !newPassword) return;

    setSubmitting(true);
    try {
      const res = await adminService.resetPassword(selectedOfficer.publicId, newPassword);
      if (res.success) {
        showSuccess(`Password reset for ${selectedOfficer.fullName}`);
        setShowResetModal(false);
        setSelectedOfficer(null);
      }
    } catch (err) {
      showError(err.message || 'Password reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOfficer = async (officer) => {
    if (!window.confirm(`Are you sure you want to remove ${officer.fullName} from active duty? If they have active assigned cases, reassign them first.`)) {
      return;
    }

    try {
      const res = await adminService.deleteUser(officer.publicId);
      if (res.success) {
        showSuccess(`Officer ${officer.fullName} has been removed.`);
        fetchOfficers();
      }
    } catch (err) {
      showError(err.message || 'Failed to delete officer');
    }
  };

  // Filtered list
  const filteredOfficers = useMemo(() => {
    return officers.filter((item) => {
      const matchSearch =
        item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.includes(searchTerm);

      const matchRole =
        roleFilter === 'ALL' ||
        (roleFilter === 'COORDINATOR' && item.role === 'ROLE_COORDINATOR') ||
        (roleFilter === 'INVESTIGATOR' && item.role === 'ROLE_INVESTIGATOR');

      const matchStatus =
        statusFilter === 'ALL' || item.accountStatus === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [officers, searchTerm, roleFilter, statusFilter]);

  // Aggregate stats
  const totalOfficers = officers.length;
  const totalActiveCases = officers.reduce((acc, o) => acc + (o.activeCasesCount || 0), 0);
  const totalCompletedCases = officers.reduce((acc, o) => acc + (o.completedCount || 0), 0);
  const activeStaffCount = officers.filter(o => o.accountStatus === 'ACTIVE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* HEADER BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(17, 22, 34, 0.95) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
              Cyber Investigator & Coordinator Roster
            </h2>
            <CyberShieldSecurityPulse statusText="SOC OPERATIONS" compact={true} />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Provision security personnel, assign operational roles, and monitor live investigation workloads.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={fetchOfficers}
            className="btn btn-secondary"
            title="Refresh Directory"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'spin-anim' : ''} /> Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Provision New Officer
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid-4" style={{ gap: '16px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>{totalOfficers}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Officers ({activeStaffCount} Active)</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>{totalActiveCases}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Incident Workload</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>{totalCompletedCases}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resolved Case Archives</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>100%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SOC Coverage Rate</div>
          </div>
        </div>
      </div>

      {/* FILTER AND SEARCH CONTROLS */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search officer by name, email, or phone..."
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

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#FFF',
                fontSize: '0.85rem'
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="COORDINATOR">Incident Coordinator</option>
              <option value="INVESTIGATOR">Investigator / Analyst</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#FFF',
                fontSize: '0.85rem'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* OFFICERS LIST */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="card-title">
            Assigned Personnel ({filteredOfficers.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {filteredOfficers.length} of {officers.length} staff
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Synchronizing officer roster...
          </div>
        ) : filteredOfficers.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No officers match the current filter criteria.
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '20px' }}>
            {filteredOfficers.map((inv) => {
              const isCoordinator = inv.role === 'ROLE_COORDINATOR';
              const roleLabel = isCoordinator ? 'Incident Coordinator' : 'Cyber Investigator';
              const roleBadgeColor = isCoordinator ? 'var(--accent-purple)' : 'var(--accent-cyan-bright)';
              const roleBgColor = isCoordinator ? 'rgba(168, 85, 247, 0.15)' : 'rgba(6, 182, 212, 0.15)';

              return (
                <div
                  key={inv.publicId}
                  style={{
                    padding: '22px',
                    backgroundColor: 'var(--bg-dark)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          backgroundColor: roleBgColor,
                          color: roleBadgeColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}
                      >
                        <Briefcase size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>{inv.fullName}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: roleBadgeColor,
                              backgroundColor: roleBgColor,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '20px',
                        backgroundColor: inv.accountStatus === 'ACTIVE' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: inv.accountStatus === 'ACTIVE' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                        border: `1px solid ${inv.accountStatus === 'ACTIVE' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}
                    >
                      {inv.accountStatus}
                    </span>
                  </div>

                  {/* CONTACT INFO */}
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.email}</span>
                    </div>
                    {inv.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} color="var(--text-muted)" />
                        <span>{inv.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* WORKLOAD METRICS */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      padding: '10px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EAB308' }}>
                        {inv.activeCasesCount ?? 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        {inv.completedCount ?? 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Resolved</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                        {inv.totalAssignedCount ?? 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total</div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => handleStatusToggle(inv)}
                      className={inv.accountStatus === 'ACTIVE' ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                      style={{ flex: 1, fontSize: '0.775rem' }}
                    >
                      {inv.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOfficer(inv);
                        setShowResetModal(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      title="Reset Password"
                      style={{ padding: '6px 10px' }}
                    >
                      <KeyRound size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteOfficer(inv)}
                      className="btn btn-sm"
                      title="Delete Officer"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--accent-rose)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '6px 10px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE OFFICER MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Provision Security Personnel</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Officer Jane Smith"
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Duty Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="janesmith@cybershield.org"
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Assigned Operational Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                >
                  <option value="ROLE_COORDINATOR">Incident Coordinator (Case Manager & Lead)</option>
                  <option value="ROLE_INVESTIGATOR">Cyber Investigator (SOC Analyst & Field Officer)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Duty Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1-800-555-0188"
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Initial Password *
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700 }}>
                  {submitting ? 'Provisioning...' : 'Provision Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showResetModal && selectedOfficer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Reset Officer Password</h3>
              <button onClick={() => setShowResetModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Set a temporary password for <strong>{selectedOfficer.fullName}</strong> ({selectedOfficer.email}).
            </p>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowResetModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Updating...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
