import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { Briefcase, Mail, ShieldCheck, Plus, UserCheck, AlertCircle, Activity, X } from 'lucide-react';

export const InvestigatorManagementPage = () => {
  const [investigators, setInvestigators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating investigator
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password@123');
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchInvestigators = async () => {
    try {
      const res = await adminService.getInvestigators();
      if (res.success && res.data) {
        setInvestigators(res.data);
      }
    } catch (err) {
      showError(err.message || 'Failed to load investigators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigators();
  }, []);

  const handleCreateInvestigator = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step 1: Register account
      const regRes = await authService.register({ fullName, email, phone, password });
      const createdUser = regRes.data?.user || regRes.user;

      if (createdUser && createdUser.publicId) {
        // Step 2: Promote to ROLE_INVESTIGATOR
        await adminService.updateUserRole(createdUser.publicId, 'ROLE_INVESTIGATOR');
      }

      showSuccess(`Investigator ${fullName} created successfully!`);
      setShowCreateModal(false);
      setFullName('');
      setEmail('');
      setPhone('');
      fetchInvestigators();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create investigator.';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (inv) => {
    const nextStatus = inv.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await adminService.updateUserStatus(inv.publicId, nextStatus);
      if (res.success) {
        showSuccess(`Updated investigator account status to ${nextStatus}`);
        fetchInvestigators();
      }
    } catch (err) {
      showError(err.message || 'Status update failed');
    }
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
              Cyber Investigator Roster Management
            </h2>
            <CyberShieldSecurityPulse statusText="SECURITY OFFICERS DIRECTORY" compact={true} />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Provision investigator accounts, assign SOC roles, monitor officer availability & status.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ padding: '10px 20px', fontWeight: 700 }}>
          <Plus size={16} /> Provision New Investigator
        </button>
      </div>

      {/* INVESTIGATORS GRID */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '20px' }}>Active Security Officers ({investigators.length})</h3>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Loading investigator directory...
          </div>
        ) : investigators.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active investigators registered in directory.
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '20px' }}>
            {investigators.map((inv) => (
              <div
                key={inv.publicId}
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--bg-dark)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{inv.fullName}</h4>
                    <span style={{ fontSize: '0.725rem', color: 'var(--accent-cyan-bright)', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                      SECURITY INVESTIGATOR
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="var(--text-muted)" /> {inv.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="var(--accent-emerald)" /> Account: <strong style={{ color: inv.accountStatus === 'ACTIVE' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{inv.accountStatus}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    onClick={() => handleStatusToggle(inv)}
                    className={inv.accountStatus === 'ACTIVE' ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                    style={{ flex: 1 }}
                  >
                    {inv.accountStatus === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE INVESTIGATOR MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Provision Investigator Account</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInvestigator} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Officer Jane Smith"
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Officer Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="janesmith@cybershield.org"
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1-800-555-0188"
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Initial Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700 }}>
                  {submitting ? 'Provisioning...' : 'Create Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
