import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {NotifyService} from "../../../service/notify.service";
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {ApproveRequest, Invitation} from "../model/app-content.model";
import {MessageService} from "../../../service/message.service";
import {ConfirmLocationComponent} from "../confirm-location/confirm-location.component";
import {ModalOptions} from "ngx-bootstrap";


@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    modalRef: BsModalRef;
    orgId: string;
    inviteId: string;
    locations: any[] = [];
    approveRequest: ApproveRequest = new ApproveRequest();
    selectedLocIds: string[] = [];
    notifications: Object[] = [];
    details: Invitation = new Invitation();
    created: Date = new Date();
    @ViewChild("assignLocation") public assignLocation: TemplateRef<any>;
    selectedEmail: string;
    modalOptions:ModalOptions = new ModalOptions();


    constructor(private modalService: BsModalService,
                private ns: NotifyService,
                private contentService: AppContentService,
                private ss: StorageService,
                private mService: MessageService) {
    }

    ngOnInit() {
        this.mService.setTitle("Notifications");

        if (this.ss.getSelectedOrg()) {
            this.orgId = this.ss.getSelectedOrg().orgId;
            this.callNotificationService();
        }

    }

    openLocationConfirmationModal(loc:any) {
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalOptions.initialState = {
            locRequest: JSON.parse(JSON.stringify(loc)),
            editMode: true,
            lat: loc.latitude? loc.latitude: 9.0820,
            lng: loc.longitude? loc.longitude: 8.6753
        }
        ;
        this.modalRef = this.modalService.show(ConfirmLocationComponent, this.modalOptions);
    }


    openAttendeesDetailsModal(template: TemplateRef<any>, locIds: string[], inviteId: string) {
        this.details = new Invitation();
        this.callNotificationServiceDetails(inviteId);
        this.selectedLocIds = [];
        this.selectedLocIds = locIds;
        this.openModal(template);

    }

    openLocationModal() {
        this.openModal(this.assignLocation);
        this.callLocationService();


    }

    openModal(viewDetails: TemplateRef<any>) {
        this.modalRef = this.modalService.show(viewDetails);
    }


    callNotificationService() {
        this.mService.setDisplay(true)

        this.contentService.fetchNotification(this.orgId)
            .finally(() => {
                this.mService.setDisplay(false)
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.notifications = result.notif ? result.notif : [];
                    } else {
                        this.ns.showError(result.description)
                    }
                },
                error => {
                    this.ns.showError("An error Occurred");
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
                    this.ns.showError("An error Occurred");
                }
            )
    }


    approveNotifications(email: string, inviteId: string, status: string) {

        this.approveRequest.status = status;

        if (this.selectedLocIds && this.selectedLocIds.length > 0) {
            this.callApproveService(inviteId);
        } else {

            this.modalRef.hide();
            this.selectedEmail = email;
            this.openLocationModal()
        }

    }

    rejectNotifications(email: string, inviteId: string, status: string) {
        this.approveRequest.status = status;

        if (!this.selectedLocIds || this.selectedLocIds.length > 0) {
            this.callRejectService(inviteId);

        } else {
            this.modalRef.hide();
            this.selectedEmail = email;

        }
    }


    confirmAssignment(inviteId: string) {
        if (this.approveRequest.locIds.length == 0) {
            this.ns.showError("You must select at least one location");
            return;
        }

        this.callApproveService(inviteId);
    }


    callApproveService(inviteId: string) {
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
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    callRejectService(inviteId: string) {
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
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }


    callLocationService() {
        this.contentService.fetchOrgLocations(this.orgId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations;
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

    getSelectedLocationName() {
        if (this.approveRequest.locIds.length > 0) {
            for (let l of this.locations) {
                if (l.locId == this.approveRequest.locIds[0]) {
                    return l.name;
                }
            }
        }
    }


    ngOnDestroy() {
        this.modalRef? this.modalRef.hide():'';
    }
}
