import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPreference } from 'app/shared/model/preference.model';
import { AccountService } from 'app/core';
import { PreferenceService } from './preference.service';

@Component({
    selector: 'jhi-preference',
    templateUrl: './preference.component.html'
})
export class PreferenceComponent implements OnInit, OnDestroy {
    preferences: IPreference[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected preferenceService: PreferenceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.preferenceService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPreference[]>) => res.ok),
                    map((res: HttpResponse<IPreference[]>) => res.body)
                )
                .subscribe((res: IPreference[]) => (this.preferences = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.preferenceService
            .query()
            .pipe(
                filter((res: HttpResponse<IPreference[]>) => res.ok),
                map((res: HttpResponse<IPreference[]>) => res.body)
            )
            .subscribe(
                (res: IPreference[]) => {
                    this.preferences = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPreferences();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPreference) {
        return item.id;
    }

    registerChangeInPreferences() {
        this.eventSubscriber = this.eventManager.subscribe('preferenceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
