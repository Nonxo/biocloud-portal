import {Component, OnInit, TemplateRef, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {BsModalService, BsModalRef} from "ngx-bootstrap/index";
import {StorageService} from "../../service/storage.service";
import {AppContentService} from "../../pages/app-content/services/app-content.service";
import {NotifyService} from "../../service/notify.service";
import {CreateOrgRequest, Org, AdminRemovalRequest} from "../../pages/app-content/model/app-content.model";
import {MessageService} from "../../service/message.service";
import {InviteRequest} from "../../pages/app-content/app-config/model/app-config.model";
import {AppConfigService} from "../../pages/app-content/app-config/services/app-config.service";
import {SearchService} from "../../service/search.service";
import {Subject} from "rxjs/Subject";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    sideNavMode = "side";
    opener:boolean = true;
    modalRef:BsModalRef;
    selectedUser:any;
    manageAdmin:boolean;
    locations:any[] = [];
    users:any[] = [];
    adminRemovalRequest:AdminRemovalRequest = new AdminRemovalRequest();
    views:Object[] = [
        {icon: "home", route: "Home", url: "/portal"},
        {icon: "group", route: "Attendees", url: "/portal/manage-users"},
        {icon: "insert_chart", route: "Report", url: "/portal/report-dashboard"},
        {icon: "payment", route: "Subscribe", url: "/portal/subscribe"}
    ];

    orgTypes:string[] = ["SCHOOL", "SECURITY", "HOSPITAL"];

    navs:Object[] = [
        // {icon: "person", route: "Profile", url: "/"},
        // {icon: "message", route: "Notifications", url: "/portal/notification"}
    ];
    orgs:Org[] = [];
    orgRequest:CreateOrgRequest = new CreateOrgRequest();
    selectedOrg:Org = new Org();
    sidenavWidth = 16;
    openDropdown:boolean;
    hamburgerClicked:boolean = true;
    title:string = "Home";
    inviteRequest:InviteRequest = new InviteRequest();
    currentUserEmail:string = this.ss.getLoggedInUserEmail();
    username = this.ss.getUserName();

    searchField:string;
    searchOrgTerm$ = new Subject<any>();
    searchType:string;


    constructor(private router:Router,
                private authService: AuthService,
                private modalService:BsModalService,
                private ss:StorageService,
                private contentService:AppContentService,
                private ns:NotifyService,
                private mService:MessageService,
                private configService:AppConfigService,
                private searchService:SearchService) {

        this.searchService.search(this.searchOrgTerm$)
            .subscribe(results => {
                switch(this.searchType) {
                    case 'ADMIN': {
                        this.users = results;
                        break;
                    }
                    case 'ORG': {
                        this.orgs = results;
                        break;
                    }
                }
            });
    }

    ngOnInit() {
        this.selectedOrg = this.ss.getSelectedOrg() ? this.ss.getSelectedOrg() : new Org();
        this.fetchUsersOrg();
        this.onResizeByWindowScreen();
    }

    search(searchType:string, searchValue:string) {
        this.searchType = searchType;
        this.searchOrgTerm$.next({searchValue: searchValue,searchType: searchType});
    }

    openModal(template:TemplateRef<any>) {
        // this.inviteRequest = new InviteRequest();
        this.modalRef = this.modalService.show(template);
    }

    show() {
        !this.openDropdown ? this.openDropdown = true : this.openDropdown = false;
    }

    onClickedOutside(e:Event) {
        this.openDropdown = false;

        if(this.searchField) {
            this.searchField = "";
            this.orgs = this.ss.getUsersOrg();
        }
    }

    increase() {
        this.sidenavWidth = 16;
    }

    decrease() {
        this.sidenavWidth = 4;
    }

    toggleNavFromHam(increase:boolean) {
        if (increase) {
            this.hamburgerClicked = true;
            this.increase();
        } else {
            this.hamburgerClicked = false;
            this.decrease();
        }
    }

    toggleNavFromMouseEvent(increase:boolean) {
        if (increase) {
            !this.hamburgerClicked ? this.increase() : '';
        } else {
            //when closing side nav, check if a search operation was made and return the initial state of the searched items
            if(this.searchField) {
                this.searchField = "";
                this.orgs = this.ss.getUsersOrg();
            }

            this.openDropdown = false;
            !this.hamburgerClicked ? this.decrease() : '';
        }
    }

    toggleManageAdmin() {
        this.users = this.ss.getAdminUsers();
    }


    fetchAdminUsers() {
        this.contentService.fetchUsersInAnOrg(this.selectedOrg.orgId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.users = result.users? result.users: [];
                        this.ss.setAdminUsers(this.users);
                    } else {

                    }
                },
                error => {
                }
            )
    }

    fetchUsersOrg() {
        this.fetchOrgFromCache();
    }

    fetchOrgFromCache() {
        if (!this.ss.getUsersOrg() || this.ss.getUsersOrg().length == 0) {
            this.callUsersOrgService();
        } else {
            this.orgs = this.ss.getUsersOrg();
            this.setDefaultSelectedOrg();
        }
    }

    setDefaultSelectedOrg() {
        if (!this.selectedOrg.orgId) {
            if (this.orgs.length > 0) {
                this.selectedOrg = this.orgs[0];
                this.ss.setSelectedOrg(this.orgs[0]);
                this.setOrgRole();

                this.mService.setSelectedOrg(this.orgs[0].orgId);
            }
        }
        this.fetchAdminUsers();
        this.callLocationService();
    }

    callUsersOrgService() {
        this.contentService.fetchUsersOrg()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.orgs = result.organisations ? result.organisations : [];
                        //cache orgs
                        this.cacheOrg();
                        this.setDefaultSelectedOrg();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }


    cacheOrg() {
        this.ss.cacheUsersOrg(this.orgs);
    }

    getOrgRequestObject() {
        this.orgRequest.createdBy = this.ss.getLoggedInUserEmail();
    }

    saveOrg() {
        this.getOrgRequestObject();
        this.callOrgCreationService();
    }

    callOrgCreationService() {
        this.contentService.createOrg(this.orgRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.modalRef.hide();

                        this.orgs.push(result.organisation);
                        this.updateOrgRoles(result.organisation);
                        this.selectOrg(result.organisation);

                        this.router.navigate(['/portal/config']);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    selectOrg(org:Org) {
        //change selected state
        this.selectedOrg = org;
        this.ss.setSelectedOrg(org);
        this.setOrgRole();

        this.fetchAdminUsers();
        this.callLocationService();
        this.mService.setSelectedOrg(org.orgId);
    }

    updateOrgRoles(org:any) {
        let arr = [{orgId: org.orgId, role: "GENERAL_ADMIN"}];

        this.ss.setOrgRoles(arr);
    }

    setOrgRole() {
        this.ss.setSelectedOrgRole(null);
        let orgRoles:any[] = this.ss.getOrgRoles();

        if(orgRoles.length > 0) {
            for(let obj of orgRoles) {
                if(obj.orgId == this.selectedOrg.orgId) {
                    this.ss.setSelectedOrgRole(obj.role);
                }
            }
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }

    onResizeByWindowScreen() {
        if (window.screen.width < 845) {
            this.sideNavMode = "over";
            this.opener = false;
        }
        else {
            this.sideNavMode = "side";
            this.opener = true;
        }

    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth < 845) {
            this.sideNavMode = "over";
            this.opener = false;
        }
        else {
            this.sideNavMode = "side";
            this.opener = true;
        }
    }

    callLocationService() {
        this.contentService.fetchOrgLocations(this.selectedOrg.orgId)
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

    getSelectedLocationName() {
        if (this.inviteRequest.locIds.length > 0) {
            for (let l of this.locations) {
                if (l.locId == this.inviteRequest.locIds[0]) {
                    return l.name;
                }
            }
        }
    }

    inviteAdmin() {
        if(!this.isInviteFormValid()) {
            return;
        }

        this.configService.inviteAttendees(this.inviteRequest)
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
        if(!this.inviteRequest.role) {
            this.ns.showError("You must select a role.");
            return false;
        }

        if(this.inviteRequest.role == "LOCATION_ADMIN") {
            if(this.inviteRequest.locIds.length == 0) {
                this.ns.showError("You must select at least one location");
                return false;
            }
        }

        return true;
    }

    viewAdminDetails(user, template:TemplateRef<any>) {
        this.inviteRequest = new InviteRequest();
        this.selectedUser = user;
        this.inviteRequest.role = user.role;
        this.inviteRequest.locIds = user.locIds? user.locIds: [];
        this.inviteRequest.email = user.email;

        this.openModal(template);
    }

    inviteAdminModal(template: TemplateRef<any>) {
        this.inviteRequest = new InviteRequest();

        this.openModal(template);
    }

  notificationModal(template: TemplateRef<any>) {
    this.openModal(template);
  }


  assignAdmins() {
        if(!this.isInviteFormValid()) {
            return;
        }

        this.configService.assignAdmins(this.inviteRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.fetchAdminUsers();
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

    removeAdmin() {
        this.adminRemovalRequest.userId = this.selectedUser.userId;
        this.adminRemovalRequest.role = this.selectedUser.role;

        this.contentService.removeAdmin(this.adminRemovalRequest)
            .subscribe(
                result => {
                    let res:any = result;
                    if (res.code == 0) {
                        this.fetchAdminUsers();
                        this.modalRef.hide();
                        this.ns.showSuccess(res.description);
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }


}
