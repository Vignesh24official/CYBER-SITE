import React from 'react';

export const CyberShieldSecurityPulse = ({ statusText = "HACKER PORTAL // ACTIVE BREACH MONITOR", compact = false, threat = true }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '6px' : '10px',
        padding: compact ? '4px 10px' : '6px 14px',
        backgroundColor: threat ? 'rgba(255, 0, 60, 0.12)' : 'rgba(0, 240, 255, 0.08)',
        border: threat ? '1px solid rgba(255, 0, 60, 0.45)' : '1px solid rgba(0, 240, 255, 0.25)',
        borderRadius: '9999px',
        backdropFilter: 'blur(8px)',
        boxShadow: threat ? '0 0 18px rgba(255, 0, 60, 0.25)' : '0 0 15px rgba(0, 240, 255, 0.2)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: compact ? '8px' : '10px',
          height: compact ? '8px' : '10px',
          borderRadius: '50%',
          backgroundColor: threat ? '#ff003c' : '#00f0ff',
          boxShadow: threat ? '0 0 12px #ff003c' : '0 0 12px #00f0ff',
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
            backgroundColor: threat ? '#ff003c' : '#00f0ff',
            animation: 'hacker-pulse-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.85,
          }}
        />
      </div>

      <span
        style={{
          fontSize: compact ? '0.7rem' : '0.775rem',
          fontWeight: 800,
          color: threat ? '#ff4d6d' : '#38bdf8',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono), monospace',
          whiteSpace: 'nowrap',
          textShadow: threat ? '0 0 8px rgba(255, 0, 60, 0.5)' : '0 0 8px rgba(0, 240, 255, 0.5)',
        }}
      >
        {statusText}
      </span>

      <style>{`
        @keyframes hacker-pulse-ping {
          75%, 100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
