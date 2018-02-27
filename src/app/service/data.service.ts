import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  private _logoutMessage: string;
  private locId: string;

  getLogoutMessage(): any {
    return this._logoutMessage;
  }

  setLogoutMessage(value: any) {
    this._logoutMessage = value;
  }

  setLocId(value: string) {
    this.locId = value;
  }

  getLocId() {
    return this.locId;
  }

}
