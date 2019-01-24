import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.css']
})
export class CreateLocationComponent implements OnInit {

    modalRef: BsModalRef;

    step: number = 1;
    isSpecificAdress: boolean = false;
    isState: boolean = false;
    isCountry: boolean = false;
    isNewShift: boolean = false;
    isDeleteShift: boolean = false;
    isSolutions: boolean = false;
    specificEmployee: boolean = false;
    isOtherIssues: boolean = false;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  specificAddress() {
      this.isSpecificAdress = true;
      this.isState = false;
      this.isCountry = false;
  }

  state() {
      this.isState = true;
      this.isSpecificAdress = false;
      this.isCountry = false;
  }

  country() {
      this.isCountry = true;
      this.isSpecificAdress = false;
      this.isState = false;
  }

  addShift() {
      this.isNewShift = true
      this.isDeleteShift = true
  }

  deleteShift() {
      this.isDeleteShift = false
  }

  cantGetLocation() {
      this.isSolutions = true;
      this.specificEmployee = false;
      this.isOtherIssues = false
  }

  otherIssues() {
    this.isSolutions = false;
    this.specificEmployee = false;
    this.isOtherIssues = true
  }

  specificEmployeeClockIn() {
    this.specificEmployee = true
  }

  searchAddressFromRecent() {
    this.specificEmployee = false
  }


nextStep() {
    switch(this.step) {
        case 1: {
            this.step = 2;
            break;
        }

        case 2: {
          this.step = 3;
          break;
      }

      case 3: {
          this.step = 4;
          break;
      }

      case 4: {
          this.step = 5;
          break;
      }

      case 5: {
          break;
      }
    }
}

previousStep() {
  switch(this.step) {
      case 1: {
          break;
      }

      case 2: {
        this.step = 1;
        break;
    }

    case 3: {
        this.step = 2;
        break;
    }

    case 4: {
        this.step = 3;
        break;
    }

  }
}
}
