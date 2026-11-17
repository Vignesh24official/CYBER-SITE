<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.cybershield.model.UserBean" %>
<%
    UserBean user = (UserBean) session.getAttribute("user");
    if (user == null) {
        response.sendRedirect(request.getContextPath() + "/portal/login");
        return;
    }
    String error = (String) request.getAttribute("error");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Incident Complaint - CyberShield</title>
    <style>
        :root {
            --bg-dark: #0a0e1a;
            --bg-card: #111827;
            --accent-cyan: #06b6d4;
            --border: rgba(255,255,255,0.12);
            --text-primary: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 36px; border-bottom: 1px solid var(--border); background: var(--bg-card); }
        .logo { font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); text-decoration: none; }
        .container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .form-group { margin-bottom: 16px; }
        .full-width { grid-column: 1 / -1; }
        label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; color: #cbd5e1; }
        input, select, textarea {
            width: 100%; padding: 11px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #FFF; outline: none; font-size: 0.9rem;
        }
        textarea { resize: vertical; min-height: 120px; font-family: inherit; }
        input:focus, select:focus, textarea:focus { border-color: var(--accent-cyan); }
        .btn-submit { padding: 12px 28px; border-radius: 8px; background: var(--accent-cyan); color: #000; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: 0.2s; }
        .btn-submit:hover { background: #22d3ee; }
        .btn-cancel { padding: 12px 20px; border-radius: 8px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-right: 12px; }
        .alert-error { padding: 12px; border-radius: 8px; background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; font-size: 0.85rem; margin-bottom: 20px; }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="<%= request.getContextPath() %>/" class="logo">🛡️ CyberShield Citizen Portal</a>
        <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-right: 16px;">User: <%= user.getFullName() %></span>
            <a href="<%= request.getContextPath() %>/portal/complaints" style="color: var(--accent-cyan); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-right: 16px;">My Complaints</a>
            <a href="<%= request.getContextPath() %>/portal/logout" style="color: #f87171; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="card">
            <div style="margin-bottom: 24px;">
                <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: monospace; font-weight: 700; letter-spacing: 0.05em;">CRUD: CREATE OPERATION &bull; JAVA SERVLET &bull; JDBC</span>
                <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 4px;">File Cyber Incident Complaint</h2>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Please provide accurate incident timeline and attacker observables to initiate forensic triage.</p>
            </div>

            <% if (error != null) { %>
                <div class="alert-error"><%= error %></div>
            <% } %>

            <form action="<%= request.getContextPath() %>/portal/complaints" method="POST">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Incident Subject / Title *</label>
                        <input type="text" name="title" placeholder="e.g. Unauthorized UPI transfer from NetBanking after clicking link" required>
                    </div>

                    <div class="form-group">
                        <label>Threat Category *</label>
                        <select name="category" required>
                            <option value="Financial & Banking Fraud">Financial & Banking Fraud</option>
                            <option value="Phishing & Identity Theft" selected>Phishing & Identity Theft</option>
                            <option value="Social Engineering & Cyberbullying">Social Engineering & Harassment</option>
                            <option value="Malware & Ransomware">Malware & Ransomware</option>
                            <option value="Unauthorized Access & Account Takeover">Account Takeover & Hacking</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Specific Threat Type *</label>
                        <select name="threatType" required>
                            <option value="UPI QR Code Fraud">UPI QR Code Fraud</option>
                            <option value="Net Banking Credential Theft">Net Banking Credential Theft</option>
                            <option value="Phishing Email / SMS Link" selected>Phishing Email / SMS Link</option>
                            <option value="Credit / Debit Card Vishing">Credit / Debit Card Vishing</option>
                            <option value="Fake E-Commerce Web Portal">Fake E-Commerce Web Portal</option>
                            <option value="Identity Impersonation">Identity Impersonation</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Severity Level</label>
                        <select name="severity">
                            <option value="LOW">LOW - Non-urgent</option>
                            <option value="MEDIUM" selected>MEDIUM - Active attempt</option>
                            <option value="HIGH">HIGH - Direct financial loss</option>
                            <option value="CRITICAL">CRITICAL - System compromise</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Financial Loss Amount (INR)</label>
                        <input type="number" step="0.01" name="financialLoss" placeholder="0.00">
                    </div>

                    <div class="form-group">
                        <label>Incident Location</label>
                        <input type="text" name="location" placeholder="e.g. Chennai / Online">
                    </div>

                    <div class="form-group">
                        <label>Suspicious URL / Website Link</label>
                        <input type="text" name="suspiciousUrl" placeholder="e.g. http://secure-update-kyc.xyz">
                    </div>

                    <div class="form-group full-width">
                        <label>Attacker Identifiers (Phone / UPI VPA / Account Number / Email)</label>
                        <input type="text" name="attackerInformation" placeholder="e.g. Scammer WhatsApp: +91 9123456789, VPA: fake_refund@okaxis">
                    </div>

                    <div class="form-group full-width">
                        <label>Detailed Incident Description *</label>
                        <textarea name="description" placeholder="Describe chronologically what occurred, messages received, and actions taken..." required></textarea>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
                    <a href="<%= request.getContextPath() %>/portal/complaints" class="btn-cancel">Cancel</a>
                    <button type="submit" class="btn-submit">Submit Incident Report &rarr;</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
