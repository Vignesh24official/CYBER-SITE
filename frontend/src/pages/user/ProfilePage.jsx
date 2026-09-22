import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import {
  User,
  Lock,
  Key,
  Shield,
  Phone,
  Mail,
  CheckCircle,
  Save,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  // Profile details state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showError('Full name cannot be blank');
      return;
    }

    setProfileSaving(true);
    try {
      const res = await authService.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || null
      });

      if (res.success && res.data) {
        const { user: updatedUser, accessToken, refreshToken } = res.data;
        if (accessToken) {
          localStorage.setItem('cybershield_token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('cybershield_refresh_token', refreshToken);
        }
        if (updatedUser) {
          localStorage.setItem('cybershield_user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        showSuccess('Profile details updated successfully');
      } else {
        showSuccess('Profile details updated successfully');
      }
    } catch (err) {
      showError(err.message || 'Failed to update profile details');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    setPasswordSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword, confirmPassword });
      showSuccess('Password changed successfully. Existing refresh sessions invalidated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'System Administrator', color: 'var(--accent-rose)', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'ROLE_COORDINATOR':
        return { label: 'Incident Coordinator', color: 'var(--accent-purple)', bg: 'rgba(168, 85, 247, 0.15)' };
      case 'ROLE_INVESTIGATOR':
        return { label: 'Cyber Investigator', color: 'var(--accent-cyan-bright)', bg: 'rgba(6, 182, 212, 0.15)' };
      default:
        return { label: 'Verified Citizen', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.15)' };
    }
  };

  const roleMeta = getRoleBadge(user?.role);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      {/* HEADER BANNER */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Account Profile & Security Settings</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your personal details, duty information, and security credentials.
        </p>
      </div>

      {/* OVERVIEW BADGE */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(17, 22, 34, 0.95) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: roleMeta.bg,
              color: roleMeta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem'
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>{user?.fullName}</h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: roleMeta.color,
                  backgroundColor: roleMeta.bg,
                  padding: '2px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}
              >
                {roleMeta.label}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{user?.email}</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Account {user?.accountStatus || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          ID: {user?.publicId || 'N/A'}
        </div>
      </div>

      {/* EDIT PROFILE DETAILS */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} color="var(--accent-cyan-bright)" /> Personal & Contact Details
        </h3>

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="grid-2" style={{ gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1-800-555-0199"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Registered Email (Immutable)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Security Role Clearance
              </label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={profileSaving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontWeight: 700 }}
            >
              <Save size={16} />
              {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Key size={20} color="var(--accent-cyan-bright)" /> Security & Password Update
        </h3>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Current Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 14px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Confirm New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={passwordSaving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontWeight: 700 }}
            >
              <Lock size={16} />
              {passwordSaving ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* SECURITY NOTICE CARD */}
      <div
        className="card"
        style={{
          border: '1px solid rgba(16, 185, 129, 0.2)',
          background: 'rgba(16, 185, 129, 0.04)',
          padding: '20px 24px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}
      >
        <ShieldCheck size={22} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: '#FFF' }}>Security Session Integrity:</strong> Any password change invalidates all other active browser refresh sessions and tokens on file. Keep your duty password stored securely and never share credentials with unauthorized individuals.
        </div>
      </div>
    </div>
  );
};
