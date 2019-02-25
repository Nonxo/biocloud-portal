import {Component, OnInit} from '@angular/core';
import {SharedService} from "../service/sharedService";

@Component({
  selector: 'app-location-step-two',
  templateUrl: './location-step-two.component.html',
  styleUrls: ['./location-step-two.component.css']
})
export class LocationStepTwoComponent implements OnInit {

  constructor(private sharedService: SharedService) {
      this.sharedService.tab = 2;
  }

  ngOnInit() {
  }

}
