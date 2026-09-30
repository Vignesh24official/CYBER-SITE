import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Maximize2, Minimize2, Copy, Check, Trash2, Download, CornerDownLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TerminalPanel = ({ isExpanded = false, isModal = false, onClose }) => {
  const { user } = useAuth();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(isExpanded);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const initialLogs = [
    { type: 'sys', text: 'CYBERSHIELD SOC INTELLIGENCE CLI v2.4.0-RELEASE (x86_64-pc-linux-gnu)' },
    { type: 'sys', text: 'Kernel telemetry stream initialized. Active sensors: 14/14. Zero trust state: ENFORCED.' },
    { type: 'info', text: '[09:42:01 INFO] Connected to primary node `soc-sensor-us-east.cybershield.org`' },
    { type: 'success', text: '[09:42:02 OK] Authenticated session as ' + (user?.email || 'admin@cybershield.org') + ' [' + (user?.role || 'ROLE_ADMIN') + ']' },
    { type: 'warn', text: '[09:42:05 WARN] Detected 2 high-severity port scans from external IP 185.220.101.5' },
    { type: 'info', text: 'Type `help` to list available security commands.' }
  ];

  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newLogs = [...logs, { type: 'prompt', text: `cybershield@soc-core:~# ${trimmed}` }];
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case 'help':
        newLogs.push({
          type: 'info',
          text: `AVAILABLE CYBERSHIELD COMMANDS:\n  nmap <target>         - Run port & service recon scan (e.g. nmap 10.0.4.15)\n  cve-scan --all       - Run automated vulnerability assessment scan\n  threat-intel --ip IP - Query C2 & botnet threat intelligence database\n  topology             - Display live network topology node status\n  status               - View real-time SOC sensor metrics & load\n  whoami               - Show current authenticated user principal & role\n  clear                - Clear terminal log output buffer\n  export-logs          - Download terminal session transcript`
        });
        break;

      case 'nmap':
        const target = parts[1] || '10.0.4.15';
        newLogs.push({ type: 'info', text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-10 20:05 UTC` });
        newLogs.push({ type: 'info', text: `Initiating SYN Stealth Scan against ${target} [1000 ports]` });
        newLogs.push({ type: 'success', text: `Discovered open port 22/tcp on ${target} (ssh OpenSSH 8.9p1 Ubuntu)` });
        newLogs.push({ type: 'success', text: `Discovered open port 80/tcp on ${target} (http nginx 1.24.0)` });
        newLogs.push({ type: 'warn', text: `Discovered open port 5432/tcp on ${target} (postgresql PostgreSQL 15.3)` });
        newLogs.push({ type: 'info', text: `Nmap scan report for ${target}:\nPORT     STATE SERVICE    VERSION\n22/tcp   open  ssh        OpenSSH 8.9p1\n80/tcp   open  http       Nginx 1.24.0\n5432/tcp open  postgresql PostgreSQL 15.3\nNmap done: 1 IP address (1 host up) scanned in 1.84 seconds` });
        break;

      case 'cve-scan':
        newLogs.push({ type: 'info', text: '[+] Triggering automated vulnerability audit engine...' });
        newLogs.push({ type: 'critical', text: '[CRITICAL] CVE-2024-3094 detected on sshd (srv-prod-auth-01) - Score 10.0' });
        newLogs.push({ type: 'warn', text: '[HIGH] CVE-2023-4863 detected on libwebp (srv-app-web-02) - Score 8.8' });
        newLogs.push({ type: 'info', text: '[+] Audit completed. 2 vulnerabilities cataloged.' });
        break;

      case 'threat-intel':
        const ip = parts[2] || '185.220.101.5';
        newLogs.push({ type: 'info', text: `[+] Querying CyberShield Threat Intelligence API for ${ip}...` });
        newLogs.push({ type: 'critical', text: `MATCH FOUND! IP: ${ip}\nCategory: Tor Exit Node / Botnet C2\nThreat Level: CRITICAL (Confidence Score: 98%)\nAssociated Campaign: Operation DarkViper\nFirst Seen: 2026-08-12 | Last Active: 4 mins ago` });
        break;

      case 'topology':
        newLogs.push({ type: 'info', text: `NETWORK TOPOLOGY HEALTH:\n[+] Edge Firewall (fw-edge-01): ONLINE (Latency 2ms)\n[+] Cloud API Gateway (api-gw-01): ONLINE (Latency 4ms)\n[+] App Microservices (app-srv-cluster): ONLINE (3/3 nodes healthy)\n[!] Primary DB (srv-prod-db-01): WARNING (PostgreSQL High Load 84%)\n[+] SOC Sensor Array: 100% Operational` });
        break;

      case 'status':
        newLogs.push({ type: 'info', text: `SOC SYSTEM METRICS:\nCPU Utilization: 24.8%\nMemory Usage: 8.4 GB / 32 GB\nActive Monitored Assets: 42\nActive Incidents: 3\nThroughput: 1.4 Gbps ingress / 650 Mbps egress` });
        break;

      case 'whoami':
        newLogs.push({ type: 'success', text: `User: ${user?.fullName || 'Cyber Defender'} | Email: ${user?.email || 'admin@cybershield.org'} | Role: ${user?.role || 'ROLE_ADMIN'}` });
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'export-logs':
        const logContent = logs.map(l => l.text).join('\n');
        const element = document.createElement('a');
        const file = new Blob([logContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `cybershield-terminal-session-${Date.now()}.log`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        newLogs.push({ type: 'success', text: '[+] Terminal logs exported successfully.' });
        break;

      default:
        newLogs.push({ type: 'warn', text: `bash: ${cmd}: command not found. Type \`help\` for command syntax.` });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const copyTerminalOutput = () => {
    const text = logs.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogStyle = (type) => {
    switch (type) {
      case 'prompt': return { color: '#06b6d4', fontWeight: 'bold' };
      case 'critical': return { color: '#f87171', fontWeight: 'bold' };
      case 'warn': return { color: '#fbbf24' };
      case 'success': return { color: '#34d399' };
      case 'sys': return { color: '#94a3b8', fontStyle: 'italic' };
      default: return { color: '#e2e8f0' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#07090e',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: fullscreen ? 0 : '8px',
        display: 'flex',
        flexDirection: 'column',
        height: fullscreen ? '100vh' : '420px',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
        position: isModal ? 'fixed' : 'relative',
        top: isModal ? 0 : undefined,
        left: isModal ? 0 : undefined,
        right: isModal ? 0 : undefined,
        bottom: isModal ? 0 : undefined,
        zIndex: isModal ? 1000 : 1,
      }}
    >
      {/* Terminal Titlebar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#0f1420',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={16} color="var(--accent-cyan-bright)" />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F8FAFC', letterSpacing: '0.02em' }}>
            CyberShield Integrated Threat Terminal (CLI)
          </span>
          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan-bright)' }}>
            ONLINE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={copyTerminalOutput}
            title="Copy Terminal Logs"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
          </button>
          <button
            onClick={() => setLogs([])}
            title="Clear Logs"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? "Minimize" : "Fullscreen"}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Close Terminal"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          fontSize: '0.825rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          backgroundColor: '#07090e',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {logs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '4px', ...getLogStyle(log.type) }}>
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Command Input Line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#0b0e17',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '8px',
        }}
      >
        <span style={{ color: 'var(--accent-cyan-bright)', fontSize: '0.85rem', fontWeight: 600 }}>
          cybershield@soc-core:~#
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type security command (e.g. nmap, cve-scan, threat-intel, status)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            color: '#FFF',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.85rem',
            padding: 0,
          }}
        />
        <button
          onClick={() => handleCommand(inputVal)}
          style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan-bright)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>RUN</span>
          <CornerDownLeft size={12} />
        </button>
      </div>
    </div>
  );
};
