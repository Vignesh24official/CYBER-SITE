package com.cybershield.servlet;

import com.cybershield.dao.ComplaintDAO;
import com.cybershield.dao.InvestigationDAO;
import com.cybershield.model.ComplaintBean;
import com.cybershield.model.InvestigationNoteBean;
import com.cybershield.model.UserBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * ComplaintServlet: Demonstrates CREATE and READ CRUD operations
 */
@WebServlet(name = "ComplaintServlet", urlPatterns = {"/portal/complaints"})
public class ComplaintServlet extends HttpServlet {

    private ComplaintDAO complaintDAO;
    private InvestigationDAO investigationDAO;

    @Override
    public void init() throws ServletException {
        this.complaintDAO = new ComplaintDAO();
        this.investigationDAO = new InvestigationDAO();
    }

    /**
     * GET: Read/List citizen complaints or show submission form or detail page
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/portal/login");
            return;
        }

        String action = request.getParameter("action");
        String idParam = request.getParameter("id");
        String numberParam = request.getParameter("number");

        if ("new".equalsIgnoreCase(action)) {
            // Render 5-Step Complaint submission form
            request.getRequestDispatcher("/WEB-INF/views/fileComplaint.jsp").forward(request, response);
            return;
        }

        if (idParam != null && !idParam.trim().isEmpty()) {
            Long complaintId = Long.parseLong(idParam);
            ComplaintBean complaint = complaintDAO.getComplaintById(complaintId);
            List<InvestigationNoteBean> notes = investigationDAO.getNotesByComplaintId(complaintId);

            request.setAttribute("complaint", complaint);
            request.setAttribute("notes", notes);
            request.getRequestDispatcher("/WEB-INF/views/complaintDetail.jsp").forward(request, response);
            return;
        }

        if (numberParam != null && !numberParam.trim().isEmpty()) {
            ComplaintBean complaint = complaintDAO.getComplaintByPublicId(numberParam);
            if (complaint != null) {
                List<InvestigationNoteBean> notes = investigationDAO.getNotesByComplaintId(complaint.getId());
                request.setAttribute("complaint", complaint);
                request.setAttribute("notes", notes);
                request.getRequestDispatcher("/WEB-INF/views/complaintDetail.jsp").forward(request, response);
                return;
            }
        }

        // List citizen's filed complaints (READ in CRUD)
        List<ComplaintBean> complaints = complaintDAO.getComplaintsByUserId(user.getId());
        request.setAttribute("complaints", complaints);
        request.getRequestDispatcher("/WEB-INF/views/myComplaints.jsp").forward(request, response);
    }

    /**
     * POST: CREATE Operation - Citizen files a new cybersecurity incident
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/portal/login");
            return;
        }

        String title = request.getParameter("title");
        String category = request.getParameter("category");
        String threatType = request.getParameter("threatType");
        String severity = request.getParameter("severity");
        String description = request.getParameter("description");
        String location = request.getParameter("location");
        String lossStr = request.getParameter("financialLoss");
        String suspiciousUrl = request.getParameter("suspiciousUrl");
        String attackerInfo = request.getParameter("attackerInformation");

        if (title == null || description == null || title.trim().isEmpty() || description.trim().isEmpty()) {
            request.setAttribute("error", "Incident title and description are required.");
            request.getRequestDispatcher("/WEB-INF/views/fileComplaint.jsp").forward(request, response);
            return;
        }

        BigDecimal loss = BigDecimal.ZERO;
        if (lossStr != null && !lossStr.trim().isEmpty()) {
            try {
                loss = new BigDecimal(lossStr.trim());
            } catch (Exception ignored) {}
        }

        ComplaintBean c = new ComplaintBean();
        c.setUserId(user.getId());
        c.setTitle(title.trim());
        c.setCategory(category != null ? category.trim() : "Phishing & Identity Theft");
        c.setThreatType(threatType != null ? threatType.trim() : "Phishing Email Link");
        c.setSeverity(severity != null ? severity.trim() : "MEDIUM");
        c.setDescription(description.trim());
        c.setLocation(location != null ? location.trim() : "Online / Remote");
        c.setFinancialLoss(loss);
        c.setCurrency("INR");
        c.setSuspiciousUrl(suspiciousUrl != null ? suspiciousUrl.trim() : "");
        c.setAttackerInformation(attackerInfo != null ? attackerInfo.trim() : "");
        c.setIncidentDate(LocalDateTime.now());

        boolean created = complaintDAO.createComplaint(c);

        if (created) {
            response.sendRedirect(request.getContextPath() + "/portal/complaints?success=created&caseNum=" + c.getComplaintNumber());
        } else {
            request.setAttribute("error", "Failed to submit complaint. Database error occurred.");
            request.getRequestDispatcher("/WEB-INF/views/fileComplaint.jsp").forward(request, response);
        }
    }
}
