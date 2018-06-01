import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/finally';
import {NotifyService} from '../../../service/notify.service';
import {AuthService} from '../auth.service';
import {Constants} from "../../../util/constants";
import {Router} from "@angular/router";
import {StorageService} from "../../../service/storage.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    form: FormGroup;
    company = false;
    loading = false;
    hide: boolean;
    show: boolean;
    recaptchaSiteKey: string = Constants.SITE_KEY;
    captchaResponse: string;
    payload: any;
    @ViewChild('cap') public recaptchaInstance;
    countries: any[];
    selectedPhoneCode: string = "234";
    selectedCountryCode: string = "NG";
    baseUrl: string = environment.baseUrl;

    userTypes: Array<{ name, checked }> = [
        {name: 'INDIVIDUAL', checked: true},
        {name: 'CORPORATE', checked: false}
    ];

    constructor(private authService: AuthService,
                private router: Router,
                private ns: NotifyService,
                private fb: FormBuilder,
                private ss: StorageService) {
    }

    ngOnInit() {
        this.fetchCountries();


        this.form = this.fb.group({
            companyName: ['', Validators.required],
            fName: ['', Validators.required],
            lName: ['', Validators.required],
            phoneCode: [''],
            phone: ['', Validators.required],
            email: ['', Validators.email],
            password: ['', Validators.required],
            gdprCompliance: ['', Validators.requiredTrue]
        });

        // disable validation for company name when it is invisible initially
        this.form.controls['companyName'].disable();
    }

    changeUserType(index) {
        this.form.controls['companyName'].disable();
        this.userTypes[0].checked = false;
        this.userTypes[1].checked = false;
        this.userTypes[index].checked = true;

        this.company = index !== 0;
        if (this.company) {
            this.form.controls['companyName'].enable();
        }
    }

    register() {
        if (!this.selectedPhoneCode) {
            this.ns.showError("Please select a Country dialling code");
            return;
        }

        this.loading = true;
        this.payload = this.form.value;

        this.payload['phoneCode'] = this.selectedPhoneCode;

        //set Device Type
        this.payload['deviceType'] = 'WEB';

        if (this.company) {
            this.payload.customerType = "C"
        } else {
            this.payload.customerType = "I";
            this.payload.companyName = "";
        }

        this.trimValues();

        if (this.captchaResponse) {
            this.validateCaptcha();
        } else {
            this.resetCaptcha();
            this.loading = false;
            this.ns.showError("Error Validating Captcha");
        }

    }

    trimValues() {
        this.payload.email = this.payload.email.toLowerCase().trim();
        this.payload.password = this.payload.password.trim();
    }

    resolved(captchaResponse: string) {
        this.captchaResponse = captchaResponse;
    }

    validateCaptcha() {
        this.authService.validateCaptcha(this.captchaResponse)
            .subscribe(
                res => {
                    if (res.code == 0) {
                        this.registerUser();
                    } else {
                        this.ns.showError(res.description);
                        this.loading = false;
                        this.resetCaptcha();
                    }

                },
                error => {
                    this.ns.showError(error ? '' : error.description);
                    this.loading = false;
                    this.resetCaptcha();
                }
            )
    }

    registerUser() {
        //noinspection TypeScriptValidateTypes
        this.authService.register(this.payload)
            .finally(() => this.loading = false)
            .subscribe(
                res => {
                    if (res.code == 0) {
                        this.ss.authToken = res.token;
                        this.ss.loggedInUser = res.user;
                        this.router.navigate(['/sign-up-as']);
                    } else {
                        this.ns.showError(res.description);
                        this.resetCaptcha();
                    }
                }, error => {
                    this.ns.showError(error ? '' : error.description);
                    this.resetCaptcha();
                }
            );
    }

    fetchCountries() {
        this.authService.fetchCountries()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.countries = result.countries ? result.countries : [];
                    }
                },
                error => {
                }
            )
    }

    onSelectChange() {
        this.selectPhoneCode();
        this.selectCountryCode();
    }

    selectPhoneCode() {
        this.selectedPhoneCode = this.form.get('phoneCode').value;
        this.form.get('phoneCode').setValue('');
    }

    selectCountryCode() {
        let obj = this.countries.filter((obj) => obj.phoneCode == this.selectedPhoneCode)[0];

        if (obj) {
            this.selectedCountryCode = obj.code;
        }
    }

    goToTerms() {
        window.open("https://seamfix.com/privacy/privacy-policy-iclocker/");
    }

    resetCaptcha() {
        this.recaptchaInstance.reset();
    }

}
