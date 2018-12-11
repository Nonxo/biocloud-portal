import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../components/auth/auth.service";
import {NotifyService} from "../../../service/notify.service";
import {MessageService} from "../../../service/message.service";

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
    otpMode: boolean;

    constructor(private route: ActivatedRoute, private authService: AuthService, private ns: NotifyService, private mService: MessageService) {
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
                    }
                }
            )
    }

    ngOnInit() {
    }

    verifyToken() {
        this.mService.setDisplay(true);

        this.authService.verifyUserToken(this.email, this.token)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.step = 2;

                    } else {
                        this.ns.showError(result.description);
                    }
                        this.mService.setDisplay(false);


                },
                error => {
                    this.ns.showError("An Error Occurred");
                    this.mService.setDisplay(false);
                }
            )
    }

    viewLoginPage(value: boolean) {
        this.loginFlag = value;
    }

    getSignupStep(event) {
        this.step = event;
    }

    getOtpMode(event) {
        this.otpMode = event;
    }
}
