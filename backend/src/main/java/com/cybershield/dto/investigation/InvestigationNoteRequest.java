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
public class InvestigationNoteRequest {

    @NotBlank(message = "Note content is required")
    private String note;

    private String finding;

    private String actionTaken;

    private String recommendation;
}
