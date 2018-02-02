import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../service/storage.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  constructor(private authService: AuthService, private ss: StorageService, private router: Router) {
  }

  ngOnInit() {

  }

  login() {
    this.authService.login('', '')
      .subscribe(
        res => {
          const body = res.json();

          this.ss.authToken = body.token;
          this.ss.loggedInUser = body.user;

          this.router.navigate(['/portal']);
        },
        error => {

        },
        () => {

        }
      );
  }

}
