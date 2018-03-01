import {Component, OnInit} from '@angular/core';
import {InviteRequest} from "../model/app-config.model";
import {StorageService} from "../../../../service/storage.service";
import {AppContentService} from "../../services/app-content.service";
import {AppConfigService} from "../services/app-config.service";
import {NotifyService} from "../../../../service/notify.service";
import {TranslateService} from "@ngx-translate/core";
import * as FileSaver from 'file-saver';
import {BsModalRef} from "ngx-bootstrap/index";

@Component({
    selector: 'app-add-attendees',
    templateUrl: './add-attendees.component.html',
    styleUrls: ['./add-attendees.component.css']
})
export class AddAttendeesComponent implements OnInit {

    invites:boolean = true;
    bulk:boolean;
    location:string;
    editMode:boolean;
    locations:any[] = [];
    inviteRequest:InviteRequest = new InviteRequest();

    addBy = [
        {name: "INVITE", checked: true},
        {name: "BULK", checked: false}
    ];

    constructor(private contentService:AppContentService,
                private configService:AppConfigService,
                private ss:StorageService,
                private ns:NotifyService,
                private translate:TranslateService,
                public modalRef:BsModalRef) {
        translate.setDefaultLang('en/add-attendees');
        translate.use('en/add-attendees');
    }

    ngOnInit() {
        this.callLocationService();
    }

    changeAdd(index) {
        this.addBy[0].checked = false;
        this.addBy[1].checked = false;
        this.addBy[index].checked = true;

        if (index === 0) {
            this.invites = true;
            this.bulk = false;
        } else {
            this.bulk = true;
            this.invites = false;
        }
    }

    onSubmit() {
        this.inviteRequest.locIds.push(this.location);
        this.inviteRequest.role = 'ATTENDEE';
        this.invite();
    }

    invite() {
        this.configService.inviteAttendees(this.inviteRequest)
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

    callLocationService() {
        this.contentService.fetchOrgLocations(this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations;
                    }
                },
                error => {
                }
            )
    }

    downloadTemplate() {
        this.configService.downloadTemplate()
            .subscribe(
                result => {
                        var blob = new Blob([result], {type: 'application/vnd.ms-excel'});
                        FileSaver.saveAs(blob, "template.xls");
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    fileChange(event) {
        this.configService.uploadTemplate(event.target.files[0])
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess("Invites successfully sent");
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.")}
            )
    }

}
