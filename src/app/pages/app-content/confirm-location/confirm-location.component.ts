import {Component, OnInit} from '@angular/core';
import {} from '@types/googlemaps';
import {MapsAPILoader} from "@agm/core";
import {AppContentService} from "../services/app-content.service";
import {BsModalRef} from "ngx-bootstrap";
import {NotifyService} from "../../../service/notify.service";
import {ApproveCoordinate} from "../model/app-content.model";
import {MessageService} from "../../../service/message.service";

@Component({
    selector: 'app-confirm-location',
    templateUrl: './confirm-location.component.html',
    styleUrls: ['./confirm-location.component.css']
})
export class ConfirmLocationComponent implements OnInit {

    locRequest: any = {suggestedLat: 6.4, suggestedLng: 3.4, suggestedRadius: 32};

    constructor(private loader: MapsAPILoader,
                private contentService: AppContentService,
                public modalRef: BsModalRef,
                private ns: NotifyService,
                private mService: MessageService) {
    }

    ngOnInit() {
        //noinspection TypeScriptUnresolvedFunction
        this.loader.load().then(() => {

        });
    }

    approveCoordinates(status) {
        let model = new ApproveCoordinate(this.locRequest.suggestedLat, this.locRequest.suggestedLng,
            this.locRequest.suggestedRadius, status, this.locRequest.referenceId, this.locRequest.locId);

        this.contentService.approveCoordinates(model)
            .subscribe(
                result => {
                    this.modalRef.hide();
                    this.mService.setUpdateNotif(true);
                    this.mService.setUpdateLocation(true);
                },
                error => {
                    this.ns.showError("An Error Occurred.")
                }
            )
    }

}
