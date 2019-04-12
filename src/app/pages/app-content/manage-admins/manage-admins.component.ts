import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {StorageService} from "../../../service/storage.service";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/index";
import {AssignAdminRequest, InviteRequest} from "../app-config/model/app-config.model";
import {AppConfigService} from "../app-config/services/app-config.service";
import {AdminRemovalRequest, UserPaginationPojo} from "../model/app-content.model";
import {MessageService} from "../../../service/message.service";
import {finalize} from "rxjs/internal/operators";
import {Router} from "@angular/router";
import {CookieService} from "../../../service/cookie.service";

@Component({
    selector: 'app-manage-admins',
    templateUrl: './manage-admins.component.html',
    styleUrls: ['./manage-admins.component.css']
})
export class ManageAdminsComponent implements OnInit, OnDestroy {

    users: any[] = [];
    modalRef: BsModalRef;
    inviteRequest: InviteRequest = new InviteRequest();
    assignAdminRequest: AssignAdminRequest = new AssignAdminRequest();
    locations: any[] = [];
    selectedUser: any;
    selAll: boolean;
    adminRemovalRequest: AdminRemovalRequest = new AdminRemovalRequest();
    currentUserEmail: string = this.ss.getLoggedInUserEmail();
    inviteEmail: string;
    pagObj: UserPaginationPojo = new UserPaginationPojo();
    totalItems: number;
    rowsOnPage: number = 10;
    currentPage: number;
    maxSize: number = 5;
    userRole: string = this.ss.getSelectedOrgRole();
    orgCreator: string = this.ss.getSelectedOrg().createdBy;
    loading: boolean;

    constructor(private ss: StorageService,
                private contentService: AppContentService,
                private ns: NotifyService,
                private modalService: BsModalService,
                private configService: AppConfigService,
                private mService: MessageService,
                private router: Router,
                private cookieService: CookieService) {
    }

    ngOnInit() {
        this.mService.setTitle("Admins");

        this.currentPage = 1;

        this.fetchAdminUsersCount();

        this.callLocationService();
    }

    onDone() {
        //set cookie to save user's preference
        this.cookieService.set(this.ss.getLoggedInUserEmail(), JSON.stringify({dontShowGuide: true}));

        this.router.navigate(['/portal']);
    }


    fetchAdminUsers() {
        this.mService.setDisplay(true);
        this.contentService.fetchUsersInAnOrg(this.ss.getSelectedOrg().orgId, this.pagObj)
            .pipe(
                finalize(() => {
                    this.mService.setDisplay(false)
                }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.totalItems = result.total;
                        this.users = result.users ? result.users : [];
                        this.ss.setAdminUsers(this.users);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }


    fetchAdminUsersCount() {
        this.fetchAdminUsers();
    }

    callLocationService() {
        this.contentService.fetchOrgUsersLocation()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations ? result.locations : [];
                    }
                },
                error => {
                }
            )
    }

    getSelectedLocationName(isInviteRequest: boolean) {

        if (isInviteRequest) {
            if (this.inviteRequest.locIds.length > 0) {
                for (let l of this.locations) {
                    if (l.locId == this.inviteRequest.locIds[0]) {
                        return l.name;
                    }
                }
            }
        } else {
            if (this.assignAdminRequest.locIds.length > 0) {
                for (let l of this.locations) {
                    if (l.locId == this.assignAdminRequest.locIds[0]) {
                        return l.name;
                    }
                }
            }
        }

    }

    openModal(template: TemplateRef<any>) {
        // this.inviteRequest = new InviteRequest();
        this.modalRef = this.modalService.show(template);
    }

    inviteAdminModal(template: TemplateRef<any>) {
        this.inviteRequest = new InviteRequest();
        this.inviteEmail = "";
        this.openModal(template);
    }

    viewAdminDetails(template: TemplateRef<any>) {
        this.setSelectedUser();
        this.assignAdminRequest = new AssignAdminRequest();

        this.assignAdminRequest.role = this.selectedUser.role;
        this.assignAdminRequest.locIds = this.selectedUser.locIds ? (this.selectedUser.locIds.length > 0 ? this.selectedUser.locIds : []) : [];
        this.assignAdminRequest.email = this.selectedUser.email;

        this.openModal(template);
    }

    setSelectedUser() {
        this.selectedUser = this.users.filter(obj => obj.checked)[0];
    }

    inviteAdmin() {
        this.inviteRequest.emails = [];
        this.inviteRequest.emails.push(this.inviteEmail);

        if (!this.isInviteFormValid()) {
            return;
        }

        this.loading = true;
        this.configService.inviteAttendees(this.inviteRequest)
            .pipe(
                finalize(() => {
                    this.loading = false;
                }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.modalRef.hide();
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

    isInviteFormValid() {
        if (!this.inviteRequest.role) {
            this.ns.showError("You must select a role.");
            return false;
        }

        if (this.inviteRequest.role == "LOCATION_ADMIN") {
            if (this.inviteRequest.locIds.length == 0) {
                this.ns.showError("You must select at least one location");
                return false;
            }
        }

        return true;
    }

    isAssignFormValid() {
        if (!this.assignAdminRequest.role) {
            this.ns.showError("You must select a role.");
            return false;
        }

        if (this.assignAdminRequest.role == "LOCATION_ADMIN") {
            if (this.assignAdminRequest.locIds.length == 0) {
                this.ns.showError("You must select at least one location");
                return false;
            }
        }

        return true;
    }

    selectAll(event) {
        if (event.checked) {
            //if user is a location admin, dont select users that are general admins
            if (this.userRole == 'LOCATION_ADMIN') {
                this.users.map((x: any) => {
                    if ((x.email != this.currentUserEmail) && (x.role !== 'GENERAL_ADMIN')) {
                        x.checked = true;
                        return x
                    }
                });
            } else {
                this.users.map((x: any) => {
                    if (x.email != this.currentUserEmail && x.email != this.orgCreator) {
                        x.checked = true;
                        return x
                    }
                });
            }

        } else {
            this.users.map((x: any) => {
                x.checked = false;
                return x
            });
        }
    }

    /**
     * This method is fired when a single record is selected
     */
    selectOne(user: any, event) {
        if (!event.checked) {
            this.selAll = false;
        }
    }

    /**
     * method that initiates process to remove selected Admins
     */
    removeAdmin() {
        this.adminRemovalRequest = new AdminRemovalRequest();
        let selectedUsers = this.users.filter(obj => obj.checked);

        for (let u of selectedUsers) {
            this.adminRemovalRequest.userIds.push(u.userId);
        }

        this.loading = true;
        this.contentService.removeAdmin(this.adminRemovalRequest)
            .pipe(
                finalize(() => {
                    this.selAll = false;
                    this.loading = false;
                }))
            .subscribe(
                result => {
                    let res: any = result;
                    if (res.code == 0) {
                        this.modalRef ? this.modalRef.hide() : '';
                        this.fetchAdminUsersCount();
                        this.ns.showSuccess(res.description);
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    assignAdmins() {
        if (this.assignAdminRequest.role == "GENERAL_ADMIN") {
            this.assignAdminRequest.locIds = [];
        }

        if (!this.isAssignFormValid()) {
            return;
        }

        this.loading = true;
        this.configService.assignAdmins(this.assignAdminRequest)
            .pipe(
                finalize(() => {
                    this.loading = false;
                }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.fetchAdminUsersCount();
                        this.modalRef.hide();
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

    /**
     * This method determines when the edit button should be shown
     * condition: when only one record is selected
     */
    canEdit() {
        return this.users.filter(obj => obj.checked).length == 1 ? true : false;
    }

    /**
     * This method determines when the remove button should be shown
     * condition: when only one or more record is selected
     */
    canRemove() {
        return this.users.filter(obj => obj.checked).length > 0 ? true : false;
    }

    resetValues() {
        this.users = [];
        this.currentPage = 1;
        this.pagObj.pageNo = 1;
    }

    updateSize() {
        this.pagObj.pageSize = this.rowsOnPage;
        this.resetValues();
        this.fetchAdminUsersCount();
    }

    pageChanged(event) {
        // i noticed that this event handler runs indefinitely
        // hence the reason why i have to introduce the if logic
        if (event.page != this.currentPage) {
            this.users = [];
            this.pagObj.pageNo = event.page;
            this.fetchAdminUsersCount();
            this.currentPage = event.page;
        }
    }

    ngOnDestroy() {
        this.modalRef ? this.modalRef.hide() : '';
    }

}
