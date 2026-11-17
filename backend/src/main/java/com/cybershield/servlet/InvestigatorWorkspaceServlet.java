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
import java.util.List;

/**
 * InvestigatorWorkspaceServlet:
 * Manages the Cyber Defense Workbench, Linux Command Terminal, and Hacking Tools Hub
 */
@WebServlet(name = "InvestigatorWorkspaceServlet", urlPatterns = {"/portal/investigator"})
public class InvestigatorWorkspaceServlet extends HttpServlet {

    private ComplaintDAO complaintDAO;
    private InvestigationDAO investigationDAO;

    @Override
    public void init() throws ServletException {
        this.complaintDAO = new ComplaintDAO();
        this.investigationDAO = new InvestigationDAO();
    }

    /**
     * GET: Displays assigned cases or opens the investigator forensic workspace
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null || (!user.getRole().contains("INVESTIGATOR") && !user.getRole().contains("ADMIN") && !user.getRole().contains("COORDINATOR"))) {
            response.sendRedirect(request.getContextPath() + "/portal/login?role=investigator");
            return;
        }

        String idStr = request.getParameter("id");
        if (idStr != null && !idStr.trim().isEmpty()) {
            try {
                Long complaintId = Long.parseLong(idStr.trim());
                ComplaintBean complaint = complaintDAO.getComplaintById(complaintId);
                List<InvestigationNoteBean> notes = investigationDAO.getNotesByComplaintId(complaintId);

                // Auto-advance status to UNDER_INVESTIGATION if currently ASSIGNED
                if ("ASSIGNED".equalsIgnoreCase(complaint.getStatus())) {
                    complaintDAO.updateStatus(complaintId, "UNDER_INVESTIGATION");
                    complaint.setStatus("UNDER_INVESTIGATION");
                }

                request.setAttribute("complaint", complaint);
                request.setAttribute("notes", notes);
                request.getRequestDispatcher("/WEB-INF/views/investigatorWorkspace.jsp").forward(request, response);
                return;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // List all cases assigned to this investigator
        List<ComplaintBean> assignedCases = complaintDAO.getComplaintsByInvestigatorId(user.getId());
        if (assignedCases.isEmpty() && "ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            assignedCases = complaintDAO.getAllComplaints();
        }

        request.setAttribute("assignedCases", assignedCases);
        request.getRequestDispatcher("/WEB-INF/views/investigatorWorkspace.jsp").forward(request, response);
    }

    /**
     * POST: Log new forensic finding / note from Linux terminal or tools hub
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

        String complaintIdStr = request.getParameter("complaintId");
        String note = request.getParameter("note");
        String finding = request.getParameter("finding");
        String actionTaken = request.getParameter("actionTaken");
        String recommendation = request.getParameter("recommendation");

        if (complaintIdStr != null && note != null && !note.trim().isEmpty()) {
            try {
                Long complaintId = Long.parseLong(complaintIdStr.trim());

                InvestigationNoteBean b = new InvestigationNoteBean();
                b.setComplaintId(complaintId);
                b.setInvestigatorId(user.getId());
                b.setNote(note.trim());
                b.setFinding(finding != null ? finding.trim() : "");
                b.setActionTaken(actionTaken != null ? actionTaken.trim() : "");
                b.setRecommendation(recommendation != null ? recommendation.trim() : "");

                investigationDAO.addNote(b);

                response.sendRedirect(request.getContextPath() + "/portal/investigator?id=" + complaintId + "&noteSaved=true");
                return;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect(request.getContextPath() + "/portal/investigator");
    }
}
