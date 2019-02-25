import {Component, OnInit} from '@angular/core';
import {SharedService} from "../service/sharedService";

@Component({
  selector: 'app-location-step-one',
  templateUrl: './location-step-one.component.html',
  styleUrls: ['./location-step-one.component.css']
})
export class LocationStepOneComponent implements OnInit {

  constructor(private sharedService: SharedService) {
      this.sharedService.tab = 2;
  }

  ngOnInit() {
  }

}
