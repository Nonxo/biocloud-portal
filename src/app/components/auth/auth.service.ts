import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Endpoints } from '../../util/endpoints';

@Injectable()
export class AuthService {

  staticAuthKey = '57662cef-cd4a-4e5b-87dc-f0ef7481ef84';
  urlEncodeHeader = {
    'sc-auth-key': this.staticAuthKey,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  constructor(private httpClient: HttpClient) {
  }

  login(email, pw): Observable<any> {
    const params = new URLSearchParams();
    params.set('email', email);
    params.set('pw', pw);

    return this.httpClient.post(Endpoints.LOGIN, params.toString(), {
      headers: this.urlEncodeHeader
    });
  }

  register(registerPayload): Observable<any> {
    return this.httpClient.post(Endpoints.REGISTER, registerPayload, {
        headers: {'sc-auth-key': this.staticAuthKey}
      }
    );
  }

  forgotPassword(email): Observable<any> {
    const params = new URLSearchParams();
    params.set('email', email);

    return this.httpClient.post(Endpoints.FORGOT_PASSWORD, params.toString(), {
      headers: this.urlEncodeHeader
    });
  }

  validateCaptcha(token): Observable<any> {
    const params = new URLSearchParams();
    params.set('resp', token);

    return this.httpClient.post(Endpoints.VERIFY_CAPTCHA, params.toString(), {
      headers: this.urlEncodeHeader
    });
  }

  test() {
    this.httpClient.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }
}
