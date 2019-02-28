package org.jhipster.health.service;

import org.jhipster.health.domain.Weight;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Weight.
 */
public interface WeightService {

    /**
     * Save a weight.
     *
     * @param weight the entity to save
     * @return the persisted entity
     */
    Weight save(Weight weight);

    /**
     * Get all the weights.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Weight> findAll(Pageable pageable);


    /**
     * Get the "id" weight.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Weight> findOne(Long id);

    /**
     * Delete the "id" weight.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the weight corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Weight> search(String query, Pageable pageable);
}
