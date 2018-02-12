import {Component, OnInit, TemplateRef, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import 'rxjs/add/operator/finally';
import {NotifyService} from '../../../service/notify.service';
import {StorageService} from '../../../service/storage.service';
import {AuthService} from '../auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    hide = true;
    loginForm:FormGroup;
    resetForm:FormGroup;
    loading = false;
    modalRef:BsModalRef;
    @ViewChildren('loginEmail') loginEmail;

    constructor(private authService:AuthService,
                private ss:StorageService,
                private router:Router,
                private fb:FormBuilder,
                private ns:NotifyService,
                private modalService:BsModalService,
                public translate:TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');

    }

    openModal(template:TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', Validators.email],
            pw: ['', Validators.required],
        });
        this.resetForm = this.fb.group({
            email: ['', Validators.email]
        });
    }

    login() {
        this.loading = true;
        const payload = this.loginForm.value;
        this.authService.login(payload.email, payload.pw)
            .finally(() => this.loading = false)
            .subscribe(
                res => {
                    console.log(res);
                    if (res.code == 0) {
                        this.ss.authToken = res.token;
                        this.ss.loggedInUser = res.user;

                        this.router.navigate(['/portal']);
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {

                }
            );
    }

    forgotPassword() {
        const payload = this.resetForm.value;
        this.loading = true;
        this.authService.forgotPassword(payload.email)
            .finally(() => this.loading = false)
            .subscribe(
                res => {
                    console.log(res);
                    if (res.code == 0) {
                        this.ns.showSuccess(res.description);
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {

                }
            );
    }

}
