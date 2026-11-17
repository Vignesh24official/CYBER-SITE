import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  ShieldAlert,
  Radio,
  FileCode,
} from 'lucide-react';

export const LinuxForensicTerminal = ({ complaint, onExportToNote, onSendToChat }) => {
  const [history, setHistory] = useState([]);
  const [inputCmd, setInputCmd] = useState('');
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [pastCmds, setPastCmds] = useState([]);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const cleanUrl = complaint?.suspiciousUrl
    ? complaint.suspiciousUrl.replace(/^https?:\/\//i, '').split('/')[0]
    : 'malicious-domain-target.com';

  const defaultEvidence = complaint?.evidenceFiles?.[0]?.originalFilename || 'transaction_receipt_fraud.png';
  const defaultChecksum = complaint?.evidenceFiles?.[0]?.checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const initialBanner = [
    { type: 'system', text: '========================================================================' },
    { type: 'system', text: ' CyberShield SOC Terminal & Linux Cyber Forensic Environment v4.8' },
    { type: 'system', text: ' Linux cybershield-soc 6.6.9-kali1-amd64 #1 SMP PREEMPT_DYNAMIC x86_64' },
    { type: 'system', text: ` Active Case Workspace: ${complaint?.complaintNumber || 'CS-DEMO'} | Severity: ${complaint?.severity || 'MEDIUM'}` },
    { type: 'system', text: ' Type "help" to view the complete cyber forensic toolset commands.' },
    { type: 'system', text: '========================================================================' },
  ];

  useEffect(() => {
    setHistory(initialBanner);
  }, [complaint?.complaintNumber]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setPastCmds((prev) => [...prev, trimmed]);
    setCmdIndex(-1);

    const parts = trimmed.split(' ');
    const base = parts[0].toLowerCase();
    const arg1 = parts[1];

    const promptEntry = {
      type: 'prompt',
      text: `investigator@cybershield-soc:~/cases/${complaint?.complaintNumber || 'current'}# ${trimmed}`,
    };

    let responseEntries = [];

    switch (base) {
      case 'help':
        responseEntries = [
          { type: 'output', text: 'AVAILABLE CYBER INVESTIGATION & FORENSIC COMMANDS:' },
          { type: 'output', text: '  nmap <target>          - Network service & port vulnerability scanner' },
          { type: 'output', text: '  whois <domain/ip>      - Domain registrar, registrant, ASN & abuse contact lookup' },
          { type: 'output', text: '  curl -I <url>          - Inspect HTTP response headers & security flags' },
          { type: 'output', text: '  dig <domain>           - Query DNS records (A, MX, TXT, SPF, DMARC)' },
          { type: 'output', text: '  traceroute <target>    - Map routing network hops to target server' },
          { type: 'output', text: '  sha256sum <file>       - Compute & verify cryptographic evidence file hash' },
          { type: 'output', text: '  tcpdump -nn -c 5       - Stream live network packet capture of attack vector' },
          { type: 'output', text: '  exiftool <file>        - Extract hidden metadata, GPS & camera tags from evidence' },
          { type: 'output', text: '  forensics --scan       - Automated SOC triage analysis of all complaint observables' },
          { type: 'output', text: '  netstat -ant           - Show active network connections & listening ports' },
          { type: 'output', text: '  uname -a               - Display Linux kernel and OS architecture details' },
          { type: 'output', text: '  clear                  - Clear terminal screen buffer' },
        ];
        break;

      case 'nmap':
        const targetHost = arg1 || cleanUrl;
        responseEntries = [
          { type: 'output', text: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString()}` },
          { type: 'output', text: `Nmap scan report for ${targetHost} (198.51.100.42)` },
          { type: 'output', text: 'Host is up (0.042s latency).' },
          { type: 'output', text: 'rDNS record for 198.51.100.42: host-42.offshore-cloud.net' },
          { type: 'output', text: 'PORT     STATE SERVICE       VERSION' },
          { type: 'warning', text: '21/tcp   open  ftp           vsftpd 2.3.4 (VULNERABLE: Backdoor command execution)' },
          { type: 'output', text: '22/tcp   open  ssh           OpenSSH 8.9p1 Ubuntu (protocol 2.0)' },
          { type: 'output', text: '80/tcp   open  http          nginx/1.18.0 (Phishing proxy redirect active)' },
          { type: 'warning', text: '443/tcp  open  ssl/http      Let\'s Encrypt TLS (Domain validation mismatch detected)' },
          { type: 'warning', text: '8080/tcp open  http-proxy    Trojan C2 Command & Control Web Panel' },
          { type: 'output', text: 'OS details: Linux 5.4 - 5.15, Android 9 - 11' },
          { type: 'warning', text: 'VULNERABILITY DETECTED: Service on port 8080 matches known credential harvester signature [CVE-2023-38606].' },
          { type: 'success', text: `Nmap done: 1 IP address (1 host up) scanned in 3.14 seconds.` },
        ];
        break;

      case 'whois':
        const domain = arg1 || cleanUrl;
        responseEntries = [
          { type: 'output', text: `Domain Name: ${domain.toUpperCase()}` },
          { type: 'output', text: 'Registry Domain ID: 2689104712_DOMAIN_COM-VRSN' },
          { type: 'output', text: 'Registrar WHOIS Server: whois.namecheap.com' },
          { type: 'output', text: 'Registrar: NameCheap, Inc.' },
          { type: 'warning', text: 'Registrant Privacy: Withheld for Privacy Purposes (Privacy service provided by Withheld for Privacy ehf)' },
          { type: 'output', text: 'Creation Date: 2026-08-14T06:12:33Z' },
          { type: 'warning', text: 'Domain Age: 34 days (High Suspicion: newly registered domain)' },
          { type: 'output', text: 'Name Server: NS1.OFFSHORE-ANON-DNS.NET' },
          { type: 'output', text: 'Name Server: NS2.OFFSHORE-ANON-DNS.NET' },
          { type: 'output', text: 'Registrar Abuse Contact Email: abuse@namecheap.com' },
          { type: 'output', text: 'Registrar Abuse Contact Phone: +1.6613102107' },
          { type: 'success', text: 'WHOIS record resolved. Registrant hidden behind proxy in Reykjavik, Iceland.' },
        ];
        break;

      case 'curl':
        const urlToInspect = arg1 || complaint?.suspiciousUrl || `http://${cleanUrl}`;
        responseEntries = [
          { type: 'output', text: `HTTP/1.1 302 Found` },
          { type: 'output', text: `Date: ${new Date().toUTCString()}` },
          { type: 'output', text: `Server: nginx/1.18.0` },
          { type: 'warning', text: `Location: https://${cleanUrl}/secure-login-verify/auth.php` },
          { type: 'warning', text: `Set-Cookie: PHPSESSID=d41d8cd98f00b204e9800998ecf8427e; path=/; HttpOnly` },
          { type: 'warning', text: `X-Frame-Options: (MISSING - vulnerable to Clickjacking)` },
          { type: 'warning', text: `Content-Security-Policy: (MISSING - inline script injection enabled)` },
          { type: 'output', text: `Content-Type: text/html; charset=UTF-8` },
          { type: 'output', text: `Content-Length: 412` },
          { type: 'warning', text: 'ALERT: Suspicious redirect points to unverified authentication harvest endpoint.' },
        ];
        break;

      case 'dig':
        const digHost = arg1 || cleanUrl;
        responseEntries = [
          { type: 'output', text: `; <<>> DiG 9.18.18-1 <<>> ${digHost} ANY` },
          { type: 'output', text: ';; Got answer: HEADER: status: NOERROR, id: 48912' },
          { type: 'output', text: ';; QUESTION SECTION:' },
          { type: 'output', text: `;${digHost}.\t\t\tIN\tANY` },
          { type: 'output', text: ';; ANSWER SECTION:' },
          { type: 'output', text: `${digHost}.\t300\tIN\tA\t198.51.100.42` },
          { type: 'output', text: `${digHost}.\t300\tIN\tMX\t10 mail.${digHost}.` },
          { type: 'warning', text: `${digHost}.\t300\tIN\tTXT\t"v=spf1 ~all" (SoftFail: Weak email validation policy)` },
          { type: 'output', text: `;; Query time: 24 msec | Server: 8.8.8.8#53` },
        ];
        break;

      case 'traceroute':
        const traceTarget = arg1 || cleanUrl;
        responseEntries = [
          { type: 'output', text: `traceroute to ${traceTarget} (198.51.100.42), 30 hops max, 60 byte packets` },
          { type: 'output', text: ' 1  gw-soc-router.internal (10.0.0.1)  0.342 ms  0.281 ms  0.254 ms' },
          { type: 'output', text: ' 2  isp-backbone-tier1.net (203.0.113.1)  4.112 ms  3.891 ms  4.002 ms' },
          { type: 'output', text: ' 3  de-cix-frankfurt.exchange (80.81.192.1)  18.421 ms  18.312 ms  18.502 ms' },
          { type: 'output', text: ' 4  transit-nordic-gw.is (185.220.101.4)  34.821 ms  34.719 ms  34.901 ms' },
          { type: 'warning', text: ' 5  bulletproof-hosting-gw.net (198.51.100.1)  41.129 ms  41.321 ms  41.018 ms' },
          { type: 'output', text: ' 6  host-42.offshore-cloud.net (198.51.100.42)  42.082 ms  42.115 ms  41.984 ms' },
          { type: 'success', text: 'Trace complete. Destination resolved to offshore bulletproof hosting provider.' },
        ];
        break;

      case 'sha256sum':
        const file = arg1 || defaultEvidence;
        responseEntries = [
          { type: 'output', text: `Computing cryptographic checksum for ${file}...` },
          { type: 'success', text: `${defaultChecksum}  ${file}` },
          { type: 'output', text: 'VirusTotal Intelligence API check: MATCH FOUND' },
          { type: 'warning', text: 'Hash signature matches Trojan.GenericKD / CredentialStealer.Android' },
          { type: 'output', text: 'File integrity verified. SHA-256 matches citizen evidence submission.' },
        ];
        break;

      case 'tcpdump':
        responseEntries = [
          { type: 'output', text: `tcpdump: verbose output suppressed, use -v[v]... for full protocol decode` },
          { type: 'output', text: `listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes` },
          { type: 'warning', text: '18:12:01.482 IP 192.168.1.84.49210 > 198.51.100.42.443: Flags [S], seq 382910, win 64240' },
          { type: 'output', text: '18:12:01.524 IP 198.51.100.42.443 > 192.168.1.84.49210: Flags [S.], seq 918230, ack 382911' },
          { type: 'warning', text: '18:12:01.588 IP 192.168.1.84.49210 > 198.51.100.42.443: Flags [P.], length 312: HTTP POST /harvest-vpa' },
          { type: 'warning', text: '18:12:01.632 IP 198.51.100.42.443 > 192.168.1.84.49210: Flags [P.], length 84: HTTP 200 OK (Exfiltration confirmed)' },
          { type: 'output', text: '5 packets captured, 5 packets received by filter, 0 packets dropped by kernel' },
        ];
        break;

      case 'exiftool':
        responseEntries = [
          { type: 'output', text: `ExifTool Version Number         : 12.65` },
          { type: 'output', text: `File Name                       : ${arg1 || defaultEvidence}` },
          { type: 'output', text: `File Size                       : 412 kB` },
          { type: 'output', text: `File Modification Date/Time     : ${new Date().toISOString()}` },
          { type: 'output', text: `MIME Type                       : image/png` },
          { type: 'warning', text: `Software                        : Adobe Photoshop 24.1 (Tampering detected)` },
          { type: 'warning', text: `GPS Latitude                    : 28 deg 36' 44.12" N` },
          { type: 'warning', text: `GPS Longitude                   : 77 deg 12' 19.80" E` },
          { type: 'output', text: `Camera Model                    : Samsung Galaxy S22 Ultra` },
          { type: 'success', text: 'Metadata extracted: Digital receipt image contains post-render editing markers.' },
        ];
        break;

      case 'forensics':
        responseEntries = [
          { type: 'system', text: '>>> INITIATING AUTOMATED SOC FORENSIC TRIAGE PROTOCOL <<<' },
          { type: 'output', text: `Target Incident ID   : ${complaint?.complaintNumber || 'CS-DEMO'}` },
          { type: 'output', text: `Threat Classification : ${complaint?.category} / ${complaint?.threatType}` },
          { type: 'output', text: `Victim Loss Exposure  : ${complaint?.currency} ${complaint?.financialLoss}` },
          { type: 'warning', text: `Observed Target Domain: ${cleanUrl} (Risk Score: 94/100 CRITICAL)` },
          { type: 'warning', text: `Attacker Identifiers  : ${complaint?.attackerInformation || 'Offshore cyber syndicate entity'}` },
          { type: 'output', text: `Evidence Artifacts    : ${complaint?.evidenceFiles?.length || 1} file(s) analyzed` },
          { type: 'success', text: `FINDINGS SUMMARY:` },
          { type: 'output', text: `  1. Phishing domain verified active on offshore bulletproof server (198.51.100.42).` },
          { type: 'output', text: `  2. Attacker credentials matched 3 other complaints in regional cyber grid.` },
          { type: 'output', text: `  3. DNS abuse notification dispatched to registrar (abuse@namecheap.com).` },
          { type: 'success', text: `RECOMMENDED ACTION: Takedown notice served + Freeze notice to designated nodal bank.` },
        ];
        break;

      case 'netstat':
        responseEntries = [
          { type: 'output', text: 'Active Internet connections (servers and established)' },
          { type: 'output', text: 'Proto Recv-Q Send-Q Local Address           Foreign Address         State' },
          { type: 'output', text: 'tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN' },
          { type: 'output', text: 'tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN' },
          { type: 'warning', text: `tcp        0      0 10.0.0.15:49812         198.51.100.42:443       ESTABLISHED` },
        ];
        break;

      case 'uname':
        responseEntries = [
          { type: 'output', text: 'Linux cybershield-soc 6.6.9-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1 (2024-01-08) x86_64 GNU/Linux' },
        ];
        break;

      case 'clear':
        setHistory([]);
        setInputCmd('');
        return;

      default:
        responseEntries = [
          { type: 'error', text: `bash: ${base}: command not found. Type "help" for a list of available cyber tools.` },
        ];
        break;
    }

    setHistory((prev) => [...prev, promptEntry, ...responseEntries]);
    setInputCmd('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputCmd);
  };

  const handleQuickCmd = (cmd) => {
    setInputCmd(cmd);
    executeCommand(cmd);
  };

  const handleCopyHistory = () => {
    const textToCopy = history.map((h) => h.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportToNotes = () => {
    const recentOutput = history
      .filter((h) => h.type !== 'system' && h.type !== 'prompt')
      .slice(-10)
      .map((h) => h.text)
      .join('\n');

    if (onExportToNote) {
      onExportToNote({
        note: `Forensic Terminal Scan Output on target: ${cleanUrl}\n\n${recentOutput}`,
        finding: `Confirmed malicious indicator on ${cleanUrl}. Ports 80/443/8080 active with phishing heuristic risk 94/100.`,
        actionTaken: `Executed Nmap port scan, DNS recon, and SHA-256 evidence checksum verification on SOC terminal.`,
        recommendation: `Issue formal domain registrar takedown request and bank account freeze.`,
      });
    }
  };

  const handleExportToChat = () => {
    const recentOutput = history
      .filter((h) => h.type !== 'system')
      .slice(-8)
      .map((h) => h.text)
      .join('\n');

    if (onSendToChat) {
      onSendToChat({
        name: `terminal_scan_${complaint?.complaintNumber || 'case'}.log`,
        data: recentOutput,
      });
    }
  };

  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid #1e293b',
        background: '#0a0e17',
        fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          padding: '10px 16px',
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
            <TerminalIcon size={14} color="#38bdf8" />
            <span>investigator@cybershield-soc: ~/cases/{complaint?.complaintNumber || 'CS-DEMO'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportToNotes}
            title="Export terminal output into Case Notes form"
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.725rem', fontFamily: 'sans-serif' }}
          >
            <FileCode size={12} /> Send to Notes
          </button>

          <button
            type="button"
            onClick={handleExportToChat}
            title="Attach terminal log to Citizen Chat"
            className="btn btn-cyan btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.725rem', fontFamily: 'sans-serif' }}
          >
            <Radio size={12} /> Share to Chat
          </button>

          <button
            type="button"
            onClick={handleCopyHistory}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.725rem' }}
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          </button>

          <button
            type="button"
            onClick={() => executeCommand('clear')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.725rem' }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Quick Launch Command Chips */}
      <div
        style={{
          padding: '8px 16px',
          background: '#070b12',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          fontFamily: 'sans-serif',
        }}
      >
        <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Play size={10} color="#38bdf8" /> Quick Scan:
        </span>
        <button
          type="button"
          onClick={() => handleQuickCmd(`forensics --scan`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          forensics --scan
        </button>
        <button
          type="button"
          onClick={() => handleQuickCmd(`nmap -sV ${cleanUrl}`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          nmap {cleanUrl}
        </button>
        <button
          type="button"
          onClick={() => handleQuickCmd(`whois ${cleanUrl}`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          whois {cleanUrl}
        </button>
        <button
          type="button"
          onClick={() => handleQuickCmd(`curl -I ${cleanUrl}`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          curl -I headers
        </button>
        <button
          type="button"
          onClick={() => handleQuickCmd(`sha256sum ${defaultEvidence}`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#c084fc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          sha256sum evidence
        </button>
        <button
          type="button"
          onClick={() => handleQuickCmd(`tcpdump -nn -c 5`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          tcpdump packets
        </button>
        <button
          type="button"
          onClick={() => handleQuickCmd(`exiftool ${defaultEvidence}`)}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          exiftool metadata
        </button>
      </div>

      {/* Terminal Screen Body */}
      <div
        style={{
          height: '360px',
          overflowY: 'auto',
          padding: '16px',
          color: '#e2e8f0',
          fontSize: '0.825rem',
          lineHeight: '1.5',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, idx) => {
          let color = '#94a3b8';
          if (line.type === 'system') color = '#38bdf8';
          if (line.type === 'prompt') color = '#22c55e';
          if (line.type === 'warning') color = '#fbbf24';
          if (line.type === 'error') color = '#f87171';
          if (line.type === 'success') color = '#34d399';

          return (
            <div
              key={idx}
              style={{
                color,
                fontWeight: line.type === 'prompt' || line.type === 'warning' ? 700 : 400,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Input Prompt */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: '#0f172a',
          borderTop: '1px solid #1e293b',
        }}
      >
        <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.85rem' }}>
          investigator@soc:#
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder="type linux or forensic command (e.g. nmap, whois, sha256sum, forensics --scan)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#38bdf8',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        />
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>[Enter to exec]</span>
      </form>
    </div>
  );
};
