package com.cybershield.model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class UserBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String publicId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String accountStatus;
    private LocalDateTime createdAt;

    public UserBean() {}

    public UserBean(Long id, String publicId, String fullName, String email, String phone, String role, String accountStatus) {
        this.id = id;
        this.publicId = publicId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.accountStatus = accountStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
