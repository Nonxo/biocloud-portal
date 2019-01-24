import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-manage-schedule',
  templateUrl: './manage-schedule.component.html',
  styleUrls: ['./manage-schedule.component.css']
})
export class ManageScheduleComponent implements OnInit {

  modalRef: BsModalRef;

  isChecked: boolean = false

  isCreateNewShift: boolean = true

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  chkShift() {
    this.isCreateNewShift = false;
    this.isChecked = true
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

}
