import {Component, OnInit} from '@angular/core';
import {SharedService} from "../service/sharedService";

@Component({
  selector: 'app-location-step-four',
  templateUrl: './location-step-four.component.html',
  styleUrls: ['./location-step-four.component.css']
})
export class LocationStepFourComponent implements OnInit {

  constructor(private sharedService: SharedService) {
      this.sharedService.tab = 2;
  }

  ngOnInit() {
  }

}
