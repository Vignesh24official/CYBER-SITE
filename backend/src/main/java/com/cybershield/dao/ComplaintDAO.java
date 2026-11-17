package com.cybershield.dao;

import com.cybershield.model.ComplaintBean;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Complaint Data Access Object demonstrating full CRUD operations via JDBC
 */
public class ComplaintDAO {

    /**
     * 1. CREATE OPERATION
     * Insert a new cyber complaint submitted by citizen
     */
    public boolean createComplaint(ComplaintBean c) {
        String insertSql = "INSERT INTO complaints (" +
                "public_id, complaint_number, user_id, title, description, category, threat_type, " +
                "severity, status, incident_date, location, financial_loss, currency, " +
                "suspicious_url, attacker_information, additional_information" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?, ?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();

            String publicId = UUID.randomUUID().toString();
            String compNumber = "CS-" + (System.currentTimeMillis() % 1000000);

            ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, publicId);
            ps.setString(2, compNumber);
            ps.setLong(3, c.getUserId());
            ps.setString(4, c.getTitle());
            ps.setString(5, c.getDescription());
            ps.setString(6, c.getCategory());
            ps.setString(7, c.getThreatType());
            ps.setString(8, c.getSeverity() != null ? c.getSeverity() : "MEDIUM");
            ps.setTimestamp(9, Timestamp.valueOf(c.getIncidentDate() != null ? c.getIncidentDate() : LocalDateTime.now()));
            ps.setString(10, c.getLocation());
            ps.setBigDecimal(11, c.getFinancialLoss() != null ? c.getFinancialLoss() : BigDecimal.ZERO);
            ps.setString(12, c.getCurrency() != null ? c.getCurrency() : "INR");
            ps.setString(13, c.getSuspiciousUrl());
            ps.setString(14, c.getAttackerInformation());
            ps.setString(15, c.getAdditionalInformation());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                rs = ps.getGeneratedKeys();
                if (rs.next()) {
                    c.setId(rs.getLong(1));
                }
                c.setPublicId(publicId);
                c.setComplaintNumber(compNumber);
                c.setStatus("SUBMITTED");
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return false;
    }

    /**
     * 2. READ OPERATION: Get all complaints for Admin SOC dashboard
     */
    public List<ComplaintBean> getAllComplaints() {
        List<ComplaintBean> list = new ArrayList<>();
        String sql = "SELECT c.*, u.full_name AS reporter_name, u.email AS reporter_email, " +
                     "inv.id AS inv_id, inv.full_name AS inv_name, inv.email AS inv_email " +
                     "FROM complaints c " +
                     "JOIN users u ON c.user_id = u.id " +
                     "LEFT JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.assignment_status = 'ACTIVE' " +
                     "LEFT JOIN users inv ON ca.investigator_id = inv.id " +
                     "ORDER BY c.created_at DESC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                list.add(mapResultSetToBean(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
        return list;
    }

    /**
     * 2. READ OPERATION: Get complaints filed by a specific citizen
     */
    public List<ComplaintBean> getComplaintsByUserId(Long userId) {
        List<ComplaintBean> list = new ArrayList<>();
        String sql = "SELECT c.*, u.full_name AS reporter_name, u.email AS reporter_email, " +
                     "inv.id AS inv_id, inv.full_name AS inv_name, inv.email AS inv_email " +
                     "FROM complaints c " +
                     "JOIN users u ON c.user_id = u.id " +
                     "LEFT JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.assignment_status = 'ACTIVE' " +
                     "LEFT JOIN users inv ON ca.investigator_id = inv.id " +
                     "WHERE c.user_id = ? " +
                     "ORDER BY c.created_at DESC";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, userId);
            rs = ps.executeQuery();

            while (rs.next()) {
                list.add(mapResultSetToBean(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return list;
    }

    /**
     * 2. READ OPERATION: Get cases assigned to an investigator
     */
    public List<ComplaintBean> getComplaintsByInvestigatorId(Long investigatorId) {
        List<ComplaintBean> list = new ArrayList<>();
        String sql = "SELECT c.*, u.full_name AS reporter_name, u.email AS reporter_email, " +
                     "inv.id AS inv_id, inv.full_name AS inv_name, inv.email AS inv_email " +
                     "FROM complaints c " +
                     "JOIN users u ON c.user_id = u.id " +
                     "JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.assignment_status = 'ACTIVE' " +
                     "JOIN users inv ON ca.investigator_id = inv.id " +
                     "WHERE ca.investigator_id = ? " +
                     "ORDER BY c.created_at DESC";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, investigatorId);
            rs = ps.executeQuery();

            while (rs.next()) {
                list.add(mapResultSetToBean(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return list;
    }

    /**
     * 2. READ OPERATION: Get single complaint details by ID or Public ID
     */
    public ComplaintBean getComplaintById(Long id) {
        String sql = "SELECT c.*, u.full_name AS reporter_name, u.email AS reporter_email, " +
                     "inv.id AS inv_id, inv.full_name AS inv_name, inv.email AS inv_email " +
                     "FROM complaints c " +
                     "JOIN users u ON c.user_id = u.id " +
                     "LEFT JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.assignment_status = 'ACTIVE' " +
                     "LEFT JOIN users inv ON ca.investigator_id = inv.id " +
                     "WHERE c.id = ?";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, id);
            rs = ps.executeQuery();

            if (rs.next()) {
                return mapResultSetToBean(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return null;
    }

    public ComplaintBean getComplaintByPublicId(String publicId) {
        String sql = "SELECT c.*, u.full_name AS reporter_name, u.email AS reporter_email, " +
                     "inv.id AS inv_id, inv.full_name AS inv_name, inv.email AS inv_email " +
                     "FROM complaints c " +
                     "JOIN users u ON c.user_id = u.id " +
                     "LEFT JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.assignment_status = 'ACTIVE' " +
                     "LEFT JOIN users inv ON ca.investigator_id = inv.id " +
                     "WHERE c.public_id = ? OR c.complaint_number = ?";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, publicId);
            ps.setString(2, publicId);
            rs = ps.executeQuery();

            if (rs.next()) {
                return mapResultSetToBean(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return null;
    }

    /**
     * 3. UPDATE OPERATION: Admin assigns complaint to investigator
     */
    public boolean assignInvestigator(Long complaintId, Long investigatorId, Long adminId) {
        String updateComplaintSql = "UPDATE complaints SET status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        String deactiveOldSql = "UPDATE complaint_assignments SET assignment_status = 'REASSIGNED', unassigned_at = CURRENT_TIMESTAMP WHERE complaint_id = ? AND assignment_status = 'ACTIVE'";
        String insertAssignSql = "INSERT INTO complaint_assignments (complaint_id, investigator_id, assigned_by, assignment_status) VALUES (?, ?, ?, 'ACTIVE')";

        Connection conn = null;
        PreparedStatement ps1 = null;
        PreparedStatement ps2 = null;
        PreparedStatement ps3 = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            ps1 = conn.prepareStatement(updateComplaintSql);
            ps1.setLong(1, complaintId);
            ps1.executeUpdate();

            ps2 = conn.prepareStatement(deactiveOldSql);
            ps2.setLong(1, complaintId);
            ps2.executeUpdate();

            ps3 = conn.prepareStatement(insertAssignSql);
            ps3.setLong(1, complaintId);
            ps3.setLong(2, investigatorId);
            ps3.setLong(3, adminId != null ? adminId : 1L);
            ps3.executeUpdate();

            conn.commit();
            return true;
        } catch (Exception e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(null, ps1);
            DBConnection.close(null, ps2);
            DBConnection.close(conn, ps3);
        }
    }

    /**
     * 3. UPDATE OPERATION: Update case status (e.g. UNDER_INVESTIGATION)
     */
    public boolean updateStatus(Long complaintId, String newStatus) {
        String sql = "UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, newStatus);
            ps.setLong(2, complaintId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(conn, ps);
        }
    }

    /**
     * 3. UPDATE OPERATION: Conclude investigation and dispatch resolution to citizen
     */
    public boolean resolveComplaint(Long complaintId, String verdict, String summary, String actions, String guidance, String badge) {
        String sql = "UPDATE complaints SET status = 'RESOLVED', resolution_verdict = ?, resolution_summary = ?, " +
                     "actions_taken_summary = ?, citizen_guidance = ?, resolution_badge = ?, resolved_at = CURRENT_TIMESTAMP, " +
                     "updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, verdict);
            ps.setString(2, summary);
            ps.setString(3, actions);
            ps.setString(4, guidance);
            ps.setString(5, badge != null ? badge : "VERIFIED_RESOLVED");
            ps.setLong(6, complaintId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(conn, ps);
        }
    }

    /**
     * 4. DELETE OPERATION: Delete or dismiss complaint
     */
    public boolean deleteComplaint(Long complaintId) {
        String sql = "DELETE FROM complaints WHERE id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, complaintId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(conn, ps);
        }
    }

    private ComplaintBean mapResultSetToBean(ResultSet rs) throws SQLException {
        ComplaintBean c = new ComplaintBean();
        c.setId(rs.getLong("id"));
        c.setPublicId(rs.getString("public_id"));
        c.setComplaintNumber(rs.getString("complaint_number"));
        c.setUserId(rs.getLong("user_id"));
        c.setReporterName(rs.getString("reporter_name"));
        c.setReporterEmail(rs.getString("reporter_email"));
        c.setTitle(rs.getString("title"));
        c.setDescription(rs.getString("description"));
        c.setCategory(rs.getString("category"));
        c.setThreatType(rs.getString("threat_type"));
        c.setSeverity(rs.getString("severity"));
        c.setStatus(rs.getString("status"));

        Timestamp incDate = rs.getTimestamp("incident_date");
        if (incDate != null) c.setIncidentDate(incDate.toLocalDateTime());

        Timestamp repDate = rs.getTimestamp("reported_at");
        if (repDate != null) c.setReportedAt(repDate.toLocalDateTime());

        c.setLocation(rs.getString("location"));
        c.setFinancialLoss(rs.getBigDecimal("financial_loss"));
        c.setCurrency(rs.getString("currency"));
        c.setSuspiciousUrl(rs.getString("suspicious_url"));
        c.setAttackerInformation(rs.getString("attacker_information"));
        c.setAdditionalInformation(rs.getString("additional_information"));

        // Investigator details if assigned
        long invId = rs.getLong("inv_id");
        if (!rs.wasNull()) {
            c.setAssignedInvestigatorId(invId);
            c.setAssignedInvestigatorName(rs.getString("inv_name"));
            c.setAssignedInvestigatorEmail(rs.getString("inv_email"));
        } else {
            c.setAssignedInvestigatorName("Unassigned");
        }

        // Resolution fields
        c.setResolutionVerdict(rs.getString("resolution_verdict"));
        c.setResolutionSummary(rs.getString("resolution_summary"));
        c.setActionsTakenSummary(rs.getString("actions_taken_summary"));
        c.setCitizenGuidance(rs.getString("citizen_guidance"));
        c.setResolutionBadge(rs.getString("resolution_badge"));

        Timestamp resDate = rs.getTimestamp("resolved_at");
        if (resDate != null) c.setResolvedAt(resDate.toLocalDateTime());

        return c;
    }
}
