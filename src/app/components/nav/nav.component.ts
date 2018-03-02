import {Component, OnInit, TemplateRef, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {BsModalService, BsModalRef} from "ngx-bootstrap/index";
import {StorageService} from "../../service/storage.service";
import {AppContentService} from "../../pages/app-content/services/app-content.service";
import {NotifyService} from "../../service/notify.service";
import {CreateOrgRequest, Org} from "../../pages/app-content/model/app-content.model";
import {MessageService} from "../../service/message.service";
import {InviteRequest} from "../../pages/app-content/app-config/model/app-config.model";
import {AppConfigService} from "../../pages/app-content/app-config/services/app-config.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    sideNavMode = "side";
    opener:boolean = true;
    modalRef:BsModalRef;
    selectedUser:Object;
    manageAdmin:boolean;
    locations:any[] = [];
    users:any[] = [];
    views:Object[] = [
        {icon: "home", route: "Home", url: "/portal"},
        {icon: "group", route: "Attendees", url: "/portal/manage-users"},
        {icon: "insert_chart", route: "Report", url: "/portal/report-dashboard"},
        {icon: "payment", route: "Subscribe", url: "/portal/subscribe"}
    ];

    orgTypes:string[] = ["SCHOOL", "SECURITY", "HOSPITAL"];

    navs:Object[] = [
        {icon: "person", route: "Profile", url: "/"},
        {icon: "message", route: "Notifications", url: "/portal/notification"}
    ];
    orgs:Org[] = [];
    orgRequest:CreateOrgRequest = new CreateOrgRequest();
    selectedOrg:Org = new Org();
    sidenavWidth = 16;
    openDropdown:boolean;
    hamburgerClicked:boolean = true;
    title:string = "Home";
    inviteRequest:InviteRequest = new InviteRequest();


    constructor(private router:Router,
                private modalService:BsModalService,
                private ss:StorageService,
                private contentService:AppContentService,
                private ns:NotifyService,
                private mService:MessageService,
                private configService:AppConfigService) {
    }

    ngOnInit() {
        this.selectedOrg = this.ss.getSelectedOrg()? this.ss.getSelectedOrg(): new Org();
        this.fetchUsersOrg();
        this.fetchAdminUsers();
        this.callLocationService();
        this.onResizeByWindowScreen();
    }

    openModal(template:TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    show() {
        !this.openDropdown ? this.openDropdown = true : this.openDropdown = false;
    }

    onClickedOutside(e:Event) {
        this.openDropdown = false;
    }

    increase() {
        this.sidenavWidth = 16;
    }

    decrease() {
        this.sidenavWidth = 4;
    }

    toggleNavFromHam(increase:boolean) {
        if(increase) {
            this.hamburgerClicked = true;
            this.increase();
        } else {
            this.hamburgerClicked = false;
            this.decrease();
        }
    }

    toggleNavFromMouseEvent(increase:boolean) {
        if(increase) {
            !this.hamburgerClicked? this.increase():'';
        } else {
            this.openDropdown = false;
            !this.hamburgerClicked? this.decrease():'';
        }
    }


    fetchAdminUsers() {
        this.contentService.fetchUsersInAnOrg(this.selectedOrg.orgId)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.users = result.users
                    }else {

                    }
                },
                error => {}
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
        if(!this.selectedOrg.orgId) {
            if(this.orgs.length > 0) {
                this.selectedOrg = this.orgs[0];
                this.ss.setSelectedOrg(this.orgs[0]);
                this.mService.setSelectedOrg(this.orgs[0].orgId);
            }
        }
    }

    callUsersOrgService() {
        this.contentService.fetchUsersOrg()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.orgs = result.organisations? result.organisations: [];
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

                        this.orgs.push(result.organisation)
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
        this.mService.setSelectedOrg(org.orgId);
    }


    logout() {
        localStorage.removeItem('_u');
        localStorage.removeItem('_tkn');
        localStorage.removeItem('_orgs');
        localStorage.removeItem('_st');
        this.router.navigate(['/auth']);
    }

    onResizeByWindowScreen(){
        if(window.screen.width < 845){
            this.sideNavMode = "over";
            this.opener = false;
        }
        else{
            this.sideNavMode = "side";
            this.opener = true;
        }

    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if(event.target.innerWidth < 845){
            this.sideNavMode = "over";
            this.opener = false;
        }
        else{
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
                error => {}
            )
    }

    getSelectedLocationName() {
        if (this.inviteRequest.locIds.length > 0) {
            for(let l of this.locations) {
                if (l.locId == this.inviteRequest.locIds[0]) {
                    return l.name;
                }
            }
        }
    }

    inviteAdmin() {
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

    viewAdminDetails(user, template:TemplateRef<any>) {
        this.selectedUser = user;
        this.openModal(template);
    }


}
