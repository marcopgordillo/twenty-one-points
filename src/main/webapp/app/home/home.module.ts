import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from 'app/shared';
import { D3ChartService, HOME_ROUTE, HomeComponent } from './';

import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
    imports: [TwentyOnePointsSharedModule, NvD3Module, RouterModule.forChild([HOME_ROUTE])],
    declarations: [HomeComponent],
    providers: [D3ChartService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsHomeModule {}
