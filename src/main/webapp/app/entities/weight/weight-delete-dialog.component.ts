import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWeight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';

@Component({
    selector: 'jhi-weight-delete-dialog',
    templateUrl: './weight-delete-dialog.component.html'
})
export class WeightDeleteDialogComponent {
    weight: IWeight;

    constructor(protected weightService: WeightService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.weightService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'weightListModification',
                content: 'Deleted an weight'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-weight-delete-popup',
    template: ''
})
export class WeightDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weight }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(WeightDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.weight = weight;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/weight', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/weight', { outlets: { popup: null } }]);
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
