package com.cybershield.controller;

import com.cybershield.dto.chat.CaseMessageRequest;
import com.cybershield.dto.chat.CaseMessageResponse;
import com.cybershield.dto.common.ApiResponse;
import com.cybershield.service.CaseMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/complaints/{publicId}/chat")
@RequiredArgsConstructor
@Tag(name = "Case Chat API", description = "Secure real-time communication channel between citizen and assigned cyber investigator")
public class CaseChatController {

    private final CaseMessageService caseMessageService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get secure communication messages for a specific case")
    public ResponseEntity<ApiResponse<List<CaseMessageResponse>>> getMessages(@PathVariable String publicId) {
        List<CaseMessageResponse> messages = caseMessageService.getMessages(publicId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Send a message in the secure case chat room")
    public ResponseEntity<ApiResponse<CaseMessageResponse>> sendMessage(
            @PathVariable String publicId,
            @Valid @RequestBody CaseMessageRequest request
    ) {
        CaseMessageResponse response = caseMessageService.sendMessage(publicId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Message sent successfully"));
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread message count for a case")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable String publicId) {
        long count = caseMessageService.getUnreadCount(publicId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("unreadCount", count)));
    }
}
