package com.cybershield.dao;

import com.cybershield.model.ChatMessageBean;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Case Chat Communication DAO using JDBC
 */
public class ChatDAO {

    public boolean sendMessage(ChatMessageBean msg) {
        String sql = "INSERT INTO case_messages (complaint_id, sender_id, message, sender_role, attachment_name, attachment_data, is_read) " +
                     "VALUES (?, ?, ?, ?, ?, ?, false)";

        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, msg.getComplaintId());
            ps.setLong(2, msg.getSenderId());
            ps.setString(3, msg.getMessage());
            ps.setString(4, msg.getSenderRole());
            ps.setString(5, msg.getAttachmentName());
            ps.setString(6, msg.getAttachmentData());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(conn, ps);
        }
    }

    public List<ChatMessageBean> getMessagesByComplaintId(Long complaintId) {
        List<ChatMessageBean> list = new ArrayList<>();
        String sql = "SELECT m.*, u.full_name AS sender_name " +
                     "FROM case_messages m " +
                     "JOIN users u ON m.sender_id = u.id " +
                     "WHERE m.complaint_id = ? " +
                     "ORDER BY m.created_at ASC";

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setLong(1, complaintId);
            rs = ps.executeQuery();

            while (rs.next()) {
                ChatMessageBean b = new ChatMessageBean();
                b.setId(rs.getLong("id"));
                b.setComplaintId(rs.getLong("complaint_id"));
                b.setSenderId(rs.getLong("sender_id"));
                b.setSenderName(rs.getString("sender_name"));
                b.setSenderRole(rs.getString("sender_role"));
                b.setMessage(rs.getString("message"));
                b.setAttachmentName(rs.getString("attachment_name"));
                b.setAttachmentData(rs.getString("attachment_data"));
                b.setIsRead(rs.getBoolean("is_read"));

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
