/**
 * Created by Kingsley Ezeokeke on 3/6/2018.
 */


import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";
@Component({
    selector: '',
    templateUrl: './add-admin-auth.component.html',
    styleUrls: []
})

export class AddAdminAuthComponent {

    inviteId:string;

    constructor(private route:ActivatedRoute,
                private aService:AuthService,
                private router:Router) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.inviteId = params['inviteId'] || null;
                    this.inviteAdmin();
                }
            )
    }

    inviteAdmin() {
        this.aService.approveAdminNotification(this.inviteId)
            .subscribe(
                result => {
                    this.router.navigate(["/auth"]);
                },
                error => {
                    this.router.navigate(["/auth"]);
                }
            )
    }

}