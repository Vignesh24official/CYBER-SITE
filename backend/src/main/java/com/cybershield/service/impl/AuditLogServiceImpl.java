package com.cybershield.service.impl;

import com.cybershield.entity.AuditLog;
import com.cybershield.entity.User;
import com.cybershield.enums.AuditAction;
import com.cybershield.repository.AuditLogRepository;
import com.cybershield.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void logAction(User actor, AuditAction action, String entityType, String entityId, String description, String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .actor(actor)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .description(description)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception ex) {
            log.error("Failed to save audit log: {}", ex.getMessage(), ex);
        }
    }

    @Override
    @Transactional
    public void logAction(User actor, AuditAction action, String entityType, String entityId, String description) {
        logAction(actor, action, entityType, entityId, description, "SYSTEM", "INTERNAL");
    }
}
