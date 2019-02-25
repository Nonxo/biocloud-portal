import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/index";
import {LocationRequest} from "../app-config/model/app-config.model";
import {SetupComponent} from "../app-config/setup/setup.component";
import {AddAttendeesComponent} from "../app-config/add-attendees/add-attendees.component";
import {Router} from "@angular/router";
import {DataService} from "../../../service/data.service";
import * as moment from "moment";
import {AssignUserRequest, Location} from "../model/app-content.model";


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
    locations:Location[] = [];
    bsModalRef:BsModalRef;
    modalOptions:ModalOptions = new ModalOptions();
    pendingAttendees:any[] = [];
    time: Date = new Date();
    orgRole:string;
    selectedLocId:string;
    noOfAttendees:number;
    assignRequestObj:AssignUserRequest = new AssignUserRequest();
    @ViewChild("deactivateLocation") public deactivateLocation: TemplateRef<any>;
    @ViewChild("deleteLocationConfirmation") public deleteLocationConfirmation: TemplateRef<any>;
    selectedLocObj: any;

    constructor(private mService:MessageService,
                private ns:NotifyService,
                private contentService:AppContentService,
                private ss:StorageService,
                private modalService:BsModalService,
                private router:Router,
                private dataService:DataService) {
        this.userId = this.ss.getUserId();

        this.mService.getUpdateLocation().debounceTime(5000)
            .subscribe(
                result => {
                    result == true? this.callLocationService():'';
                }
            )
    }

    ngOnInit() {
        this.mService.setTitle("Dashboard");
        this.orgRole = this.ss.getSelectedOrgRole();

        if (this.ss.getSelectedOrg()) {
            this.orgId = this.ss.getSelectedOrg().orgId;
            this.callLocationService();
            this.fetchTotalEmployeeCount();

        }

        this.locationsSubscription = this.mService.getSelectedOrg().debounceTime(400)
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

        // this.editLocationsSubscription = this.mService.isEditLocation().debounceTime(5000)
        //     .subscribe(
        //         result => {
        //             if(result) {
        //                 debugger;
        //                 this.callLocationService();
        //             }
        //         }
        //     )



    }

    callLocationService() {
        this.mService.setDisplay(true);
        this.contentService.fetchOrgUsersLocation()
            .finally(() => {this.mService.setDisplay(false);})
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations ? result.locations : [];
                        // this.locations.forEach(x=>x.deleted=true);console.log(this.locations);
                        this.locations.sort((a,b) => b.created - a.created);
                        this.fetchTotalClockIns();
                        this.fetchClockInsHistory();
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



    editLocation(loc:LocationRequest) {
        this.ss.setLocationObj(loc);
        this.router.navigate(['/portal/config']);
        // this.openLocationModal(loc);
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

    deleteLocation() {
        this.assignRequestObj.oldlocId = this.selectedLocId;

        if(this.assignRequestObj.newlocId) {
            this.assignUsers(true);
        } else {
            this.callDeteLocationService(this.selectedLocId);
        }


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

    deleteLocationConfirmationPopup(locId:string, noOfAttendees:number) {
        this.selectedLocId = locId;
        this.noOfAttendees = noOfAttendees;

        this.openModal(this.deleteLocationConfirmation);
    }

    callActivateLocationService(active:boolean, locId:string) {
        this.contentService.activateLocation(active, locId)
            .finally(() => {!active? this.bsModalRef.hide():''})
            .subscribe(
                result => {
                    if(result.code == 0) {

                        this.setStatus(active, locId);

                        if(!active && this.assignRequestObj.newlocId) {
                            this.assignUsers(false);
                        }

                        this.ns.showSuccess(result.description);
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    callDeteLocationService(locId: string) {
        // let location: Location = this.locations.find(loc => loc.locId == locId);

        this.contentService.deleteLocation(locId)
            .finally(() => { this.bsModalRef.hide() })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.callLocationService();
                        this.fetchTotalEmployeeCount();

                        this.ns.showSuccess(result.description);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => { this.ns.showError("An Error Occurred."); }
            )
    }

    assignUsers(deleted: boolean) {
        this.contentService.assignLocusers(this.assignRequestObj)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess(result.description);

                        if(deleted) {
                            this.callDeteLocationService(this.selectedLocId);
                        } else {
                            this.callLocationService();
                        }

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
        this.locations.forEach((obj) => {
            this.totalClockin = this.totalClockin + obj.noOfClockInForToday;
        })
    }

    getLocAddress(): string {
        if(this.selectedLocObj.locationType == "SPECIFIC_ADDRESS") {
            return this.selectedLocObj.address;
        }

        if(this.selectedLocObj.locationType == "COUNTRY") {
            return this.selectedLocObj.country;
        }

        if(this.selectedLocObj.locationType == "STATE") {
            return this.selectedLocObj.state;
        }

        return "N/A";
    }

    viewLocDetails(loc: any, template: TemplateRef<any>) {
        this.selectedLocObj = loc;
        this.openModal(template);
    }

    addCompany() {
        // this.mService.setCreateOrg(true);
        this.router.navigate(['/onboard']);
    }

    ngOnDestroy(): void {
        this.bsModalRef? this.bsModalRef.hide():'';
    }

}

