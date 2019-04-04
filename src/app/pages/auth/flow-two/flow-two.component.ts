import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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

    constructor(private route: ActivatedRoute, private authService: AuthService, private ns: NotifyService, private mService: MessageService, private router: Router) {
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
                    } else {
                        if (this.email) {
                            this.step = 2;
                        }
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
        !this.loginFlag? this.step = 1: '';
    }

    getSignupStep(event) {
        this.step = event;
    }
}
