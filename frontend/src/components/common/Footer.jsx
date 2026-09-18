import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-dark)',
        borderTop: '1px solid var(--border-color)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.825rem',
        color: 'var(--text-muted)',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>CyberShield Platform</strong> — Threat & Incident Management System
        </div>
        <div>
          This system is strictly for authorized cyber incident reporting and security triage. All access activities are audited.
        </div>
        <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
          © {new Date().getFullYear()} CyberShield Security Systems. Built with React & Spring Boot.
        </div>
      </div>
    </footer>
  );
};
