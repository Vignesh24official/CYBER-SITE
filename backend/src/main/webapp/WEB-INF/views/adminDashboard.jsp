<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.cybershield.model.UserBean" %>
<%@ page import="com.cybershield.model.ComplaintBean" %>
<%@ page import="java.util.List" %>
<%
    UserBean user = (UserBean) session.getAttribute("user");
    if (user == null || !"ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
        response.sendRedirect(request.getContextPath() + "/portal/login?role=admin");
        return;
    }

    List<ComplaintBean> complaints = (List<ComplaintBean>) request.getAttribute("complaints");
    List<UserBean> investigators = (List<UserBean>) request.getAttribute("investigators");

    String assigned = request.getParameter("assigned");
    String deleted = request.getParameter("deleted");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOC Admin Triage & Assignment - CyberShield</title>
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
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; padding-bottom: 40px; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 36px; border-bottom: 1px solid var(--border); background: var(--bg-card); }
        .logo { font-size: 1.25rem; font-weight: 800; color: #ff003c; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .container { max-width: 1200px; margin: 32px auto; padding: 0 20px; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); padding: 24px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; margin-top: 16px; }
        th { padding: 12px 16px; background: rgba(0,0,0,0.4); border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: middle; }
        tr:hover { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.725rem; font-weight: 700; font-family: monospace; }
        .badge-submitted { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid #3b82f6; }
        .badge-assigned { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid #f59e0b; }
        .badge-investigating { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid #a855f7; }
        .badge-resolved { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
        .btn-sm { padding: 6px 12px; border-radius: 6px; font-size: 0.775rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border); color: #FFF; background: rgba(255,255,255,0.04); cursor: pointer; }
        .btn-assign { background: var(--accent-cyan); color: #000; border: none; font-weight: 700; }
        .btn-delete { border-color: #ef4444; color: #f87171; background: rgba(239,68,68,0.08); }
        .alert-success { padding: 12px 18px; border-radius: 8px; background: rgba(16,185,129,0.15); border: 1px solid var(--accent-green); color: #6ee7b7; font-size: 0.88rem; margin-bottom: 20px; }
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal.active { display: flex; }
        .modal-box { width: 100%; max-width: 480px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px; box-shadow: 0 12px 36px rgba(0,0,0,0.5); }
        select { width: 100%; padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #FFF; font-size: 0.9rem; margin: 12px 0 20px; }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="<%= request.getContextPath() %>/" class="logo">
            🛡️ SOC Administration Console &bull; Root Clearance [MAIN]
        </a>
        <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-right: 16px;">Admin: <%= user.getFullName() %></span>
            <a href="<%= request.getContextPath() %>/portal/logout" style="color: #f87171; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div style="margin-bottom: 24px;">
            <span style="font-size: 0.75rem; color: #ff003c; font-family: monospace; font-weight: 700;">CRUD: READ & UPDATE OPERATIONS &bull; JAVA SERVLET &bull; JDBC PREPAREDSTATEMENT</span>
            <h2 style="font-size: 1.6rem; font-weight: 800; margin-top: 4px;">Incident Triage & Investigator Assignment Grid</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Receive submitted complaints and assign cases to available cybersecurity investigators.</p>
        </div>

        <% if ("true".equals(assigned)) { %>
            <div class="alert-success">Investigator assigned successfully! Complaint transitioned to ASSIGNED state.</div>
        <% } %>
        <% if ("true".equals(deleted)) { %>
            <div class="alert-success">Complaint record deleted successfully from database.</div>
        <% } %>

        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th>Case #</th>
                        <th>Incident Title</th>
                        <th>Reporter</th>
                        <th>Category</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Assigned Officer</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <% if (complaints == null || complaints.isEmpty()) { %>
                        <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No complaints registered in system.</td></tr>
                    <% } else { 
                        for (ComplaintBean c : complaints) {
                            String stClass = "badge-submitted";
                            if ("ASSIGNED".equalsIgnoreCase(c.getStatus())) stClass = "badge-assigned";
                            if ("UNDER_INVESTIGATION".equalsIgnoreCase(c.getStatus())) stClass = "badge-investigating";
                            if ("RESOLVED".equalsIgnoreCase(c.getStatus())) stClass = "badge-resolved";
                    %>
                        <tr>
                            <td><strong style="color: var(--accent-cyan); font-family: monospace;"><%= c.getComplaintNumber() %></strong></td>
                            <td style="font-weight: 600;"><%= c.getTitle() %></td>
                            <td><%= c.getReporterName() %></td>
                            <td><%= c.getCategory() %></td>
                            <td><strong><%= c.getSeverity() %></strong></td>
                            <td><span class="badge <%= stClass %>"><%= c.getStatus() %></span></td>
                            <td style="color: <%= "Unassigned".equalsIgnoreCase(c.getAssignedInvestigatorName()) ? "#f59e0b" : "#34d399" %>; font-weight: 600;">
                                <%= c.getAssignedInvestigatorName() %>
                            </td>
                            <td>
                                <div style="display: flex; gap: 6px;">
                                    <button onclick="openAssignModal('<%= c.getId() %>', '<%= c.getComplaintNumber() %>')" class="btn-sm btn-assign" title="Assign Work to Investigator">
                                        Assign Work
                                    </button>
                                    <a href="<%= request.getContextPath() %>/portal/complaints?id=<%= c.getId() %>" class="btn-sm">
                                        Detail
                                    </a>
                                    <a href="<%= request.getContextPath() %>/portal/delete-complaint?id=<%= c.getId() %>" class="btn-sm btn-delete" onclick="return confirm('Delete this complaint record?');">
                                        Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <% } } %>
                </tbody>
            </table>
        </div>
    </div>

    <!-- ASSIGN INVESTIGATOR MODAL (UPDATE OPERATION) -->
    <div id="assignModal" class="modal">
        <div class="modal-box">
            <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 6px;">Assign Investigator</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
                Select an available investigator for Case: <span id="modalCaseNum" style="color: var(--accent-cyan); font-family: monospace; font-weight: 700;"></span>
            </p>

            <form action="<%= request.getContextPath() %>/portal/admin" method="POST">
                <input type="hidden" id="modalComplaintId" name="complaintId" value="">

                <label style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1;">Available Cyber Investigators:</label>
                <select name="investigatorId" required>
                    <% if (investigators != null) {
                        for (UserBean inv : investigators) { %>
                            <option value="<%= inv.getId() %>"><%= inv.getFullName() %> (<%= inv.getEmail() %>) &bull; <%= inv.getRole() %></option>
                    <% } } %>
                </select>

                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button type="button" onclick="closeAssignModal()" class="btn-sm" style="padding: 10px 18px;">Cancel</button>
                    <button type="submit" class="btn-sm btn-assign" style="padding: 10px 22px;">Confirm Assignment &rarr;</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openAssignModal(id, caseNum) {
            document.getElementById('modalComplaintId').value = id;
            document.getElementById('modalCaseNum').innerText = caseNum;
            document.getElementById('assignModal').classList.add('active');
        }
        function closeAssignModal() {
            document.getElementById('assignModal').classList.remove('active');
        }
    </script>
</body>
</html>
