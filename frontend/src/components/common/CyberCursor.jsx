import React, { useEffect, useState, useRef } from 'react';
import { cyberAudio } from '../../services/cyberAudio';

export const CyberCursor = () => {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);

  // Scary entrance states
  // 0: unentered, 1: breach detected (giant zoom lock), 2: target locked, 3: settled scary predator
  const [entranceStage, setEntranceStage] = useState(0);
  const [clickRipples, setClickRipples] = useState([]);
  const [crosshairActive, setCrosshairActive] = useState(true);

  // Trailing phantom ghost trail
  const trailRef = useRef([]);
  const targetPosRef = useRef({ x: -300, y: -300 });
  const currentPosRef = useRef({ x: -300, y: -300 });
  const entranceTimersRef = useRef([]);

  // Telemetry scary glitch strings
  const [glitchText, setGlitchText] = useState('☠ HOST_INTRUSION_DETECTED');

  useEffect(() => {
    const scaryTexts = [
      '☠ HOST_INTRUSION_DETECTED',
      '⚠ BIOMETRIC_LOCK_ENGAGED',
      '⚡ THREAT_LEVEL: CRITICAL',
      '👁 TRACE_INITIATED // 100%',
      '⚡ BIO-CYBER_OVERRIDE',
      '💀 TARGET_LOCKED :: EXECUTE',
      '☣ MEMORY_CORRUPTION_SCAN',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % scaryTexts.length;
      setGlitchText(scaryTexts[idx]);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  const triggerEntranceSequence = () => {
    // Clear existing timers if re-triggering
    entranceTimersRef.current.forEach(clearTimeout);
    entranceTimersRef.current = [];

    setEntranceStage(1);
    cyberAudio.playIntrusionLock();

    const t1 = setTimeout(() => {
      setEntranceStage(2);
    }, 1300);

    const t2 = setTimeout(() => {
      setEntranceStage(3);
    }, 3000);

    entranceTimersRef.current = [t1, t2];
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);
    if (!mediaQuery.matches) return;

    // Hide standard cursor completely
    document.documentElement.style.cursor = 'none';

    let hasInitiallyEntered = false;

    const handleMouseEnter = () => {
      setIsOffscreen(false);
      triggerEntranceSequence();
    };

    const handleMouseLeave = () => {
      setIsOffscreen(true);
    };

    const handleMouseMove = (e) => {
      setIsOffscreen(false);
      if (!hasInitiallyEntered) {
        hasInitiallyEntered = true;
        triggerEntranceSequence();
      }
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      cyberAudio.playClick();
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setClickRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('card-interactive') ||
        target.classList.contains('btn') ||
        target.getAttribute('role') === 'button';

      if (isInteractive) {
        if (!isHovered) cyberAudio.playTargetSnap();
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Frame animation loop for smooth trail & position lerping
    let animId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const tick = () => {
      currentPosRef.current.x = lerp(currentPosRef.current.x, targetPosRef.current.x, 0.42);
      currentPosRef.current.y = lerp(currentPosRef.current.y, targetPosRef.current.y, 0.42);

      const curX = currentPosRef.current.x;
      const curY = currentPosRef.current.y;

      // Update phantom ghost trail history
      trailRef.current.unshift({ x: curX, y: curY });
      if (trailRef.current.length > 8) {
        trailRef.current.pop();
      }

      setPos({
        x: Math.round(curX),
        y: Math.round(curY),
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = 'auto';
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
      entranceTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  if (!isFinePointer || pos.x < -100 || isOffscreen) return null;

  const isScaryEntrance = entranceStage === 1 || entranceStage === 2;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. SCARY ENTRANCE FULL-SCREEN RED SCANNER & VIGNETTE BREACH */}
      {/* ============================================================== */}
      {isScaryEntrance && (
        <>
          {/* Blood-Red Peripheral Alarm Vignette */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              boxShadow: 'inset 0 0 140px rgba(255, 0, 60, 0.65), inset 0 0 40px rgba(0, 0, 0, 0.9)',
              pointerEvents: 'none',
              zIndex: 99980,
              animation: 'scary-vignette-pulse 0.9s infinite alternate cubic-bezier(0.4, 0, 0.6, 1)',
            }}
          />

          {/* Sweeping Laser Scanner Bar from Top to Bottom */}
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#ff003c',
              boxShadow: '0 0 25px #ff003c, 0 0 60px rgba(255, 0, 60, 0.8)',
              pointerEvents: 'none',
              zIndex: 99981,
              animation: 'scary-scan-sweep 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          />

          {/* Biometric Warning Banner Top Center */}
          <div
            style={{
              position: 'fixed',
              top: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(10, 0, 4, 0.92)',
              border: '1px solid #ff003c',
              padding: '6px 20px',
              borderRadius: '4px',
              boxShadow: '0 0 35px rgba(255, 0, 60, 0.75)',
              zIndex: 99985,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'scary-banner-glitch 0.25s infinite',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ff003c',
                boxShadow: '0 0 12px #ff003c',
                animation: 'pulse-glow 0.5s infinite alternate',
              }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#ff4d6d' }}>
              <span style={{ fontWeight: 900, color: '#ffffff' }}>[ ☠ BIO-SIGNATURE COMPROMISED ]</span>{' '}
              TRACE: <strong style={{ color: '#ff003c' }}>ACTIVE</strong> // HOST: <strong style={{ color: '#00f2fe' }}>IDENTIFIED</strong>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 2. FULL VIEWPORT PREDATOR CROSSHAIR LASERS (X & Y AXES) */}
      {/* ============================================================== */}
      {crosshairActive && (
        <>
          {/* Horizontal Laser Line spanning 0 to 100vw at pos.y */}
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: `${pos.y}px`,
              height: '1px',
              background: isHovered
                ? `linear-gradient(90deg, transparent 0%, rgba(255,0,60,0.2) 20%, rgba(255,0,60,0.85) 50%, rgba(255,0,60,0.2) 80%, transparent 100%)`
                : `linear-gradient(90deg, transparent 0%, rgba(0,242,254,0.15) 30%, rgba(255,0,60,0.55) 50%, rgba(0,242,254,0.15) 70%, transparent 100%)`,
              pointerEvents: 'none',
              zIndex: 99988,
              boxShadow: isHovered ? '0 0 8px rgba(255, 0, 60, 0.7)' : '0 0 5px rgba(255, 0, 60, 0.35)',
              transition: 'background 0.15s ease',
            }}
          />

          {/* Vertical Laser Line spanning 0 to 100vh at pos.x */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: `${pos.x}px`,
              width: '1px',
              background: isHovered
                ? `linear-gradient(180deg, transparent 0%, rgba(255,0,60,0.2) 20%, rgba(255,0,60,0.85) 50%, rgba(255,0,60,0.2) 80%, transparent 100%)`
                : `linear-gradient(180deg, transparent 0%, rgba(0,242,254,0.15) 30%, rgba(255,0,60,0.55) 50%, rgba(0,242,254,0.15) 70%, transparent 100%)`,
              pointerEvents: 'none',
              zIndex: 99988,
              boxShadow: isHovered ? '0 0 8px rgba(255, 0, 60, 0.7)' : '0 0 5px rgba(255, 0, 60, 0.35)',
              transition: 'background 0.15s ease',
            }}
          />

          {/* Axis Ticks beside the cursor */}
          <div
            style={{
              position: 'fixed',
              left: `${pos.x + 14}px`,
              top: `${pos.y - 18}px`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: isHovered ? '#ff003c' : 'rgba(0, 242, 254, 0.7)',
              letterSpacing: '0.06em',
              pointerEvents: 'none',
              zIndex: 99989,
              userSelect: 'none',
            }}
          >
            X:{String(pos.x).padStart(4, '0')} | Y:{String(pos.y).padStart(4, '0')}
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 3. TRAILING PHANTOM GHOST ECHOES (Sinister Plasma Tail) */}
      {/* ============================================================== */}
      {trailRef.current.map((pt, idx) => {
        if (idx === 0) return null;
        const opacity = (1 - idx / trailRef.current.length) * 0.55;
        const size = Math.max(3, 16 - idx * 1.7);
        const color = idx % 2 === 0 ? '#ff003c' : '#00f2fe';
        return (
          <div
            key={idx}
            style={{
              position: 'fixed',
              left: `${pt.x}px`,
              top: `${pt.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${size * 2.2}px ${color}`,
              opacity: opacity,
              pointerEvents: 'none',
              zIndex: 99990 - idx,
            }}
          />
        );
      })}

      {/* ============================================================== */}
      {/* 4. CLICK SHOCKWAVE EXPLOSIONS */}
      {/* ============================================================== */}
      {clickRipples.map((ripple) => (
        <React.Fragment key={ripple.id}>
          {/* Primary Crimson EMP Shockwave */}
          <div
            style={{
              position: 'fixed',
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid #ff003c',
              boxShadow: '0 0 35px #ff003c, inset 0 0 20px #ff003c',
              animation: 'scary-click-blast 0.65s cubic-bezier(0.12, 0.8, 0.32, 1) forwards',
              pointerEvents: 'none',
              zIndex: 99995,
            }}
          />
          {/* Secondary Cyan Fractured Ring */}
          <div
            style={{
              position: 'fixed',
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: '1px dashed #00f2fe',
              boxShadow: '0 0 25px #00f2fe',
              animation: 'scary-click-blast-secondary 0.75s cubic-bezier(0.1, 0.7, 0.2, 1) forwards',
              pointerEvents: 'none',
              zIndex: 99994,
            }}
          />
        </React.Fragment>
      ))}

      {/* ============================================================== */}
      {/* 5. MAIN SCARY CYBER PREDATOR RETICLE CURSOR */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'fixed',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ENTRANCE GIANT RADAR RETICLE ZOOMING DOWN (Scary predator acquisition) */}
        {isScaryEntrance && (
          <div
            style={{
              position: 'absolute',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 0, 60, 0.9)',
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              boxShadow: '0 0 45px rgba(255, 0, 60, 0.8), inset 0 0 30px rgba(255, 0, 60, 0.45)',
              animation: 'scary-entrance-zoom-spin 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          >
            {/* Crosshair lines inside the entrance radar */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: '#ff003c' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: '#ff003c' }} />
          </div>
        )}

        {/* Tactical Corner Brackets [  ] */}
        <div
          style={{
            position: 'absolute',
            width: isHovered ? '64px' : isScaryEntrance ? '72px' : '44px',
            height: isHovered ? '64px' : isScaryEntrance ? '72px' : '44px',
            transition: 'all 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            pointerEvents: 'none',
          }}
        >
          {/* Top-Left Bracket */}
          <span style={{ position: 'absolute', top: 0, left: 0, width: '9px', height: '9px', borderTop: '2px solid #ff003c', borderLeft: '2px solid #ff003c', filter: 'drop-shadow(0 0 4px #ff003c)' }} />
          {/* Top-Right Bracket */}
          <span style={{ position: 'absolute', top: 0, right: 0, width: '9px', height: '9px', borderTop: '2px solid #ff003c', borderRight: '2px solid #ff003c', filter: 'drop-shadow(0 0 4px #ff003c)' }} />
          {/* Bottom-Left Bracket */}
          <span style={{ position: 'absolute', bottom: 0, left: 0, width: '9px', height: '9px', borderBottom: '2px solid #ff003c', borderLeft: '2px solid #ff003c', filter: 'drop-shadow(0 0 4px #ff003c)' }} />
          {/* Bottom-Right Bracket */}
          <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderBottom: '2px solid #ff003c', borderRight: '2px solid #ff003c', filter: 'drop-shadow(0 0 4px #ff003c)' }} />
        </div>

        {/* OUTER BARBED RAZOR TEETH CYBER RING (Clockwise Spin) */}
        <svg
          style={{
            position: 'absolute',
            width: isHovered ? '54px' : isScaryEntrance ? '66px' : '38px',
            height: isHovered ? '54px' : isScaryEntrance ? '66px' : '38px',
            animation: 'scary-reticle-spin 3.2s linear infinite',
            filter: 'drop-shadow(0 0 10px #ff003c)',
            transition: 'width 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          viewBox="0 0 100 100"
        >
          {/* 8 Wicked Razor Barbs */}
          {/* 0 deg North */}
          <polygon points="50,0 55,14 45,14" fill="#ff003c" />
          {/* 180 deg South */}
          <polygon points="50,100 55,86 45,86" fill="#ff003c" />
          {/* 270 deg West */}
          <polygon points="0,50 14,55 14,45" fill="#ff003c" />
          {/* 90 deg East */}
          <polygon points="100,50 86,55 86,45" fill="#ff003c" />
          {/* 45 deg NE */}
          <polygon points="85,15 78,25 73,20" fill="#ff003c" />
          {/* 135 deg SE */}
          <polygon points="85,85 73,80 78,75" fill="#ff003c" />
          {/* 225 deg SW */}
          <polygon points="15,85 22,75 27,80" fill="#ff003c" />
          {/* 315 deg NW */}
          <polygon points="15,15 27,20 22,25" fill="#ff003c" />

          {/* Serrated Cutout Ring */}
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#ff003c"
            strokeWidth="2.8"
            strokeDasharray="20 10 32 10"
          />
        </svg>

        {/* INNER COUNTER-ROTATING CYAN / AMBER APERTURE (Counter-Clockwise) */}
        <svg
          style={{
            position: 'absolute',
            width: isHovered ? '34px' : '22px',
            height: isHovered ? '34px' : '22px',
            animation: 'scary-reticle-spin-rev 2s linear infinite',
            filter: 'drop-shadow(0 0 7px #00f2fe)',
            transition: 'all 0.2s ease',
          }}
          viewBox="0 0 60 60"
        >
          <circle
            cx="30"
            cy="30"
            r="20"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="2"
            strokeDasharray="10 8 16 8"
          />
          {/* Crosshair Center Reticle */}
          <line x1="30" y1="16" x2="30" y2="44" stroke="#00f2fe" strokeWidth="1.5" />
          <line x1="16" y1="30" x2="44" y2="30" stroke="#00f2fe" strokeWidth="1.5" />
        </svg>

        {/* CENTRAL DEMONIC RED EYE / GLOWING CORE */}
        <div
          style={{
            width: isClicking ? '10px' : isHovered ? '7px' : '5px',
            height: isClicking ? '10px' : isHovered ? '7px' : '5px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: isClicking
              ? '0 0 25px #ff003c, 0 0 45px #ff003c, 0 0 60px #ffffff'
              : '0 0 12px #ff003c, 0 0 24px #ff003c',
            zIndex: 10,
            transition: 'all 0.08s ease',
          }}
        />

        {/* SCARY ENTRANCE HUD OVERLAY (Pinned beside cursor) */}
        {isScaryEntrance && (
          <div
            style={{
              position: 'absolute',
              top: '46px',
              left: '32px',
              backgroundColor: 'rgba(15, 2, 6, 0.94)',
              border: '1px solid #ff003c',
              borderLeft: '4px solid #ff003c',
              padding: '6px 12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              color: '#ff4d6d',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 24px rgba(255, 0, 60, 0.7)',
              animation: 'scary-text-glitch 0.28s infinite',
            }}
          >
            <div style={{ fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ff003c' }}>☠</span>
              <span>HOST_INTRUSION: {pos.x}:{pos.y}</span>
            </div>
            <div style={{ fontSize: '0.6rem', color: '#ff8099', marginTop: '2px' }}>
              BIOMETRIC_LOCK: <strong style={{ color: '#00f2fe' }}>100%</strong> // CYBER_TRACE: ENGAGED
            </div>
          </div>
        )}

        {/* HOVER TARGET LOCK-ON HUD */}
        {isHovered && !isScaryEntrance && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '30px',
              backgroundColor: 'rgba(8, 2, 5, 0.94)',
              border: '1px solid #ff003c',
              borderRadius: '4px',
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              color: '#ff003c',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 18px rgba(255, 0, 60, 0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'scary-text-glitch 0.35s infinite',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ff003c',
                boxShadow: '0 0 8px #ff003c',
              }}
            />
            <span style={{ fontWeight: 800, color: '#ffffff' }}>{glitchText}</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 6. KEYFRAME ANIMATION INJECTIONS */}
      {/* ============================================================== */}
      <style>{`
        @keyframes scary-reticle-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scary-reticle-spin-rev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes scary-vignette-pulse {
          0% { opacity: 0.35; }
          100% { opacity: 0.95; }
        }
        @keyframes scary-scan-sweep {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scary-entrance-zoom-spin {
          0% {
            transform: scale(2.4) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.4) rotate(180deg);
            opacity: 0.9;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0.4;
          }
        }
        @keyframes scary-click-blast {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
            border-width: 3px;
          }
          100% {
            width: 140px;
            height: 140px;
            opacity: 0;
            border-color: #00f2fe;
            border-width: 1px;
          }
        }
        @keyframes scary-click-blast-secondary {
          0% {
            width: 10px;
            height: 10px;
            opacity: 0.9;
          }
          100% {
            width: 90px;
            height: 90px;
            opacity: 0;
            border-color: #ff003c;
          }
        }
        @keyframes scary-text-glitch {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-1.5px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, 0.5px); }
          80% { transform: translate(1.5px, -1px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes scary-banner-glitch {
          0% { transform: translateX(-50%) skewX(0deg); }
          25% { transform: translateX(calc(-50% - 2px)) skewX(-1.5deg); }
          50% { transform: translateX(calc(-50% + 2px)) skewX(1deg); }
          75% { transform: translateX(calc(-50% - 1px)) skewX(-0.5deg); }
          100% { transform: translateX(-50%) skewX(0deg); }
        }
      `}</style>
    </>
  );
};
