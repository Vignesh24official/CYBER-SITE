package com.cybershield.util;

import com.cybershield.exception.FileUploadException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Slf4j
public class FileStorageUtil {

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "png", "jpg", "jpeg", "txt", "csv");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf", "image/png", "image/jpeg", "image/pjpeg", "text/plain", "text/csv", "application/vnd.ms-excel"
    );

    public static void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Uploaded file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new FileUploadException("Invalid filename");
        }

        String extension = FilenameUtils.getExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new FileUploadException("File extension ." + extension + " is not allowed. Allowed: " + ALLOWED_EXTENSIONS);
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            log.warn("MIME type {} checked for filename {}", contentType, originalFilename);
        }
    }

    public static StoredFileInfo storeFile(MultipartFile file, String uploadDirectory) {
        validateFile(file);

        try {
            Path targetLocation = Paths.get(uploadDirectory).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);

            String originalFilename = FilenameUtils.getName(file.getOriginalFilename());
            String extension = FilenameUtils.getExtension(originalFilename).toLowerCase();
            String storedFilename = UUID.randomUUID().toString() + (extension.isEmpty() ? "" : "." + extension);

            Path filePath = targetLocation.resolve(storedFilename);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            try (InputStream is = file.getInputStream();
                 DigestInputStream dis = new DigestInputStream(is, md)) {
                Files.copy(dis, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            String checksum = HexFormat.of().formatHex(md.digest());

            return new StoredFileInfo(originalFilename, storedFilename, file.getContentType(), file.getSize(), filePath.toString(), checksum);
        } catch (Exception ex) {
            throw new FileUploadException("Failed to store uploaded file: " + ex.getMessage(), ex);
        }
    }

    public record StoredFileInfo(
            String originalFilename,
            String storedFilename,
            String mimeType,
            long fileSize,
            String storagePath,
            String checksum
    ) {}
}
