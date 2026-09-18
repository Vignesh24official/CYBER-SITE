package com.cybershield.dto.complaint;

import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {

    @NotNull(message = "New status is required")
    private ComplaintStatus newStatus;

    private ThreatSeverity severity;

    private String reason;
}
