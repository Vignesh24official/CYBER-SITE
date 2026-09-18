package com.cybershield.service.impl;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.entity.Notification;
import com.cybershield.entity.User;
import com.cybershield.enums.NotificationType;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.repository.NotificationRepository;
import com.cybershield.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Notification sendNotification(User recipient, NotificationType type, String title, String message, String referenceType, String referenceId) {
        Notification notification = Notification.builder()
                .user(recipient)
                .type(type)
                .title(title)
                .message(message)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Notification> getUserNotifications(Long userId, int page, int size) {
        return PageResponse.from(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getRecentUserNotifications(Long userId) {
        return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found with ID: " + notificationId);
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        LocalDateTime now = LocalDateTime.now();
        unreadNotifications.forEach(n -> {
            n.setIsRead(true);
            n.setReadAt(now);
        });
        notificationRepository.saveAll(unreadNotifications);
    }
}
