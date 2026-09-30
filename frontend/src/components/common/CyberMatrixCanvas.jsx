import React, { useEffect, useRef } from 'react';

export const CyberMatrixCanvas = ({ height = '100%', opacity = 0.75 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let heightPx = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      heightPx = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive scary pulse
    let mouse = { x: -1000, y: -1000, radius: 150 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // 1. Cyber Nodes: 50% Electric Blue (Defense) & 50% Sinister Red (Threat)
    const nodeCount = Math.floor(Math.min(width, 1200) / 16);
    const nodes = [];
    const colors = [
      '#ff003c', // Blood Threat Red
      '#ff1744', // Crimson Alert
      '#00f0ff', // High Voltage Blue
      '#38bdf8', // Neon Sky Blue
      '#0066ff', // Deep Cyber Cobalt
    ];

    for (let i = 0; i < nodeCount; i++) {
      const isRedTeam = Math.random() < 0.45;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * heightPx,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.2 + 1.2,
        color: isRedTeam ? (Math.random() > 0.5 ? '#ff003c' : '#ff1744') : (Math.random() > 0.5 ? '#00f0ff' : '#0066ff'),
        isRedTeam,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.035 + Math.random() * 0.025,
      });
    }

    // 2. Data Packets (Flying red attack bursts and blue defense pulses)
    const packets = [];
    const createPacket = (fromNode, toNode) => {
      const isRed = fromNode.isRedTeam || toNode.isRedTeam;
      packets.push({
        from: fromNode,
        to: toNode,
        progress: 0,
        speed: 0.02 + Math.random() * 0.025,
        color: isRed ? '#ff003c' : '#00f0ff',
        size: isRed ? 2.8 : 2.2,
      });
    };

    // 3. Floating Scary Hacker Tokens
    const cyberTokens = [
      '☠ ROOT_OVERRIDE',
      '0xFA_BREACH',
      'CVE-2026-4421',
      'PORT:443_EXPLOIT',
      'ZERO_DAY_PAYLOAD',
      'C2_BEACON:ACTIVE',
      'TLS_STRIP',
      'BUFFER_OVERFLOW',
      'SYN_FLOOD',
      'BLUE_CIPHER:LOCKED',
      'RED_INTRUSION:ENGAGED',
      'AES-256-GCM',
      'MEMORY_DUMP:0x8B',
      'SHIELD_DEFENSE:ONLINE',
    ];

    const floatingTokens = [];
    for (let i = 0; i < 16; i++) {
      const isRed = Math.random() > 0.5;
      floatingTokens.push({
        text: cyberTokens[Math.floor(Math.random() * cyberTokens.length)],
        x: Math.random() * width,
        y: Math.random() * heightPx,
        vy: -0.3 - Math.random() * 0.45,
        alpha: 0.2 + Math.random() * 0.35,
        color: isRed ? '#ff003c' : '#00f0ff',
        size: 9 + Math.floor(Math.random() * 4),
      });
    }

    let lastPacketTime = 0;

    const render = (time) => {
      ctx.clearRect(0, 0, width, heightPx);

      // A. Floating Scary Cyber Tokens
      ctx.font = '10px "JetBrains Mono", monospace';
      floatingTokens.forEach((tok) => {
        tok.y += tok.vy;
        if (tok.y < -20) {
          tok.y = heightPx + 20;
          tok.x = Math.random() * width;
          tok.text = cyberTokens[Math.floor(Math.random() * cyberTokens.length)];
          tok.color = Math.random() > 0.5 ? '#ff003c' : '#00f0ff';
        }
        ctx.fillStyle = tok.color === '#ff003c' ? `rgba(255, 0, 60, ${tok.alpha})` : `rgba(0, 240, 255, ${tok.alpha})`;
        ctx.fillText(tok.text, tok.x, tok.y);
      });

      // B. Update Nodes Position
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = heightPx;
        if (n.y > heightPx) n.y = 0;

        n.pulse += n.pulseSpeed;

        // Mouse interaction: push away gently or draw dual laser beam
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 2.2;
          n.y -= (dy / dist) * force * 2.2;

          // Connect to mouse with dual Red/Blue neon beam
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = n.isRedTeam
            ? `rgba(255, 0, 60, ${(1 - dist / mouse.radius) * 0.75})`
            : `rgba(0, 240, 255, ${(1 - dist / mouse.radius) * 0.75})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // C. Draw Inter-Node Circuit Connections
      const maxDistance = 125;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            // If Red vs Blue: purple-crimson threat clash line!
            if (n1.isRedTeam && n2.isRedTeam) {
              ctx.strokeStyle = `rgba(255, 0, 60, ${alpha * 1.2})`;
            } else if (!n1.isRedTeam && !n2.isRedTeam) {
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 1.2})`;
            } else {
              // Clash line: purple/magenta cyber warfare
              ctx.strokeStyle = `rgba(217, 70, 239, ${alpha * 1.4})`;
            }

            ctx.lineWidth = 0.9;
            ctx.stroke();

            // Randomly spawn data packet between connected nodes
            if (time - lastPacketTime > 400 && Math.random() < 0.02 && packets.length < 20) {
              createPacket(n1, n2);
              lastPacketTime = time;
            }
          }
        }
      }

      // D. Draw and Animate Data Packets Flying Along Paths
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const currX = p.from.x + (p.to.x - p.from.x) * p.progress;
        const currY = p.from.y + (p.to.y - p.from.y) * p.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // E. Draw Nodes with Neon Red & Blue Glows
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const currentRadius = n.radius + Math.sin(n.pulse) * 0.8;

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1.2, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: opacity,
        zIndex: 1,
      }}
    />
  );
};
