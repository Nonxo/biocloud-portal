import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    show() {
        !this.open? this.open = true: this.open = false;
    }

    onClickedOutside(e: Event) {
       this.open = false;
    }
    
    sidenavWidth = 16;
    open:boolean;

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

    logout() {
        localStorage.removeItem('_u');
        localStorage.removeItem('_tkn');
        localStorage.removeItem('_orgs');
        localStorage.removeItem('_st');

        this.router.navigate(['/auth']);
    }

    
}
