import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {AssignUserRequest} from "../model/app-content.model";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

    locationsSubscription:any;
    editLocationsSubscription:any;
    latestClockin: Object[] = [];
    totalClockin:number = 0;
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
    selectedLocId:string;
    noOfAttendees:number;
    assignRequestObj:AssignUserRequest = new AssignUserRequest();
    @ViewChild("deactivateLocation")public deactivateLocation: TemplateRef<any>;

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
            this.fetchTotalEmployeeCount();

        }

        this.locationsSubscription = this.mService.getSelectedOrg()
            .subscribe(
                result => {
                    if(this.orgId != result) {
                        this.orgId = result;
                        this.callLocationService();
                        this.fetchTotalEmployeeCount();
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
                        this.fetchTotalClockIns();
                        this.fetchClockInsHistory();
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

    viewReport(locId:string) {
        this.dataService.setLocId(locId);
        this.mService.setHomeLinkActive(false);
        this.router.navigate(['/portal/report-dashboard']);
    }

    deactivateUser() {
        this.assignRequestObj.oldlocId = this.selectedLocId;
        this.callActivateLocationService(false, this.selectedLocId);

    }

    activateLocation(status:boolean, locId:string, noOfAttendees:number) {
        this.selectedLocId = locId;
        this.noOfAttendees = noOfAttendees;
        let active = status? false:true;

        if(active) {
            this.callActivateLocationService(active, locId);
        } else {
            this.openModal(this.deactivateLocation);
        }

    }

    callActivateLocationService(active:boolean, locId:string) {
        this.contentService.activateLocation(active, locId)
            .finally(() => {!active? this.bsModalRef.hide():''})
            .subscribe(
                result => {
                    if(result.code == 0) {

                        this.setStatus(active, locId);

                        if(!active && this.assignRequestObj.newlocId) {
                            this.assignUsers();
                        }

                        this.ns.showSuccess(result.description);
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    assignUsers() {
        this.contentService.assignLocusers(this.assignRequestObj)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.callLocationService();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred");}
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
      this.contentService.clockInsHistory(this.orgId, this.pageSize, this.pageNo, this.locations)
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
        this.totalClockin = 0;
      // this.contentService.totalClockInsDaily(this.orgId, this.startDate, this.endDate)
      //   .subscribe(
      //     result => {
      //       if (result.code == 0) {
      //         this.totalClockin = result.total;
      //       }
      //
      //     },
      //   )
        this.locations.forEach((obj) => {
            this.totalClockin = this.totalClockin + obj.noOfClockInForToday;
        })
    }

    ngOnDestroy(): void {
        this.bsModalRef? this.bsModalRef.hide():'';
    }

}

