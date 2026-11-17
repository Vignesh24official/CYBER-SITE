package com.cybershield.servlet;

import com.cybershield.dao.ChatDAO;
import com.cybershield.dao.ComplaintDAO;
import com.cybershield.model.ChatMessageBean;
import com.cybershield.model.ComplaintBean;
import com.cybershield.model.UserBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

/**
 * CaseChatServlet:
 * Real-time interactive communication between Citizen and assigned Investigator using Servlet & JDBC
 */
@WebServlet(name = "CaseChatServlet", urlPatterns = {"/portal/chat"})
public class CaseChatServlet extends HttpServlet {

    private ChatDAO chatDAO;
    private ComplaintDAO complaintDAO;

    @Override
    public void init() throws ServletException {
        this.chatDAO = new ChatDAO();
        this.complaintDAO = new ComplaintDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/portal/login");
            return;
        }

        String complaintIdStr = request.getParameter("complaintId");
        if (complaintIdStr == null || complaintIdStr.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/portal/complaints");
            return;
        }

        try {
            Long complaintId = Long.parseLong(complaintIdStr.trim());
            ComplaintBean complaint = complaintDAO.getComplaintById(complaintId);
            List<ChatMessageBean> messages = chatDAO.getMessagesByComplaintId(complaintId);

            request.setAttribute("complaint", complaint);
            request.setAttribute("messages", messages);
            request.getRequestDispatcher("/WEB-INF/views/caseChat.jsp").forward(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/portal/complaints");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/portal/login");
            return;
        }

        String complaintIdStr = request.getParameter("complaintId");
        String message = request.getParameter("message");
        String attachmentName = request.getParameter("attachmentName");
        String attachmentData = request.getParameter("attachmentData");

        if (complaintIdStr != null && message != null && !message.trim().isEmpty()) {
            try {
                Long complaintId = Long.parseLong(complaintIdStr.trim());

                ChatMessageBean msg = new ChatMessageBean();
                msg.setComplaintId(complaintId);
                msg.setSenderId(user.getId());
                msg.setSenderName(user.getFullName());
                msg.setSenderRole(user.getRole());
                msg.setMessage(message.trim());
                msg.setAttachmentName(attachmentName != null ? attachmentName.trim() : null);
                msg.setAttachmentData(attachmentData != null ? attachmentData.trim() : null);

                chatDAO.sendMessage(msg);

                response.sendRedirect(request.getContextPath() + "/portal/chat?complaintId=" + complaintId);
                return;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect(request.getContextPath() + "/portal/complaints");
    }
}
