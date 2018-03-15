import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {NotifyService} from "../../../service/notify.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/index";
import {DataService} from "../../../service/data.service";
import {AssignUserRequest, ActivateDeactivateUserRequest} from "../model/app-content.model";
import {AddAttendeesComponent} from "../app-config/add-attendees/add-attendees.component";

@Component({
    selector: 'app-manage-attendees',
    templateUrl: './manage-attendees.component.html',
    styleUrls: ['./manage-attendees.component.css']
})
export class ManageAttendeesComponent implements OnInit, OnDestroy {

    data:any[] = [];
    locations:any[] = [];
    orgId:string;
    action:string;
    selectedLocId:string;
    modalRef:BsModalRef;
    orgWideSearch:boolean;
    activeUsers:any[] = [];
    inactiveUsers:any[] = [];
    currentTab:number = 0;
    selAll:boolean;
    modalOptions:ModalOptions = new ModalOptions();
    assignRequestObj:AssignUserRequest = new AssignUserRequest();
    adr:ActivateDeactivateUserRequest = new ActivateDeactivateUserRequest();
    @ViewChild("activateUserTemplate") public activateUserTemplate:TemplateRef<any>;
    @ViewChild("assignuserTemplate") public assignuserTemplate:TemplateRef<any>;
    actions = [
        {name: "Re-assign", enum: "ASSIGN", displayFor: "LOC", template: "assignuserTemplate"},
        {name: "Deactivate", enum: "DE_ACTIVATE", displayFor: "ALL", template: "activateUserTemplate"},
        {name: "Activate", enum: "ACTIVATE", displayFor: "ALL", template: "activateUserTemplate"}
    ];

    constructor(private contentService:AppContentService,
                private ss:StorageService,
                private ns:NotifyService,
                private modalService:BsModalService,
                private dataService:DataService) {
        this.orgId = this.ss.getSelectedOrg().orgId;

        if (this.dataService.getLocId()) {
            this.orgWideSearch = false;
            this.selectedLocId = this.dataService.getLocId();
        } else {
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
        this.selAll = false;
        let id;
        if (!this.selectedLocId) {
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
                        this.getUsers(result.attendees);
                        this.data = [];
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    getUsers(users:any) {
        let u = users ? users : [];

        if (u.length > 0) {
            this.activeUsers = u.filter(obj => obj.status);
            this.inactiveUsers = u.filter(obj => !obj.status);
        }
    }

    selectAll(event) {
        this.getData();

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

    getData() {
        switch (this.currentTab) {
            case 0:
            {
                this.data = this.activeUsers;
                break;
            }
            case 1:
            {
                this.data = this.inactiveUsers;
                break;
            }
            case 2:
            {

            }
        }
    }

    openInviteModal() {
        this.modalOptions.class = 'modal-md mt-0';
        this.modalOptions.initialState = {
            editMode: true,
            location: this.selectedLocId
        }
        this.modalRef = this.modalService.show(AddAttendeesComponent, this.modalOptions);
    }

    openModal(template:TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    groupActions(action:string) {
        switch (action) {
            case "ASSIGN":
            {
                this.getSelectedUsersEmail();
                this.openModal(this.assignuserTemplate);
                break;
            }
            case "DE_ACTIVATE":
            {
                this.getSelectedUsersId(false);
                this.openModal(this.activateUserTemplate);
                break;
            }
            case "ACTIVATE":
            {
                this.getSelectedUsersId(true);
                this.openModal(this.activateUserTemplate);
                break;
            }
        }
    }

    getSelectedUsersId(status:boolean) {
        this.adr.status = status;
        this.adr.orgId = this.orgId;
        this.adr.emails = [];
        let arr:any[] = this.data.filter((obj:any) => obj.checked);

        if (arr.length > 0) {
            for (let a of arr) {
                this.adr.emails.push(a.email);
            }
        }
    }

    getSelectedUsersEmail() {
        this.assignRequestObj.emails = [];
        let arr:any[] = this.data.filter((obj:any) => obj.checked);

        if (arr.length > 0) {
            for (let a of arr) {
                this.assignRequestObj.emails.push(a.email);
            }
        }
    }

    activateDeactivateUser() {
        //noinspection TypeScriptValidateTypes
        this.contentService.activateDeactivateAttendees(this.adr)
            .finally(() => {this.selAll = false})
            .subscribe(
                result => {
                    let res:any = result;
                    if (res.code == 0) {
                        this.ns.showSuccess(res.description);
                        this.modalRef.hide();
                        this.fetchUsers();
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    openAssignModal(template, email) {
        this.assignRequestObj.emails = [];
        this.assignRequestObj.emails.push(email);
        this.openModal(template);
    }

    openActivateUserModal(template:TemplateRef<any>, email:string, status:boolean) {
        this.adr.emails = [];
        this.adr.emails.push(email);
        this.adr.status = status ? false : true;
        this.openModal(template);
    }

    /**
     * call service that assigns users to a location
     */
    assignUser() {
        this.assignRequestObj.oldlocId = this.selectedLocId;
        //noinspection TypeScriptValidateTypes
        this.contentService.assignUsersToLocation(this.assignRequestObj)
            .finally(() => {this.selAll = false})
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.modalRef.hide();
                        this.fetchUsers();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    /**
     * This is a method that checks if any record is selected
     */
    isChecked() {
        if(this.data.length > 0) {
            if(this.data.filter(obj => obj.checked).length > 0) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * This method is trigged when tabs change
     * @param event
     */
    onTabChange(event) {
        this.selAll = false;
        this.data.map((x:any) => {
            x.checked = false;
            return x
        });
        this.currentTab = event.index;
    }

    /**
     * Fires events that should happen when a record is selected
     * @param event
     */
    selectOne(event) {
        if (!event.checked) {
            this.selAll = false;
        }

        this.getData();
    }

    /**
     * Events that should happen when this component is destroyed
     */
    ngOnDestroy() {
        this.modalRef? this.modalRef.hide():'';
        this.dataService.setLocId(null);
    }

}
