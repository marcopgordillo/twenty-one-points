package org.jhipster.health.web.rest;

import io.github.jhipster.web.util.ResponseUtil;
import org.jhipster.health.domain.Preference;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.service.PreferenceService;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Preference.
 */
@RestController
@RequestMapping("/api")
public class PreferenceResource {

    private final Logger log = LoggerFactory.getLogger(PreferenceResource.class);

    private static final String ENTITY_NAME = "preference";

    private final PreferenceService preferenceService;
    private final UserRepository userRepository;

    public PreferenceResource(PreferenceService preferenceService, UserRepository userRepository) {
        this.preferenceService = preferenceService;
        this.userRepository = userRepository;
    }

    /**
     * POST  /preferences : Create a new preference.
     *
     * @param preference the preference to create
     * @return the ResponseEntity with status 201 (Created) and with body the new preference, or with status 400 (Bad Request) if the preference has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/preferences")
    public ResponseEntity<?> createPreference(@Valid @RequestBody Preference preference) throws URISyntaxException {
        log.debug("REST request to save Preference : {}", preference);
        if (preference.getId() != null) {
            throw new BadRequestAlertException("A new preference cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) && preference.getUser() != null &&
            !preference.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            preference.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null));
        }

        Preference result = preferenceService.save(preference);
        return ResponseEntity.created(new URI("/api/preferences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /preferences : Updates an existing preference.
     *
     * @param preference the preference to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated preference,
     * or with status 400 (Bad Request) if the preference is not valid,
     * or with status 500 (Internal Server Error) if the preference couldn't be updated
     */
    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreference(@Valid @RequestBody Preference preference) {
        log.debug("REST request to update Preference : {}", preference);
        if (preference.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) && preference.getUser() != null &&
            !preference.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        Preference result = preferenceService.save(preference);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, preference.getId().toString()))
            .body(result);
    }

    /**
     * GET  /preferences : get all the preferences.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of preferences in body
     */
    @GetMapping("/preferences")
    public List<Preference> getAllPreferences() {
        log.debug("REST request to get all Preferences");

        List<Preference> preferences;

        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            preferences = preferenceService.findAll();
        } else {
            preferences = preferenceService.findByUserIsCurrentUser();
        }

        return preferences;
    }

    /**
     * GET  /preferences/:id : get the "id" preference.
     *
     * @param id the id of the preference to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the preference, or with status 404 (Not Found)
     */
    @GetMapping("/preferences/{id}")
    public ResponseEntity<?> getPreference(@PathVariable Long id) {
        log.debug("REST request to get Preference : {}", id);
        Optional<Preference> preference = preferenceService.findOne(id);

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) && preference.isPresent() && preference.get().getUser() != null &&
            !preference.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        return ResponseUtil.wrapOrNotFound(preference);
    }

    /**
     * DELETE  /preferences/:id : delete the "id" preference.
     *
     * @param id the id of the preference to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/preferences/{id}")
    public ResponseEntity<?> deletePreference(@PathVariable Long id) {
        log.debug("REST request to delete Preference : {}", id);

        Optional<Preference> preference = preferenceService.findOne(id);

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) && preference.isPresent() && preference.get().getUser() != null &&
            !preference.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        preferenceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/preferences?query=:query : search for the preference corresponding
     * to the query.
     *
     * @param query the query of the preference search
     * @return the result of the search
     */
    @GetMapping("/_search/preferences")
    public List<Preference> searchPreferences(@RequestParam String query) {
        log.debug("REST request to search Preferences for query {}", query);
        return preferenceService.search(query);
    }

    @GetMapping("/my-preference")
    public ResponseEntity<Preference> getUserPreference() {
        return ResponseEntity.ok().body(preferenceService.findUserPreference());
    }

}
