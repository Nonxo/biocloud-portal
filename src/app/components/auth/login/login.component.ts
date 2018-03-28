import {Component, OnInit, TemplateRef, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import 'rxjs/add/operator/finally';
import {NotifyService} from '../../../service/notify.service';
import {StorageService} from '../../../service/storage.service';
import {AuthService} from '../auth.service';
import {TranslateService} from '@ngx-translate/core';
import {ChangePasswordComponent} from "../../../pages/change-password/change-password.component";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    hide = true;
    loginForm: FormGroup;
    resetForm: FormGroup;
    loading = false;
    modalRef: BsModalRef;
    modalOptions: ModalOptions = new ModalOptions();
    @ViewChildren('loginEmail') loginEmail;

    constructor(private authService: AuthService,
                private ss: StorageService,
                private router: Router,
                private fb: FormBuilder,
                private ns: NotifyService,
                private modalService: BsModalService,
                public translate: TranslateService) {
        translate.setDefaultLang('en/login');
        translate.use('en/login');

    }

    openModal(template: TemplateRef<any>) {
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

        this.loginForm.get('email').valueChanges
            .subscribe((value) => {
            if(value.length > value.trim().length) {
                this.loginForm.get('email').setValue(value.trim());
            }
            })

    }

    resetPasswordCheck(res: any) {

        if (res.bioUser.passwordReset == true) {
            this.openModalWithComponent(res);
        } else {
            this.ss.authToken = res.token;
            this.ss.loggedInUser = res.bioUser;
            this.ss.setOrgRoles(res.bioUser.orgRoles);

            this.router.navigate(['/portal']);
        }

    }

    openModalWithComponent(res: any) {
        const payload = this.loginForm.value;
        this.modalOptions.initialState = {
            email: payload.email,
            response: res

        };
        this.modalRef = this.modalService.show(ChangePasswordComponent, this.modalOptions);
    }



    login() {
        this.loading = true;
        const payload = this.loginForm.value;

        //noinspection TypeScriptValidateTypes
        this.authService.login(payload.email, payload.pw)
            .finally(() => this.loading = false)
            .subscribe(
                res => {
                    console.log(res);
                    if (res.code == 0) {

                        this.resetPasswordCheck(res);

                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            );
    }

    forgotPassword() {
        const payload = this.resetForm.value;
        this.loading = true;
        //noinspection TypeScriptValidateTypes
        this.authService.forgotPassword(payload.email)
            .finally(() => this.loading = false)
            .subscribe(
                res => {
                    console.log(res);
                    if (res.code == 0) {
                        this.ns.showSuccess(res.description);
                        this.modalRef.hide();
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {

                }
            );
    }

}





