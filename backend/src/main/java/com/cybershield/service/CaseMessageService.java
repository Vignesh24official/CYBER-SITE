package com.cybershield.service;

import com.cybershield.dto.chat.CaseMessageRequest;
import com.cybershield.dto.chat.CaseMessageResponse;

import java.util.List;

public interface CaseMessageService {
    List<CaseMessageResponse> getMessages(String complaintPublicId);
    CaseMessageResponse sendMessage(String complaintPublicId, CaseMessageRequest request);
    long getUnreadCount(String complaintPublicId);
}
