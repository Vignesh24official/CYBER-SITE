package com.cybershield.servlet;

import com.cybershield.dao.ComplaintDAO;
import com.cybershield.dao.InvestigationDAO;
import com.cybershield.model.InvestigationNoteBean;
import com.cybershield.model.UserBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * ResolveComplaintServlet:
 * Concludes the case investigation and dispatches the official resolution result to the citizen
 */
@WebServlet(name = "ResolveComplaintServlet", urlPatterns = {"/portal/resolve-complaint"})
public class ResolveComplaintServlet extends HttpServlet {

    private ComplaintDAO complaintDAO;
    private InvestigationDAO investigationDAO;

    @Override
    public void init() throws ServletException {
        this.complaintDAO = new ComplaintDAO();
        this.investigationDAO = new InvestigationDAO();
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
        String verdict = request.getParameter("resolutionVerdict");
        String summary = request.getParameter("resolutionSummary");
        String actions = request.getParameter("actionsTakenSummary");
        String guidance = request.getParameter("citizenGuidance");
        String badge = request.getParameter("resolutionBadge");

        if (complaintIdStr != null && verdict != null && summary != null) {
            try {
                Long complaintId = Long.parseLong(complaintIdStr.trim());

                boolean resolved = complaintDAO.resolveComplaint(
                        complaintId,
                        verdict.trim(),
                        summary.trim(),
                        actions != null ? actions.trim() : "",
                        guidance != null ? guidance.trim() : "",
                        badge != null ? badge.trim() : "VERIFIED_RESOLVED"
                );

                if (resolved) {
                    // Log formal concluding note
                    InvestigationNoteBean closingNote = new InvestigationNoteBean();
                    closingNote.setComplaintId(complaintId);
                    closingNote.setInvestigatorId(user.getId());
                    closingNote.setNote("OFFICIAL RESOLUTION DISPATCHED TO CITIZEN\nVerdict: " + verdict.trim());
                    closingNote.setFinding(summary.trim());
                    closingNote.setActionTaken(actions != null ? actions.trim() : "");
                    closingNote.setRecommendation(guidance != null ? guidance.trim() : "");
                    investigationDAO.addNote(closingNote);

                    response.sendRedirect(request.getContextPath() + "/portal/investigator?id=" + complaintId + "&resolved=true");
                    return;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect(request.getContextPath() + "/portal/investigator?error=resolution_failed");
    }
}
