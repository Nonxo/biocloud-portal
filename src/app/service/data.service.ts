import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  private _logoutMessage: string;

  get logoutMessage(): any {
    return this._logoutMessage;
  }

  set logoutMessage(value: any) {
    this._logoutMessage = value;
  }

}
