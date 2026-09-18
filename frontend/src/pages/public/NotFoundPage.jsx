import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '480px' }}>
        <ShieldAlert size={56} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>404 - Page Not Found</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The requested security portal URI does not exist or has been restricted.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};
