package com.cybershield.model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ChatMessageBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long complaintId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String message;
    private String attachmentName;
    private String attachmentData;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public ChatMessageBean() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }

    public String getAttachmentData() { return attachmentData; }
    public void setAttachmentData(String attachmentData) { this.attachmentData = attachmentData; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
