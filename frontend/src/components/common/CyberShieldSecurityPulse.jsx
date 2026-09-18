import React from 'react';

export const CyberShieldSecurityPulse = ({ statusText = "DEFENSE GRID ACTIVE", compact = false }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '6px' : '10px',
        padding: compact ? '4px 10px' : '6px 14px',
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: '9999px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: compact ? '8px' : '10px',
          height: compact ? '8px' : '10px',
          borderRadius: '50%',
          backgroundColor: '#06b6d4',
          boxShadow: '0 0 10px #06b6d4',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.75,
          }}
        />
      </div>

      <span
        style={{
          fontSize: compact ? '0.7rem' : '0.775rem',
          fontWeight: 700,
          color: '#38bdf8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        {statusText}
      </span>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
