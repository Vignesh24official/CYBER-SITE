import React, { useEffect, useRef } from 'react';

export const CyberMatrixCanvas = ({ height = '100%', opacity = 0.65 }) => {
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

    // Mouse coordinates for interactive repulsion / connection
    let mouse = { x: -1000, y: -1000, radius: 140 };
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

    // 1. Cyber Nodes
    const nodeCount = Math.floor(Math.min(width, 1200) / 18);
    const nodes = [];
    const colors = ['#00f2fe', '#38bdf8', '#3b82f6', '#818cf8'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * heightPx,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.02,
      });
    }

    // 2. Data Packets (flying light pulses along connections)
    const packets = [];
    const createPacket = (fromNode, toNode) => {
      packets.push({
        from: fromNode,
        to: toNode,
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
        color: '#00f2fe',
        size: 2.5,
      });
    };

    // 3. Floating Cyber Hex Symbols
    const cyberTokens = ['0xFA', 'SHA256', 'AES-GCM', '10.0.1.4', 'PORT:443', 'ZERO_TRUST', 'TLS1.3', 'SEALED', '0x8B', 'ENCRYPT'];
    const floatingTokens = [];
    for (let i = 0; i < 14; i++) {
      floatingTokens.push({
        text: cyberTokens[Math.floor(Math.random() * cyberTokens.length)],
        x: Math.random() * width,
        y: Math.random() * heightPx,
        vy: -0.25 - Math.random() * 0.4,
        alpha: 0.15 + Math.random() * 0.25,
        fadeSpeed: 0.002,
        size: 9 + Math.floor(Math.random() * 4),
      });
    }

    let lastPacketTime = 0;

    const render = (time) => {
      ctx.clearRect(0, 0, width, heightPx);

      // A. Update and Draw Floating Cyber Tokens
      ctx.font = '10px "JetBrains Mono", monospace';
      floatingTokens.forEach((tok) => {
        tok.y += tok.vy;
        if (tok.y < -20) {
          tok.y = heightPx + 20;
          tok.x = Math.random() * width;
          tok.text = cyberTokens[Math.floor(Math.random() * cyberTokens.length)];
        }
        ctx.fillStyle = `rgba(56, 189, 248, ${tok.alpha})`;
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

        // Mouse interaction: push away gently or attract
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 2;
          n.y -= (dy / dist) * force * 2;

          // Connect to mouse with neon beam
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist / mouse.radius) * 0.6})`;
          ctx.lineWidth = 1;
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
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();

            // Randomly spawn data packet between connected nodes
            if (time - lastPacketTime > 600 && Math.random() < 0.015 && packets.length < 16) {
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
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // E. Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const currentRadius = n.radius + Math.sin(n.pulse) * 0.8;

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
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
