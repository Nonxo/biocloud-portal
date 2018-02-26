import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {NotifyService} from "../../../service/notify.service";
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {Invitation} from "../model/app-content.model";
import {Router} from "@angular/router";



@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  modalRef: BsModalRef;
  orgId: string;
  notifications: Object[] = [];
  details: Invitation = new Invitation();
  created: Date = new Date();


  constructor(private modalService: BsModalService,
              private ns: NotifyService,
              private contentService: AppContentService,
              private ss: StorageService,
              private router: Router) {
  }

  openModal(viewDetails: TemplateRef<any>, inviteId: string) {
    this.callNotificationServiceDetails(inviteId);
    this.modalRef = this.modalService.show(viewDetails);
  }






  ngOnInit() {

    if (this.ss.getSelectedOrg()) {
      this.orgId = this.ss.getSelectedOrg().orgId;
      this.callNotificationService();
    }

  }

  callNotificationService() {
    this.contentService.fetchNotification(this.orgId)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.notifications = result.attendees;
          } else {
            this.ns.showError(result.description);
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

  approveRejectNotifications(inviteId:string, action:string) {
    this.contentService.approveRejectNotification(inviteId, action)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.ns.showSuccess("Notification Approved");
            this.modalRef.hide();
            this.router.navigate(['/portal/notification']);

          } else {
            this.ns.showError("An error Occurred");
          }
        }
      )
  }



}
