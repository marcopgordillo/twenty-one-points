package org.jhipster.health.repository;

import org.jhipster.health.domain.BloodPressure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the BloodPressure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloodPressureRepository extends JpaRepository<BloodPressure, Long> {

    @Query("select blood_pressures from BloodPressure blood_pressures where blood_pressures.user.login = ?#{principal.username} order by blood_pressures.timestamp desc")
    Page<BloodPressure> findByUserIsCurrentUser(Pageable pageable);

    List<BloodPressure> findAllByTimestampBetweenOrderByTimestampDesc(ZonedDateTime firstDate, ZonedDateTime secondDate);

    List<BloodPressure> findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(
        ZonedDateTime firstDate, ZonedDateTime secondDate, String login);

    Page<BloodPressure> findAllByOrderByTimestampDesc(Pageable pageable);
}
