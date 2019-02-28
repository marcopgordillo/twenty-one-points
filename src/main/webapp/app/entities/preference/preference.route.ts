import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Preference } from 'app/shared/model/preference.model';
import { PreferenceService } from './preference.service';
import { PreferenceComponent } from './preference.component';
import { PreferenceDetailComponent } from './preference-detail.component';
import { PreferenceUpdateComponent } from './preference-update.component';
import { PreferenceDeletePopupComponent } from './preference-delete-dialog.component';
import { IPreference } from 'app/shared/model/preference.model';

@Injectable({ providedIn: 'root' })
export class PreferenceResolve implements Resolve<IPreference> {
    constructor(private service: PreferenceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPreference> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Preference>) => response.ok),
                map((preference: HttpResponse<Preference>) => preference.body)
            );
        }
        return of(new Preference());
    }
}

export const preferenceRoute: Routes = [
    {
        path: '',
        component: PreferenceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.preference.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PreferenceDetailComponent,
        resolve: {
            preference: PreferenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.preference.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PreferenceUpdateComponent,
        resolve: {
            preference: PreferenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.preference.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PreferenceUpdateComponent,
        resolve: {
            preference: PreferenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.preference.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const preferencePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PreferenceDeletePopupComponent,
        resolve: {
            preference: PreferenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.preference.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
