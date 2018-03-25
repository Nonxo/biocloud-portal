import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {NotifyService} from "../../../service/notify.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/index";
import {DataService} from "../../../service/data.service";
import {AssignUserRequest, ActivateDeactivateUserRequest, AttendeesPOJO} from "../model/app-content.model";
import {AddAttendeesComponent} from "../app-config/add-attendees/add-attendees.component";
import {MessageService} from "../../../service/message.service";
import {Router} from "@angular/router";

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
    userRole = this.ss.getSelectedOrgRole();
    aPojo: AttendeesPOJO = new AttendeesPOJO();
    totalItems:number;
    maxSize:number = 5;
    currentPage:number;
    rowsOnPage = 10;

    constructor(private contentService:AppContentService,
                private ss:StorageService,
                private ns:NotifyService,
                private modalService:BsModalService,
                private dataService:DataService,
                private mService: MessageService,
                private router: Router) {
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
        this.mService.setTitle("Employees");

        if (this.ss.getSelectedOrg()) {
            this.orgId = this.ss.getSelectedOrg().orgId;
            this.callLocationService();
        }
    }

    callLocationService() {
        this.mService.setDisplay(true);
        this.contentService.fetchOrgUsersLocation()
            .finally(() => {this.fetchUsers()})
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations;

                        if(this.userRole == 'LOCATION_ADMIN') {
                            if(this.locations.length > 1) {
                                //if user is a location admin select the first location by default
                                this.selectedLocId = this.locations[0].locId;
                            }
                        }

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
        if (!this.selectedLocId) {
            this.orgWideSearch = true;
            this.aPojo.locId = null;
            this.aPojo.orgId = this.userRole == 'GENERAL_ADMIN'? this.orgId: "";
        } else {
            this.orgWideSearch = false;
            this.aPojo.orgId = null;
            this.aPojo.locId = this.selectedLocId;
        }
        this.fetchAttendeesCount();
    }

    fetchAttendeesList() {
        this.mService.setDisplay(true);
        this.contentService.fetchAttendees(this.aPojo)
            .finally(() => {this.mService.setDisplay(false)})
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.data = result.attendees;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    fetchAttendeesCount() {
        this.mService.setDisplay(true);
        this.contentService.fetchAttendeesCount(this.aPojo)
            .subscribe(
                result => {
                    let res:any = result;
                    if(res.code == 0) {
                        this.totalItems = res.total;
                        this.fetchAttendeesList();
                    }else {
                        this.ns.showError(res.description);
                        this.totalItems = 0;
                        this.mService.setDisplay(false)
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                    this.totalItems = 0;
                    this.mService.setDisplay(false)
                }
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

        if(this.selectedLocId) {
            this.adr.orgId = "";
            this.adr.locId = this.selectedLocId;
        } else {
            this.adr.orgId = this.orgId;
            this.adr.locId = "";
        }

        this.adr.status = status;
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

    resetValues() {
        this.data = [];
        this.currentPage = 1;
        this.aPojo.pageNo = 1;
    }

    /**
     * This method is trigged when tabs change
     * @param event
     */
    onTabChange(event) {
        this.resetValues();
        this.selAll = false;
        this.data.map((x:any) => {
            x.checked = false;
            return x
        });
        this.currentTab = event.index;

        switch(this.currentTab) {
            case 0: {
                this.aPojo.active = true;
                this.fetchUsers();
                break;
            }
            case 1: {
                this.aPojo.active = false;
                this.fetchUsers();
                break;
            }
            case 2: {
                break;
            }
        }
    }

    /**
     * Fires events that should happen when a record is selected
     * @param event
     */
    selectOne(event) {
        if (!event.checked) {
            this.selAll = false;
        }
    }

    pageChanged(event) {
        this.aPojo.pageNo = event.page;
        this.fetchUsers();
    }

    updateSize() {
        this.aPojo.pageSize = this.rowsOnPage;
        this.resetValues();
        this.fetchUsers();
    }

    gotoOverview(email:string) {
        this.dataService.setUserObj({email, orgId: this.orgWideSearch? this.orgId:'', locId: !this.orgWideSearch? this.selectedLocId:''});
        this.router.navigate(['/portal/overview']);
    }

    /**
     * Events that should happen when this component is destroyed
     */
    ngOnDestroy() {
        this.modalRef? this.modalRef.hide():'';
        this.dataService.setLocId(null);
    }

}
