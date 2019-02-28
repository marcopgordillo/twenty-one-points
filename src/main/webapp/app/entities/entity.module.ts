import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'point',
                loadChildren: './point/point.module#TwentyOnePointsPointModule'
            },
            {
                path: 'weight',
                loadChildren: './weight/weight.module#TwentyOnePointsWeightModule'
            },
            {
                path: 'blood-pressure',
                loadChildren: './blood-pressure/blood-pressure.module#TwentyOnePointsBloodPressureModule'
            },
            {
                path: 'preference',
                loadChildren: './preference/preference.module#TwentyOnePointsPreferenceModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsEntityModule {}
