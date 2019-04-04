import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/finally';
import {NotifyService} from '../../../service/notify.service';
import {AuthService} from '../auth.service';
import {Constants} from "../../../util/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../../service/storage.service";
import {environment} from "../../../../environments/environment";
import {AppContentService} from '../../../pages/app-content/services/app-content.service';


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
    countries: any[] = [];
    selectedPhoneCode: string = "234";
    selectedCountryCode: string = "NG";
    baseUrl: string = environment.baseUrl;
    filteredCountries: any = [];
    openDropdown: boolean;
    password: string;
    fullName: string;
    phone: string;
    iAgree: boolean;
    searchField: string;
    nameError: string;
    phoneError: string;
    emailError: string;
    invites: any[] = [];
    orgCode: string = '';

    @Input()
    step: number;

    @Input()
    email: string = "";

    @Output()
    getStep = new EventEmitter<number>();

    @Input()
    ignoreRouteParams: boolean;

    @ViewChild('myInput') myInput: ElementRef;


    userTypes: Array<{ name, checked }> = [
        { name: 'INDIVIDUAL', checked: true },
        { name: 'CORPORATE', checked: false }
    ];

    constructor(private contentService: AppContentService,
        private authService: AuthService,
        private router: Router,
        private ns: NotifyService,
        private fb: FormBuilder,
        private ss: StorageService,
        private route: ActivatedRoute) {
        this.route
            .queryParams
            .subscribe(params => {
                let email = params['email'] || null;
                let token = params['token'] || null;
            }
            )
    }

    ngOnInit() {
        this.fetchCountries();

        this.getStep.emit(this.step);

        this.form = this.fb.group({
            companyName: ['', Validators.required],
            fName: ['', Validators.required],
            lName: ['', Validators.required],
            phoneCode: [''],
            phone: ['', Validators.required],
            email: [this.email, Validators.email],
            password: ['', Validators.required],
            gdprCompliance: ['', Validators.requiredTrue]
        });

        // disable validation for company name when it is invisible initially
        this.form.controls['companyName'].disable();

        this.form.get('phone').valueChanges
            .subscribe((value) => {
                if (value.replace(/[^0-9]/g, "").length < value.length) {
                    let val = value.replace(/[^0-9]/g, "");

                    this.form.get('phone').setValue(val.trim());
                }
            })

        this.form.get('email').valueChanges
            .subscribe(
                value => {
                    if (/[^A-Za-z\-_.0-9@]/.test(value)) {
                        this.emailError = "Sorry, only letters (a-z), numbers (0-9) , periods ( . ) , underscores ( _ ) and hyphens ( - ) are allowed before the @ symbol";
                    } else {
                        this.emailError = null;
                    }
                }
            )
    }

    showDd() {
        if (!this.openDropdown) {
            //first load filteredCountries afresh else the old searched countries will still be displayed
            this.filteredCountries = this.countries;

            this.openDropdown = true;
        } else {
            this.openDropdown = false;
        }
    }

    onClickedOutside(e: Event) {
        this.openDropdown = false;
        this.searchField = "";

        //load filteredCountries afresh else the old searched countries will still be displayed
        this.filteredCountries = this.countries;
    }

    changeStep(param?: string) {
        switch (this.step) {
            case 1: {
                this.email = this.form.get('email').value;
                this.step = 2;
                this.getStep.emit(this.step);
                break;
            }
            case 2: {
                this.payload = this.form.value;
                this.setName();
                this.register();
                break;
            }
            case 3: {
                if (param == 'employer') {
                    this.goToCreateCompany();
                } else if (param == 'employee') {
                    this.goToCompany();
                }
                this.step = 4;
                break;
            }
            case 4: {
                this.goToFinalStage();
                break;
            }
        }
    }


    verifyEmail(emailFromRoute?: string) {
        this.loading = true;
        let email = "";

        emailFromRoute ? email = emailFromRoute : email = this.form.get('email').value;

        this.authService.verifyEmail(email)
            .finally(() => {
                this.loading = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.router.navigate(['/reg-message'], { queryParams: { email: email.toLowerCase() } });
                    } else {
                        this.ns.showError(result.description);
                        this.router.navigate(['/auth'], { queryParams: { login: true } });
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                    this.router.navigate(['/auth']);
                }
            )
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

        this.payload['password'] = this.password;
        this.payload['phoneCode'] = this.selectedPhoneCode.charAt(0) == "+" ? this.selectedPhoneCode : "+" + this.selectedPhoneCode;

        //set Device Type
        this.payload['deviceType'] = 'WEB';

        //Get firstname and lastname
        this.setName();
        this.payload.phone = this.phone;

        this.payload.gdprCompliance = true;

        //set Flow id
        this.setFlowId();

        if (this.company) {
            this.payload.customerType = "C"
        } else {
            this.payload.customerType = "I";
            this.payload.companyName = "";
        }

        this.trimValues();

        this.registerUser();
    }

    setName() {
        let names = this.fullName.split(" ");
        this.payload.fName = names[0];
        this.payload.lName = names[1];
    }

    setFlowId() {
        if (this.ss.getAuthRoute()) {
            if (this.ss.getAuthRoute() == '/auth/register') {
                this.payload['flowId'] = 2;
                return;
            }
        }
        this.payload['flowId'] = 1;
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
                        this.ss.loggedInUser = res.bioUser;
                        this.step = 3;
                    } else {
                        if (res.code == -9) {
                            this.ns.showError("This email already exist. Please proceed to sign in");
                            this.router.navigate(['/auth'], { queryParams: { login: true } });
                        } else {
                            this.ns.showError(res.description);
                        }
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
                        this.filteredCountries = this.countries;
                    }
                },
                error => {
                }
            )
    }

    onSelectChange(country: any) {
        this.searchField = "";
        this.openDropdown = false;
        this.selectCountryCode(country.code);
        this.selectPhoneCode();
    }

    selectCountryCode(code: any) {
        this.selectedCountryCode = code;
        // this.form.get('phoneCode').setValue('');
    }

    selectPhoneCode() {
        let obj = this.countries.filter((obj) => obj.code == this.selectedCountryCode)[0];
        if (obj) {
            this.selectedPhoneCode = obj.phoneCode;
        }
    }

    goToTerms() {
        window.open("https://seamfix.com/privacy/privacy-policy-iclocker/");
    }

    resetCaptcha() {
        this.recaptchaInstance.reset();
    }

    search(searchParam: string) {
        if (searchParam) {
            this.filteredCountries = this.countries.filter(obj => obj.name.toLowerCase().includes(searchParam.toLowerCase()));
        } else {
            this.filteredCountries = this.countries;
        }

    }

    openc(event) {
        if (!event) {
            this.myInput.nativeElement.value = '';
            this.filteredCountries = this.countries;
        } else {
            this.myInput.nativeElement.focus();
        }
    }

    validateNameField() {
        if (!(/^([a-zA-Z]{1,}'?-?[a-zA-Z]{1,}?\s[a-zA-Z]{1,}'?-?[a-zA-Z]{1,}?)/.test(this.fullName))) {
            this.nameError = "Type only firstname & lastname. DO NOT include numbers & special characters";
        } else {
            this.nameError = "";
        }
    }

    validatePhoneField() {
        if (/[^0-9]/.test(this.phone)) {
            this.phoneError = "Only numbers allowed"
        } else {
            this.phoneError = "";
        }
    }

    goToFinalStage() {
        this.callOrgInvitationsService();
    }

    goToCompany() {
        this.callEmailInvitationsService();
        this.step = 4;
    }

    goToCreateCompany() {
        this.router.navigate(['/onboard']);
    }

    callEmailInvitationsService() {
        this.contentService.fetchEmailInvitations(this.payload.email)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.invites = result.attendees ? result.attendees : [];
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    callOrgInvitationsService() {
        this.contentService.inviteUserByOrgId(this.payload.email, this.orgCode)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.invites = result.attendees ? result.attendees : [];
                        this.ns.showSuccess(result.description);
                        this.step = 5;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

}
