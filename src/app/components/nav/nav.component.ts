import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  navs: Object[] = [
    {name: 'Home', route: '/portal'},
    {name: 'Reports', route: '/portal'},
    {name: 'Subscription', route: '/portal'}
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('_u');
    localStorage.removeItem('_tkn');
    localStorage.removeItem('_orgs');

    this.router.navigate([''])
  }


}
