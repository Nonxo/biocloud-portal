import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataService {

  private _logoutMessage: string;
  private locId: string;
  private userPhoto = new BehaviorSubject<any>({image:null});
  private username = new BehaviorSubject<any>({username: null});

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

  setUserPhoto(img:string){
    this.userPhoto.next({image: null});
  }

  clearUserPhoto() {
    this.userPhoto.next({image: null});
  }

  getUserPhoto():Observable<any> {
    return this.userPhoto;
  }

  setUsername(name:string) {
    this.username.next({username: name})
  }

  clearUsername() {
    this.username.next(null);
  }

  getUsername() {
    return this.username;
  }

}
