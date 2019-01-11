import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {StorageService} from "../../../service/storage.service";
import {NotifyService} from "../../../service/notify.service";

declare const gapi: any;

@Component({
    selector: 'app-google-sign-in',
    templateUrl: './google-sign-in.component.html',
    styleUrls: ['./google-sign-in.component.css']
})
export class GoogleSignInComponent implements OnInit, AfterViewInit {


    public auth2: any;

    @Input()
    public isSignIn: boolean;


    constructor(private router: Router,
                private authService: AuthService,
                private ss: StorageService,
                private ns: NotifyService,
                private ngZone: NgZone) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.googleInit();
    }

    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '1024122094553-p6h78fl1nikufo00ern6s9qutgdblni1.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });

            let googleBtns = document.getElementsByClassName('googleBtn');
            for (let i = 0; i < googleBtns.length; i++) {
                this.attachSignin(googleBtns.item(i));
            }
        })
    }

    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {

                this.authService.verifySocialLogin('GOOGLE', googleUser.getAuthResponse().id_token)
                    .subscribe(
                        result => {

                            this.ngZone.run(() => {
                                if (result.code == 0) {
                                    this.ss.authToken = result.token;
                                    this.ss.loggedInUser = result.bioUser;

                                    this.router.navigate(['/wizard']);
                                } else if(result.code == -9) {
                                    this.ss.authToken = result.token;
                                    this.ss.loggedInUser = result.bioUser;
                                    this.ss.setOrgRoles(result.bioUser.orgRoles);

                                    this.router.navigate(['/portal']);
                                } else {
                                    this.ns.showError(result.description);
                                }

                            });

                        },
                        error => {this.ns.showError("An Error Occurred");}
                    )



            }, (error) =>  {
                console.log(JSON.stringify(error, undefined, 2));
            });
    }




}
