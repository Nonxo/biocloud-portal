import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../../service/notify.service';
import { AuthService } from '../auth.service';
import { RegisterModel } from './register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  company = false;
  hide:boolean;
  model: RegisterModel = {
    email: 'a@b.c',
    companyName: 'company name',
    fName: 'banky',
    lName: 'slacks',
    password: 'testing',
    phone: '08099223322',
    role: 'ADMIN'
  };

  whom = [
    {name: 'INDIVIDUAL', checked: true},
    {name: 'CORPORATE', checked: false}
  ];

  constructor(private authService: AuthService, private ns: NotifyService) {
  }

  ngOnInit() {
  }

  changeWho(index) {
    this.whom[0].checked = false;
    this.whom[1].checked = false;
    this.whom[index].checked = true;

    this.company = index !== 0;
  }

  register() {
    this.authService.register(this.model).subscribe(
      res => {
        console.log(res);
      }, err => {
        console.log(err);
        this.ns.showError('Failed');
      }
    );
  }
}
