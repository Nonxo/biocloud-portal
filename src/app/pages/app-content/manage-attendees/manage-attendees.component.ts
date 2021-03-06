import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {NotifyService} from "../../../service/notify.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/index";
import {DataService} from "../../../service/data.service";
import {ActivateDeactivateUserRequest, AssignUserRequest, AttendeesPOJO} from "../model/app-content.model";
import {AddAttendeesComponent} from "../app-config/add-attendees/add-attendees.component";
import {MessageService} from "../../../service/message.service";
import {Router} from "@angular/router";
import {finalize} from "rxjs/internal/operators";

@Component({
    selector: 'app-manage-attendees',
    templateUrl: './manage-attendees.component.html',
    styleUrls: ['./manage-attendees.component.css']
})
export class ManageAttendeesComponent implements OnInit, OnDestroy {

    data: any[] = [];
    locations: any[] = [];
    orgId: string;
    action: string;
    selectedLocId: string;
    modalRef: BsModalRef;
    orgWideSearch: boolean;
    activeUsers: any[] = [];
    inactiveUsers: any[] = [];
    currentTab: number = 0;
    selAll: boolean;
    modalOptions: ModalOptions = new ModalOptions();
    assignRequestObj: AssignUserRequest = new AssignUserRequest();
    adr: ActivateDeactivateUserRequest = new ActivateDeactivateUserRequest();
    @ViewChild("activateUserTemplate") public activateUserTemplate: TemplateRef<any>;
    @ViewChild("assignuserTemplate") public assignuserTemplate: TemplateRef<any>;
    userRole = this.ss.getSelectedOrgRole();
    aPojo: AttendeesPOJO = new AttendeesPOJO();
    totalItems: number = 0;
    maxSize: number = 5;
    currentPage: number;
    rowsOnPage = 10;
    loading:boolean;
    searchValue:string = '';

    constructor(private contentService: AppContentService,
                private ss: StorageService,
                private ns: NotifyService,
                private modalService: BsModalService,
                private dataService: DataService,
                private mService: MessageService,
                private router: Router) {
        this.orgId = this.ss.getSelectedOrg()? this.ss.getSelectedOrg().orgId: '';
        this.ss.clearPrevRoute();

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
            .pipe(
            finalize(() => {
                this.fetchUsers();
            }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations? result.locations: [];

                        if (this.userRole == 'LOCATION_ADMIN') {
                            if (this.locations.length > 0) {
                                //if user is a location admin select the first location by default
                                if(!this.selectedLocId) {
                                    this.selectedLocId = this.locations[0].locId;
                                }
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

    getRequestObj() {
        if (!this.selectedLocId && this.userRole == 'GENERAL_ADMIN') {
            this.orgWideSearch = true;
            this.aPojo.locId = "";
            this.aPojo.orgId = this.userRole == 'GENERAL_ADMIN' ? this.orgId : "";
        } else {
            this.orgWideSearch = false;
            this.aPojo.orgId = "";
            this.aPojo.locId = this.selectedLocId;
        }
    }

    fetchUsers() {
        this.selAll = false;
        this.getRequestObj();

        //Check to prevent fetching of employees when a location admin has no location assigned to them
        if(this.orgWideSearch == false && !this.aPojo.locId) {
            this.mService.setDisplay(false);
            return;
        }

        this.fetchAttendeesCount();
    }

    fetchInvitedUsers() {
        this.getRequestObj();
        this.aPojo.orgId = this.orgId;

        //Check to prevent fetching of employees when a location admin has no location assigned to them
        if(this.orgWideSearch == false && !this.aPojo.locId) {
            this.mService.setDisplay(false);
            return;
        }

        this.callInvitedUsersCountService();
    }

    callInvitedUsersCountService() {
        this.mService.setDisplay(true);
        this.contentService.fetchInvitedUsersCount(this.aPojo)
            .subscribe(
                result => {
                    let res: any = result;
                    if (res.code == 0) {
                        this.totalItems = res.total;
                        this.callInvitedUsersService();
                    } else {
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

    callInvitedUsersService() {
        this.mService.setDisplay(true);
        this.contentService.fetchInvitedUsers(this.aPojo)
            .pipe(
            finalize(() => {
                this.mService.setDisplay(false)
            }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.data = result.attendees? result.attendees: [];
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    fetchAttendeesList() {
        this.mService.setDisplay(true);
        this.contentService.fetchAttendees(this.aPojo)
            .pipe(
            finalize(() => {
                this.mService.setDisplay(false)
            }))
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
                    let res: any = result;
                    if (res.code == 0) {
                        this.totalItems = res.total;
                        this.fetchAttendeesList();
                    } else {
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
            this.data.map((x: any) => {
                x.checked = true;
                return x
            });
        } else {
            this.data.map((x: any) => {
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    groupActions(action: string) {
        switch (action) {
            case "ASSIGN": {
                this.getSelectedUsersEmail();
                this.openModal(this.assignuserTemplate);
                break;
            }
            case "DE_ACTIVATE": {
                this.getSelectedUsersId(false);
                this.openModal(this.activateUserTemplate);
                break;
            }
            case "ACTIVATE": {
                this.getSelectedUsersId(true);
                this.openModal(this.activateUserTemplate);
                break;
            }
        }
    }

    getSelectedUsersId(status: boolean) {
console.log('ssssssssss');

        if (this.selectedLocId) {
            this.adr.orgId = this.orgId;
            this.adr.locId = this.selectedLocId;
        } else {
            this.adr.orgId = this.orgId;
            this.adr.locId = "";
        }

        this.adr.status = status;
        this.adr.emails = [];
        let arr: any[] = this.data.filter((obj: any) => obj.checked);

        if (arr.length > 0) {
            for (let a of arr) {
                this.adr.emails.push(a.email);
            }
        }
    }

    getSelectedUsersEmail() {
        this.assignRequestObj.emails = [];
        let arr: any[] = this.data.filter((obj: any) => obj.checked);

        if (arr.length > 0) {
            for (let a of arr) {
                this.assignRequestObj.emails.push(a.email);
            }
        }
    }

    activateDeactivateUser() {
        this.loading = true;
        //noinspection TypeScriptValidateTypes
        this.contentService.activateDeactivateAttendees(this.adr)
            .pipe(
            finalize(() => {
                this.selAll = false;
                this.loading = false;
            }))
            .subscribe(
                result => {
                    let res: any = result;
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

    openActivateUserModal(template: TemplateRef<any>, email: string, status: boolean) {
        this.adr.emails = [];
        this.adr.emails.push(email);
        this.adr.status = status ? false : true;
        this.openModal(template);
    }

    /**
     * call service that assigns users to a location
     */
    assignUser() {
        this.loading = true;
        this.assignRequestObj.oldlocId = this.selectedLocId;
        //noinspection TypeScriptValidateTypes
        this.contentService.assignUsersToLocation(this.assignRequestObj)
            .pipe(
            finalize(() => {
                this.selAll = false;
                this.loading = false;
            }))
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
        if (this.data.length > 0) {
            if (this.data.filter(obj => obj.checked).length > 0) {
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
        this.data.map((x: any) => {
            x.checked = false;
            return x
        });
        this.currentTab = event.index;

        switch (this.currentTab) {
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
                this.fetchInvitedUsers();
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

        if (this.currentTab == 2) {
            this.fetchInvitedUsers();
        } else {
            this.fetchUsers();
        }
    }

    updateSize() {
        this.aPojo.pageSize = this.rowsOnPage;
        this.resetValues();

        if (this.currentTab == 2) {
            this.fetchInvitedUsers();
        } else {
            this.fetchUsers();
        }
    }

    gotoOverview(email: string) {
        this.dataService.setUserObj({
            email,
            orgId: this.orgWideSearch ? this.orgId : '',
            locId: !this.orgWideSearch ? this.selectedLocId : ''
        });
        this.router.navigate(['/portal/overview']);
    }

    search() {
        this.resetValues();
        this.aPojo.param = this.searchValue.trim();
        this.fetchAttendeesCount();
    }

    searchInvitedUser() {
        this.resetValues();
        this.aPojo.param = this.searchValue;
        this.callInvitedUsersCountService();
    }


    /**
     * Events that should happen when this component is destroyed
     */
    ngOnDestroy() {
        this.modalRef ? this.modalRef.hide() : '';
        this.dataService.setLocId(null);
    }

}
