import {Component, OnInit} from '@angular/core';
import {InviteRequest} from "../model/app-config.model";
import {StorageService} from "../../../../service/storage.service";
import {AppContentService} from "../../services/app-content.service";
import {AppConfigService} from "../services/app-config.service";
import {NotifyService} from "../../../../service/notify.service";
import {TranslateService} from "@ngx-translate/core";
import * as FileSaver from 'file-saver';
import {BsModalRef} from "ngx-bootstrap/index";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";

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
    separatorKeysCodes = [ENTER, COMMA];

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
        if (!this.location) {
            this.ns.showError("You must select a location");
            return;
        }

        if (this.inviteRequest.emails.length > 0) {
            if (!this.validateEmails()) {
                return false
            }
        }else {
            this.ns.showError("You must provide atleast one Email");
            return;
        }

        this.inviteRequest.locIds.push(this.location);
        this.inviteRequest.role = 'ATTENDEE';
        this.invite();
    }

    invite() {
        this.configService.inviteAttendees(this.inviteRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.inviteRequest = new InviteRequest();
                        this.location = null;
                        this.ns.showSuccess(result.description);
                        this.cancel();
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
        // this.contentService.fetchOrgLocations(this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null)
        this.contentService.fetchOrgUsersLocation()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations? result.locations:[];
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

    addEmails(event:MatChipInputEvent) {
        let input = event.input;
        let value = event.value;

        let arr = value.split(" ");

        if(arr.length > 0) {
            for(let a of arr) {
                // Add email
                if ((a || '').trim()) {
                    this.inviteRequest.emails.push(a.trim());
                }
            }
        }else {
            // Add email
            if ((value || '').trim()) {
                this.inviteRequest.emails.push(value.trim());
            }
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeEmail(email:any):void {
        let index = this.inviteRequest.emails.indexOf(email);

        if (index >= 0) {
            this.inviteRequest.emails.splice(index, 1);
        }
    }

    validateEmails():boolean {
        let regex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

        for (let a of this.inviteRequest.emails) {
            if (a) {
                let res = regex.test(a);
                if (!res) {
                    this.ns.showError("Incorrect Email format detected: " + a);
                    return false;
                }
            }
        }
        return true;
    }

    cancel() {
        this.editMode? this.modalRef.hide():'';
    }

}
