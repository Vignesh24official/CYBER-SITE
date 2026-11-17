<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.cybershield.model.UserBean" %>
<%@ page import="com.cybershield.model.ComplaintBean" %>
<%@ page import="com.cybershield.model.InvestigationNoteBean" %>
<%@ page import="java.util.List" %>
<%
    UserBean user = (UserBean) session.getAttribute("user");
    if (user == null) {
        response.sendRedirect(request.getContextPath() + "/portal/login");
        return;
    }

    ComplaintBean complaint = (ComplaintBean) request.getAttribute("complaint");
    List<InvestigationNoteBean> notes = (List<InvestigationNoteBean>) request.getAttribute("notes");

    boolean isResolved = complaint != null && ("RESOLVED".equalsIgnoreCase(complaint.getStatus()) || complaint.getResolutionVerdict() != null);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Case Detail - <%= complaint != null ? complaint.getComplaintNumber() : "Incident" %></title>
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
        .logo { font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); text-decoration: none; }
        .container { max-width: 960px; margin: 32px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 24px; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .head-bar { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.725rem; font-weight: 700; font-family: monospace; }
        .badge-resolved { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
        .badge-active { background: rgba(6,182,212,0.15); color: #38bdf8; border: 1px solid #06b6d4; }
        .btn { padding: 9px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; }
        .btn-cyan { background: var(--accent-cyan); color: #000; }
        .btn-outline { background: transparent; border: 1px solid var(--border); color: #FFF; }
        .btn-chat { background: #0284c7; color: #FFF; }
        .resolution-banner {
            background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%);
            border: 1px solid rgba(16,185,129,0.4);
            border-radius: 16px;
            padding: 28px;
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
        .meta-item { margin-bottom: 12px; font-size: 0.88rem; }
        .meta-label { color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; font-weight: 700; }
        .meta-val { color: #FFF; font-weight: 600; margin-top: 2px; }
        @media print {
            .navbar, .btn, .no-print { display: none !important; }
            body, .card, .resolution-banner { background: #FFF !important; color: #000 !important; }
            * { color: #000 !important; }
        }
    </style>
</head>
<body>
    <nav class="navbar no-print">
        <a href="<%= request.getContextPath() %>/" class="logo">🛡️ CyberShield Citizen Portal</a>
        <div>
            <a href="<%= request.getContextPath() %>/portal/complaints" style="color: var(--accent-cyan); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-right: 16px;">&larr; Back to My Complaints</a>
            <a href="<%= request.getContextPath() %>/portal/logout" style="color: #f87171; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Logout</a>
        </div>
    </nav>

    <div class="container">
        <!-- Header -->
        <div class="card">
            <div class="head-bar">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="font-size: 1.4rem; font-weight: 900; font-family: monospace; color: var(--accent-cyan);">
                            <%= complaint.getComplaintNumber() %>
                        </span>
                        <span class="badge <%= isResolved ? "badge-resolved" : "badge-active" %>">
                            <%= complaint.getStatus() %>
                        </span>
                    </div>
                    <h2 style="font-size: 1.5rem; font-weight: 800;"><%= complaint.getTitle() %></h2>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                        Reported on <%= complaint.getReportedAt() %> &bull; Location: <%= complaint.getLocation() %>
                    </div>
                </div>

                <div class="no-print" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <a href="<%= request.getContextPath() %>/portal/chat?complaintId=<%= complaint.getId() %>" class="btn btn-chat">
                        💬 Open Case Chat Room
                    </a>
                    <% if (isResolved) { %>
                        <button onclick="window.print()" class="btn btn-outline">🖨️ Print Certificate</button>
                    <% } %>
                </div>
            </div>
        </div>

        <!-- OFFICIAL RESOLUTION DOSSIER (WHEN RESOLVED) -->
        <% if (isResolved) { %>
            <div class="resolution-banner">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
                    <div>
                        <span style="font-size: 0.725rem; font-family: monospace; background: rgba(16,185,129,0.3); color: #34d399; padding: 2px 8px; border-radius: 10px; font-weight: 800;">
                            OFFICIAL VERDICT ISSUED
                        </span>
                        <h3 style="font-size: 1.35rem; font-weight: 800; color: #FFF; margin-top: 4px;">
                            Cyber Defense Investigation Resolution Report
                        </h3>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">
                        Resolved on <%= complaint.getResolvedAt() != null ? complaint.getResolvedAt() : "Recent" %>
                    </div>
                </div>

                <div style="padding: 14px 18px; background: rgba(0,0,0,0.35); border-left: 4px solid #10b981; border-radius: 8px; margin-bottom: 18px;">
                    <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Conclusive Verdict</div>
                    <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">
                        <%= complaint.getResolutionVerdict() != null ? complaint.getResolutionVerdict() : "Investigation Concluded" %>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <% if (complaint.getResolutionSummary() != null) { %>
                        <div>
                            <h4 style="font-size: 0.92rem; font-weight: 700; color: #FFF; margin-bottom: 4px;">Investigation Findings & Forensic Summary:</h4>
                            <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; white-space: pre-wrap;"><%= complaint.getResolutionSummary() %></p>
                        </div>
                    <% } %>

                    <% if (complaint.getActionsTakenSummary() != null) { %>
                        <div>
                            <h4 style="font-size: 0.92rem; font-weight: 700; color: #FFF; margin-bottom: 4px;">Enforcement Actions & Mitigations Executed by Cyber Cell:</h4>
                            <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; white-space: pre-wrap;"><%= complaint.getActionsTakenSummary() %></p>
                        </div>
                    <% } %>

                    <% if (complaint.getCitizenGuidance() != null) { %>
                        <div style="padding: 14px 16px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); border-radius: 8px;">
                            <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 4px;">Citizen Safety Guidance & Instructions:</h4>
                            <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;"><%= complaint.getCitizenGuidance() %></p>
                        </div>
                    <% } %>

                    <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.8rem; color: #34d399; font-weight: 700;">
                        ✔ Authenticated by CyberShield Defense Platform &bull; Assigned Officer: <%= complaint.getAssignedInvestigatorName() %>
                    </div>
                </div>
            </div>
        <% } %>

        <!-- Case Metadata Grid -->
        <div class="grid-2">
            <div class="card">
                <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Incident Metadata</h3>
                <div class="meta-item">
                    <div class="meta-label">Threat Category</div>
                    <div class="meta-val"><%= complaint.getCategory() %></div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Specific Threat Vector</div>
                    <div class="meta-val"><%= complaint.getThreatType() %></div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Financial Loss Amount</div>
                    <div class="meta-val">Rs. <%= complaint.getFinancialLoss() %> <%= complaint.getCurrency() %></div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Suspicious URL / Phishing Link</div>
                    <div class="meta-val" style="word-break: break-all; color: var(--accent-cyan);">
                        <%= complaint.getSuspiciousUrl() != null && !complaint.getSuspiciousUrl().isEmpty() ? complaint.getSuspiciousUrl() : "None provided" %>
                    </div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Attacker Identifiers</div>
                    <div class="meta-val"><%= complaint.getAttackerInformation() != null && !complaint.getAttackerInformation().isEmpty() ? complaint.getAttackerInformation() : "None provided" %></div>
                </div>
            </div>

            <div class="card">
                <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Detailed Description</h3>
                <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap; background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px;">
                    <%= complaint.getDescription() %>
                </p>
                <div style="margin-top: 18px; font-size: 0.825rem; color: var(--text-muted);">
                    Assigned Officer: <strong style="color: #FFF;"><%= complaint.getAssignedInvestigatorName() %></strong>
                </div>
            </div>
        </div>

        <!-- Investigation Activity Log -->
        <div class="card">
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Official Case Investigation Notes</h3>
            <% if (notes == null || notes.isEmpty()) { %>
                <div style="color: var(--text-muted); font-size: 0.85rem; padding: 16px 0;">No forensic notes logged yet.</div>
            <% } else { %>
                <div style="display: flex; flex-direction: column; gap: 14px;">
                    <% for (InvestigationNoteBean n : notes) { %>
                        <div style="padding: 14px; background: rgba(0,0,0,0.35); border-left: 3px solid var(--accent-cyan); border-radius: 6px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <strong style="font-size: 0.85rem; color: var(--accent-cyan);">Officer <%= n.getInvestigatorName() %></strong>
                                <span style="font-size: 0.75rem; color: var(--text-muted);"><%= n.getCreatedAt() %></span>
                            </div>
                            <p style="font-size: 0.85rem; color: #FFF; margin-bottom: 6px; white-space: pre-wrap;"><%= n.getNote() %></p>
                            <% if (n.getFinding() != null && !n.getFinding().isEmpty()) { %>
                                <div style="font-size: 0.8rem; color: #cbd5e1;"><strong>Finding:</strong> <%= n.getFinding() %></div>
                            <% } %>
                            <% if (n.getActionTaken() != null && !n.getActionTaken().isEmpty()) { %>
                                <div style="font-size: 0.8rem; color: #cbd5e1;"><strong>Action Taken:</strong> <%= n.getActionTaken() %></div>
                            <% } %>
                            <% if (n.getRecommendation() != null && !n.getRecommendation().isEmpty()) { %>
                                <div style="font-size: 0.8rem; color: #34d399;"><strong>Recommendation:</strong> <%= n.getRecommendation() %></div>
                            <% } %>
                        </div>
                    <% } %>
                </div>
            <% } %>
        </div>
    </div>
</body>
</html>
