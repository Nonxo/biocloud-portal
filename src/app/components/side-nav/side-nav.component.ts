import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/index";
import {CreateOrgRequest} from "../../pages/app-content/model/app-content.model";
import {StorageService} from "../../service/storage.service";
import {AppContentService} from "../../pages/app-content/services/app-content.service";
import {NotifyService} from "../../service/notify.service";

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

    modalRef:BsModalRef;
    orgRequest:CreateOrgRequest = new CreateOrgRequest();
    orgs = [
        {name: 'Seamfix Nig LTD', hits: '02', active: true},
        {name: 'Hitman Organisation', hits: '19', active: false},
        {name: 'Halo - Ubisoft', hits: '35', active: false}
    ];

    constructor(private modalService:BsModalService,
                private ss:StorageService,
                private contentService:AppContentService,
                private ns:NotifyService) {
    }

    ngOnInit() {
        this.fetchUsersOrg();
    }

    openModal(template:TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }


    getOrgRequestObject() {
        this.orgRequest.type = "HOSPITAL";
        this.orgRequest.createdBy = this.ss.getLoggedInUserEmail();
    }

    saveOrg() {
        this.getOrgRequestObject();
        this.callOrgCreationService();
    }

    callOrgCreationService() {
        this.contentService.createOrg(this.orgRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    fetchUsersOrg() {
        this.fetchOrgFromCache();
    }

    fetchOrgFromCache() {
        if (!this.ss.getUsersOrg()) {
            this.callUsersOrgService();
        } else {
            this.orgs = this.ss.getUsersOrg();
        }
    }

    callUsersOrgService() {
        this.contentService.fetchUsersOrg()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.orgs = result.organisations;
                        //cache orgs
                        this.cacheOrg();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    cacheOrg() {
        this.ss.cacheUsersOrg(this.orgs);
    }

}
