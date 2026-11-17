package com.cybershield.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseMessageRequest {

    @NotBlank(message = "Message text is required")
    private String message;

    private String attachmentName;
    private String attachmentData;
}
