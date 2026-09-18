package com.cybershield.service;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.entity.Notification;
import com.cybershield.entity.User;
import com.cybershield.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    Notification sendNotification(User recipient, NotificationType type, String title, String message, String referenceType, String referenceId);
    PageResponse<Notification> getUserNotifications(Long userId, int page, int size);
    List<Notification> getRecentUserNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}
