package org.jhipster.health.repository;

import org.jhipster.health.domain.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Preference entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    @Query("select preferences from Preference preferences where preferences.user.login = ?#{principal.username}")
    List<Preference> findByUserIsCurrentUser();

    Optional<Preference> findOneByUserLogin(String login);

}
