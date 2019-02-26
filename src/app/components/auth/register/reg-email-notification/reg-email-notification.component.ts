import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth.service";
import {NotifyService} from "../../../../service/notify.service";

@Component({
    selector: 'app-reg-email-notification',
    templateUrl: './reg-email-notification.component.html',
    styleUrls: ['./reg-email-notification.component.css']
})
export class RegEmailNotificationComponent implements OnInit {

    email: string;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private ns: NotifyService) {
        this.activatedRoute
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.email = params['email'] || null;

                    if (!this.email) {
                        this.router.navigate(['/auth']);
                    }

                    //call service to verify email

                }
            )
    }

    ngOnInit() {
    }

    verifyEmail() {
        this.authService.verifyEmail(this.email)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        // this.router.navigate(['/reg-message'], { queryParams: { email: this.form.get('email').value.toLowerCase() } });
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

}
