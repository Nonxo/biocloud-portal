import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../../components/auth/auth.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {NotifyService} from "../../../../service/notify.service";
import {MessageService} from "../../../../service/message.service";
import {StorageService} from "../../../../service/storage.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    sideNavMode = "side";
    opener: boolean = true;
    modalRef: BsModalRef;
    selectedUser: any;
    locations: any[] = [];
    users: any[] = [];
    hoverState:boolean;
    views: Object[] = [
        {
            icon: "group",
            route: "Re-enrolment Request",
            url: "/portal/manage-users",
            authority: ['GENERAL_ADMIN', 'LOCATION_ADMIN']
        },
        {
            icon: "insert_chart",
            route: "Re-enrolment Log",
            url: "/portal/report-dashboard",
            authority: ['GENERAL_ADMIN', 'LOCATION_ADMIN']
        }
        // {icon: "payment", route: "Subscribe", url: "/portal/subscribe", authority: "GENERAL_ADMIN"}
    ];

    orgId: string;
    sidenavWidth = 16;
    openDropdown: boolean;
    retrieveStatus:boolean = true;
    notifications: any[] = [];
    selectedLocIds: string[] = [];
    hamburgerClicked: boolean = true;
    title: string = "Dashboard";
    currentUserEmail: string = this.ss.getLoggedInUserEmail();
    username = this.ss.getUserName();
    userImage = this.ss.getUserImg();
    searchField: string;
    userId:string;
    searchType: string;
    activeClass: string;
    notificationLength: number;
    notifAlert: boolean;
    timer:any;
    loading:boolean;


    constructor(private router: Router,
                private authService: AuthService,
                private modalService: BsModalService,
                private ss: StorageService,
                private ns: NotifyService,
                private mService: MessageService) {


        //subscribe to homeLinkActive Observable
        this.mService.isHomeLinkActive()
            .subscribe(
                result => {
                    !result ? this.activeClass = "" : '';
                }
            )

        //subscribe to title Observable
        this.mService.getTitle()
            .subscribe(
                result => {
                    result ? this.title = result : '';
                }
            )
        //subscribe to userImage Observable
        this.mService.getUserImage()
            .subscribe(
                result => {
                    this.userImage = result ? result : '';
                }
            )
    }

    ngOnInit() {
    }

    openModal(template: TemplateRef<any>) {
        // this.inviteRequest = new InviteRequest();
        this.modalRef = this.modalService.show(template);
    }
    increase() {
        this.sidenavWidth = 16;
    }

    decrease() {
        this.sidenavWidth = 4;
    }

    toggleNavFromHam(increase: boolean) {
        if (increase) {
            this.hamburgerClicked = true;
            this.increase();
        } else {
            this.hamburgerClicked = false;
            this.decrease();
        }
    }

    toggleNavFromMouseEvent(increase: boolean) {
        if (increase) {
            !this.hamburgerClicked ? this.increase() : '';
        } else {
            //when closing side nav, check if a search operation was made and return the initial state of the searched items
            if (this.searchField) {
                this.searchField = "";
            }

            this.openDropdown = false;
            !this.hamburgerClicked ? this.decrease() : '';
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

    toggleClass(home: boolean) {
        home ? this.activeClass = "active" : this.activeClass = "";
    }

    goToProfile() {
        this.router.navigate(['/portal/profile']);
    }


}
