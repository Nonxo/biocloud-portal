import {Component, OnInit, TemplateRef} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalService, BsModalRef, ModalOptions} from "ngx-bootstrap/index";
import {LocationRequest} from "../app-config/model/app-config.model";
import {SetupComponent} from "../app-config/setup/setup.component";
import {AddAttendeesComponent} from "../app-config/add-attendees/add-attendees.component";
import {Router} from "@angular/router";
import {DataService} from "../../../service/data.service";
import * as moment from "moment";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    locationsSubscription:any;
    editLocationsSubscription:any;
    latestClockin: Object[] = [];
    totalClockin:number;
    orgId:string;
    pageSize = 5;
    counts:number;
    pageNo = 1;
    userId:string;
    startDate = moment().startOf('day').toDate().getTime();
    endDate = moment().endOf('day').toDate().getTime();
    locations:any[] = [];
    bsModalRef:BsModalRef;
    modalOptions:ModalOptions = new ModalOptions();
    pendingAttendees:any[] = [];
    time: Date = new Date();
    orgRole:string;

    constructor(private mService:MessageService,
                private ns:NotifyService,
                private contentService:AppContentService,
                private ss:StorageService,
                private modalService:BsModalService,
                private router:Router,
                private dataService:DataService) {
        this.userId = this.ss.getUserId();
    }

    ngOnInit() {
        this.mService.setTitle("Dashboard");
        this.orgRole = this.ss.getSelectedOrgRole();

        if (this.ss.getSelectedOrg()) {
            this.orgId = this.ss.getSelectedOrg().orgId;
            this.callLocationService();
            this.fetchClockInsHistory();
            this.fetchTotalEmployeeCount();
            this.fetchTotalClockIns();


        }

        this.locationsSubscription = this.mService.getSelectedOrg()
            .subscribe(
                result => {
                    if(this.orgId != result) {
                        this.orgId = result;
                        this.callLocationService();
                        this.fetchClockInsHistory();
                        this.fetchTotalEmployeeCount();
                        this.fetchTotalClockIns();
                    }

                    this.orgRole = this.ss.getSelectedOrgRole();
                }
            )

        this.editLocationsSubscription = this.mService.isEditLocation()
            .subscribe(
                result => {
                    if(result) {
                        this.callLocationService();
                    }
                }
            )


    }

    callLocationService() {
        this.mService.setDisplay(true);
        this.contentService.fetchOrgUsersLocation()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations ? result.locations : [];
                        this.mService.setDisplay(false);
                    } else {
                        this.ns.showError(result.description);
                        this.locations = [];
                        this.mService.setDisplay(false);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                    this.locations = [];
                    this.mService.setDisplay(false);
                }
            )
    }

    editLocation(loc:LocationRequest) {
        this.openLocationModal(loc);
    }

    invite(locId:string) {
        this.openInviteModal(locId);
    }

    openLocationModal(loc:LocationRequest) {
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalOptions.initialState = {
            locRequest: JSON.parse(JSON.stringify(loc)),
            editMode: true,
            lat: loc.latitude? loc.latitude: 9.0820,
            lng: loc.longitude? loc.longitude: 8.6753
    }
        ;
        this.bsModalRef = this.modalService.show(SetupComponent, this.modalOptions);
    }

    openInviteModal(locId:string) {
        this.modalOptions.class = 'modal-md mt-0';
        this.modalOptions.initialState = {
            editMode: true,
            location: locId
        }
        this.bsModalRef = this.modalService.show(AddAttendeesComponent, this.modalOptions);
    }

    viewAttendees(locId:string) {
        this.dataService.setLocId(locId);
        this.mService.setHomeLinkActive(false);
        this.router.navigate(['/portal/manage-users']);
    }

    activateLocation(status:boolean, locId:string) {
        let active = status? false:true;
        this.contentService.activateLocation(active, locId)
            .subscribe(
                result => {
                    if(result.code == 0) {

                        this.setStatus(active, locId);

                        this.ns.showSuccess(result.description);
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    setStatus(status:boolean, locId:string) {
        for(let f of this.locations) {
            if(locId == f.locId) {
                f.active = status;
                return;
            }
        }
    }

    openModal(template:TemplateRef<any>) {
        this.bsModalRef = this.modalService.show(template);
    }

    viewPendingAttendees(template:TemplateRef<any>, locId:string) {
        this.fetchPendingAttendees(locId);
        this.openModal(template);
    }

    fetchPendingAttendees(locId:string) {
        this.contentService.fetchPendingAttendees(this.ss.getSelectedOrg().orgId, locId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.pendingAttendees = result.attendees;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    fetchClockInsHistory() {
      this.contentService.clockInsHistory(this.orgId, this.pageSize, this.pageNo)
        .subscribe(
          result => {
            if (result.code == 0) {
              this.latestClockin = result.clockInHistory ? result.clockInHistory : [];
            }else {
                this.latestClockin = [];
            }
          },
            error => {this.latestClockin = [];}

        )
    }

    fetchTotalEmployeeCount(){
      this.contentService.totalEmployeeCount(this.userId,this.orgId)
        .subscribe(
          result => {
            if (result.code == 0) {
              this.counts = result.count;
            }
          },
        )
    }

    fetchTotalClockIns(){
      this.contentService.totalClockInsDaily(this.orgId, this.startDate, this.endDate)
        .subscribe(
          result => {
            if (result.code == 0) {
              this.totalClockin = result.total;
            }

          },
        )
    }

}

