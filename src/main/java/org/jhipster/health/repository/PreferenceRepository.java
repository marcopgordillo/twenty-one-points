package org.jhipster.health.repository;

import org.jhipster.health.domain.Preference;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Preference entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    @Query("select preference from Preference preference where preference.login.login = ?#{principal.username}")
    List<Preference> findByLoginIsCurrentUser();

}
