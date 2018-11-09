import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-flow-two',
    templateUrl: './flow-two.component.html',
    styleUrls: ['./flow-two.component.css']
})
export class FlowTwoComponent implements OnInit {

    loginFlag: boolean = false;
    email: string;
    token: string;
    step: number = 3;

    constructor(private route: ActivatedRoute) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.loginFlag = (params['login'] == 'true') || false;
                    this.email = params['email'] || null;
                    this.token = params['token'] || null;

                    if(this.email && this.token) {
                        //cal service to verify email and token

                        //display message if token is invalid
                        //set step to 2
                        this.step = 2;
                    }
                }
            )
    }

    ngOnInit() {
    }

    viewLoginPage(value: boolean) {
        this.loginFlag = value;
    }

    getSignupStep(event) {
        this.step = event;
    }
}
