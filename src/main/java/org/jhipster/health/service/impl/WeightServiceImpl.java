package org.jhipster.health.service.impl;

import org.jhipster.health.domain.Weight;
import org.jhipster.health.repository.WeightRepository;
import org.jhipster.health.repository.search.WeightSearchRepository;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.service.WeightService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Weight.
 */
@Service
@Transactional
public class WeightServiceImpl implements WeightService {

    private final Logger log = LoggerFactory.getLogger(WeightServiceImpl.class);

    private final WeightRepository weightRepository;

    private final WeightSearchRepository weightSearchRepository;

    public WeightServiceImpl(WeightRepository weightRepository, WeightSearchRepository weightSearchRepository) {
        this.weightRepository = weightRepository;
        this.weightSearchRepository = weightSearchRepository;
    }

    /**
     * Save a weight.
     *
     * @param weight the entity to save
     * @return the persisted entity
     */
    @Override
    public Weight save(Weight weight) {
        log.debug("Request to save Weight : {}", weight);
        Weight result = weightRepository.save(weight);
        weightSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the weights.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Weight> findAll(Pageable pageable) {
        log.debug("Request to get all Weights");
        return weightRepository.findAll(pageable);
    }


    /**
     * Get one weight by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Weight> findOne(Long id) {
        log.debug("Request to get Weight : {}", id);
        return weightRepository.findById(id);
    }

    /**
     * Delete the weight by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Weight : {}", id);
        weightRepository.deleteById(id);
        weightSearchRepository.deleteById(id);
    }

    /**
     * Search for the weight corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Weight> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Weights for query {}", query);
        return weightSearchRepository.search(queryStringQuery(query), pageable);    }

    @Override
    @Transactional(readOnly = true)
    public List<Weight> findByDays(Integer days) {
        ZonedDateTime rightNow = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime daysAgo = rightNow.minusDays(days);

        List<Weight> weighIns = weightRepository.findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(daysAgo, rightNow, SecurityUtils.getCurrentUserLogin().orElse(null));

        return weighIns;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Weight> findByMonth(YearMonth date) {
        LocalDate firstDay = date.atDay(1);
        LocalDate lastDay = date.atEndOfMonth();

        ZoneId timezone = ZoneId.of("Z");

        List<Weight> weighIns = weightRepository.findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(firstDay.atStartOfDay(timezone), lastDay.plusDays(1).atStartOfDay(timezone), SecurityUtils.getCurrentUserLogin().orElse(null));

        return weighIns;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Weight> findAllByOrderByDateDesc(Pageable pageable) {
        return weightRepository.findAllByOrderByTimestampDesc(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Weight> findByUserIsCurrentUser(Pageable pageable) {
        return weightRepository.findByUserIsCurrentUser(pageable);
    }

    /*private List<Weight> filterByUser(List<Weight> readings) {
        Stream<Weight> userReadings = readings.stream()
            .filter(bp -> bp.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(null)));
        return userReadings.collect(Collectors.toList());
    }*/
}
