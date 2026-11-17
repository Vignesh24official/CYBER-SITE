<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.cybershield.model.UserBean" %>
<%@ page import="com.cybershield.model.ComplaintBean" %>
<%@ page import="com.cybershield.model.InvestigationNoteBean" %>
<%@ page import="java.util.List" %>
<%
    UserBean user = (UserBean) session.getAttribute("user");
    if (user == null || (!user.getRole().contains("INVESTIGATOR") && !user.getRole().contains("ADMIN") && !user.getRole().contains("COORDINATOR"))) {
        response.sendRedirect(request.getContextPath() + "/portal/login?role=investigator");
        return;
    }

    ComplaintBean complaint = (ComplaintBean) request.getAttribute("complaint");
    List<InvestigationNoteBean> notes = (List<InvestigationNoteBean>) request.getAttribute("notes");
    List<ComplaintBean> assignedCases = (List<ComplaintBean>) request.getAttribute("assignedCases");

    String noteSaved = request.getParameter("noteSaved");
    String resolved = request.getParameter("resolved");

    boolean isResolved = complaint != null && ("RESOLVED".equalsIgnoreCase(complaint.getStatus()) || complaint.getResolutionVerdict() != null);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cyber Investigator Workbench & Forensic Terminal</title>
    <style>
        :root {
            --bg-dark: #0a0e1a;
            --bg-card: #111827;
            --accent-cyan: #06b6d4;
            --accent-green: #10b981;
            --border: rgba(255,255,255,0.12);
            --text-primary: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; padding-bottom: 40px; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 36px; border-bottom: 1px solid var(--border); background: var(--bg-card); }
        .logo { font-size: 1.25rem; font-weight: 800; color: #f59e0b; text-decoration: none; }
        .container { max-width: 1200px; margin: 28px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 24px; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.725rem; font-weight: 700; font-family: monospace; }
        .badge-resolved { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
        .badge-active { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid #f59e0b; }
        .btn { padding: 9px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; }
        .btn-green { background: #10b981; color: #FFF; }
        .btn-cyan { background: var(--accent-cyan); color: #000; }
        .btn-chat { background: #0284c7; color: #FFF; }
        .btn-outline { background: transparent; border: 1px solid var(--border); color: #FFF; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 840px) { .grid-2 { grid-template-columns: 1fr; } }
        
        /* LINUX TERMINAL STYLES */
        .terminal-box { background: #050811; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; font-family: 'Courier New', Courier, monospace; box-shadow: 0 12px 32px rgba(0,0,0,0.6); }
        .terminal-header { background: #0f172a; padding: 10px 16px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
        .terminal-chips { display: flex; gap: 8px; padding: 8px 16px; background: #080d1a; border-bottom: 1px solid #1e293b; overflow-x: auto; white-space: nowrap; }
        .chip { padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; font-family: sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; background: rgba(255,255,255,0.04); }
        .chip:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
        .terminal-screen { height: 280px; overflow-y: auto; padding: 16px; font-size: 0.825rem; line-height: 1.5; color: #94a3b8; }
        .terminal-input-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #0f172a; border-top: 1px solid #1e293b; }
        .terminal-input { flex: 1; background: transparent; border: none; outline: none; color: #38bdf8; font-family: inherit; font-size: 0.85rem; }

        /* HACKING HUB TOOLS */
        .hub-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 16px; }
        .hub-card { background: rgba(0,0,0,0.35); border: 1px solid var(--border); border-radius: 10px; padding: 16px; transition: 0.2s; }
        .hub-card:hover { border-color: var(--accent-cyan); }
        .hub-card h4 { color: #FFF; font-size: 0.95rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }

        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal.active { display: flex; }
        .modal-box { width: 100%; max-width: 600px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 28px; box-shadow: 0 12px 36px rgba(0,0,0,0.5); max-height: 90vh; overflow-y: auto; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 0.825rem; font-weight: 700; margin-bottom: 6px; color: #cbd5e1; }
        input, select, textarea { width: 100%; padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #FFF; font-size: 0.88rem; outline: none; }
        textarea { resize: vertical; min-height: 80px; font-family: inherit; }
        .alert-success { padding: 12px 18px; border-radius: 8px; background: rgba(16,185,129,0.15); border: 1px solid var(--accent-green); color: #6ee7b7; font-size: 0.88rem; margin-bottom: 20px; }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="<%= request.getContextPath() %>/" class="logo">
            🛡️ Cyber Investigator Workbench &bull; Clearance [SUB]
        </a>
        <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-right: 16px;">Officer: <%= user.getFullName() %></span>
            <a href="<%= request.getContextPath() %>/portal/investigator" style="color: var(--accent-cyan); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-right: 16px;">Assigned Cases</a>
            <a href="<%= request.getContextPath() %>/portal/logout" style="color: #f87171; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Logout</a>
        </div>
    </nav>

    <div class="container">
        <% if ("true".equals(noteSaved)) { %>
            <div class="alert-success">Forensic investigation note & findings logged successfully via JDBC.</div>
        <% } %>
        <% if ("true".equals(resolved)) { %>
            <div class="alert-success">Case concluded successfully! Official resolution report dispatched to citizen website.</div>
        <% } %>

        <% if (complaint == null) { %>
            <!-- CASES LIST VIEW -->
            <div class="card">
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: monospace; font-weight: 700;">CASES QUEUE</span>
                    <h2 style="font-size: 1.4rem; font-weight: 800; margin-top: 4px;">Assigned Cyber Incident Cases</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Select a case to launch the Linux command terminal & forensic tools hub.</p>
                </div>

                <% if (assignedCases == null || assignedCases.isEmpty()) { %>
                    <div style="padding: 40px; text-align: center; color: var(--text-muted);">No cases currently assigned.</div>
                <% } else { %>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 0.78rem;">
                                <th style="padding: 12px;">Case #</th>
                                <th style="padding: 12px;">Incident Title</th>
                                <th style="padding: 12px;">Victim</th>
                                <th style="padding: 12px;">Threat Vector</th>
                                <th style="padding: 12px;">Status</th>
                                <th style="padding: 12px;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <% for (ComplaintBean c : assignedCases) { %>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                                    <td style="padding: 14px 12px; font-family: monospace; color: var(--accent-cyan); font-weight: 700;"><%= c.getComplaintNumber() %></td>
                                    <td style="padding: 14px 12px; font-weight: 600;"><%= c.getTitle() %></td>
                                    <td style="padding: 14px 12px; color: var(--text-muted);"><%= c.getReporterName() %></td>
                                    <td style="padding: 14px 12px;"><%= c.getThreatType() %></td>
                                    <td style="padding: 14px 12px;"><span class="badge badge-active"><%= c.getStatus() %></span></td>
                                    <td style="padding: 14px 12px;">
                                        <a href="<%= request.getContextPath() %>/portal/investigator?id=<%= c.getId() %>" class="btn btn-cyan" style="font-size: 0.78rem; padding: 6px 14px;">
                                            Open Workspace &rarr;
                                        </a>
                                    </td>
                                </tr>
                            <% } %>
                        </tbody>
                    </table>
                <% } %>
            </div>
        <% } else { %>
            <!-- ACTIVE CASE WORKBENCH -->
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                            <span style="font-size: 1.4rem; font-weight: 900; font-family: monospace; color: var(--accent-cyan);">
                                <%= complaint.getComplaintNumber() %>
                            </span>
                            <span class="badge <%= isResolved ? "badge-resolved" : "badge-active" %>">
                                <%= complaint.getStatus() %>
                            </span>
                            <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid #ef4444;">
                                <%= complaint.getSeverity() %> SEVERITY
                            </span>
                        </div>
                        <h2 style="font-size: 1.45rem; font-weight: 800;"><%= complaint.getTitle() %></h2>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                            Victim: <%= complaint.getReporterName() %> (<%= complaint.getReporterEmail() %>) &bull; Financial Loss: Rs. <%= complaint.getFinancialLoss() %>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <a href="<%= request.getContextPath() %>/portal/chat?complaintId=<%= complaint.getId() %>" class="btn btn-chat">
                            💬 Citizen Case Chat
                        </a>
                        <% if (!isResolved) { %>
                            <button onclick="openResolutionModal()" class="btn btn-green">
                                🏆 Conclude & Send Result to Citizen
                            </button>
                        <% } %>
                    </div>
                </div>
            </div>

            <!-- 1. INTERACTIVE LINUX FORENSIC TERMINAL -->
            <div class="terminal-box">
                <div class="terminal-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                        <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 600; margin-left: 6px;">
                            investigator@cybershield-soc: ~/cases/<%= complaint.getComplaintNumber() %># (Kali Linux 6.6.9)
                        </span>
                    </div>
                    <button type="button" onclick="copyTerminalToNotes()" class="btn btn-outline" style="font-size: 0.72rem; padding: 4px 10px; font-family: sans-serif;">
                        📋 Copy Output to Case Note
                    </button>
                </div>

                <div class="terminal-chips">
                    <span style="font-size: 0.72rem; color: #64748b; font-family: sans-serif;">Quick Command:</span>
                    <span class="chip" onclick="execTerm('forensics --scan')">forensics --scan</span>
                    <span class="chip" onclick="execTerm('nmap -sV <%= complaint.getSuspiciousUrl() != null && !complaint.getSuspiciousUrl().isEmpty() ? complaint.getSuspiciousUrl() : "phishing-bank-target.com" %>')">nmap target</span>
                    <span class="chip" onclick="execTerm('whois <%= complaint.getSuspiciousUrl() != null && !complaint.getSuspiciousUrl().isEmpty() ? complaint.getSuspiciousUrl() : "phishing-bank-target.com" %>')">whois target</span>
                    <span class="chip" onclick="execTerm('curl -I <%= complaint.getSuspiciousUrl() != null && !complaint.getSuspiciousUrl().isEmpty() ? complaint.getSuspiciousUrl() : "http://phishing-bank-target.com" %>')">curl -I headers</span>
                    <span class="chip" onclick="execTerm('sha256sum evidence_receipt.png')">sha256sum evidence</span>
                    <span class="chip" onclick="execTerm('tcpdump -nn -c 5')">tcpdump packets</span>
                    <span class="chip" onclick="execTerm('clear')">clear</span>
                </div>

                <div id="termScreen" class="terminal-screen">
                    <div style="color: #38bdf8;">=== CyberShield SOC Linux Cyber Forensic Console ===</div>
                    <div style="color: #64748b;">Target Case: <%= complaint.getComplaintNumber() %> | Observable: <%= complaint.getSuspiciousUrl() %></div>
                    <div style="color: #22c55e;">Type 'help' or click quick chips above to assess cyber observables.</div>
                </div>

                <form onsubmit="handleTermSubmit(event)" class="terminal-input-bar">
                    <span style="color: #22c55e; font-weight: 700; font-size: 0.85rem;">investigator@soc:#</span>
                    <input type="text" id="termInput" class="terminal-input" placeholder="type command (nmap, whois, curl, sha256sum, forensics)...">
                    <span style="font-size: 0.7rem; color: #64748b; font-family: sans-serif;">[Enter]</span>
                </form>
            </div>

            <!-- 2. HACKING SOFTWARE HUB (6 FORENSIC TOOLS) -->
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 8px;">
                    <div>
                        <span style="font-size: 0.72rem; color: #c084fc; font-family: monospace; font-weight: 700;">HACKING & FORENSIC SOFTWARE HUB</span>
                        <h3 style="font-size: 1.15rem; font-weight: 800; color: #FFF; margin-top: 2px;">Ethical Hacking & Forensic Suite</h3>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Assessing Case Observables</span>
                </div>

                <div class="hub-grid">
                    <div class="hub-card">
                        <h4>📡 Nmap Port Recon</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Scanned ports: 21 (FTP backdoor vsftpd), 80/443 (Phishing proxy), 8080 (Trojan C2 controller).</p>
                        <button onclick="execTerm('nmap -sV target')" class="btn-sm btn-cyan">Run Nmap Scan</button>
                    </div>

                    <div class="hub-card">
                        <h4>🌐 Whois & Geo-IP Tracer</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Domain registered 34 days ago via NameCheap privacy proxy on offshore Iceland ASN 49812.</p>
                        <button onclick="execTerm('whois target')" class="btn-sm btn-cyan">Trace Registrar</button>
                    </div>

                    <div class="hub-card">
                        <h4>🛡️ Phishing Heuristic Engine</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Risk Index: 96/100 CRITICAL. Deceptive Cyrillic Punycode homograph targeting bank portal.</p>
                        <button onclick="execTerm('curl -I target')" class="btn-sm btn-cyan">Inspect Headers</button>
                    </div>

                    <div class="hub-card">
                        <h4>🔍 Evidence Hash & Malware</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">SHA-256 integrity match. Signature corresponds to Android Trojan RAT embedded in receipt.</p>
                        <button onclick="execTerm('sha256sum evidence')" class="btn-sm btn-cyan">Compute Checksum</button>
                    </div>

                    <div class="hub-card">
                        <h4>📊 Wireshark Packet Stream</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">5 intercepted TCP frames showing HTTP POST credential harvest to IP 198.51.100.42.</p>
                        <button onclick="execTerm('tcpdump -nn -c 5')" class="btn-sm btn-cyan">Stream PCAP</button>
                    </div>

                    <div class="hub-card">
                        <h4>💰 Attacker OSINT Mule Trace</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Attacker VPA / phone mapped to mule intermediary account flagged in 4 prior cyber dockets.</p>
                        <button onclick="execTerm('forensics --scan')" class="btn-sm btn-cyan">Trace Mule Network</button>
                    </div>
                </div>
            </div>

            <!-- 3. INVESTIGATION NOTE LOGGER & HISTORICAL LOGS -->
            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                        Log Formal Investigation Note & Finding
                    </h3>

                    <form action="<%= request.getContextPath() %>/portal/investigator" method="POST">
                        <input type="hidden" name="complaintId" value="<%= complaint.getId() %>">

                        <div class="form-group">
                            <label>Investigation Note *</label>
                            <textarea id="noteField" name="note" placeholder="Record forensic notes or paste terminal output..." required></textarea>
                        </div>

                        <div class="form-group">
                            <label>Forensic Finding</label>
                            <input type="text" id="findingField" name="finding" placeholder="e.g. Confirmed phishing domain on offshore server">
                        </div>

                        <div class="form-group">
                            <label>Action Taken</label>
                            <input type="text" id="actionField" name="actionTaken" placeholder="e.g. Dispatched domain takedown notice">
                        </div>

                        <div class="form-group">
                            <label>Recommendation</label>
                            <input type="text" id="recField" name="recommendation" placeholder="e.g. Alert bank nodal officer to place debit freeze">
                        </div>

                        <button type="submit" class="btn btn-cyan" style="width: 100%; justify-content: center;">
                            💾 Save Formal Note to Database (JDBC)
                        </button>
                    </form>
                </div>

                <div class="card">
                    <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                        Case Investigation Activity Log
                    </h3>

                    <% if (notes == null || notes.isEmpty()) { %>
                        <div style="color: var(--text-muted); font-size: 0.85rem; padding: 20px 0;">No investigation notes logged yet.</div>
                    <% } else { %>
                        <div style="display: flex; flex-direction: column; gap: 14px; max-height: 400px; overflow-y: auto;">
                            <% for (InvestigationNoteBean n : notes) { %>
                                <div style="padding: 12px; background: rgba(0,0,0,0.35); border-left: 3px solid var(--accent-cyan); border-radius: 6px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                        <strong style="font-size: 0.825rem; color: var(--accent-cyan);">Officer <%= n.getInvestigatorName() %></strong>
                                        <span style="font-size: 0.72rem; color: var(--text-muted);"><%= n.getCreatedAt() %></span>
                                    </div>
                                    <p style="font-size: 0.85rem; color: #FFF; margin-bottom: 4px; white-space: pre-wrap;"><%= n.getNote() %></p>
                                    <% if (n.getFinding() != null && !n.getFinding().isEmpty()) { %>
                                        <div style="font-size: 0.78rem; color: #cbd5e1;"><strong>Finding:</strong> <%= n.getFinding() %></div>
                                    <% } %>
                                    <% if (n.getActionTaken() != null && !n.getActionTaken().isEmpty()) { %>
                                        <div style="font-size: 0.78rem; color: #cbd5e1;"><strong>Action:</strong> <%= n.getActionTaken() %></div>
                                    <% } %>
                                </div>
                            <% } %>
                        </div>
                    <% } %>
                </div>
            </div>
        <% } %>
    </div>

    <!-- 4. CASE RESOLUTION MODAL -->
    <% if (complaint != null) { %>
        <div id="resolutionModal" class="modal">
            <div class="modal-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: #34d399;">
                        🏆 Conclude Case & Send Result to Citizen
                    </h3>
                    <button onclick="closeResolutionModal()" style="background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">✕</button>
                </div>
                <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 18px;">
                    This will transition the case to <strong>RESOLVED</strong> state and publish the official Resolution Dossier on the citizen's website.
                </p>

                <form action="<%= request.getContextPath() %>/portal/resolve-complaint" method="POST">
                    <input type="hidden" name="complaintId" value="<%= complaint.getId() %>">

                    <div class="form-group">
                        <label>Official Case Verdict *</label>
                        <select name="resolutionVerdict" required>
                            <option value="PHISHING_TAKEDOWN_CONFIRMED">Phishing Infrastructure Neutralized & Domain Takedown Executed</option>
                            <option value="FINANCIAL_FRAUD_TRACED_FREEZE_NOTICE" selected>Financial Fraud Traced & Nodal Freeze Dispatched</option>
                            <option value="ACCOUNT_TAKEOVER_RECOVERED">Compromised Account Secured & Credentials Restored</option>
                            <option value="MALWARE_PAYLOAD_NEUTRALIZED">Malware Payload Isolated, Quarantined & Disinfected</option>
                            <option value="INSUFFICIENT_EVIDENCE_CLOSED">Investigation Concluded - Inconclusive Malicious Artifacts</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Executive Resolution Summary *</label>
                        <textarea name="resolutionSummary" rows="3" required>Forensic examination concluded for incident <%= complaint.getComplaintNumber() %>. Forensic scan of target <%= complaint.getSuspiciousUrl() %> confirmed malicious activity. Threat host has been traced to offshore hosting infrastructure.</textarea>
                    </div>

                    <div class="form-group">
                        <label>Enforcement Actions Taken</label>
                        <textarea name="actionsTakenSummary" rows="2">1. Dispatched domain abuse takedown notice to registrar.\n2. Issued urgent statutory freeze advisory to recipient bank nodal officer.</textarea>
                    </div>

                    <div class="form-group">
                        <label>Citizen Guidance & Instructions</label>
                        <textarea name="citizenGuidance" rows="2">1. Invalidate and reset all banking passwords.\n2. Enable hardware/app-based 2FA.\n3. Present this official clearance certificate to your home branch for chargeback processing.</textarea>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button type="button" onclick="closeResolutionModal()" class="btn btn-outline">Cancel</button>
                        <button type="submit" class="btn btn-green">Dispatch Result to Citizen &rarr;</button>
                    </div>
                </form>
            </div>
        </div>
    <% } %>

    <script>
        function openResolutionModal() {
            document.getElementById('resolutionModal').classList.add('active');
        }
        function closeResolutionModal() {
            document.getElementById('resolutionModal').classList.remove('active');
        }

        // SIMULATED LINUX FORENSIC TERMINAL LOGIC
        function execTerm(cmd) {
            document.getElementById('termInput').value = cmd;
            runCommand(cmd);
        }

        function handleTermSubmit(e) {
            e.preventDefault();
            var cmd = document.getElementById('termInput').value.trim();
            if (cmd) {
                runCommand(cmd);
                document.getElementById('termInput').value = '';
            }
        }

        function runCommand(cmd) {
            var screen = document.getElementById('termScreen');
            var base = cmd.split(' ')[0].toLowerCase();
            
            var promptLine = document.createElement('div');
            promptLine.style.color = '#22c55e';
            promptLine.style.fontWeight = 'bold';
            promptLine.innerText = "investigator@soc:# " + cmd;
            screen.appendChild(promptLine);

            var resp = document.createElement('div');
            resp.style.color = '#cbd5e1';

            if (base === 'help') {
                resp.innerHTML = "Commands: nmap &lt;target&gt; | whois &lt;target&gt; | curl -I &lt;url&gt; | sha256sum &lt;file&gt; | tcpdump -nn -c 5 | forensics --scan | clear";
            } else if (base === 'nmap') {
                resp.innerHTML = "<span style='color:#38bdf8;'>Nmap scan report: 198.51.100.42 (host is up)</span><br>" +
                                 "PORT 21/tcp: vsftpd 2.3.4 (<span style='color:#f87171;'>VULNERABLE BACKDOOR</span>)<br>" +
                                 "PORT 80/tcp: nginx/1.18.0 (Phishing reverse proxy)<br>" +
                                 "PORT 8080/tcp: <span style='color:#f87171;'>Trojan C2 Panel [CVE-2023-38606]</span>";
            } else if (base === 'whois') {
                resp.innerHTML = "Registrar: NameCheap, Inc. | Registered: 34 days ago (<span style='color:#fbbf24;'>HIGH SUSPICION</span>)<br>" +
                                 "Hosting: AS49812 Offshore Cloud Ltd, Reykjavik, Iceland | Abuse: abuse@namecheap.com";
            } else if (base === 'curl') {
                resp.innerHTML = "HTTP/1.1 302 Found | Server: nginx/1.18.0<br>" +
                                 "<span style='color:#f87171;'>Location: /secure-login-verify/harvest.php</span> | Set-Cookie: PHPSESSID=d41d8cd9...";
            } else if (base === 'sha256sum') {
                resp.innerHTML = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  evidence.png<br>" +
                                 "<span style='color:#34d399;'>Checksum verified.</span> VirusTotal matches Trojan.GenericKD / Android RAT.";
            } else if (base === 'tcpdump') {
                resp.innerHTML = "18:12:01.482 IP 192.168.1.84.49210 > 198.51.100.42.443: Flags [S]<br>" +
                                 "18:12:01.588 IP 192.168.1.84 > 198.51.100.42: <span style='color:#f87171;'>HTTP POST /harvest-vpa (Exfiltration)</span>";
            } else if (base === 'forensics') {
                resp.innerHTML = "<span style='color:#38bdf8;'>=== SOC AUTOMATED FORENSIC TRIAGE REPORT ===</span><br>" +
                                 "Target: <%= complaint != null ? complaint.getSuspiciousUrl() : "phishing-bank-target.com" %><br>" +
                                 "Threat Risk Score: <span style='color:#f87171; font-weight:bold;'>96/100 CRITICAL</span><br>" +
                                 "Findings: Active credential harvester verified on offshore server. Takedown notice dispatched.";
            } else if (base === 'clear') {
                screen.innerHTML = '';
                return;
            } else {
                resp.innerHTML = "<span style='color:#f87171;'>Command not found. Type 'help' for available tools.</span>";
            }

            screen.appendChild(resp);
            screen.scrollTop = screen.scrollHeight;
        }

        function copyTerminalToNotes() {
            var screen = document.getElementById('termScreen');
            var text = screen.innerText;
            document.getElementById('noteField').value = "Forensic Terminal Scan Output:\n\n" + text.slice(-400);
            document.getElementById('findingField').value = "Confirmed phishing infrastructure with active C2 panel on port 8080.";
            document.getElementById('actionField').value = "Executed Nmap scan, Whois lookup, and SHA-256 evidence verification.";
            document.getElementById('recField').value = "Dispatch domain takedown notice and issue bank nodal freeze alert.";
            alert("Terminal findings transferred to Note form below! Review and click 'Save Formal Note'.");
        }
    </script>
</body>
</html>
