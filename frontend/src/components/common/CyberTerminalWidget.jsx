import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Send, Play, Sparkles, Check, CornerDownLeft } from 'lucide-react';
import { cyberAudio } from '../../services/cyberAudio';

export const CyberTerminalWidget = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([
    { type: 'system', text: 'CYBERSHIELD DEFENSE OS v4.12.0-STABLE (x86_64-soc-linux)' },
    { type: 'system', text: 'Connecting to Grid Node [ASIA-PACIFIC-1]... ESTABLISHED.' },
    { type: 'system', text: 'Type "help" to view command manual, or click quick triggers below.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    cyberAudio.playClick();
    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    const newHistory = [...history, { type: 'user', text: `root@cybershield:~$ ${raw}` }];

    switch (command) {
      case 'help':
        newHistory.push({
          type: 'response',
          text: [
            'AVAILABLE SOC COMMANDS:',
            '  help              - Display this command manual',
            '  scan <url/domain> - Run heuristic reconnaissance scan on indicator',
            '  report            - Launch 5-step guided cyber incident wizard',
            '  status            - Query live SOC node latency and active sensors',
            '  defcon <level>    - Set defense condition alert (1 to 5)',
            '  hash <data>       - Generate SHA-256 cryptographic evidence seal',
            '  clear             - Reset terminal output log',
          ].join('\n'),
        });
        break;

      case 'scan':
        const target = arg || 'unverified-phishing-host.xyz';
        newHistory.push({
          type: 'response',
          text: [
            `[+] INITIATING DEEP RECON ON: ${target}`,
            `[1] Querying Global DNS Records... Resolving IP 185.220.101.5 (AS9123)`,
            `[2] Inspecting SSL/TLS Handshake... Host mismatch / Punycode detected`,
            `[3] Heuristic Analysis: Risk Score 94/100 [CRITICAL PHISHING RISK]`,
            `[!] Recommendation: Execute immediate URL quarantine. Use 'report' to file formal incident.`,
          ].join('\n'),
        });
        cyberAudio.playScan();
        break;

      case 'report':
        newHistory.push({
          type: 'response',
          text: 'REDIRECTING TO INCIDENT REPORTING WIZARD...',
        });
        setTimeout(() => navigate('/report'), 600);
        break;

      case 'status':
        newHistory.push({
          type: 'response',
          text: [
            'SOC COMMAND TELEMETRY:',
            '  • Primary Grid: ASIA-SOUTH-1 (ONLINE · 99.99% SLA)',
            '  • Monitored Nodes: 128 Active Hardware Probes',
            '  • Threat Classification Engine: Heuristic v2.4 (ACTIVE)',
            '  • Evidence Vault: AES-256-GCM / SHA-256 (SEALED)',
            '  • Incident Queue: 24 Cases under active investigation',
          ].join('\n'),
        });
        break;

      case 'defcon':
        const level = arg || '1';
        newHistory.push({
          type: 'response',
          text: `[!] ALERT: DEFENSE CONDITION ESCALATED TO DEFCON ${level}. High-alert posture engaged across all 14 regional nodes.`,
        });
        cyberAudio.playAlarm();
        break;

      case 'hash':
        const sample = arg || 'CYBERSHIELD_EVIDENCE_SAMPLE';
        newHistory.push({
          type: 'response',
          text: `SHA256(${sample}) = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n[+] Cryptographic hash locked into immutable audit chain.`,
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${command}". Type "help" for available SOC operations.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  return (
    <div
      style={{
        backgroundColor: '#040711',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 242, 254, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-mono)',
        height: '340px',
      }}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          backgroundColor: '#080e1e',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
            cybershield-cli // interactive bash session
          </span>
        </div>

        <div style={{ fontSize: '0.68rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="status-dot status-dot-active" style={{ width: '6px', height: '6px' }} />
          <span>CONNECTED</span>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div
        style={{
          flex: 1,
          padding: '14px 16px',
          overflowY: 'auto',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {history.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.type === 'user' ? '#00f2fe' : line.type === 'error' ? '#fb7185' : line.type === 'system' ? 'var(--text-muted)' : '#a5f3fc',
              whiteSpace: 'pre-wrap',
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Trigger Buttons */}
      <div
        style={{
          padding: '6px 14px',
          backgroundColor: '#070c18',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Quick Commands:</span>
        {[
          { label: 'help', cmd: 'help' },
          { label: 'scan malware-url.xyz', cmd: 'scan malware-url.xyz' },
          { label: 'status', cmd: 'status' },
          { label: 'defcon 1', cmd: 'defcon 1' },
          { label: 'hash PAYLOAD_01', cmd: 'hash PAYLOAD_01' },
          { label: 'clear', cmd: 'clear' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleCommand(item.cmd)}
            style={{
              padding: '3px 8px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '4px',
              color: 'var(--accent-cyan-bright)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Terminal Input Line */}
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 14px',
          backgroundColor: '#050914',
          borderTop: '1px solid rgba(56, 189, 248, 0.15)',
        }}
      >
        <span style={{ color: 'var(--accent-cyan)', marginRight: '8px', fontSize: '0.85rem' }}>
          root@cybershield:~$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type command here (try: help, scan, defcon 1)..."
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: '0.825rem',
            padding: 0,
            boxShadow: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-cyan)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CornerDownLeft size={16} />
        </button>
      </form>
    </div>
  );
};
