import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from "../../components/auth/auth.service";
import {StorageService} from "../../service/storage.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifyService} from "../../service/notify.service";




@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})


export class ChangePasswordComponent implements OnInit {

  hide = true;
  changePasswordForm:FormGroup;
  loading = false;



  constructor(private authService:AuthService,
              private ss:StorageService,
              private router:Router,
              private fb:FormBuilder,
              private ns:NotifyService) {}

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPw: ['', Validators.required],
      newPw: ['', Validators.required],
    });

  }

  passwordChange() {
    this.loading = true;
    const payload = this.changePasswordForm.value;

    this.authService.changePassword(payload.oldPw, payload.newPw)
      .finally(() => this.loading = false)
      .subscribe(
        res => {
          console.log(res);
          if (res.code == 0) {
            this.ss.authToken = res.token;
            this.ss.loggedInUser = res.bioUser;
            this.router.navigate(['/portal']);
          } else {
            this.ns.showError(res.description);
          }
        },
        error => {}
      );

  }




}
