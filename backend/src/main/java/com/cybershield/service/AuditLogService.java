package com.cybershield.service;

import com.cybershield.entity.User;
import com.cybershield.enums.AuditAction;

public interface AuditLogService {
    void logAction(User actor, AuditAction action, String entityType, String entityId, String description, String ipAddress, String userAgent);
    void logAction(User actor, AuditAction action, String entityType, String entityId, String description);
}
