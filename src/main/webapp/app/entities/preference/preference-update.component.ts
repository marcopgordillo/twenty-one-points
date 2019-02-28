import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPreference } from 'app/shared/model/preference.model';
import { PreferenceService } from './preference.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-preference-update',
    templateUrl: './preference-update.component.html'
})
export class PreferenceUpdateComponent implements OnInit {
    preference: IPreference;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected preferenceService: PreferenceService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ preference }) => {
            this.preference = preference;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.preference.id !== undefined) {
            this.subscribeToSaveResponse(this.preferenceService.update(this.preference));
        } else {
            this.subscribeToSaveResponse(this.preferenceService.create(this.preference));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPreference>>) {
        result.subscribe((res: HttpResponse<IPreference>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
