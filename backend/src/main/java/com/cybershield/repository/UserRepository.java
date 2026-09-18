package com.cybershield.repository;

import com.cybershield.entity.User;
import com.cybershield.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPublicId(String publicId);
    boolean existsByEmail(String email);
    List<User> findByRole_Name(RoleName roleName);
    Page<User> findByRole_Name(RoleName roleName, Pageable pageable);
}
