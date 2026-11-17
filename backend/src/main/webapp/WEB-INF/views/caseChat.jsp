<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.cybershield.model.UserBean" %>
<%@ page import="com.cybershield.model.ComplaintBean" %>
<%@ page import="com.cybershield.model.ChatMessageBean" %>
<%@ page import="java.util.List" %>
<%
    UserBean user = (UserBean) session.getAttribute("user");
    if (user == null) {
        response.sendRedirect(request.getContextPath() + "/portal/login");
        return;
    }

    ComplaintBean complaint = (ComplaintBean) request.getAttribute("complaint");
    List<ChatMessageBean> messages = (List<ChatMessageBean>) request.getAttribute("messages");

    boolean isInvestigatorOrAdmin = user.getRole().contains("INVESTIGATOR") || user.getRole().contains("ADMIN") || user.getRole().contains("COORDINATOR");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Case Chat - <%= complaint != null ? complaint.getComplaintNumber() : "Channel" %></title>
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
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 36px; border-bottom: 1px solid var(--border); background: var(--bg-card); }
        .logo { font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); text-decoration: none; }
        .chat-container { flex: 1; max-width: 900px; width: 100%; margin: 24px auto; padding: 0 20px; display: flex; flex-direction: column; }
        .chat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; display: flex; flex-direction: column; height: 600px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
        .chat-head { padding: 14px 20px; background: rgba(0,0,0,0.4); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; background: radial-gradient(ellipse at bottom, rgba(15,23,42,0.6) 0%, rgba(10,14,26,0.95) 100%); }
        .msg-wrap { display: flex; flex-direction: column; max-width: 80%; }
        .msg-wrap.mine { align-self: flex-end; align-items: flex-end; }
        .msg-wrap.other { align-self: flex-start; align-items: flex-start; }
        .msg-meta { font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px; display: flex; gap: 6px; align-items: center; }
        .msg-bubble { padding: 10px 16px; border-radius: 14px; font-size: 0.88rem; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
        .msg-wrap.mine .msg-bubble { background: linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(14,165,233,0.4) 100%); border: 1px solid rgba(6,182,212,0.5); color: #FFF; border-bottom-right-radius: 2px; }
        .msg-wrap.other .msg-bubble { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255,255,255,0.1); color: #FFF; border-bottom-left-radius: 2px; }
        .role-tag { font-size: 0.65rem; padding: 1px 6px; border-radius: 8px; font-weight: 700; font-family: monospace; }
        .tag-citizen { background: rgba(6,182,212,0.2); color: var(--accent-cyan); border: 1px solid var(--accent-cyan); }
        .tag-investigator { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
        .tag-admin { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid #ef4444; }
        .quick-bar { padding: 8px 16px; background: rgba(0,0,0,0.3); border-top: 1px solid var(--border); display: flex; gap: 8px; overflow-x: auto; white-space: nowrap; }
        .pill { padding: 4px 10px; border-radius: 12px; font-size: 0.725rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #cbd5e1; cursor: pointer; }
        .pill:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
        .chat-input-bar { padding: 12px 16px; background: rgba(0,0,0,0.5); border-top: 1px solid var(--border); display: flex; gap: 10px; align-items: center; }
        .chat-input { flex: 1; padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #FFF; font-size: 0.88rem; outline: none; }
        .btn-send { padding: 10px 20px; border-radius: 8px; background: var(--accent-cyan); color: #000; font-weight: 700; border: none; cursor: pointer; font-size: 0.88rem; }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="<%= request.getContextPath() %>/" class="logo">🛡️ Secure Case Communication Link</a>
        <div>
            <% if (isInvestigatorOrAdmin) { %>
                <a href="<%= request.getContextPath() %>/portal/investigator?id=<%= complaint.getId() %>" style="color: var(--accent-cyan); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-right: 16px;">&larr; Back to Workspace</a>
            <% } else { %>
                <a href="<%= request.getContextPath() %>/portal/complaints?id=<%= complaint.getId() %>" style="color: var(--accent-cyan); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-right: 16px;">&larr; Back to Case Details</a>
            <% } %>
            <a href="<%= request.getContextPath() %>/portal/logout" style="color: #f87171; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Logout</a>
        </div>
    </nav>

    <div class="chat-container">
        <div class="chat-card">
            <div class="chat-head">
                <div>
                    <span style="font-size: 0.95rem; font-weight: 800; color: #FFF;">
                        Case Ref: <span style="font-family: monospace; color: var(--accent-cyan);"><%= complaint.getComplaintNumber() %></span>
                    </span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">
                        &bull; <%= complaint.getTitle() %>
                    </span>
                </div>
                <div style="font-size: 0.72rem; color: #34d399; font-family: monospace; font-weight: 700;">
                    🔒 E2EE ENCRYPTED CHANNEL ACTIVE
                </div>
            </div>

            <div id="chatBox" class="chat-messages">
                <% if (messages == null || messages.isEmpty()) { %>
                    <div style="margin: auto; text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 24px;">
                        <p style="margin-bottom: 6px; font-weight: 700; color: #FFF;">Secure Direct Channel Opened</p>
                        <p>Communicate directly regarding forensic status, additional evidence, or recovery steps.</p>
                    </div>
                <% } else { 
                    for (ChatMessageBean m : messages) {
                        boolean isMine = m.getSenderId().equals(user.getId());
                        String tagClass = "tag-citizen";
                        String roleLabel = "Citizen";
                        if (m.getSenderRole().contains("ADMIN")) {
                            tagClass = "tag-admin";
                            roleLabel = "SOC Admin";
                        } else if (m.getSenderRole().contains("INVESTIGATOR") || m.getSenderRole().contains("COORDINATOR")) {
                            tagClass = "tag-investigator";
                            roleLabel = "Investigator";
                        }
                %>
                    <div class="msg-wrap <%= isMine ? "mine" : "other" %>">
                        <div class="msg-meta">
                            <strong><%= isMine ? "You" : m.getSenderName() %></strong>
                            <span class="role-tag <%= tagClass %>"><%= roleLabel %></span>
                            <span><%= m.getCreatedAt() != null ? m.getCreatedAt() : "" %></span>
                        </div>
                        <div class="msg-bubble">
                            <%= m.getMessage() %>
                            <% if (m.getAttachmentData() != null && !m.getAttachmentData().isEmpty()) { %>
                                <div style="margin-top: 8px; padding: 8px; background: #050811; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; font-family: monospace; font-size: 0.75rem; color: #38bdf8;">
                                    <strong>Artifact:</strong> <%= m.getAttachmentName() != null ? m.getAttachmentName() : "Forensic Log" %><br>
                                    <pre style="margin-top: 4px; white-space: pre-wrap;"><%= m.getAttachmentData() %></pre>
                                </div>
                            <% } %>
                        </div>
                    </div>
                <% } } %>
            </div>

            <!-- Quick Inquiry / Response Chips -->
            <div class="quick-bar">
                <span style="font-size: 0.7rem; color: var(--text-muted); align-self: center;">Quick:</span>
                <% if (isInvestigatorOrAdmin) { %>
                    <span class="pill" onclick="setQuickMsg('Notice served to hosting registrar and ISP for immediate takedown.')">Takedown notice served</span>
                    <span class="pill" onclick="setQuickMsg('Urgent lien / freeze alert dispatched to nodal bank officer.')">Bank nodal freeze alert</span>
                    <span class="pill" onclick="setQuickMsg('Please confirm if any OTP, card CVV, or remote access app was shared.')">Request OTP confirmation</span>
                    <span class="pill" onclick="setQuickMsg('Forensic inspection of uploaded evidence files is complete.')">Evidence verified</span>
                <% } else { %>
                    <span class="pill" onclick="setQuickMsg('Can you provide an update on my investigation status?')">Status update request</span>
                    <span class="pill" onclick="setQuickMsg('Has the fraudulent bank account or UPI handle been frozen?')">Bank freeze check</span>
                    <span class="pill" onclick="setQuickMsg('I found another suspicious SMS / transaction related to this incident.')">Additional transaction</span>
                    <span class="pill" onclick="setQuickMsg('What safety precautions should I take right now with my bank?')">Next steps advice</span>
                <% } %>
            </div>

            <!-- Message Input Form -->
            <form action="<%= request.getContextPath() %>/portal/chat" method="POST" class="chat-input-bar">
                <input type="hidden" name="complaintId" value="<%= complaint.getId() %>">
                <input type="text" id="msgInput" name="message" class="chat-input" placeholder="Type your message to <%= isInvestigatorOrAdmin ? "citizen" : "assigned investigator" %> (press Enter to send)..." required>
                <button type="submit" class="btn-send">Send &rarr;</button>
            </form>
        </div>
    </div>

    <script>
        var chatBox = document.getElementById('chatBox');
        chatBox.scrollTop = chatBox.scrollHeight;

        function setQuickMsg(text) {
            document.getElementById('msgInput').value = text;
            document.getElementById('msgInput').focus();
        }

        // Auto-refresh chat every 6 seconds to fetch new incoming messages
        setInterval(function() {
            var input = document.getElementById('msgInput');
            if (!input.value) {
                window.location.reload();
            }
        }, 6000);
    </script>
</body>
</html>
