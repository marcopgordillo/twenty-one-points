import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPoint } from 'app/shared/model/point.model';
import { PointService } from './point.service';

@Component({
    selector: 'jhi-point-delete-dialog',
    templateUrl: './point-delete-dialog.component.html'
})
export class PointDeleteDialogComponent {
    point: IPoint;

    constructor(protected pointService: PointService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pointService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'pointListModification',
                content: 'Deleted an point'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-point-delete-popup',
    template: ''
})
export class PointDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ point }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PointDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.point = point;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/point', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/point', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
