package com.cybershield.service.impl;

import com.cybershield.dto.complaint.ComplaintResponse;
import com.cybershield.entity.Complaint;
import com.cybershield.entity.EvidenceFile;
import com.cybershield.entity.User;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.FileUploadException;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.exception.UnauthorizedAccessException;
import com.cybershield.repository.ComplaintRepository;
import com.cybershield.repository.EvidenceFileRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.EvidenceService;
import com.cybershield.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvidenceServiceImpl implements EvidenceService {

    private final EvidenceFileRepository evidenceFileRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Value("${cybershield.storage.upload-dir:./uploads/evidence}")
    private String uploadDir;

    @Override
    @Transactional
    public ComplaintResponse.EvidenceFileResponse uploadEvidence(String complaintPublicId, MultipartFile file) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(complaintPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        verifyAccessToComplaint(user, complaint);

        FileStorageUtil.StoredFileInfo fileInfo = FileStorageUtil.storeFile(file, uploadDir);

        EvidenceFile evidenceFile = EvidenceFile.builder()
                .complaint(complaint)
                .uploadedBy(user)
                .originalFilename(fileInfo.originalFilename())
                .storedFilename(fileInfo.storedFilename())
                .mimeType(fileInfo.mimeType() != null ? fileInfo.mimeType() : "application/octet-stream")
                .fileSize(fileInfo.fileSize())
                .storagePath(fileInfo.storagePath())
                .checksum(fileInfo.checksum())
                .build();

        EvidenceFile savedFile = evidenceFileRepository.save(evidenceFile);

        auditLogService.logAction(
                user, AuditAction.UPLOAD_EVIDENCE, "EVIDENCE", savedFile.getId().toString(),
                "Uploaded evidence file: " + savedFile.getOriginalFilename() + " for complaint " + complaint.getComplaintNumber()
        );

        return ComplaintResponse.EvidenceFileResponse.builder()
                .id(savedFile.getId().toString())
                .originalFilename(savedFile.getOriginalFilename())
                .mimeType(savedFile.getMimeType())
                .fileSize(savedFile.getFileSize())
                .checksum(savedFile.getChecksum())
                .createdAt(savedFile.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadEvidenceAsResource(Long evidenceId) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EvidenceFile evidenceFile = evidenceFileRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence file not found with ID: " + evidenceId));

        verifyAccessToComplaint(user, evidenceFile.getComplaint());

        try {
            Path filePath = Paths.get(evidenceFile.getStoragePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                auditLogService.logAction(
                        user, AuditAction.DOWNLOAD_EVIDENCE, "EVIDENCE", evidenceFile.getId().toString(),
                        "Downloaded evidence file: " + evidenceFile.getOriginalFilename()
                );
                return resource;
            } else {
                throw new FileUploadException("Could not read stored evidence file");
            }
        } catch (IOException ex) {
            throw new FileUploadException("Error retrieving evidence file", ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public EvidenceFile getEvidenceMetadata(Long evidenceId) {
        return evidenceFileRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence file not found with ID: " + evidenceId));
    }

    @Override
    @Transactional
    public void deleteEvidence(Long evidenceId) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EvidenceFile evidenceFile = evidenceFileRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence file not found with ID: " + evidenceId));

        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isUploader = evidenceFile.getUploadedBy().getId().equals(user.getId());

        if (!isAdmin && !isUploader) {
            throw new UnauthorizedAccessException("You are not authorized to delete this evidence file");
        }

        try {
            Path filePath = Paths.get(evidenceFile.getStoragePath());
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.warn("Failed to delete physical file: {}", evidenceFile.getStoragePath());
        }

        evidenceFileRepository.delete(evidenceFile);

        auditLogService.logAction(
                user, AuditAction.ADMIN_ACTION, "EVIDENCE", evidenceId.toString(),
                "Deleted evidence file: " + evidenceFile.getOriginalFilename()
        );
    }

    private void verifyAccessToComplaint(User user, Complaint complaint) {
        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isOwner = complaint.getUser().getId().equals(user.getId());
        boolean isInvestigator = user.getRole().getName() == RoleName.ROLE_INVESTIGATOR;

        if (!isAdmin && !isOwner && !isInvestigator) {
            throw new UnauthorizedAccessException("Access denied to complaint evidence");
        }
    }
}
