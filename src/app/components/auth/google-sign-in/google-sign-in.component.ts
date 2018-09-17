import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

declare const gapi: any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.css']
})
export class GoogleSignInComponent implements OnInit, AfterViewInit {


    public auth2: any;

    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '1024122094553-p6h78fl1nikufo00ern6s9qutgdblni1.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });

            let googleBtns = document.getElementsByClassName('googleBtn');
            for (let i = 0; i < googleBtns.length; i++) {
                this.attachSignin(googleBtns.item(i));
            }
        })
    }

    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {
            let profile = googleUser.getBasicProfile();
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + googleUser.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());

                this.router.navigate(["/get-started"]);
                //...
            }, function (error) {
                console.log(JSON.stringify(error, undefined, 2));
            });
    }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit () {
      this.googleInit();
  }

}
