import { Injectable } from '@angular/core';
import {TimezonePOJO} from "../pages/app-content/app-config/model/app-config.model";

@Injectable()
export class StorageService {

  get loggedInUser(): any {
    let obj = JSON.parse(localStorage.getItem('_u'));
    return obj? obj: null;
  }

  set loggedInUser(value: any) {
    localStorage.setItem('_u', JSON.stringify(value));
  }

  get authToken(): string {
    let obj = JSON.parse(localStorage.getItem('_tkn'));
    return obj? obj: null;
  }

  set authToken(value: string) {
    localStorage.setItem('_tkn', JSON.stringify(value));
  }

  getLoggedInUserEmail(): string {
    let obj:any = JSON.parse(localStorage.getItem('_u'));
    if (obj) {
      return obj.email? obj.email: '';
    }
    return '';
  }

  getUserId():string {
    let obj:any = JSON.parse(localStorage.getItem('_u'));
    if (obj) {
      return obj.userId? obj.userId: '';
    }
    return '';
  }

  cacheUsersOrg(value:any) {
    localStorage.setItem("_orgs", JSON.stringify(value));
  }
  
  getUsersOrg() {
    let obj:any = JSON.parse(localStorage.getItem('_orgs'));
    return obj? obj: null;
  }

  setSelectedOrg(value) {
    let obj = {selectedOrg: value};
    localStorage.setItem("_st", JSON.stringify(obj));
  }

  getSelectedOrg() {
    let obj:any = JSON.parse(localStorage.getItem('_st'));
    return obj? obj.selectedOrg: null;
  }

  setTimezones(value:TimezonePOJO[]) {
    localStorage.setItem("timezones", JSON.stringify(value));
  }

  getTimezones() {
    let arr:TimezonePOJO[] = JSON.parse(localStorage.getItem('timezones'));
    return arr? arr: null;
  }

}
