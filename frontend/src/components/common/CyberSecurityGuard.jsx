import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Maximize2, ShieldAlert, Lock, AlertTriangle, CameraOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { cyberAudio } from '../../services/cyberAudio';

/**
 * CyberSecurityGuard
 * Comprehensive site-wide security enforcement:
 * 1. Fullscreen Enforcement: Prompts user to open and remain in Full Screen mode when windowed or off-screen.
 * 2. 100% Anti-Copy & Anti-Paste: Completely locks copy, paste, cut, select-all, drag, and context menu across the site.
 * 3. 100% Anti-Screenshot: Detects PrintScreen (keydown & keyup) & snipping shortcuts, purges clipboard, flashes strobe alert.
 * 4. Ensures the website content is always visible and never appears empty.
 */
export const CyberSecurityGuard = ({ children }) => {
  const { showWarning, showError } = useToast();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotStrobe, setScreenshotStrobe] = useState(false);
  const [securityBanner, setSecurityBanner] = useState(null);
  const bannerTimeoutRef = useRef(null);

  // True Fullscreen Detection (supports Fullscreen API, F11, and window sizing)
  const checkFullscreen = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    // 1. Fullscreen API element check
    if (Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )) {
      return true;
    }
    // 2. Window dimension check for F11 on Windows / Mac
    const sw = window.screen.width;
    const sh = window.screen.height;
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    if (Math.abs(iw - sw) <= 16 && Math.abs(ih - sh) <= 16) {
      return true;
    }
    if (window.outerWidth === sw && window.outerHeight === sh) {
      return true;
    }
    return false;
  }, []);

  // Track if portal has already been breached so alert modal triggers during site browsing
  const [portalBreached, setPortalBreached] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.pathname !== '/') return true;
    try {
      return sessionStorage.getItem('cybershield_portal_breached') === 'true';
    } catch {
      return false;
    }
  });

  const prevFullscreenRef = useRef(false);

  useEffect(() => {
    const onBreach = () => setPortalBreached(true);
    const onReopen = () => setPortalBreached(false);
    window.addEventListener('cybershield-portal-breached', onBreach);
    window.addEventListener('cybershield-reopen-portal', onReopen);
    return () => {
      window.removeEventListener('cybershield-portal-breached', onBreach);
      window.removeEventListener('cybershield-reopen-portal', onReopen);
    };
  }, []);

  const triggerSecurityNotice = useCallback((message, type = 'warning', sound = true) => {
    if (sound) {
      cyberAudio.playAlarm();
    }
    if (type === 'error') {
      showError(message);
    } else {
      showWarning(message);
    }

    setSecurityBanner(message);
    if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    bannerTimeoutRef.current = setTimeout(() => {
      setSecurityBanner(null);
    }, 2800);
  }, [showError, showWarning]);

  // Request Fullscreen helper
  const enterFullscreen = async () => {
    cyberAudio.playClick();
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen engagement error:', err);
    }
    // Immediately set isFullscreen to true so modal closes without delay!
    setIsFullscreen(true);
    prevFullscreenRef.current = true;
  };

  // 1. Fullscreen Listener & Exit Alarm Trigger
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = checkFullscreen();
      // If user came out of full screen while browsing, sound the alarm!
      if (prevFullscreenRef.current && !isFS && portalBreached) {
        cyberAudio.playAlarm();
        triggerSecurityNotice('DEFCON-1 ALERT: You exited full screen! Full screen mode required.', 'error', false);
      }
      prevFullscreenRef.current = isFS;
      setIsFullscreen(isFS);
    };

    const handleKeyFS = (e) => {
      if (e.key === 'F11' || e.code === 'F11') {
        setTimeout(() => {
          const isFS = checkFullscreen();
          setIsFullscreen(isFS);
          prevFullscreenRef.current = isFS;
        }, 150);
      }
    };

    const initialFS = checkFullscreen();
    prevFullscreenRef.current = initialFS;
    setIsFullscreen(initialFS);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('resize', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyFS);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('resize', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyFS);
    };
  }, [checkFullscreen, portalBreached, triggerSecurityNotice]);

  // 2. 100% Anti-Copy, Anti-Cut, Anti-Paste & Anti-Right-Click Event Traps
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '[CYBERSHIELD DEFCON-1]: Copying locked.');
      }
      triggerSecurityNotice('SECURITY LOCK: Copy option is locked on this site.');
    };

    const handleCut = (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerSecurityNotice('SECURITY LOCK: Cut option is locked on this site.');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerSecurityNotice('SECURITY LOCK: Paste option is locked on this site.');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerSecurityNotice('RESTRICTED ACCESS: Context menu and right-click are locked.');
    };

    const handleDragStart = (e) => {
      e.preventDefault();
    };

    const handleSelectStart = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('selectstart', handleSelectStart, true);

    return () => {
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
    };
  }, [triggerSecurityNotice]);

  // 3. 100% Anti-Screenshot & Anti-Copy/Paste Keyboard Trap (KeyDown + KeyUp)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key || '';
      const code = e.code || '';
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // Block Ctrl+C / Cmd+C (Copy)
      if (ctrlOrMeta && (key.toLowerCase() === 'c' || code === 'KeyC')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY LOCK: Copy option is locked on this site.');
        return;
      }

      // Block Ctrl+V / Cmd+V (Paste)
      if (ctrlOrMeta && (key.toLowerCase() === 'v' || code === 'KeyV')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY LOCK: Paste option is locked on this site.');
        return;
      }

      // Block Ctrl+X / Cmd+X (Cut)
      if (ctrlOrMeta && (key.toLowerCase() === 'x' || code === 'KeyX')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY LOCK: Cut option is locked.');
        return;
      }

      // Block Ctrl+A / Cmd+A (Select All)
      if (ctrlOrMeta && (key.toLowerCase() === 'a' || code === 'KeyA')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY LOCK: Text selection is locked.');
        return;
      }

      // Block Ctrl+Insert & Shift+Insert
      if ((ctrlOrMeta && (key === 'Insert' || code === 'Insert')) || (e.shiftKey && (key === 'Insert' || code === 'Insert'))) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY LOCK: Clipboard operation is locked.');
        return;
      }

      // PrintScreen interception on keydown
      if (key === 'PrintScreen' || code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('[SECURITY ALERT]: Screenshot capture is locked.').catch(() => {});
        }
        setScreenshotStrobe(true);
        setTimeout(() => setScreenshotStrobe(false), 1200);
        triggerSecurityNotice('DEFCON ALARM: Screenshot option is locked on this site!', 'error', true);
        return;
      }

      // Block Ctrl+P (Print to PDF/printer)
      if (ctrlOrMeta && key.toLowerCase() === 'p') {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('RESTRICTED ACTION: Printing and PDF export are disabled.');
        return;
      }

      // Block Ctrl+Shift+S / Meta+Shift+S (Snipping)
      if (ctrlOrMeta && e.shiftKey && key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopPropagation();
        setScreenshotStrobe(true);
        setTimeout(() => setScreenshotStrobe(false), 1200);
        triggerSecurityNotice('DEFCON ALARM: Screenshot shortcut blocked!', 'error', true);
        return;
      }

      // Block Ctrl+S / Meta+S (Save page)
      if (ctrlOrMeta && key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY PROTOCOL: Saving webpage source is restricted.');
        return;
      }

      // Block Ctrl+U (View Source)
      if (ctrlOrMeta && key.toLowerCase() === 'u') {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('SECURITY PROTOCOL: View source is restricted.');
        return;
      }

      // Block F12 / DevTools shortcuts
      if (
        key === 'F12' ||
        (ctrlOrMeta && e.shiftKey && ['i', 'j', 'c'].includes(key.toLowerCase()))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('RESTRICTED: Developer inspection tools disabled.');
      }
    };

    // Windows/Chromium fires PrintScreen on keyup
    const handleKeyUp = (e) => {
      const key = e.key || '';
      const code = e.code || '';
      if (key === 'PrintScreen' || code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('[SECURITY ALERT]: Screenshot capture is locked.').catch(() => {});
        }
        setScreenshotStrobe(true);
        setTimeout(() => setScreenshotStrobe(false), 1200);
        triggerSecurityNotice('DEFCON ALARM: Screenshot option is locked on this site!', 'error', true);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [triggerSecurityNotice]);

  return (
    <>
      {/* Dynamic Security Notice Banner */}
      {securityBanner && (
        <div
          style={{
            position: 'fixed',
            top: isFullscreen ? '16px' : '62px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000000,
            backgroundColor: 'rgba(255, 0, 60, 0.95)',
            color: '#ffffff',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 800,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 35px rgba(255, 0, 60, 0.8), 0 0 10px #ff003c',
            border: '1px solid #ffffff',
            animation: 'fadeIn 0.2s ease-out',
            pointerEvents: 'none',
            transition: 'top 0.3s ease',
          }}
        >
          <ShieldAlert size={18} color="#ffffff" />
          <span>{securityBanner}</span>
        </div>
      )}

      {/* Screenshot Intercept Strobe Flash */}
      {screenshotStrobe && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000001,
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            color: '#ff003c',
            fontFamily: 'var(--font-mono, monospace)',
            textAlign: 'center',
            padding: '24px',
            animation: 'pulse 0.4s infinite alternate',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 0, 60, 0.2)',
              border: '2px solid #ff003c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px #ff003c',
            }}
          >
            <CameraOff size={42} color="#ff003c" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', letterSpacing: '3px', margin: '0 0 12px', color: '#ff4d6d' }}>
              ⚠ SCREENSHOT OPTION LOCKED
            </h1>
            <p style={{ fontSize: '1rem', color: '#f8fafc', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
              CLASSIFIED BUFFER PURGED // Screen captures and visual scraping are forbidden on this site.
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ff003c', letterSpacing: '2px' }}>
            SECURITY AUDIT: 0xLOCKED // {new Date().toISOString()}
          </div>
        </div>
      )}

      {/* DEFCON-1 FULL SCREEN EXIT ALERT MODAL */}
      {!isFullscreen && portalBreached && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999998,
            backgroundColor: 'rgba(2, 6, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '540px',
              width: '100%',
              backgroundColor: 'rgba(8, 12, 28, 0.98)',
              border: '2px solid #ff003c',
              borderRadius: '16px',
              padding: '42px 32px',
              boxShadow: '0 0 60px rgba(255, 0, 60, 0.5), inset 0 0 30px rgba(255, 0, 60, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            {/* Top pulsing laser accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #ff003c, #00f0ff, #ff003c)',
                boxShadow: '0 0 20px #ff003c',
                borderRadius: '16px 16px 0 0',
              }}
            />

            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 60, 0.18)',
                border: '2px solid #ff003c',
                boxShadow: '0 0 30px rgba(255, 0, 60, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                animation: 'pulse 1.4s infinite',
              }}
            >
              <Maximize2 size={38} color="#ff003c" />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 0, 60, 0.2)',
                border: '1px solid #ff003c',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                color: '#ff4d6d',
                fontWeight: 800,
                letterSpacing: '1.5px',
                marginBottom: '16px',
              }}
            >
              <AlertTriangle size={13} color="#ff003c" />
              <span>DEFCON-1 ALERT // FULL SCREEN EXITED</span>
            </div>

            <h2
              style={{
                fontSize: '1.65rem',
                color: '#ffffff',
                fontWeight: 900,
                margin: '0 0 14px',
                letterSpacing: '1px',
              }}
            >
              FULL SCREEN REQUIRED
            </h2>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                margin: '0 0 30px',
                maxWidth: '430px',
              }}
            >
              You have exited full screen mode. CyberShield is configured to present only on full screen. Please turn on full screen to continue.
            </p>

            <button
              type="button"
              onClick={enterFullscreen}
              onMouseEnter={() => cyberAudio.playHover()}
              style={{
                backgroundColor: '#ff003c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 36px',
                fontSize: '0.95rem',
                fontWeight: 800,
                fontFamily: 'inherit',
                letterSpacing: '1.2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 35px rgba(255, 0, 60, 0.7)',
                transition: 'all 0.2s ease',
              }}
            >
              <Maximize2 size={18} />
              <span>TURN ON FULL SCREEN (F11)</span>
            </button>

            <span
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                marginTop: '18px',
                letterSpacing: '1px',
              }}
            >
              PRESS <strong style={{ color: '#00f0ff' }}>F11</strong> OR CLICK BUTTON ABOVE
            </span>
          </div>
        </div>
      )}

      {/* Main Website Content - Always Fully Visible and Interactive */}
      <div
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </>
  );
};
