import {Component, OnInit, TemplateRef, OnDestroy} from '@angular/core';
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {NotifyService} from "../../../service/notify.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/index";
import {DataService} from "../../../service/data.service";
import {AssignUserRequest} from "../model/app-content.model";

@Component({
    selector: 'app-manage-attendees',
    templateUrl: './manage-attendees.component.html',
    styleUrls: ['./manage-attendees.component.css']
})
export class ManageAttendeesComponent implements OnInit, OnDestroy {

    data:Object[] = [];
    locations:any[] =[];
    orgId:string;
    action:string;
    selectedLocId:string;
    modalRef:BsModalRef;
    orgWideSearch:boolean;
    assignRequestObj:AssignUserRequest = new AssignUserRequest();
    actions = [
        {name: "Re-assign", enum:"ASSIGN", displayFor: "LOC"},
        {name: "Deactivate", enum:"DE_ACTIVATE", displayFor: "ALL"},
        {name: "Activate", enum:"ACTIVATE", displayFor: "ALL"}
    ];

    constructor(private contentService:AppContentService,
                private ss:StorageService,
                private ns:NotifyService,
                private modalService:BsModalService,
                private dataService:DataService) {
        this.orgId = this.ss.getSelectedOrg().orgId;

        if(this.dataService.getLocId()) {
            this.orgWideSearch = false;
            this.selectedLocId = this.dataService.getLocId();
        }else {
            this.orgWideSearch = true;
            this.selectedLocId = "";
        }
    }

    ngOnInit() {
        if (this.ss.getSelectedOrg()) {
            this.orgId = this.ss.getSelectedOrg().orgId;
            this.callLocationService();
        }

        this.fetchUsers();
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

    fetchUsers() {
        let id;
        if(!this.selectedLocId) {
            this.orgWideSearch = true;
            id = this.orgId;
        } else {
            this.orgWideSearch = false;
            id = this.selectedLocId;
        }
        this.fetchAttendeesList(id);
    }

    fetchAttendeesList(id:string) {
        this.contentService.fetchAttendees(this.orgWideSearch, id)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.data = result.attendees;
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    selectAll(event) {
        if (event.checked) {
            this.data.map((x:any) => {
                x.checked = true;
                return x
            });
        } else {
            this.data.map((x:any) => {
                x.checked = false;
                return x
            });
        }
    }

    openModal(template:TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
    
    groupActions() {
        switch(this.action) {
            case "ASSIGN": {
                break;
            }
            case "DE_ACTIVATE": {
                break;
            }
            case "ACTIVATE": {
                break;
            }
        }
    }

    openAssignModal(template, email) {
        this.assignRequestObj.emails = [];
        this.assignRequestObj.emails.push(email);
        this.openModal(template);
    }

    openActivateUserModal(template) {
        this.openModal(template);
    }

    assignUser() {
        this.assignRequestObj.oldlocId = this.selectedLocId;
        this.contentService.assignUsersToLocation(this.assignRequestObj)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess(result.description);
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred");}
            )
    }

    ngOnDestroy() {
        this.dataService.setLocId(null);
    }

}
