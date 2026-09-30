import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, ShieldAlert } from 'lucide-react';
import { cyberAudio } from '../../services/cyberAudio';

export const CyberPortalGateway = ({ onBreachComplete }) => {
  const isTrueFullscreen = () => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return false;
    if (Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )) {
      return true;
    }
    const wDiff = Math.abs(window.innerWidth - window.screen.width);
    const hDiff = Math.abs(window.innerHeight - window.screen.height);
    return wDiff <= 16 && hDiff <= 16;
  };

  // Stage 1: Full screen option is ALWAYS asked first when entering the site
  const [fullscreenAccepted, setFullscreenAccepted] = useState(false);

  // Phases: 'dormant' | 'triggering' | 'traveling' | 'dissolving' | 'completed'
  const [phase, setPhase] = useState('dormant');
  const [colorSwitched, setColorSwitched] = useState(false);
  const [warpSpeed, setWarpSpeed] = useState(0);
  const canvasRef = useRef(null);

  // Sync fullscreen state with document changes (F11, resize, or HTML5 fullscreen API)
  useEffect(() => {
    const handleFS = () => {
      if (isTrueFullscreen()) {
        setFullscreenAccepted(true);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'F11' || e.code === 'F11') {
        setTimeout(() => {
          setFullscreenAccepted(true);
        }, 150);
      }
    };

    document.addEventListener('fullscreenchange', handleFS);
    document.addEventListener('webkitfullscreenchange', handleFS);
    document.addEventListener('mozfullscreenchange', handleFS);
    document.addEventListener('MSFullscreenChange', handleFS);
    window.addEventListener('resize', handleFS);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFS);
      document.removeEventListener('webkitfullscreenchange', handleFS);
      document.removeEventListener('mozfullscreenchange', handleFS);
      document.removeEventListener('MSFullscreenChange', handleFS);
      window.removeEventListener('resize', handleFS);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRequestFullscreen = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    cyberAudio.playClick();
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen engagement error:', err);
    }
    setFullscreenAccepted(true);
  };

  // Warp tunnel particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Warp stars / cyber matrix rays
    const count = 90;
    const stars = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      z: Math.random() * window.innerWidth,
      pz: Math.random() * window.innerWidth,
      color: Math.random() > 0.4 ? '#00f0ff' : '#ff003c',
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const speed = phase === 'traveling' ? 38 : phase === 'triggering' ? 14 : 1.2;

      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
          star.pz = canvas.width;
        }

        const k = 180 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const pk = 180 / star.pz;
          const prevX = star.x * pk + cx;
          const prevY = star.y * pk + cy;

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.strokeStyle = colorSwitched ? '#00f0ff' : star.color;
          ctx.lineWidth = phase === 'traveling' ? 2.5 : 1;
          ctx.stroke();
        }
        star.pz = star.z;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [phase, colorSwitched]);

  // Lock body scroll while in portal
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleTriggerPortal = () => {
    if (!fullscreenAccepted) return;
    if (phase !== 'dormant') return;

    // 1. Play massive multi-frequency breach audio
    cyberAudio.playPortalBreach();

    // 2. Trigger Phase: Instant color switch (Red -> Cyan/Blue) + Shockwave
    setPhase('triggering');
    setColorSwitched(true);

    // 3. Travel Phase: Warp speed travel through cyberspace
    setTimeout(() => {
      setPhase('traveling');
      setWarpSpeed(1);
    }, 450);

    // 4. Dissolve Phase: Smooth portal shroud dissolve into website
    setTimeout(() => {
      setPhase('dissolving');
    }, 1250);

    // 5. Completed: Unveil website with smooth stagger entrance
    setTimeout(() => {
      setPhase('completed');
      if (onBreachComplete) onBreachComplete();
    }, 1800);
  };

  const handleHover = () => {
    if (phase === 'dormant') {
      cyberAudio.playPortalHover();
    }
  };

  if (phase === 'completed') {
    return null;
  }

  // Active theme colors based on state
  const primaryColor = colorSwitched ? '#00f0ff' : '#ff003c';
  const secondaryColor = colorSwitched ? '#0066ff' : '#990022';
  const glowColor = colorSwitched
    ? 'rgba(0, 240, 255, 0.95)'
    : 'rgba(255, 0, 60, 0.85)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#020408',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: phase === 'dissolving' ? 0 : 1,
        transition: phase === 'dissolving' ? 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        pointerEvents: phase === 'dissolving' ? 'none' : 'auto',
      }}
      onClick={handleTriggerPortal}
    >
      {/* Background Cyber Warp Tunnel Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          opacity: phase === 'traveling' ? 0.95 : 0.45,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Cyber Grid Scanlines Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 4px, 6px 100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Expanding Shockwaves (Triggered on Click) */}
      {colorSwitched && (
        <>
          <div
            className="portal-shockwave shockwave-1"
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px solid #00f0ff',
              boxShadow: '0 0 35px #00f0ff, inset 0 0 20px #00f0ff',
              zIndex: 3,
              pointerEvents: 'none',
              animation: 'portal-shockwave-expand 1.4s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
            }}
          />
          <div
            className="portal-shockwave shockwave-2"
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px solid #38bdf8',
              boxShadow: '0 0 45px #38bdf8',
              zIndex: 3,
              pointerEvents: 'none',
              animation: 'portal-shockwave-expand 1.4s 0.18s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
            }}
          />
          <div
            className="portal-shockwave shockwave-3"
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px solid #ffffff',
              boxShadow: '0 0 60px #00f0ff',
              zIndex: 3,
              pointerEvents: 'none',
              animation: 'portal-shockwave-expand 1.4s 0.36s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
            }}
          />
        </>
      )}

      {/* STAGE 1: ASK FOR FULL SCREEN FIRST */}
      {!fullscreenAccepted ? (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            zIndex: 20,
            maxWidth: '540px',
            width: '90%',
            backgroundColor: 'rgba(5, 9, 22, 0.95)',
            border: '2px solid rgba(255, 0, 60, 0.5)',
            borderRadius: '16px',
            padding: '44px 32px',
            boxShadow: '0 0 60px rgba(255, 0, 60, 0.35), inset 0 0 30px rgba(0, 240, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: 'var(--font-mono, monospace)',
            animation: 'fadeIn 0.35s ease-out',
          }}
        >
          {/* Top Line Gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #ff003c 0%, #00f0ff 50%, #ff003c 100%)',
              boxShadow: '0 0 15px #ff003c',
              borderRadius: '16px 16px 0 0',
            }}
          />

          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 0, 60, 0.15)',
              border: '1px solid rgba(255, 0, 60, 0.6)',
              boxShadow: '0 0 30px rgba(255, 0, 60, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Maximize2 size={34} color="#ff003c" />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 0, 60, 0.18)',
              border: '1px solid #ff003c',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: '#ff4d6d',
              fontWeight: 800,
              letterSpacing: '1px',
              marginBottom: '14px',
            }}
          >
            <ShieldAlert size={12} color="#ff003c" />
            <span>CLASSIFIED GATEWAY // PROTOCOL ACTIVE</span>
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 900, margin: '0 0 12px', letterSpacing: '1px' }}>
            FULL SCREEN REQUIRED
          </h2>

          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 28px', maxWidth: '440px' }}>
            To initialize the Cyber Matrix and access the secure terminal, presentation must be in dedicated Full Screen mode.
          </p>

          <button
            type="button"
            onClick={handleRequestFullscreen}
            onMouseEnter={() => cyberAudio.playHover()}
            style={{
              backgroundColor: '#ff003c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 34px',
              fontSize: '0.92rem',
              fontWeight: 800,
              fontFamily: 'inherit',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 35px rgba(255, 0, 60, 0.65)',
              transition: 'all 0.2s ease',
            }}
          >
            <Maximize2 size={16} />
            <span>ENGAGE FULL SCREEN TO ENTER</span>
          </button>

          <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '18px', letterSpacing: '1px' }}>
            PRESS <strong style={{ color: '#00f0ff' }}>F11</strong> OR CLICK BUTTON ABOVE
          </span>
        </div>
      ) : (
        /* STAGE 2: THE SCARY CYBER HACKER LOGO GRAPHIC */
        <div
          onMouseEnter={handleHover}
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: phase === 'traveling'
              ? 'scale(4.2) rotate(25deg)'
              : phase === 'triggering'
              ? 'scale(1.18)'
              : 'scale(1)',
            transition: phase === 'traveling'
              ? 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), filter 0.85s ease'
              : phase === 'triggering'
              ? 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'transform 0.3s ease',
            filter: phase === 'traveling'
              ? `drop-shadow(0 0 80px ${primaryColor}) blur(1px)`
              : `drop-shadow(0 0 35px ${glowColor})`,
          }}
        >
        {/* Outer Orbiting Runic Telemetry Ring (Clockwise) */}
        <svg
          style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            animation: colorSwitched ? 'portal-spin-fast 1.8s linear infinite' : 'portal-spin-cw 20s linear infinite',
            pointerEvents: 'none',
            transition: 'stroke 0.4s ease',
          }}
          viewBox="0 0 300 300"
        >
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeDasharray="14 10 4 10"
            opacity="0.6"
          />
          <circle
            cx="150"
            cy="150"
            r="132"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
            strokeDasharray="60 25 35 25"
            opacity="0.85"
          />
          {/* Cardinal Targeting Blades */}
          <line x1="150" y1="2" x2="150" y2="18" stroke={primaryColor} strokeWidth="3" />
          <line x1="150" y1="282" x2="150" y2="298" stroke={primaryColor} strokeWidth="3" />
          <line x1="2" y1="150" x2="18" y2="150" stroke={primaryColor} strokeWidth="3" />
          <line x1="282" y1="150" x2="298" y2="150" stroke={primaryColor} strokeWidth="3" />
        </svg>

        {/* Counter-Rotating High-Tech Hexagonal Energy Shroud */}
        <svg
          style={{
            position: 'absolute',
            width: '270px',
            height: '270px',
            animation: colorSwitched ? 'portal-spin-fast-ccw 1.4s linear infinite' : 'portal-spin-ccw 14s linear infinite',
            pointerEvents: 'none',
          }}
          viewBox="0 0 240 240"
        >
          <polygon
            points="120,20 206,70 206,170 120,220 34,170 34,70"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeDasharray="18 12"
            opacity="0.75"
          />
          <circle
            cx="120"
            cy="120"
            r="94"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.5"
          />
        </svg>

        {/* The Menacing Biomechanical Cyber Predator Skull Core */}
        <div
          style={{
            position: 'relative',
            width: '180px',
            height: '180px',
            borderRadius: '24px',
            background: colorSwitched
              ? 'radial-gradient(circle, rgba(0, 240, 255, 0.35) 0%, rgba(2, 6, 18, 0.95) 75%)'
              : 'radial-gradient(circle, rgba(255, 0, 60, 0.35) 0%, rgba(10, 4, 8, 0.95) 75%)',
            border: `2px solid ${primaryColor}`,
            boxShadow: `0 0 45px ${glowColor}, inset 0 0 25px ${primaryColor}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: phase === 'dormant' ? 'portal-icon-breathe 2.8s ease-in-out infinite' : 'none',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Cyber Skull Vector Art */}
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '120px',
              height: '120px',
              filter: `drop-shadow(0 0 12px ${primaryColor})`,
              transition: 'all 0.35s ease',
            }}
          >
            <defs>
              <linearGradient id="skullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </linearGradient>
              <filter id="glowEyes" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Cranial Armor Plates */}
            <path
              d="M 22 38 Q 20 18 50 14 Q 80 18 78 38 Q 82 58 72 70 L 66 84 L 34 84 L 28 70 Q 18 58 22 38 Z"
              fill="rgba(5, 8, 15, 0.95)"
              stroke="url(#skullGrad)"
              strokeWidth="2.5"
            />

            {/* Forehead Cyber Circuit Lines & Defcon Hex Core */}
            <line x1="50" y1="16" x2="50" y2="34" stroke={primaryColor} strokeWidth="2" />
            <polygon points="50,22 55,29 50,36 45,29" fill={primaryColor} />
            <path d="M 36 28 L 44 32 L 44 40" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.8" />
            <path d="M 64 28 L 56 32 L 56 40" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.8" />

            {/* Piercing Scary Eyes (Menacing Angular Gaze) */}
            <polygon
              points="30,46 44,42 42,54 32,54"
              fill={primaryColor}
              filter="url(#glowEyes)"
              style={{
                animation: colorSwitched ? 'portal-eye-flare 0.4s ease forwards' : 'portal-eye-pulse 2s ease infinite',
              }}
            />
            <polygon
              points="70,46 56,42 58,54 68,54"
              fill={primaryColor}
              filter="url(#glowEyes)"
              style={{
                animation: colorSwitched ? 'portal-eye-flare 0.4s ease forwards' : 'portal-eye-pulse 2s ease infinite',
              }}
            />

            {/* Crosshair Target Pupils inside Eyes */}
            <circle cx="37" cy="48" r="2" fill="#ffffff" />
            <circle cx="63" cy="48" r="2" fill="#ffffff" />

            {/* Nasal Vent Cavity */}
            <polygon points="50,56 46,65 54,65" fill={primaryColor} opacity="0.9" />

            {/* Segmented Cybernetic Titanium Jaw & Teeth Grate */}
            <rect x="36" y="73" width="5" height="8" rx="1.5" fill={primaryColor} />
            <rect x="43" y="73" width="5" height="8" rx="1.5" fill={primaryColor} />
            <rect x="52" y="73" width="5" height="8" rx="1.5" fill={primaryColor} />
            <rect x="59" y="73" width="5" height="8" rx="1.5" fill={primaryColor} />

            {/* Jaw Hydraulic Rivets */}
            <circle cx="28" cy="70" r="2.5" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" />
            <circle cx="72" cy="70" r="2.5" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" />

            {/* Temple Conduits */}
            <path d="M 22 48 Q 14 56 26 66" fill="none" stroke={primaryColor} strokeWidth="2" />
            <path d="M 78 48 Q 86 56 74 66" fill="none" stroke={primaryColor} strokeWidth="2" />
          </svg>
        </div>

        {/* 4 Corner High-Tech Targeting HUD Brackets */}
        <div style={{ position: 'absolute', width: '220px', height: '220px', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 18, height: 18, borderTop: `2.5px solid ${primaryColor}`, borderLeft: `2.5px solid ${primaryColor}`, filter: `drop-shadow(0 0 6px ${primaryColor})` }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderTop: `2.5px solid ${primaryColor}`, borderRight: `2.5px solid ${primaryColor}`, filter: `drop-shadow(0 0 6px ${primaryColor})` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 18, height: 18, borderBottom: `2.5px solid ${primaryColor}`, borderLeft: `2.5px solid ${primaryColor}`, filter: `drop-shadow(0 0 6px ${primaryColor})` }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderBottom: `2.5px solid ${primaryColor}`, borderRight: `2.5px solid ${primaryColor}`, filter: `drop-shadow(0 0 6px ${primaryColor})` }} />
        </div>

        {/* Ambient Subtle Cyber Breach Callout */}
        <div
          style={{
            marginTop: '38px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
            opacity: phase === 'traveling' ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: `1px solid ${primaryColor}66`,
              boxShadow: `0 0 15px ${glowColor}44`,
              color: primaryColor,
              fontSize: '0.78rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              animation: 'portal-glitch-text 3s infinite',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primaryColor, boxShadow: `0 0 8px ${primaryColor}` }} />
            {colorSwitched ? 'ACCESS GRANTED // BREACHING CYBER MATRIX...' : 'TOUCH CORE TO INITIATE SYSTEM BREACH'}
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            CLASSIFIED CYBERSHIELD GATEWAY // DEFCON 1 ACTIVE
          </span>
        </div>
      </div>
      )}

      {/* Embedded High-Performance Portal Animations */}
      <style>{`
        @keyframes portal-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes portal-spin-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes portal-spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        @keyframes portal-spin-fast-ccw {
          from { transform: rotate(720deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes portal-icon-breathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 25px rgba(255, 0, 60, 0.7));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 45px rgba(255, 0, 60, 0.95)) drop-shadow(0 0 70px rgba(255, 0, 60, 0.4));
          }
        }
        @keyframes portal-eye-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px #ff003c); }
        }
        @keyframes portal-eye-flare {
          0% { opacity: 0.8; }
          50% { opacity: 1; transform: scale(1.3); filter: drop-shadow(0 0 16px #00f0ff); }
          100% { opacity: 1; filter: drop-shadow(0 0 12px #ffffff); }
        }
        @keyframes portal-shockwave-expand {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(26);
            opacity: 0;
          }
        }
        @keyframes portal-glitch-text {
          0%, 100% { transform: translate(0, 0); opacity: 0.9; }
          92% { transform: translate(0, 0); opacity: 0.9; }
          93% { transform: translate(-2px, 1px); opacity: 1; }
          95% { transform: translate(2px, -1px); opacity: 0.8; }
          97% { transform: translate(0, 0); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
};
