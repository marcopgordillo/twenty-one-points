import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, AccountService, LoginModalService } from 'app/core';
import { Subscription } from 'rxjs';
import { PointService } from 'app/entities/point';
import { Preference } from 'app/shared/model/preference.model';
import { PreferenceService } from 'app/entities/preference';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    eventSubscriber: Subscription;
    pointsThisWeek: any = {};
    pointsPercentage: number;
    preference: Preference;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private pointService: PointService,
        private preferenceService: PreferenceService
    ) {}

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
                this.getUserData();
            });
        });
        this.eventSubscriber = this.eventManager.subscribe('pointsListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('preferenceListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.getUserData());
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    private getUserData() {
        // Get preferences
        this.preferenceService.user().subscribe((preference: any) => {
            this.preference = preference.body;

            // Get points for the current week
            this.pointService.thisWeek().subscribe((points: any) => {
                points = points.body;
                this.pointsThisWeek = points;
                this.pointsPercentage = (points.points / this.preference.weeklyGoal) * 100;

                // calculate success, warning, or danger
                if (points.points >= preference.weeklyGoal) {
                    this.pointsThisWeek.progress = 'success';
                } else if (points.points < 10) {
                    this.pointsThisWeek.progress = 'danger';
                } else if (points.points > 10 && points.points < this.preference.weeklyGoal) {
                    this.pointsThisWeek.progress = 'warning';
                }
            });
        });

        /* // Get points for the current week
        this.pointService.thisWeek().subscribe((points: any) => {
            points = points.body;
            this.pointsThisWeek = points;
            this.pointsPercentage = (points.points / 21) * 100;
        });*/
    }
}
