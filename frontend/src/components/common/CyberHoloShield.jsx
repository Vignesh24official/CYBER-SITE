import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

export const CyberHoloShield = ({ size = 220 }) => {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      {/* Outer Hexagonal Telemetry Ring (Clockwise Rotation) */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          animation: 'holo-rotate-cw 20s linear infinite',
          filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.4))',
        }}
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1.5"
          strokeDasharray="8 6 2 6"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="rgba(0, 242, 254, 0.5)"
          strokeWidth="1.5"
          strokeDasharray="40 18 60 18"
        />
        {/* Corner Telemetry Marks */}
        <line x1="100" y1="2" x2="100" y2="12" stroke="#00f2fe" strokeWidth="2" />
        <line x1="100" y1="188" x2="100" y2="198" stroke="#00f2fe" strokeWidth="2" />
        <line x1="2" y1="100" x2="12" y2="100" stroke="#00f2fe" strokeWidth="2" />
        <line x1="188" y1="100" x2="198" y2="100" stroke="#00f2fe" strokeWidth="2" />
      </svg>

      {/* Counter-Rotating Dashed Inner Compass (Counter-Clockwise Rotation) */}
      <svg
        style={{
          position: 'absolute',
          width: '82%',
          height: '82%',
          animation: 'holo-rotate-ccw 14s linear infinite',
        }}
        viewBox="0 0 160 160"
      >
        <circle
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="rgba(168, 85, 247, 0.35)"
          strokeWidth="1"
          strokeDasharray="12 12"
        />
        <polygon
          points="80,14 138,46 138,114 80,146 22,114 22,46"
          fill="none"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="1"
        />
      </svg>

      {/* Sonar Shockwave Expansions */}
      <div
        key={`sonar-${pulseCount}`}
        style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '2px solid rgba(0, 242, 254, 0.8)',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.6)',
          animation: 'sonar-shockwave 2.6s cubic-bezier(0.1, 0.6, 0.3, 1) forwards',
          pointerEvents: 'none',
        }}
      />
      <div
        key={`sonar-delayed-${pulseCount}`}
        style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '1.5px solid rgba(16, 185, 129, 0.6)',
          animation: 'sonar-shockwave 2.6s 0.7s cubic-bezier(0.1, 0.6, 0.3, 1) forwards',
          pointerEvents: 'none',
        }}
      />

      {/* Central Glowing Shield Core */}
      <div
        style={{
          position: 'relative',
          width: '74px',
          height: '74px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(37, 99, 235, 0.35) 100%)',
          border: '2px solid rgba(0, 242, 254, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(0, 242, 254, 0.6), inset 0 0 15px rgba(0, 242, 254, 0.4)',
          zIndex: 3,
        }}
      >
        <Shield size={38} color="#ffffff" style={{ filter: 'drop-shadow(0 0 8px #00f2fe)' }} />
      </div>

      {/* Target HUD Brackets */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', top: 4, left: 4, width: 12, height: 12, borderTop: '2px solid #00f2fe', borderLeft: '2px solid #00f2fe' }} />
        <div style={{ position: 'absolute', top: 4, right: 4, width: 12, height: 12, borderTop: '2px solid #00f2fe', borderRight: '2px solid #00f2fe' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 4, width: 12, height: 12, borderBottom: '2px solid #00f2fe', borderLeft: '2px solid #00f2fe' }} />
        <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderBottom: '2px solid #00f2fe', borderRight: '2px solid #00f2fe' }} />
      </div>
    </div>
  );
};
