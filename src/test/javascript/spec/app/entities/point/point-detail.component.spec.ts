/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PointDetailComponent } from 'app/entities/point/point-detail.component';
import { Point } from 'app/shared/model/point.model';

describe('Component Tests', () => {
    describe('Point Management Detail Component', () => {
        let comp: PointDetailComponent;
        let fixture: ComponentFixture<PointDetailComponent>;
        const route = ({ data: of({ point: new Point(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PointDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PointDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PointDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.point).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
