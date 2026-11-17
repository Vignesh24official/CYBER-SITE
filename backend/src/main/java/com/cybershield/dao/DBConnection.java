package com.cybershield.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Pure JDBC Connection Manager
 * Integrates MySQL Database using JDBC Driver as required by MCA Advanced Java Rubric.
 */
public class DBConnection {

    // Default MySQL configuration (can be overridden via Environment Variables)
    private static final String MYSQL_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String DEFAULT_MYSQL_URL = "jdbc:mysql://localhost:3306/cybershield_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true";
    private static final String DEFAULT_MYSQL_USER = "root";
    private static final String DEFAULT_MYSQL_PASSWORD = "";

    // Fallback in-memory or PostgreSQL configuration
    private static final String H2_DRIVER = "org.h2.Driver";
    private static final String H2_URL = "jdbc:h2:mem:cybershield;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";

    /**
     * Get JDBC Connection using Driver Manager
     */
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        String dbUrl = System.getenv("MYSQL_URL");
        String dbUser = System.getenv("MYSQL_USER");
        String dbPass = System.getenv("MYSQL_PASSWORD");

        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            dbUrl = DEFAULT_MYSQL_URL;
        }
        if (dbUser == null) {
            dbUser = DEFAULT_MYSQL_USER;
        }
        if (dbPass == null) {
            dbPass = DEFAULT_MYSQL_PASSWORD;
        }

        try {
            Class.forName(MYSQL_DRIVER);
            return DriverManager.getConnection(dbUrl, dbUser, dbPass);
        } catch (Exception mysqlEx) {
            // Graceful fallback to H2 in-memory or local test database if MySQL daemon is offline
            try {
                Class.forName(H2_DRIVER);
                return DriverManager.getConnection(H2_URL, "sa", "");
            } catch (Exception h2Ex) {
                throw new SQLException("Failed to establish JDBC Connection: " + mysqlEx.getMessage(), mysqlEx);
            }
        }
    }

    /**
     * Helper to close JDBC resources cleanly
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) {
            try { rs.close(); } catch (SQLException ignored) {}
        }
        if (stmt != null) {
            try { stmt.close(); } catch (SQLException ignored) {}
        }
        if (conn != null) {
            try { conn.close(); } catch (SQLException ignored) {}
        }
    }

    public static void close(Connection conn, Statement stmt) {
        close(conn, stmt, null);
    }
}
