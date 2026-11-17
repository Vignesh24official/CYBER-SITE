<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.cybershield.model.UserBean" %>
<%@ page import="com.cybershield.model.ComplaintBean" %>
<%@ page import="java.util.List" %>
<%
    UserBean user = (UserBean) session.getAttribute("user");
    if (user == null) {
        response.sendRedirect(request.getContextPath() + "/portal/login");
        return;
    }

    List<ComplaintBean> complaints = (List<ComplaintBean>) request.getAttribute("complaints");
    String success = request.getParameter("success");
    String caseNum = request.getParameter("caseNum");
    String deleted = request.getParameter("deleted");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Incident Complaints - CyberShield</title>
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
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 36px; border-bottom: 1px solid var(--border); background: var(--bg-card); }
        .logo { font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); text-decoration: none; }
        .container { max-width: 1100px; margin: 32px auto; padding: 0 20px; }
        .page-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .btn-new { padding: 10px 22px; border-radius: 8px; background: var(--accent-cyan); color: #000; font-weight: 700; text-decoration: none; font-size: 0.9rem; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
        th { padding: 14px 18px; background: rgba(0,0,0,0.4); border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: middle; }
        tr:hover { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.725rem; font-weight: 700; font-family: monospace; }
        .badge-submitted { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid #3b82f6; }
        .badge-assigned { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid #f59e0b; }
        .badge-investigating { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid #a855f7; }
        .badge-resolved { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
        .btn-sm { padding: 6px 12px; border-radius: 6px; font-size: 0.775rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border); color: #FFF; background: rgba(255,255,255,0.04); }
        .btn-sm:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
        .btn-chat { border-color: #38bdf8; color: #38bdf8; background: rgba(56,189,248,0.1); }
        .btn-delete { border-color: #ef4444; color: #f87171; background: rgba(239,68,68,0.08); }
        .alert-success { padding: 12px 18px; border-radius: 8px; background: rgba(16,185,129,0.15); border: 1px solid var(--accent-green); color: #6ee7b7; font-size: 0.88rem; margin-bottom: 20px; }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="<%= request.getContextPath() %>/" class="logo">🛡️ CyberShield Citizen Portal</a>
        <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-right: 16px;">Welcome, <%= user.getFullName() %></span>
            <a href="<%= request.getContextPath() %>/portal/logout" style="color: #f87171; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="page-head">
            <div>
                <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: monospace; font-weight: 700;">CRUD: READ OPERATION &bull; JDBC RESULTSET QUERY</span>
                <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 4px;">My Incident Complaints</h2>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Track real-time investigation progress, resolution reports, and communicate via chat.</p>
            </div>
            <a href="<%= request.getContextPath() %>/portal/complaints?action=new" class="btn-new">+ File New Complaint</a>
        </div>

        <% if ("created".equals(success)) { %>
            <div class="alert-success">Complaint filed successfully! Case tracking number: <strong><%= caseNum != null ? caseNum : "" %></strong></div>
        <% } %>
        <% if ("true".equals(deleted)) { %>
            <div class="alert-success">Complaint withdrawn and deleted from database successfully.</div>
        <% } %>

        <div class="card">
            <% if (complaints == null || complaints.isEmpty()) { %>
                <div style="padding: 48px; text-align: center; color: var(--text-muted);">
                    <p style="font-size: 1rem; margin-bottom: 14px;">No incident complaints filed yet.</p>
                    <a href="<%= request.getContextPath() %>/portal/complaints?action=new" class="btn-new" style="font-size: 0.85rem;">File First Complaint</a>
                </div>
            <% } else { %>
                <table>
                    <thead>
                        <tr>
                            <th>Case Number</th>
                            <th>Incident Title</th>
                            <th>Threat Vector</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Assigned Officer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% for (ComplaintBean c : complaints) { 
                            String stClass = "badge-submitted";
                            if ("ASSIGNED".equalsIgnoreCase(c.getStatus())) stClass = "badge-assigned";
                            if ("UNDER_INVESTIGATION".equalsIgnoreCase(c.getStatus())) stClass = "badge-investigating";
                            if ("RESOLVED".equalsIgnoreCase(c.getStatus())) stClass = "badge-resolved";
                        %>
                            <tr>
                                <td><strong style="color: var(--accent-cyan); font-family: monospace;"><%= c.getComplaintNumber() %></strong></td>
                                <td style="font-weight: 600;"><%= c.getTitle() %></td>
                                <td style="color: var(--text-muted);"><%= c.getThreatType() %></td>
                                <td><%= c.getSeverity() %></td>
                                <td><span class="badge <%= stClass %>"><%= c.getStatus() %></span></td>
                                <td style="color: #cbd5e1;"><%= c.getAssignedInvestigatorName() %></td>
                                <td>
                                    <div style="display: flex; gap: 8px;">
                                        <a href="<%= request.getContextPath() %>/portal/complaints?id=<%= c.getId() %>" class="btn-sm">View Details</a>
                                        <a href="<%= request.getContextPath() %>/portal/chat?complaintId=<%= c.getId() %>" class="btn-sm btn-chat">💬 Chat</a>
                                        <a href="<%= request.getContextPath() %>/portal/delete-complaint?id=<%= c.getId() %>" class="btn-sm btn-delete" onclick="return confirm('Withdraw and delete this complaint?');">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        <% } %>
                    </tbody>
                </table>
            <% } %>
        </div>
    </div>
</body>
</html>
