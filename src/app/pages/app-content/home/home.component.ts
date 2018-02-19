import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalService, BsModalRef, ModalOptions} from "ngx-bootstrap/index";
import {LocationRequest} from "../app-config/model/app-config.model";
import {SetupComponent} from "../app-config/setup/setup.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    locationsSubscription:any;
    orgId:string;
    locations:any = [];
    bsModalRef: BsModalRef;
    modalOptions: ModalOptions = new ModalOptions();

    constructor(private mService:MessageService,
                private ns:NotifyService,
                private contentService:AppContentService,
                private ss:StorageService,
                private modalService:BsModalService) {
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
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    editLocation(loc:LocationRequest) {
        this.openLocationModal(loc);
    }

    openLocationModal(loc: LocationRequest) {
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalOptions.initialState = {
            locRequest: loc,
            editMode: true
        }
        this.bsModalRef = this.modalService.show(SetupComponent, this.modalOptions);
    }

}
