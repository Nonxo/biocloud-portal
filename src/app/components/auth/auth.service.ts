import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Endpoints } from '../../util/endpoints';
import { RegisterModel } from './register/register.model';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  login(username, password): Observable<any> {
    const body = {username, password};
    return this.httpClient.post(Endpoints.LOGIN, body);
  }

  register(registerModel: RegisterModel): Observable<any> {
    return this.httpClient.post(Endpoints.REGISTER, registerModel, {headers: {'sc-auth-key': '57662cef-cd4a-4e5b-87dc-f0ef7481ef84'}}).map((res: Response) => res.json());
  }

  forgotPassword(username, password) {
    const body = {username, password};
    this.httpClient.post(`${Endpoints.FORGOT_PASSWORD}`, body).subscribe();
  }

  test() {
    this.httpClient.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }
}
