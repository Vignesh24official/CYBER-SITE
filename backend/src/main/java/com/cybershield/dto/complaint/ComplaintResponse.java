package com.cybershield.dto.complaint;

import com.cybershield.dto.user.UserDto;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {

    private String publicId;
    private String complaintNumber;
    private UserDto reporter;
    private String title;
    private String description;
    private String category;
    private String threatType;
    private ThreatSeverity severity;
    private ComplaintStatus status;
    private LocalDateTime incidentDate;
    private LocalDateTime reportedAt;
    private String location;
    private BigDecimal financialLoss;
    private String currency;
    private String suspiciousUrl;
    private String attackerInformation;
    private String additionalInformation;
    private String userResponse;
    private LocalDateTime responseProvidedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    private UserDto assignedInvestigator;
    private List<StatusHistoryResponse> statusHistory;
    private List<EvidenceFileResponse> evidenceFiles;
    private List<InvestigationNoteResponse> investigationNotes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusHistoryResponse {
        private ComplaintStatus oldStatus;
        private ComplaintStatus newStatus;
        private String changedByName;
        private String reason;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvidenceFileResponse {
        private String id;
        private String originalFilename;
        private String mimeType;
        private Long fileSize;
        private String checksum;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvestigationNoteResponse {
        private Long id;
        private String investigatorName;
        private String note;
        private String finding;
        private String actionTaken;
        private String recommendation;
        private LocalDateTime createdAt;
    }
}
