package com.cybershield.servlet;

import com.cybershield.dao.ComplaintDAO;
import com.cybershield.model.UserBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * DeleteComplaintServlet: Demonstrates DELETE CRUD operation in Java Servlets & JDBC
 */
@WebServlet(name = "DeleteComplaintServlet", urlPatterns = {"/portal/delete-complaint"})
public class DeleteComplaintServlet extends HttpServlet {

    private ComplaintDAO complaintDAO;

    @Override
    public void init() throws ServletException {
        this.complaintDAO = new ComplaintDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
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

        String idStr = request.getParameter("id");
        if (idStr != null) {
            try {
                Long complaintId = Long.parseLong(idStr.trim());
                complaintDAO.deleteComplaint(complaintId);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            response.sendRedirect(request.getContextPath() + "/portal/admin?deleted=true");
        } else {
            response.sendRedirect(request.getContextPath() + "/portal/complaints?deleted=true");
        }
    }
}
