<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberShield - Online Cyber Incident & Complaint Management System</title>
    <style>
        :root {
            --bg-dark: #0a0e1a;
            --bg-card: #111827;
            --accent-cyan: #06b6d4;
            --accent-green: #10b981;
            --text-primary: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: rgba(255,255,255,0.12);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 18px 48px; border-bottom: 1px solid var(--border-color); background: rgba(17,24,39,0.8); backdrop-filter: blur(10px); }
        .logo { font-size: 1.4rem; font-weight: 800; color: var(--accent-cyan); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-links { display: flex; gap: 16px; align-items: center; }
        .btn { padding: 9px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; cursor: pointer; transition: 0.2s; font-size: 0.9rem; border: none; }
        .btn-cyan { background: var(--accent-cyan); color: #000; }
        .btn-cyan:hover { background: #22d3ee; }
        .btn-outline { border: 1px solid var(--border-color); color: var(--text-primary); background: transparent; }
        .btn-outline:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
        .hero { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 24px; max-width: 900px; margin: 0 auto; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; background: rgba(6,182,212,0.15); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); font-size: 0.8rem; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.05em; }
        h1 { font-size: 2.8rem; font-weight: 900; line-height: 1.2; margin-bottom: 18px; }
        h1 span { color: var(--accent-cyan); }
        p.subtitle { font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; max-width: 720px; }
        .cta-group { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-bottom: 48px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; width: 100%; text-align: left; margin-top: 32px; }
        .feature-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; }
        .feature-card h3 { color: #FFF; font-size: 1.1rem; margin-bottom: 8px; }
        .feature-card p { color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; }
        footer { padding: 24px; text-align: center; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-color); }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="<%= request.getContextPath() %>/" class="logo">
            🛡️ CyberShield SOC
        </a>
        <div class="nav-links">
            <a href="<%= request.getContextPath() %>/portal/login?role=citizen" class="btn btn-outline">Citizen Portal</a>
            <a href="<%= request.getContextPath() %>/portal/login?role=investigator" class="btn btn-outline">Investigator Hub</a>
            <a href="<%= request.getContextPath() %>/portal/login?role=admin" class="btn btn-cyan">SOC Admin</a>
        </div>
    </nav>

    <div class="hero">
        <span class="badge">MCA ADVANCED JAVA &bull; SERVLET &bull; JSP &bull; JDBC &bull; MYSQL</span>
        <h1>Online Incident & <span>Complaint Management</span> System</h1>
        <p class="subtitle">
            A comprehensive cybersecurity reporting, administrative triage, forensic investigator workbench, and citizen resolution communication platform.
        </p>

        <div class="cta-group">
            <a href="<%= request.getContextPath() %>/portal/login?role=citizen" class="btn btn-cyan" style="padding: 12px 28px; font-size: 1rem;">File a Complaint</a>
            <a href="<%= request.getContextPath() %>/portal/login?role=investigator" class="btn btn-outline" style="padding: 12px 28px; font-size: 1rem;">Investigator Workspace</a>
            <a href="<%= request.getContextPath() %>/portal/login?role=admin" class="btn btn-outline" style="padding: 12px 28px; font-size: 1rem;">Admin Triage</a>
        </div>

        <div class="grid-3">
            <div class="feature-card">
                <h3>1. Citizen Incident Reporting</h3>
                <p>Submit cyber complaints capturing category, financial impact, attacker handles, and suspicious URLs with automated sequential case tracking.</p>
            </div>
            <div class="feature-card">
                <h3>2. Admin Assignment Triage</h3>
                <p>SOC Administrators review submitted cases and assign active workloads to designated cyber investigators.</p>
            </div>
            <div class="feature-card">
                <h3>3. Forensic Tools & Chat</h3>
                <p>Investigators execute Linux commands, scan via Hacking Tools Hub, conclude cases with official reports, and communicate via real-time Case Chat.</p>
            </div>
        </div>
    </div>

    <footer>
        &copy; 2026 CyberShield Platform &bull; Advanced Programming in Java Group Assignment &bull; Servlet + JSP + JDBC + MySQL Architecture
    </footer>
</body>
</html>
