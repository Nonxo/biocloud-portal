import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-reg-email-notification',
    templateUrl: './reg-email-notification.component.html',
    styleUrls: ['./reg-email-notification.component.css']
})
export class RegEmailNotificationComponent implements OnInit {

    email: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {
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

    onPaste(event) {
        console.log(event.clipboardData.getData('text/plain'));
        debugger;
    }

}
