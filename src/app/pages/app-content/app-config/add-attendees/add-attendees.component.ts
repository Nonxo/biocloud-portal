import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-attendees',
  templateUrl: './add-attendees.component.html',
  styleUrls: ['./add-attendees.component.css']
})
export class AddAttendeesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  invites:boolean = true;
  bulk:boolean;

  addBy = [
    {name: "INVITE", checked: true},
    {name: "BULK", checked: false}
  ];

  changeAdd(index) {
    this.addBy[0].checked = false;
    this.addBy[1].checked = false;
    this.addBy[index].checked = true;

    if (index === 0) {
      this.invites = true;
      this.bulk = false;
    } else {
      this.bulk = true;
      this.invites=false;
    }
  }

}
