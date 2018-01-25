import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  company: boolean = false;

  whom = [
    {name: "INDIVIDUAL", checked: true},
    {name: "CORPERATE", checked: false}
  ];

  changeWho(index) {
    this.whom[0].checked = false;
    this.whom[1].checked = false;
    this.whom[index].checked = true;

    if (index === 0) {
      this.company = false;
    } else {
      this.company = true;
    }
  }
}
