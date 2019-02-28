package org.jhipster.health.service;

import org.jhipster.health.domain.Preference;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Preference.
 */
public interface PreferenceService {

    /**
     * Save a preference.
     *
     * @param preference the entity to save
     * @return the persisted entity
     */
    Preference save(Preference preference);

    /**
     * Get all the preferences.
     *
     * @return the list of entities
     */
    List<Preference> findAll();


    /**
     * Get the "id" preference.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Preference> findOne(Long id);

    /**
     * Delete the "id" preference.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the preference corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Preference> search(String query);
}
