import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, AccountService, LoginModalService } from 'app/core';
import { Subscription } from 'rxjs';
import { PointService } from 'app/entities/point';
import { Preference } from 'app/shared/model/preference.model';
import { PreferenceService } from 'app/entities/preference';
import { BloodPressureService } from 'app/entities/blood-pressure';
import { D3ChartService } from 'app/home/d3-chart.service';

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
    bpReadings: any = {};
    bpOptions: any;
    bpData: any;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private pointService: PointService,
        private preferenceService: PreferenceService,
        private bloodPressureService: BloodPressureService
    ) {}

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.account = account;
            if (this.isAuthenticated()) {
                this.getUserData();
            }
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

        // Get blood pressure readings for the last 30 days
        this.bloodPressureService.last30Days().subscribe((bpReadings: any) => {
            bpReadings = bpReadings.body;
            this.bpReadings = bpReadings;
            this.bpOptions = { ...D3ChartService.getChartConfig() };
            if (bpReadings.readings.length) {
                this.bpOptions.title.text = bpReadings.period;
                this.bpOptions.chart.yAxis.axisLabel = 'Blood Pressure';
                const systolics = [];
                const diastolics = [];
                const upperValues = [];
                const lowerValues = [];
                bpReadings.readings.forEach(item => {
                    systolics.push({
                        x: new Date(item.timestamp),
                        y: item.systolic
                    });
                    diastolics.push({
                        x: new Date(item.timestamp),
                        y: item.diastolic
                    });
                    upperValues.push(item.systolic);
                    lowerValues.push(item.diastolic);
                });
                this.bpData = [
                    {
                        values: systolics,
                        key: 'Systolic',
                        color: '#673ab7'
                    },
                    {
                        values: diastolics,
                        key: 'Diastolic',
                        color: '#03a9f4'
                    }
                ];
                // set y scale to be 10 more than max and min
                this.bpOptions.chart.yDomain = [Math.min.apply(Math, lowerValues) - 10, Math.max.apply(Math, upperValues) + 10];
            } else {
                this.bpReadings.readings = [];
            }
        });
    }
}
