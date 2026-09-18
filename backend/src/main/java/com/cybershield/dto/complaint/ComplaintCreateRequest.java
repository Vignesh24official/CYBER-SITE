package com.cybershield.dto.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ComplaintCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters long")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Threat type is required")
    private String threatType;

    @NotNull(message = "Incident date is required")
    private LocalDateTime incidentDate;

    private String location;

    private BigDecimal financialLoss;

    private String currency;

    private String suspiciousUrl;

    private String attackerInformation;

    private String additionalInformation;
}
