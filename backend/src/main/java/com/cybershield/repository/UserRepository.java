package com.cybershield.repository;

import com.cybershield.entity.User;
import com.cybershield.enums.RoleName;
import com.cybershield.enums.AccountStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPublicId(String publicId);
    boolean existsByEmail(String email);
    List<User> findByRole_Name(RoleName roleName);
    List<User> findByRole_NameIn(List<RoleName> roleNames);
    Page<User> findByRole_Name(RoleName roleName, Pageable pageable);
    long countByRole_Name(RoleName roleName);
    long countByAccountStatus(AccountStatus status);
}
