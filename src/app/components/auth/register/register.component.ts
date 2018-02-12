import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/finally';
import { NotifyService } from '../../../service/notify.service';
import { AuthService } from '../auth.service';
import {Constants} from "../../../util/constants";

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
  recaptchaSiteKey:string = Constants.SITE_KEY;
  captchaResponse:string;
  payload:any;
  @ViewChild('cap') public recaptchaInstance;

  userTypes: Array<{ name, checked }> = [
    {name: 'INDIVIDUAL', checked: true},
    {name: 'CORPORATE', checked: false}
  ];

  constructor(private authService: AuthService, private ns: NotifyService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required]
    });

    // disable validation for company name when it is invisible initially
    this.form.controls.companyName.disable();
  }

  changeUserType(index) {
    this.userTypes[0].checked = false;
    this.userTypes[1].checked = false;
    this.userTypes[index].checked = true;

    this.company = index !== 0;
    if (this.company) {
      this.form.controls.companyName.enable();
    }
  }

  register() {
    this.loading = true;
    this.payload = this.form.value;
    this.company ? this.payload.customerType = 'C' : this.payload.customerType = 'I';

    if(this.captchaResponse) {
      this.validateCaptcha();
    } else {
      this.resetCaptcha();
      this.ns.showError("Error Validating Captcha");
    }
    
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
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
                this.resetCaptcha();
              }

            },
            error => {this.ns.showError(error ? '' : error.description); this.resetCaptcha();}
        )
  }
  
  registerUser() {
    this.authService.register(this.payload)
        .finally(() => this.loading = false)
        .subscribe(
            res => {
              if (res.code == 0) {

              } else {
                this.ns.showError(res.description);
                this.resetCaptcha();
              }
            }, error => {this.ns.showError(error ? '' : error.description); this.resetCaptcha();}
        );
  }

  resetCaptcha() {
    this.recaptchaInstance.reset();
  }

}
