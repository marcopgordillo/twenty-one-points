import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TwentyOnePointsSharedModule } from 'app/shared';
import {
    PointComponent,
    PointDetailComponent,
    PointUpdateComponent,
    PointDeletePopupComponent,
    PointDeleteDialogComponent,
    pointRoute,
    pointPopupRoute
} from './';

const ENTITY_STATES = [...pointRoute, ...pointPopupRoute];

@NgModule({
    imports: [TwentyOnePointsSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [PointComponent, PointDetailComponent, PointUpdateComponent, PointDeleteDialogComponent, PointDeletePopupComponent],
    entryComponents: [PointComponent, PointUpdateComponent, PointDeleteDialogComponent, PointDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsPointModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
