<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String error = (String) request.getAttribute("error");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Citizen - CyberShield Platform</title>
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
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .card { width: 100%; max-width: 440px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
        .logo { font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 0.825rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); }
        input { width: 100%; padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #FFF; outline: none; font-size: 0.9rem; }
        input:focus { border-color: var(--accent-cyan); }
        .btn-submit { width: 100%; padding: 12px; border-radius: 8px; background: var(--accent-cyan); color: #000; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: 0.2s; margin-top: 8px; }
        .alert-error { padding: 10px 14px; border-radius: 8px; background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; font-size: 0.85rem; margin-bottom: 16px; }
        .footer-links { text-align: center; margin-top: 20px; font-size: 0.825rem; color: var(--text-muted); }
        .footer-links a { color: var(--accent-cyan); text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="card">
        <a href="<%= request.getContextPath() %>/" class="logo">🛡️ CyberShield</a>
        <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 4px;">Register Citizen Account</h2>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 20px;">Create your account to file and track cyber incident reports.</p>

        <% if (error != null) { %>
            <div class="alert-error"><%= error %></div>
        <% } %>

        <form action="<%= request.getContextPath() %>/portal/register" method="POST">
            <div class="form-group">
                <label>Full Legal Name</label>
                <input type="text" name="fullName" placeholder="e.g. Rahul Sharma" required>
            </div>

            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="e.g. rahul@example.com" required>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" placeholder="e.g. +91 9876543210" required>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create password" required>
            </div>

            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Confirm password" required>
            </div>

            <button type="submit" class="btn-submit">Register Account &rarr;</button>
        </form>

        <div class="footer-links">
            Already have an account? <a href="<%= request.getContextPath() %>/portal/login?role=citizen">Login here</a>
        </div>
    </div>
</body>
</html>
