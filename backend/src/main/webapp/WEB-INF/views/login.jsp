<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String selectedRole = (String) request.getAttribute("selectedRole");
    if (selectedRole == null) selectedRole = request.getParameter("role");
    if (selectedRole == null) selectedRole = "citizen";

    String error = (String) request.getAttribute("error");
    String registered = request.getParameter("registered");
    String logout = request.getParameter("logout");

    String defaultEmail = "user@cybershield.org";
    String roleTitle = "Citizen Defender Portal";
    boolean requiresCode = false;

    if ("admin".equalsIgnoreCase(selectedRole)) {
        defaultEmail = "admin@cybershield.org";
        roleTitle = "SOC Root Administration";
        requiresCode = true;
    } else if ("investigator".equalsIgnoreCase(selectedRole)) {
        defaultEmail = "investigator@cybershield.org";
        roleTitle = "Cyber Investigator Workbench";
        requiresCode = true;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CyberShield Platform</title>
    <style>
        :root {
            --bg-dark: #0a0e1a;
            --bg-card: #111827;
            --accent-cyan: #06b6d4;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --border: rgba(255,255,255,0.12);
            --text-primary: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .login-card { width: 100%; max-width: 440px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
        .logo-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .logo { font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); text-decoration: none; }
        .role-tabs { display: flex; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 10px; margin-bottom: 24px; }
        .role-tab { flex: 1; text-align: center; padding: 8px; font-size: 0.8rem; font-weight: 700; border-radius: 8px; text-decoration: none; color: var(--text-muted); transition: 0.2s; }
        .role-tab.active { background: var(--accent-cyan); color: #000; }
        .form-group { margin-bottom: 18px; }
        label { display: block; font-size: 0.825rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); }
        input[type="text"], input[type="email"], input[type="password"] {
            width: 100%; padding: 11px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #FFF; outline: none; font-size: 0.9rem;
        }
        input:focus { border-color: var(--accent-cyan); }
        .code-box { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 18px; }
        .code-box.inv { background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3); }
        .code-box label { color: #fca5a5; font-weight: 700; }
        .code-box.inv label { color: #fcd34d; }
        .btn-submit { width: 100%; padding: 12px; border-radius: 8px; background: var(--accent-cyan); color: #000; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: 0.2s; margin-top: 8px; }
        .btn-submit:hover { background: #22d3ee; }
        .alert { padding: 12px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 18px; }
        .alert-error { background: rgba(239,68,68,0.15); border: 1px solid var(--accent-red); color: #fca5a5; }
        .alert-success { background: rgba(16,185,129,0.15); border: 1px solid var(--accent-green); color: #6ee7b7; }
        .footer-links { text-align: center; margin-top: 20px; font-size: 0.825rem; color: var(--text-muted); }
        .footer-links a { color: var(--accent-cyan); text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="logo-head">
            <a href="<%= request.getContextPath() %>/" class="logo">🛡️ CyberShield</a>
            <span style="font-size: 0.725rem; color: var(--text-muted); font-family: monospace;">SERVLET AUTH</span>
        </div>

        <!-- Role Switcher -->
        <div class="role-tabs">
            <a href="?role=citizen" class="role-tab <%= "citizen".equalsIgnoreCase(selectedRole) ? "active" : "" %>">Citizen</a>
            <a href="?role=investigator" class="role-tab <%= "investigator".equalsIgnoreCase(selectedRole) ? "active" : "" %>">Investigator</a>
            <a href="?role=admin" class="role-tab <%= "admin".equalsIgnoreCase(selectedRole) ? "active" : "" %>">SOC Admin</a>
        </div>

        <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 4px;"><%= roleTitle %></h2>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 20px;">Enter your credentials to access the complaint grid.</p>

        <% if (error != null) { %>
            <div class="alert alert-error"><%= error %></div>
        <% } %>
        <% if ("true".equals(registered)) { %>
            <div class="alert alert-success">Registration successful! Please login with your credentials.</div>
        <% } %>
        <% if ("true".equals(logout)) { %>
            <div class="alert alert-success">You have been logged out securely.</div>
        <% } %>

        <form action="<%= request.getContextPath() %>/portal/login" method="POST">
            <input type="hidden" name="role" value="<%= selectedRole %>">

            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value="<%= defaultEmail %>" required>
            </div>

            <div class="form-group">
                <label>Password (Demo: Password@123)</label>
                <input type="password" name="password" value="Password@123" required>
            </div>

            <% if (requiresCode) { %>
                <div class="code-box <%= "investigator".equalsIgnoreCase(selectedRole) ? "inv" : "" %>">
                    <label>
                        <%= "admin".equalsIgnoreCase(selectedRole) ? "Admin Clearance Code (Code: MAIN)" : "Investigator Clearance Code (Code: SUB)" %>
                    </label>
                    <input type="password" name="secretCode" value="<%= "admin".equalsIgnoreCase(selectedRole) ? "MAIN" : "SUB" %>" placeholder="Enter clearance code" required style="font-family: monospace; letter-spacing: 2px; font-weight: 800;">
                </div>
            <% } %>

            <button type="submit" class="btn-submit">
                Authorize & Login &rarr;
            </button>
        </form>

        <div class="footer-links">
            Don't have an account? <a href="<%= request.getContextPath() %>/portal/register">Register Citizen Account</a>
        </div>
    </div>
</body>
</html>
