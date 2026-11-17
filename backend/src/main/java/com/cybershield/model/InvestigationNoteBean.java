package com.cybershield.model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class InvestigationNoteBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long complaintId;
    private Long investigatorId;
    private String investigatorName;
    private String note;
    private String finding;
    private String actionTaken;
    private String recommendation;
    private LocalDateTime createdAt;

    public InvestigationNoteBean() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public Long getInvestigatorId() { return investigatorId; }
    public void setInvestigatorId(Long investigatorId) { this.investigatorId = investigatorId; }

    public String getInvestigatorName() { return investigatorName; }
    public void setInvestigatorName(String investigatorName) { this.investigatorName = investigatorName; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getFinding() { return finding; }
    public void setFinding(String finding) { this.finding = finding; }

    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
