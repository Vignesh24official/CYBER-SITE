package com.cybershield.repository;

import com.cybershield.entity.ThreatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatTypeRepository extends JpaRepository<ThreatType, Long> {
    List<ThreatType> findByCategoryIdAndActiveTrue(Long categoryId);
    List<ThreatType> findByActiveTrue();
}

