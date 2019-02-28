package org.jhipster.health.service.impl;

import org.jhipster.health.service.PreferenceService;
import org.jhipster.health.domain.Preference;
import org.jhipster.health.repository.PreferenceRepository;
import org.jhipster.health.repository.search.PreferenceSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Preference.
 */
@Service
@Transactional
public class PreferenceServiceImpl implements PreferenceService {

    private final Logger log = LoggerFactory.getLogger(PreferenceServiceImpl.class);

    private final PreferenceRepository preferenceRepository;

    private final PreferenceSearchRepository preferenceSearchRepository;

    public PreferenceServiceImpl(PreferenceRepository preferenceRepository, PreferenceSearchRepository preferenceSearchRepository) {
        this.preferenceRepository = preferenceRepository;
        this.preferenceSearchRepository = preferenceSearchRepository;
    }

    /**
     * Save a preference.
     *
     * @param preference the entity to save
     * @return the persisted entity
     */
    @Override
    public Preference save(Preference preference) {
        log.debug("Request to save Preference : {}", preference);
        Preference result = preferenceRepository.save(preference);
        preferenceSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the preferences.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Preference> findAll() {
        log.debug("Request to get all Preferences");
        return preferenceRepository.findAll();
    }


    /**
     * Get one preference by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Preference> findOne(Long id) {
        log.debug("Request to get Preference : {}", id);
        return preferenceRepository.findById(id);
    }

    /**
     * Delete the preference by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Preference : {}", id);
        preferenceRepository.deleteById(id);
        preferenceSearchRepository.deleteById(id);
    }

    /**
     * Search for the preference corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Preference> search(String query) {
        log.debug("Request to search Preferences for query {}", query);
        return StreamSupport
            .stream(preferenceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
