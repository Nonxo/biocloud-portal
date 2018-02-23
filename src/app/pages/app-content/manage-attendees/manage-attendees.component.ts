import {Component, OnInit, TemplateRef} from '@angular/core';
import {AppContentService} from "../services/app-content.service";
import {StorageService} from "../../../service/storage.service";
import {NotifyService} from "../../../service/notify.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/index";

@Component({
    selector: 'app-manage-attendees',
    templateUrl: './manage-attendees.component.html',
    styleUrls: ['./manage-attendees.component.css']
})
export class ManageAttendeesComponent implements OnInit {

    data:Object[] = [];
    orgId:string;
    modalRef:BsModalRef;

    constructor(private contentService:AppContentService,
                private ss:StorageService,
                private ns:NotifyService,
                private modalService:BsModalService) {
        this.orgId = this.ss.getSelectedOrg().orgId;
    }

    ngOnInit() {
        this.fetchUsers();
    }

    fetchUsers() {
        this.contentService.fetchUsersInAnOrg(this.orgId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.data = result.users;
                    }
                },
                error => {}
            )
    }

    selectAll(event) {
        if (event.checked) {
            this.data.map((x:any) => {
                x.checked = true;
                return x
            });
        } else {
            this.data.map((x:any) => {
                x.checked = false;
                return x
            });
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    openAssignModal(template) {
        this.openModal(template);
    }

    openActivateUserModal(template){
        this.openModal(template);
    }

}
