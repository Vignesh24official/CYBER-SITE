package com.cybershield.servlet;

import com.cybershield.dao.ComplaintDAO;
import com.cybershield.dao.UserDAO;
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
 * AdminComplaintServlet: Demonstrates Admin Incident Triage & Investigator Assignment (UPDATE in CRUD)
 */
@WebServlet(name = "AdminComplaintServlet", urlPatterns = {"/portal/admin"})
public class AdminComplaintServlet extends HttpServlet {

    private ComplaintDAO complaintDAO;
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        this.complaintDAO = new ComplaintDAO();
        this.userDAO = new UserDAO();
    }

    /**
     * GET: Displays all complaints and available investigators for Admin SOC Triage
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null || !"ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            response.sendRedirect(request.getContextPath() + "/portal/login?role=admin");
            return;
        }

        List<ComplaintBean> complaints = complaintDAO.getAllComplaints();
        List<UserBean> investigators = userDAO.getAllInvestigators();

        request.setAttribute("complaints", complaints);
        request.setAttribute("investigators", investigators);
        request.getRequestDispatcher("/WEB-INF/views/adminDashboard.jsp").forward(request, response);
    }

    /**
     * POST: Admin assigns complaint to selected cyber investigator (UPDATE in CRUD)
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        UserBean user = session != null ? (UserBean) session.getAttribute("user") : null;

        if (user == null || !"ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            response.sendRedirect(request.getContextPath() + "/portal/login?role=admin");
            return;
        }

        String complaintIdStr = request.getParameter("complaintId");
        String investigatorIdStr = request.getParameter("investigatorId");

        if (complaintIdStr != null && investigatorIdStr != null) {
            try {
                Long complaintId = Long.parseLong(complaintIdStr.trim());
                Long investigatorId = Long.parseLong(investigatorIdStr.trim());

                boolean assigned = complaintDAO.assignInvestigator(complaintId, investigatorId, user.getId());
                if (assigned) {
                    response.sendRedirect(request.getContextPath() + "/portal/admin?assigned=true");
                    return;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect(request.getContextPath() + "/portal/admin?error=assignment_failed");
    }
}
