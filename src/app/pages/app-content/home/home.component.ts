import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalService, BsModalRef, ModalOptions} from "ngx-bootstrap/index";
import {LocationRequest} from "../app-config/model/app-config.model";
import {SetupComponent} from "../app-config/setup/setup.component";
import {AddAttendeesComponent} from "../app-config/add-attendees/add-attendees.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    locationsSubscription:any;
    orgId:string;
    locations:any = [];
    bsModalRef:BsModalRef;
    modalOptions:ModalOptions = new ModalOptions();

    constructor(private mService:MessageService,
                private ns:NotifyService,
                private contentService:AppContentService,
                private ss:StorageService,
                private modalService:BsModalService,
                private router:Router) {
    }

    ngOnInit() {

        if (this.ss.getSelectedOrg()) {
            this.orgId = this.ss.getSelectedOrg().orgId;
            this.callLocationService();
        }

        this.locationsSubscription = this.mService.getSelectedOrg()
            .subscribe(
                result => {
                    this.orgId = result;
                    this.callLocationService();
                    this.router.navigate(['/portal']);
                }
            )

    }

    callLocationService() {
        this.contentService.fetchOrgLocations(this.orgId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations;
                    } else {
                        this.ns.showError(result.description);
                        this.locations = [];
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                    this.locations = [];
                }
            )
    }

    editLocation(loc:LocationRequest) {
        this.openLocationModal(loc);
    }

    invite() {
        this.openInviteModal();
    }

    openLocationModal(loc:LocationRequest) {
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalOptions.initialState = {
            locRequest: loc,
            editMode: true,
            lat: loc.latitude? loc.latitude: 9.0820,
            lng: loc.longitude? loc.longitude: 8.6753
    }
        ;
        this.bsModalRef = this.modalService.show(SetupComponent, this.modalOptions);
    }

    openInviteModal() {
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalOptions.initialState = {
            editMode: true
        }
        this.bsModalRef = this.modalService.show(AddAttendeesComponent, this.modalOptions);
    }

}
