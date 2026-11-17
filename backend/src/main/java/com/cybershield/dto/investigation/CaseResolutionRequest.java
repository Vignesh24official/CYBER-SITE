package com.cybershield.dto.investigation;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseResolutionRequest {

    @NotBlank(message = "Resolution verdict is required")
    private String resolutionVerdict;

    @NotBlank(message = "Resolution summary is required")
    private String resolutionSummary;

    private String actionsTakenSummary;

    private String citizenGuidance;

    private String resolutionBadge;
}
