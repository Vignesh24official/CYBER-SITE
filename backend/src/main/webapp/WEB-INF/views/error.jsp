<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CyberShield - Page Notice</title>
    <style>
        body { background: #0a0e1a; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #111827; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 36px; text-align: center; max-width: 500px; }
        h1 { color: #06b6d4; font-size: 1.8rem; margin-bottom: 12px; }
        p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 24px; }
        a { display: inline-block; padding: 10px 24px; background: #06b6d4; color: #000; text-decoration: none; border-radius: 8px; font-weight: 700; }
    </style>
</head>
<body>
    <div class="card">
        <h1>CyberShield Security Gateway</h1>
        <p>The requested endpoint was not recognized or is being redirected.</p>
        <a href="<%= request.getContextPath() %>/">Return to Portal Home</a>
    </div>
</body>
</html>
