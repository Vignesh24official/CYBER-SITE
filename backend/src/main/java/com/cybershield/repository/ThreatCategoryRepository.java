package com.cybershield.repository;

import com.cybershield.entity.ThreatCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreatCategoryRepository extends JpaRepository<ThreatCategory, Long> {
    Optional<ThreatCategory> findByName(String name);
    List<ThreatCategory> findByActiveTrue();
}
