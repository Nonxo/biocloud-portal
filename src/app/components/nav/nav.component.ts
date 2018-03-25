import {Component, OnInit, TemplateRef, HostListener, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {BsModalService, BsModalRef} from "ngx-bootstrap/index";
import {StorageService} from "../../service/storage.service";
import {AppContentService} from "../../pages/app-content/services/app-content.service";
import {NotifyService} from "../../service/notify.service";
import {
  CreateOrgRequest, Org, AdminRemovalRequest, Invitation,
  ApproveRequest
} from "../../pages/app-content/model/app-content.model";
import {MessageService} from "../../service/message.service";
import {InviteRequest} from "../../pages/app-content/app-config/model/app-config.model";
import {SearchService} from "../../service/search.service";
import {Subject} from "rxjs/Subject";
import {AuthService} from "../auth/auth.service";
import {PictureUtil} from "../../util/PictureUtil";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    sideNavMode = "side";
    opener: boolean = true;
    modalRef: BsModalRef;
    selectedUser: any;
    manageAdmin: boolean;
    locations: any[] = [];
    users: any[] = [];
    uploadedFileName:string;
    adminRemovalRequest: AdminRemovalRequest = new AdminRemovalRequest();
    views: Object[] = [
        {icon: "group", route: "Employees", url: "/portal/manage-users", authority: ['GENERAL_ADMIN', 'LOCATION_ADMIN']},
        {icon: "insert_chart", route: "Report", url: "/portal/report-dashboard", authority: ['GENERAL_ADMIN', 'LOCATION_ADMIN']}
        // {icon: "payment", route: "Subscribe", url: "/portal/subscribe", authority: "GENERAL_ADMIN"}
    ];

    orgTypes: string[] = ["SCHOOL", "SECURITY", "HOSPITAL"];
    orgs:Org[] = [];
    orgId: string;
    orgRequest:CreateOrgRequest = new CreateOrgRequest();
    selectedOrg:Org = new Org();
    sidenavWidth = 16;
    openDropdown:boolean;
    approveRequest: ApproveRequest = new ApproveRequest();
    notifications: Object[] = [];
    selectedLocIds:string[] = [];
    hamburgerClicked:boolean = true;
    details: Invitation = new Invitation();
    title:string = "Dashboard";
    selectedEmail:string;
    inviteRequest:InviteRequest = new InviteRequest();
    currentUserEmail:string = this.ss.getLoggedInUserEmail();
    username = this.ss.getUserName();
    @ViewChild("assignLocation") public assignLocation: TemplateRef<any>;

    searchField:string;
    searchOrgTerm$ = new Subject<any>();
    searchType:string;
    activeClass:string;
    editOrgMode: boolean;


    constructor(private router:Router,
                private authService: AuthService,
                private modalService:BsModalService,
                private ss:StorageService,
                private contentService:AppContentService,
                private ns:NotifyService,
                private mService:MessageService,
                private pictureUtil:PictureUtil,
                private searchService:SearchService) {

        if(this.router.url == "/portal") {
            this.activeClass = "active";
        }

        //subscribe to search observable
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

        //subscribe to homeLinkActive Observable
        this.mService.isHomeLinkActive()
            .subscribe(
                result => {
                    !result? this.activeClass = "":'';
                }
            )

        //subscribe to title Observable
        this.mService.getTitle()
            .subscribe(
                result => {
                    result? this.title = result:'';
                }
            )

    }

    ngOnInit() {
        this.selectedOrg = this.ss.getSelectedOrg() ? this.ss.getSelectedOrg() : new Org();

        //if an org is already selected, update role
        if(this.selectedOrg.orgId) {
            this.setOrgRole();
            this.mService.setSelectedOrg(this.selectedOrg.orgId);
        }

        this.fetchUsersOrg();
        this.onResizeByWindowScreen();
        this.callNotificationService();
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

  openAttendeesDetailsModal(template: TemplateRef<any>, locIds:string[], inviteId: string) {
    this.selectedLocIds = [];
    this.selectedLocIds = locIds;
    this.callNotificationServiceDetails(inviteId);
    this.openModal(template);
  }

  openLocationModal() {
    this.openModal(this.assignLocation);
    this.callLocationService();


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
  callNotificationService() {
    this.contentService.fetchNotification(this.selectedOrg.orgId)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.notifications = result.attendees? result.attendees: [];
            this.notifications.length;
          } else {
              this.notifications = [];
          }
        },
        error => {
            this.notifications = [];
        }
      )
  }

  callNotificationServiceDetails(inviteId: string) {
    this.contentService.fetchNotificationDetails(inviteId)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.details = result.invitation;
          } else {
            this.ns.showError(result.description);
          }
        },
        error => {
          this.ns.showError("An Error Occurred");
        }
      )
  }
  callApproveService(inviteId:string) {
    this.contentService.approveRejectNotification(inviteId, this.approveRequest)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.ns.showSuccess("Notification Approved");
            this.modalRef.hide();
            this.callNotificationService();

          } else {
            this.ns.showError(result.description);
          }
        },
        error => {this.ns.showError("An Error Occurred");}
      )
  }

  approveNotifications(email:string, inviteId:string, status:string) {

    this.approveRequest.status = status;

    if (this.selectedLocIds && this.selectedLocIds.length > 0) {
      this.callApproveService(inviteId);
    } else {

      this.modalRef.hide();
      this.selectedEmail = email;
      this.openLocationModal()
    }

  }

  rejectNotifications(email:string, inviteId:string, status:string) {
    this.approveRequest.status = status;

    if (this.selectedLocIds || this.selectedLocIds.length == 0) {
      this.callRejectService(inviteId);

    } else {
      this.modalRef.hide();
      this.selectedEmail = email;

    }
  }

  callRejectService(inviteId:string) {
    this.contentService.approveRejectNotification(inviteId, this.approveRequest)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.ns.showSuccess("Notification Rejected");
            this.modalRef.hide();
            this.callNotificationService();

          } else {
            this.ns.showError(result.description);
          }
        },
        error => {this.ns.showError("An Error Occurred");}
      )
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
        this.editOrgMode? this.callOrgEditService():this.callOrgCreationService();
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

    callOrgEditService() {
        this.contentService.updateOrg(this.orgRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.modalRef.hide();
                        this.updateOrg(result.organisation);
                        this.cacheOrg();
                        this.selectOrg(result.organisation);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    updateOrg(org:Org) {
        for(let o of this.orgs) {
            if(o.orgId == org.orgId) {
                o.logo = org.logo;
                o.name = org.name;
                o.sector = org.sector;
                return;
            }
        }
    }

    selectOrg(org:Org) {
        //change selected state
        this.selectedOrg = org;
        this.ss.setSelectedOrg(org);
        this.setOrgRole();

        this.fetchAdminUsers();
        this.callLocationService();
        this.callNotificationService();
        this.router.navigate(['/portal']);
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
        // this.contentService.fetchOrgLocations(this.selectedOrg.orgId)
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

    createOrg(template: TemplateRef<any>) {
        this.editOrgMode = false;
        this.uploadedFileName = "";
        this.orgRequest = new CreateOrgRequest();
        this.openModal(template);
    }

    editOrg(template: TemplateRef<any>) {
        this.editOrgMode = true;
        this.uploadedFileName = "";
        this.orgRequest.type = this.selectedOrg.sector;
        this.orgRequest.name = this.selectedOrg.name;
        this.orgRequest.logo = this.selectedOrg.logo;
        this.openModal(template);
    }

    notificationModal(template: TemplateRef<any>) {
        this.openModal(template);
    }


    toggleClass(home:boolean) {
        home? this.activeClass = "active": this.activeClass = "";
    }

    goToProfile() {
      this.router.navigate(['/portal/profile']);
    }

    fileChange(event){
        if (this.pictureUtil.restrictFilesSize(event.target.files[0].size)) {
            this.uploadedFileName = event.target.files[0].name;
            this.readFiles(event.target.files);
        } else {
            this.ns.showError('Picture size is more than 100kb. Select another');
            this.uploadedFileName = "";
            this.orgRequest.logo = "";
        }
    }

    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    readFiles(files, index = 0){
        let reader = new FileReader();

        if (index in files) {
            this.readFile(files[index], reader,(result) => {
                var img = document.createElement("img");
                img.src = result;

                this.pictureUtil.resize(img, 250, 250, (resized_jpeg, before, after)=> {
                    this.orgRequest.logo = resized_jpeg;
                    this.readFiles(files, index + 1);

                });
            });
        } else {
        }
    }
}
