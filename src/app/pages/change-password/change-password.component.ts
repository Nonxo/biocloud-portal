import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from "../../components/auth/auth.service";
import {StorageService} from "../../service/storage.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {NotifyService} from "../../service/notify.service";
import {BsModalRef} from "ngx-bootstrap";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})


export class ChangePasswordComponent implements OnInit {

    hide = true;
    visible = true;
    changePasswordForm: FormGroup;
    loading = false;
    email: string = this.ss.getLoggedInUserEmail();
    response: any;
    @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

    @Input()
    profilePage: boolean;

    @Output()
    changePasswordResponse = new EventEmitter<any>();


    constructor(private authService: AuthService,
                private ss: StorageService,
                private router: Router,
                private fb: FormBuilder,
                private modalRef: BsModalRef,
                private translate: TranslateService,
                private ns: NotifyService) {
        translate.setDefaultLang('en/change-password');
        translate.use('en/change-password');

    }

    ngOnInit() {
        this.changePasswordForm = this.fb.group({
            oldPw: ['', Validators.required],
            newPw: ['', Validators.required],
        });


    }

    passwordChange() {
        this.loading = true;
        const payload = this.changePasswordForm.value;
        this.formGroupDirective.resetForm();

        this.authService.changePassword(this.email, payload.oldPw, payload.newPw)
            .finally(() => {this.loading = false;})
            .subscribe(
                res => {
                    if (this.profilePage) {
                        this.changePasswordForm.markAsPristine();
                        this.changePasswordForm.markAsUntouched();
                        this.changePasswordResponse.emit(res)
                    } else {
                        if (res.code == 0) {

                            this.ss.authToken = this.response.token;
                            this.ss.loggedInUser = this.response.bioUser;
                            this.ss.setOrgRoles(this.response.bioUser.orgRoles);
                            this.changePasswordForm.reset();
                            this.modalRef.hide();
                            this.router.navigate(['/portal']);
                        } else {
                            this.ns.showError(res.description);
                        }
                    }
                },
                error => {
                    if (this.profilePage) {
                        this.changePasswordResponse.emit({code: 600})
                    }

                }
            );

    }


}
