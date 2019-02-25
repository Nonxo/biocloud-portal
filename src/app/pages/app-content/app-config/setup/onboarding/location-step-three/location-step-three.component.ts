import {Component, OnInit} from '@angular/core';
import {SharedService} from "../service/sharedService";

@Component({
    selector: 'app-location-step-three',
    templateUrl: './location-step-three.component.html',
    styleUrls: ['./location-step-three.component.css']
})
export class LocationStepThreeComponent implements OnInit {

    constructor(private sharedService: SharedService) {
        this.sharedService.tab = 2;
    }

    ngOnInit() {
    }

}
