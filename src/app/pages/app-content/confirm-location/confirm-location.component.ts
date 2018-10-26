import {Component, OnInit} from '@angular/core';
import {} from '@types/googlemaps';
import {MapsAPILoader} from "@agm/core";
import {AppContentService} from "../services/app-content.service";
import {BsModalRef} from "ngx-bootstrap";
import {NotifyService} from "../../../service/notify.service";
import {ApproveCoordinate} from "../model/app-content.model";
import {MessageService} from "../../../service/message.service";
import {GeoMapService} from "../../../service/geo-map.service";

@Component({
    selector: 'app-confirm-location',
    templateUrl: './confirm-location.component.html',
    styleUrls: ['./confirm-location.component.css']
})
export class ConfirmLocationComponent implements OnInit {

    locRequest: any = {suggestedLat: 6.4, suggestedLng: 3.4, suggestedRadius: 32};
    address: string;

    constructor(private loader: MapsAPILoader,
                private contentService: AppContentService,
                public modalRef: BsModalRef,
                private ns: NotifyService,
                private mService: MessageService,
                private mapService: GeoMapService) {
    }

    ngOnInit() {
        //noinspection TypeScriptUnresolvedFunction
        this.loader.load().then(() => {

        });

    }

    approveCoordinates(status) {
        this.mapService.getAddress(this.locRequest.suggestedLat, this.locRequest.suggestedLng)
            .subscribe(
                result => {
                    if (typeof result === 'string') {
                        this.address = result;
                    } else {
                        this.address = "Unknown Address";
                    }

                },
                error => {
                    this.address = "Unknown Address";
                },
                () => this.callApproveService(status)
            );
    }


    callApproveService(status) {
        let model = new ApproveCoordinate(this.locRequest.suggestedLat, this.locRequest.suggestedLng,
            this.locRequest.suggestedRadius, status, this.locRequest.referenceId, this.locRequest.locId, this.address);

        this.contentService.approveCoordinates(model)
            .subscribe(
                result => {
                    this.modalRef.hide();

                    if (status == 'APPROVED') {
                        this.ns.showSuccess("Your request was successful. Your Location is now active and employees can clock-in to the location");

                    } else {
                        this.ns.showSuccess("Suggested Location Rejected. Your Location is still inactive. you can try out other options to activate your location");
                    }
                    this.mService.setUpdateNotif(true);
                    this.mService.setUpdateLocation(true);
                },
                error => {
                    this.ns.showError("An Error Occurred.")
                }
            )
    }

}
