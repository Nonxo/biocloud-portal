import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  private _logoutMessage: string;

  getLogoutMessage(): any {
    return this._logoutMessage;
  }

  setLogoutMessage(value: any) {
    this._logoutMessage = value;
  }

}
