import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/finally';
import { NotifyService } from '../../../service/notify.service';
import { AuthService } from '../auth.service';

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
    const payload = this.form.value;
    this.company ? payload.customerType = 'C' : payload.customerType = 'I';
    this.authService.register(payload)
      .finally(() => this.loading = false)
      .subscribe(
        res => {
          console.log(res);
          if (res.code == 0) {

          } else {
            this.ns.showError(res.description);
          }
        }, err => {
          this.ns.showError(err ? '' : err.description);
        }
      );
  }
}
