import {finalize} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';

import {NotifyService} from '../../../service/notify.service';
import {StorageService} from '../../../service/storage.service';
import {AuthService} from '../auth.service';
import {TranslateService} from '@ngx-translate/core';
import {ChangePasswordComponent} from "../../../pages/change-password/change-password.component";
import {DataService} from "../../../service/data.service";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

    hide = true;
    loginForm: FormGroup;
    resetForm: FormGroup;
    loading = false;
    modalRef: BsModalRef;
    loginResponse: any;
    modalOptions: ModalOptions = new ModalOptions();
    @ViewChildren('loginEmail') loginEmail;
    @ViewChild
    ("complianceTemplate") private complianceTemplate: TemplateRef<any>;


    constructor(private authService: AuthService,
                private ss: StorageService,
                private ds: DataService,
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
        if(this.ds.getLogoutMessage()) {
            this.ns.showError(this.ds.getLogoutMessage());
        }

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
            this.authService.setTawktoUserName(res.bioUser.email, res.bioUser.fName + ' ' + res.bioUser.lName, res.tawkHash);

            //check support role
            if(res.bioUser.role == "BASE_ADMIN") {
                this.router.navigate([''])
            }else {
                this.router.navigate(['/portal']);
            }
        }

    }

    openModalWithComponent(res: any) {
        const payload = this.loginForm.value;
        this.modalOptions.initialState = {
            email: payload.email,
            oldPw: payload.pw,
            response: res

        };
        this.modalRef = this.modalService.show(ChangePasswordComponent, this.modalOptions);
    }



    login() {
        this.loading = true;
        const payload = this.loginForm.value;

        //noinspection TypeScriptValidateTypes
        this.authService.login(payload.email, payload.pw.trim()).pipe(
            finalize(() => this.loading = false))
            .subscribe(
                res => {
                    if (res.code == 0) {

                        //For Existing users, check gdpr compliance flag
                        this.checkGdprComplianceStatus(res);

                        // this.resetPasswordCheck(res);

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
        this.authService.forgotPassword(payload.email).pipe(
            finalize(() => this.loading = false))
            .subscribe(
                res => {
                    if (res.code == 0) {
                        this.ns.showSuccess("Email sent successfully");
                        this.modalRef.hide();
                    } else {
                        this.ns.showError(res.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            );
    }

    checkGdprComplianceStatus(res: any) {
        if(res.bioUser) {
            if(!res.bioUser.complianceStatus) {
                this.loginResponse = res;
                this.openModal(this.complianceTemplate);
            }else {
                this.resetPasswordCheck(res);
            }
        }
    }

    accept() {
        this.loading = true;
        this.authService.acceptCompliance(this.loginForm.get('email').value).pipe(
            finalize(() => {this.loading = false}))
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.modalRef.hide();
                        this.resetPasswordCheck(this.loginResponse);
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred");}
            )
    }


    goToTerms() {
        window.open("https://seamfix.com/privacy/privacy-policy-iclocker/");
    }

    ngOnDestroy() {
        this.ds.setLogoutMessage(null);
    }

}





