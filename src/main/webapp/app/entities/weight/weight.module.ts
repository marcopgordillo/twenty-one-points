import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TwentyOnePointsSharedModule } from 'app/shared';
import {
    WeightComponent,
    WeightDetailComponent,
    WeightUpdateComponent,
    WeightDeletePopupComponent,
    WeightDeleteDialogComponent,
    weightRoute,
    weightPopupRoute
} from './';

const ENTITY_STATES = [...weightRoute, ...weightPopupRoute];

@NgModule({
    imports: [TwentyOnePointsSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [WeightComponent, WeightDetailComponent, WeightUpdateComponent, WeightDeleteDialogComponent, WeightDeletePopupComponent],
    entryComponents: [WeightComponent, WeightUpdateComponent, WeightDeleteDialogComponent, WeightDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsWeightModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
