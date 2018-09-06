import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-flow-one',
  templateUrl: './flow-one.component.html',
  styleUrls: ['./flow-one.component.css']
})
export class FlowOneComponent implements OnInit {

    register: boolean;
    currentTab: number;


    constructor(private route: ActivatedRoute) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.register = (params['signup'] == 'true') || null;
                    if(this.register) {
                        this.currentTab = 1;
                    }
                }
            )
    }

    ngOnInit() {
    }

    onTabChange(event) {

        switch (event.index) {
            case 0: {
                this.currentTab = 0;
                break;
            }
            case 1: {
                this.currentTab = 1;
                this.register = true;
                break;
            }

        }
    }

}
