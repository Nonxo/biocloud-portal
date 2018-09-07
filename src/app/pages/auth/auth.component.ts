import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../components/auth/auth.service";
import {StorageService} from "../../service/storage.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    register: boolean;
    currentTab: number;


    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private ss: StorageService) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.register = (params['signup'] == 'true') || null;
                }
            )
    }

    ngOnInit() {

        this.authService.getAbTestMode().subscribe(
            result => {

                if(result.status) {

                    if(this.ss.getAuthRoute() && (this.ss.getAuthRoute() == '/auth/login' || this.ss.getAuthRoute() == '/auth/register')) {
                        this.router.navigate([this.ss.getAuthRoute()]);
                    } else {

                        if(result.flowId == 1) {
                            this.ss.setAuthRoute('/auth/login');
                            this.register? this.router.navigate(['/auth/login'], { queryParams: { signup: 'true' } }): this.router.navigate(['/auth/login']);
                        }else {
                            this.ss.setAuthRoute('/auth/register');
                            this.router.navigate(['/auth/register']);
                        }
                    }


                }else {
                    this.register? this.router.navigate(['/auth/login'], { queryParams: { signup: 'true' } }): this.router.navigate(['/auth/login']);
                }
            },
            error => {
                this.register? this.router.navigate(['/auth/login'], { queryParams: { signup: 'true' } }): this.router.navigate(['/auth/login']);
            }
        )
    }


}
