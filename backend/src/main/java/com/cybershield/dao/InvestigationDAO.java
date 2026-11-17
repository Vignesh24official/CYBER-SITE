package com.cybershield.dao;

import com.cybershield.model.InvestigationNoteBean;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Investigation Note & Forensic Finding DAO using JDBC
 */
public class InvestigationDAO {

    public boolean addNote(InvestigationNoteBean note) {
        String sql = "INSERT INTO investigation_notes (complaint_id, investigator_id, note, finding, action_taken, recommendation) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, note.getComplaintId());
            ps.setLong(2, note.getInvestigatorId());
            ps.setString(3, note.getNote());
            ps.setString(4, note.getFinding());
            ps.setString(5, note.getActionTaken());
            ps.setString(6, note.getRecommendation());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(conn, ps);
        }
    }

    public List<InvestigationNoteBean> getNotesByComplaintId(Long complaintId) {
        List<InvestigationNoteBean> list = new ArrayList<>();
        String sql = "SELECT n.*, u.full_name AS investigator_name " +
                     "FROM investigation_notes n " +
                     "JOIN users u ON n.investigator_id = u.id " +
                     "WHERE n.complaint_id = ? " +
                     "ORDER BY n.created_at ASC";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, complaintId);
            rs = ps.executeQuery();

            while (rs.next()) {
                InvestigationNoteBean b = new InvestigationNoteBean();
                b.setId(rs.getLong("id"));
                b.setComplaintId(rs.getLong("complaint_id"));
                b.setInvestigatorId(rs.getLong("investigator_id"));
                b.setInvestigatorName(rs.getString("investigator_name"));
                b.setNote(rs.getString("note"));
                b.setFinding(rs.getString("finding"));
                b.setActionTaken(rs.getString("action_taken"));
                b.setRecommendation(rs.getString("recommendation"));

                Timestamp ts = rs.getTimestamp("created_at");
                if (ts != null) b.setCreatedAt(ts.toLocalDateTime());

                list.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return list;
    }
}
