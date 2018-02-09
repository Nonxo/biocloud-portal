import { Component, OnInit } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }


}
