package com.cybershield.servlet;

import com.cybershield.dao.UserDAO;
import com.cybershield.model.UserBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * LoginServlet demonstrating GET and POST handling with Session Management
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/portal/login"})
public class LoginServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        this.userDAO = new UserDAO();
    }

    /**
     * GET Request: Show Login Form
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String role = request.getParameter("role");
        if (role == null) role = "citizen";
        request.setAttribute("selectedRole", role);
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
    }

    /**
     * POST Request: Process Authentication and Role Clearance Code
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String role = request.getParameter("role");
        String secretCode = request.getParameter("secretCode");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            request.setAttribute("error", "Email and Password are required.");
            request.setAttribute("selectedRole", role);
            request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
            return;
        }

        // Validate clearance codes: MAIN for Admin, SUB for Investigator
        if ("admin".equalsIgnoreCase(role) || email.toLowerCase().contains("admin")) {
            if (secretCode == null || !"MAIN".equalsIgnoreCase(secretCode.trim())) {
                request.setAttribute("error", "ACCESS DENIED: Invalid Admin security code! Code 'MAIN' required.");
                request.setAttribute("selectedRole", "admin");
                request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
                return;
            }
        } else if ("investigator".equalsIgnoreCase(role) || email.toLowerCase().contains("investigator") || email.toLowerCase().contains("coordinator")) {
            if (secretCode == null || !"SUB".equalsIgnoreCase(secretCode.trim())) {
                request.setAttribute("error", "ACCESS DENIED: Invalid Investigator security code! Code 'SUB' required.");
                request.setAttribute("selectedRole", "investigator");
                request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
                return;
            }
        }

        UserBean user = userDAO.authenticate(email, password);

        if (user != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);

            String userRole = user.getRole();
            if ("ROLE_ADMIN".equalsIgnoreCase(userRole)) {
                response.sendRedirect(request.getContextPath() + "/portal/admin");
            } else if ("ROLE_INVESTIGATOR".equalsIgnoreCase(userRole) || "ROLE_COORDINATOR".equalsIgnoreCase(userRole)) {
                response.sendRedirect(request.getContextPath() + "/portal/investigator");
            } else {
                response.sendRedirect(request.getContextPath() + "/portal/complaints");
            }
        } else {
            request.setAttribute("error", "Invalid credentials. Use demo password 'Password@123'.");
            request.setAttribute("selectedRole", role);
            request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
        }
    }
}
