import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TwentyOnePointsSharedModule } from 'app/shared';
import {
    PreferenceComponent,
    PreferenceDetailComponent,
    PreferenceUpdateComponent,
    PreferenceDeletePopupComponent,
    PreferenceDeleteDialogComponent,
    preferenceRoute,
    preferencePopupRoute
} from './';

const ENTITY_STATES = [...preferenceRoute, ...preferencePopupRoute];

@NgModule({
    imports: [TwentyOnePointsSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PreferenceComponent,
        PreferenceDetailComponent,
        PreferenceUpdateComponent,
        PreferenceDeleteDialogComponent,
        PreferenceDeletePopupComponent
    ],
    entryComponents: [PreferenceComponent, PreferenceUpdateComponent, PreferenceDeleteDialogComponent, PreferenceDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsPreferenceModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
