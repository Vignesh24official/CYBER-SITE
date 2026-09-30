import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

export const CyberHoloShield = ({ size = 220 }) => {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2400);
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
      {/* Outer Menacing Crimson Red Ring (Clockwise Rotation) */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          animation: 'holo-rotate-cw 18s linear infinite',
          filter: 'drop-shadow(0 0 10px rgba(255, 0, 60, 0.55))',
        }}
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="rgba(255, 0, 60, 0.3)"
          strokeWidth="1.5"
          strokeDasharray="8 6 2 6"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="rgba(255, 0, 60, 0.75)"
          strokeWidth="1.5"
          strokeDasharray="40 18 60 18"
        />
        {/* Red Target Telemetry Marks */}
        <line x1="100" y1="2" x2="100" y2="12" stroke="#ff003c" strokeWidth="2.5" />
        <line x1="100" y1="188" x2="100" y2="198" stroke="#ff003c" strokeWidth="2.5" />
        <line x1="2" y1="100" x2="12" y2="100" stroke="#ff003c" strokeWidth="2.5" />
        <line x1="188" y1="100" x2="198" y2="100" stroke="#ff003c" strokeWidth="2.5" />
      </svg>

      {/* Counter-Rotating High-Voltage Blue Inner Compass (Counter-Clockwise Rotation) */}
      <svg
        style={{
          position: 'absolute',
          width: '82%',
          height: '82%',
          animation: 'holo-rotate-ccw 12s linear infinite',
          filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))',
        }}
        viewBox="0 0 160 160"
      >
        <circle
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="rgba(0, 240, 255, 0.4)"
          strokeWidth="1"
          strokeDasharray="10 10"
        />
        <polygon
          points="80,14 138,46 138,114 80,146 22,114 22,46"
          fill="none"
          stroke="rgba(0, 240, 255, 0.6)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Sonar Shockwave Waves: Alternating Red & Blue Cyber Pulses */}
      <div
        key={`sonar-red-${pulseCount}`}
        style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 0, 60, 0.85)',
          boxShadow: '0 0 25px rgba(255, 0, 60, 0.7)',
          animation: 'sonar-shockwave 2.4s cubic-bezier(0.1, 0.6, 0.3, 1) forwards',
          pointerEvents: 'none',
        }}
      />
      <div
        key={`sonar-blue-${pulseCount}`}
        style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '2px solid rgba(0, 240, 255, 0.85)',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)',
          animation: 'sonar-shockwave 2.4s 0.6s cubic-bezier(0.1, 0.6, 0.3, 1) forwards',
          pointerEvents: 'none',
        }}
      />

      {/* Central Glowing Shield Core - Dual Red & Blue Plasma */}
      <div
        style={{
          position: 'relative',
          width: '78px',
          height: '78px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.35) 0%, rgba(10, 15, 30, 0.95) 50%, rgba(0, 240, 255, 0.35) 100%)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(255, 0, 60, 0.6), 0 0 45px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(255, 0, 60, 0.3)',
          zIndex: 3,
        }}
      >
        <Shield size={40} color="#ffffff" style={{ filter: 'drop-shadow(0 0 10px #ff003c) drop-shadow(0 0 15px #00f0ff)' }} />
      </div>

      {/* Dual Red & Blue Target HUD Brackets */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', top: 4, left: 4, width: 14, height: 14, borderTop: '2px solid #ff003c', borderLeft: '2px solid #ff003c', filter: 'drop-shadow(0 0 4px #ff003c)' }} />
        <div style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderTop: '2px solid #00f0ff', borderRight: '2px solid #00f0ff', filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 4, width: 14, height: 14, borderBottom: '2px solid #00f0ff', borderLeft: '2px solid #00f0ff', filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
        <div style={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderBottom: '2px solid #ff003c', borderRight: '2px solid #ff003c', filter: 'drop-shadow(0 0 4px #ff003c)' }} />
      </div>
    </div>
  );
};
