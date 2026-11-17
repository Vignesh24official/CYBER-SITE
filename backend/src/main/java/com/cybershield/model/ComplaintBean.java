package com.cybershield.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ComplaintBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String publicId;
    private String complaintNumber;
    private Long userId;
    private String reporterName;
    private String reporterEmail;
    private String title;
    private String description;
    private String category;
    private String threatType;
    private String severity;
    private String status;
    private LocalDateTime incidentDate;
    private LocalDateTime reportedAt;
    private String location;
    private BigDecimal financialLoss;
    private String currency;
    private String suspiciousUrl;
    private String attackerInformation;
    private String additionalInformation;
    private Long assignedInvestigatorId;
    private String assignedInvestigatorName;
    private String assignedInvestigatorEmail;

    // Official Resolution Fields
    private String resolutionVerdict;
    private String resolutionSummary;
    private String actionsTakenSummary;
    private String citizenGuidance;
    private String resolutionBadge;
    private LocalDateTime resolvedAt;

    public ComplaintBean() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getThreatType() { return threatType; }
    public void setThreatType(String threatType) { this.threatType = threatType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getFinancialLoss() { return financialLoss; }
    public void setFinancialLoss(BigDecimal financialLoss) { this.financialLoss = financialLoss; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getSuspiciousUrl() { return suspiciousUrl; }
    public void setSuspiciousUrl(String suspiciousUrl) { this.suspiciousUrl = suspiciousUrl; }

    public String getAttackerInformation() { return attackerInformation; }
    public void setAttackerInformation(String attackerInformation) { this.attackerInformation = attackerInformation; }

    public String getAdditionalInformation() { return additionalInformation; }
    public void setAdditionalInformation(String additionalInformation) { this.additionalInformation = additionalInformation; }

    public Long getAssignedInvestigatorId() { return assignedInvestigatorId; }
    public void setAssignedInvestigatorId(Long assignedInvestigatorId) { this.assignedInvestigatorId = assignedInvestigatorId; }

    public String getAssignedInvestigatorName() { return assignedInvestigatorName; }
    public void setAssignedInvestigatorName(String assignedInvestigatorName) { this.assignedInvestigatorName = assignedInvestigatorName; }

    public String getAssignedInvestigatorEmail() { return assignedInvestigatorEmail; }
    public void setAssignedInvestigatorEmail(String assignedInvestigatorEmail) { this.assignedInvestigatorEmail = assignedInvestigatorEmail; }

    public String getResolutionVerdict() { return resolutionVerdict; }
    public void setResolutionVerdict(String resolutionVerdict) { this.resolutionVerdict = resolutionVerdict; }

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }

    public String getActionsTakenSummary() { return actionsTakenSummary; }
    public void setActionsTakenSummary(String actionsTakenSummary) { this.actionsTakenSummary = actionsTakenSummary; }

    public String getCitizenGuidance() { return citizenGuidance; }
    public void setCitizenGuidance(String citizenGuidance) { this.citizenGuidance = citizenGuidance; }

    public String getResolutionBadge() { return resolutionBadge; }
    public void setResolutionBadge(String resolutionBadge) { this.resolutionBadge = resolutionBadge; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
