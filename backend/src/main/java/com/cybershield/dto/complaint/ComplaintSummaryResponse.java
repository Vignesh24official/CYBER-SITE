package com.cybershield.dto.complaint;

import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintSummaryResponse {
    private String publicId;
    private String complaintNumber;
    private String title;
    private String category;
    private String threatType;
    private ThreatSeverity severity;
    private ComplaintStatus status;
    private BigDecimal financialLoss;
    private String currency;
    private LocalDateTime incidentDate;
    private LocalDateTime reportedAt;
    private String reporterName;
    private String assignedInvestigatorName;
}
