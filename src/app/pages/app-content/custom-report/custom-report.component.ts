import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';



@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.css']
})
export class CustomReportComponent implements OnInit {
  advances = new FormControl();
  advancedList = [
    'Clock in time', 'Institution', 'Biocloud', 'Staff ID', 'First Name', 'Last Name', 'Email Address','Phone Number','Gender','Device ID','2FA Mode'
  ];
outputs = new FormControl();
// show = false;
outputList = ['Clock in time', 'Institution', 'Biocloud', 'Staff ID', 'First Name', 'Last Name', 'Email Address','Phone Number','Gender','Device ID','2FA Mode','Clock in Result', 'On Time?', 'Expected Location', 'Clock in Location?'];

  constructor() { }

  ngOnInit() {
  }

}
