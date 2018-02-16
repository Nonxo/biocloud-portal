import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    sidenavWidth = 16;

    views:Object[] =[
      {icon:"home",route:"Home", url:"/"},
      {icon:"group",route:"Attendees", url:"/"},
      {icon:"insert_chart",route:"Report", url:"/"},
      {icon:"payment",route:"Subscribe", url:"/"}
    ];

    navs:Object[] =[
      {icon:"person",route:"Profile", url:"/"},
      {icon:"message",route:"Notifications", url:"/"},
      {icon:"power_settings_new",route:"Log out", url:"/"}
    ];
    
      increase(){
        this.sidenavWidth = 16;
        console.log("increase sidenav width");
      }
      decrease(){
        this.sidenavWidth = 4;
        console.log("decrease sidenav width");
      }

     

    
}
