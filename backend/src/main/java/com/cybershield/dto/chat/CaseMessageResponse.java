package com.cybershield.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseMessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private String senderRole;
    private String message;
    private String attachmentName;
    private String attachmentData;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
