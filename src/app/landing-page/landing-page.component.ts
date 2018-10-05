import {Component, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

    modalRef: BsModalRef;

    constructor(private router: Router,
        private modalService: BsModalService,
        ) {
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
      }

    ngOnInit() {
    }

    gotoLogin() {
      this.router.navigate(['/auth'], {queryParams: {login: true}});
    }

    scroll(el) {
        el.scrollIntoView();
    }
}
