import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-flow-two',
    templateUrl: './flow-two.component.html',
    styleUrls: ['./flow-two.component.css']
})
export class FlowTwoComponent implements OnInit {

    loginFlag: boolean = false;

    constructor(private route: ActivatedRoute) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.loginFlag = (params['login'] == 'true') || false;
                }
            )
    }

    ngOnInit() {
    }

    viewLoginPage(value: boolean) {
        this.loginFlag = value;
    }

}
