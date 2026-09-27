import React, { useEffect, useRef, useState } from 'react';

export const CyberThreatGlobe = ({ size = 380 }) => {
  const canvasRef = useRef(null);
  const [activeIncident, setActiveIncident] = useState('FRANKFURT → MUMBAI [MITIGATED]');
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.25, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = size);
    const height = (canvas.height = size);
    const radius = size * 0.38;
    const centerX = width / 2;
    const centerY = height / 2;

    // Global Node coordinates (lat, lon in degrees)
    const nodes = [
      { name: 'San Francisco', lat: 37.7, lon: -122.4, color: '#00f2fe' },
      { name: 'New York', lat: 40.7, lon: -74.0, color: '#38bdf8' },
      { name: 'London', lat: 51.5, lon: -0.1, color: '#60a5fa' },
      { name: 'Frankfurt', lat: 50.1, lon: 8.6, color: '#fb7185' },
      { name: 'Mumbai', lat: 19.0, lon: 72.8, color: '#34d399' },
      { name: 'Tokyo', lat: 35.6, lon: 139.6, color: '#fbbf24' },
      { name: 'Singapore', lat: 1.3, lon: 103.8, color: '#a855f7' },
      { name: 'Sydney', lat: -33.8, lon: 151.2, color: '#f43f5e' },
    ];

    // Simulated attack arcs traveling in 3D
    const arcs = [
      { from: 3, to: 4, progress: 0, speed: 0.008, color: '#fb7185' }, // Frankfurt -> Mumbai
      { from: 1, to: 2, progress: 0.4, speed: 0.007, color: '#00f2fe' }, // NY -> London
      { from: 5, to: 0, progress: 0.2, speed: 0.006, color: '#fbbf24' }, // Tokyo -> SF
      { from: 7, to: 6, progress: 0.7, speed: 0.009, color: '#f43f5e' }, // Sydney -> Singapore
    ];

    // Mouse drag rotation controls
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      rotationRef.current.y += dx * 0.006;
      rotationRef.current.x += dy * 0.006;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Convert lat/lon to 3D Cartesian (x, y, z) on sphere
    const latLonTo3D = (lat, lon, r) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return { x, y, z };
    };

    // Rotate 3D point around X and Y axes
    const rotate3D = (p, rx, ry) => {
      // Rotate around Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      // Rotate around X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Automatic slow rotation if not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.004;
      }

      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;

      // 1. Draw Globe Outer Halo & Atmosphere
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.2);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.06)');
      grad.addColorStop(0.7, 'rgba(37, 99, 235, 0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Sphere Boundary Wireframe
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Draw Latitude Rings
      const latSteps = [-60, -30, 0, 30, 60];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 8) {
          const p = latLonTo3D(lat, lon, radius);
          const rotated = rotate3D(p, rx, ry);
          const screenX = centerX + rotated.x;
          const screenY = centerY - rotated.y;

          if (lon === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(0, 242, 254, 0.35)' : 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = lat === 0 ? 1.2 : 0.8;
        ctx.stroke();
      });

      // 4. Draw Longitude Meridian Lines
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 6) {
          const p = latLonTo3D(lat, lon, radius);
          const rotated = rotate3D(p, rx, ry);
          const screenX = centerX + rotated.x;
          const screenY = centerY - rotated.y;

          if (lat === -90) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 5. Draw City Nodes
      const projectedNodes = nodes.map((node, i) => {
        const p = latLonTo3D(node.lat, node.lon, radius);
        const rot = rotate3D(p, rx, ry);
        return {
          ...node,
          index: i,
          screenX: centerX + rot.x,
          screenY: centerY - rot.y,
          z: rot.z,
          visible: rot.z > -10, // front hemisphere
        };
      });

      projectedNodes.forEach((n) => {
        if (!n.visible) return;

        // Node Glow
        ctx.beginPath();
        ctx.arc(n.screenX, n.screenY, 4, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer Target Ring
        ctx.beginPath();
        ctx.arc(n.screenX, n.screenY, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // City Tag Label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(n.name, n.screenX + 9, n.screenY + 3);
      });

      // 6. Draw 3D Parabolic Laser Attack Arcs
      arcs.forEach((arc) => {
        const fromNode = projectedNodes[arc.from];
        const toNode = projectedNodes[arc.to];

        arc.progress += arc.speed;
        if (arc.progress >= 1) {
          arc.progress = 0;
        }

        // Draw parabolic curve points
        ctx.beginPath();
        const steps = 30;
        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          // Interpolate lat and lon
          const lat = fromNode.lat + (toNode.lat - fromNode.lat) * t;
          const lon = fromNode.lon + (toNode.lon - fromNode.lon) * t;

          // Parabolic height above sphere surface
          const heightOffset = Math.sin(t * Math.PI) * (radius * 0.35);
          const p = latLonTo3D(lat, lon, radius + heightOffset);
          const rot = rotate3D(p, rx, ry);

          const px = centerX + rot.x;
          const py = centerY - rot.y;

          if (step === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = `${arc.color}33`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Draw Traveling Glowing Laser Head
        const tHead = arc.progress;
        const curLat = fromNode.lat + (toNode.lat - fromNode.lat) * tHead;
        const curLon = fromNode.lon + (toNode.lon - fromNode.lon) * tHead;
        const curH = Math.sin(tHead * Math.PI) * (radius * 0.35);
        const pHead = latLonTo3D(curLat, curLon, radius + curH);
        const rotHead = rotate3D(pHead, rx, ry);

        if (rotHead.z > -10) {
          ctx.beginPath();
          ctx.arc(centerX + rotHead.x, centerY - rotHead.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          cursor: 'grab',
          borderRadius: '50%',
          display: 'block',
        }}
        onMouseDown={(e) => (e.currentTarget.style.cursor = 'grabbing')}
        onMouseUp={(e) => (e.currentTarget.style.cursor = 'grab')}
      />

      {/* 3D Telemetry HUD Label */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          padding: '4px 10px',
          backgroundColor: 'rgba(4, 7, 17, 0.85)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '6px',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-cyan-bright)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)',
          pointerEvents: 'none',
        }}
      >
        <span className="status-dot status-dot-active" style={{ width: '6px', height: '6px' }} />
        <span>DRAG TO ROTATE 3D ATTACK SPHERE</span>
      </div>
    </div>
  );
};
