/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PointUpdateComponent } from 'app/entities/point/point-update.component';
import { PointService } from 'app/entities/point/point.service';
import { Point } from 'app/shared/model/point.model';

describe('Component Tests', () => {
    describe('Point Management Update Component', () => {
        let comp: PointUpdateComponent;
        let fixture: ComponentFixture<PointUpdateComponent>;
        let service: PointService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PointUpdateComponent]
            })
                .overrideTemplate(PointUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PointUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Point(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.point = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Point();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.point = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
