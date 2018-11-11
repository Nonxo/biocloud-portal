import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../components/auth/auth.service";
import {NotifyService} from "../../../service/notify.service";

@Component({
    selector: 'app-flow-two',
    templateUrl: './flow-two.component.html',
    styleUrls: ['./flow-two.component.css']
})
export class FlowTwoComponent implements OnInit {

    loginFlag: boolean = false;
    email: string;
    token: string;
    step: number = 1;

    constructor(private route: ActivatedRoute, private authService: AuthService, private ns: NotifyService) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.loginFlag = (params['login'] == 'true') || false;
                    this.email = params['email'] || null;
                    this.token = params['token'] || null;

                    if (this.email && this.token) {
                        //cal service to verify email and token
                        this.verifyToken();

                        //display message if token is invalid
                        //set step to 2
                    }
                }
            )
    }

    ngOnInit() {
    }

    verifyToken() {
        this.authService.verifyUserToken(this.email, this.token)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.step = 2;

                    } else {
                        this.ns.showError(result.description);
                    }

                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    viewLoginPage(value: boolean) {
        this.loginFlag = value;
    }

    getSignupStep(event) {
        this.step = event;
    }
}
