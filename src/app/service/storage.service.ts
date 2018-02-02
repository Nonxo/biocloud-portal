import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  private _authToken: string;
  private _loggedInUser: any;

  get loggedInUser(): any {
    return this._loggedInUser;
  }

  set loggedInUser(value: any) {
    this._loggedInUser = value;

    localStorage.setItem('user', JSON.stringify(value));
  }

  get authToken(): string {
    return this._authToken;
  }

  set authToken(value: string) {
    this._authToken = value;
  }

  getLoggedInUserEmail(): string {
    return this.loggedInUser ? this.loggedInUser.username || '' : '';
  }

}
