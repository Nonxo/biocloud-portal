import {Injectable} from '@angular/core';
import {LocationRequest, TimezonePOJO} from "../pages/app-content/app-config/model/app-config.model";

@Injectable()
export class StorageService {

    isUserLoggedIn():Promise<boolean> {
        let user = this.loggedInUser;
        let token = this.authToken;

        if (!user || !token) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }


    get loggedInUser():any {
        let obj = JSON.parse(localStorage.getItem('_u'));
        return obj ? obj : null;
    }

    set loggedInUser(value:any) {
        localStorage.setItem('_u', JSON.stringify(value));
    }

    get authToken():string {
        let obj = JSON.parse(localStorage.getItem('_tkn'));
        return obj ? obj : null;
    }

    set authToken(value:string) {
        localStorage.setItem('_tkn', JSON.stringify(value));
    }

    getLoggedInUserEmail():string {
        let obj:any = JSON.parse(localStorage.getItem('_u'));
        if (obj) {
            return obj.email ? obj.email : '';
        }
        return '';
    }

    getUserName():string {
        let obj:any = JSON.parse(localStorage.getItem('_u'));

        if(obj) {
            return obj.fName + ' ' + obj.lName;
        }

        return '';
    }
    getUserImg():string {
      let obj:any = JSON.parse(localStorage.getItem('_u'));

      if(obj) {
        return obj.img ? obj.img : '';
      }

      return '';
    }

    getUserPhone() {
        let obj:any = JSON.parse(localStorage.getItem('_u'));

        if(obj) {
            return obj.phoneCode? obj.phoneCode: '234' + ' ' + obj.phone;
        }

        return '';
    }

    setUserImage(value) {
      let _u:any = JSON.parse(localStorage.getItem('_u'))

      if(_u) {
        _u['img'] = value;
      }
      localStorage.setItem("_u", JSON.stringify(_u));
    }

    getUserId():string {
        let obj:any = JSON.parse(localStorage.getItem('_u'));
        if (obj) {
            return obj.userId ? obj.userId : '';
        }
        return '';
    }

    cacheUsersOrg(value:any) {
        localStorage.setItem("_orgs", JSON.stringify(value));
    }

    getUsersOrg() {
        let obj:any = JSON.parse(localStorage.getItem('_orgs'));
        return obj ? obj : null;
    }

    updateUsersOrg(org:any) {
        let orgs = this.getUsersOrg();

        if(orgs) {
            orgs.push(org);
            this.cacheUsersOrg(orgs);
        }
    }

    setSelectedOrg(value) {
        let _st = JSON.parse(localStorage.getItem('_st'));

        if (_st) {
            _st['selectedOrg'] = value;
        } else {
            _st = {selectedOrg: value};
        }

        localStorage.setItem("_st", JSON.stringify(_st));
    }

    getSelectedOrg() {
        let obj:any = JSON.parse(localStorage.getItem('_st'));
        return obj ? obj.selectedOrg : null;
    }

    setTimezones(value:TimezonePOJO[]) {
        localStorage.setItem("timezones", JSON.stringify(value));
    }

    getTimezones() {
        let arr:TimezonePOJO[] = JSON.parse(localStorage.getItem('timezones'));
        return arr ? arr : null;
    }

    setAdminUsers(value:any[]) {
        let _st = JSON.parse(localStorage.getItem('_st'));

        if (_st) {
            _st['adminUsers'] = value;
        } else {
            _st = {adminUsers: value};
        }

        localStorage.setItem("_st", JSON.stringify(_st));
    }

    getAdminUsers() {
        let obj:any = JSON.parse(localStorage.getItem('_st'));
        return obj? obj.adminUsers: null;
    }

    setSelectedOrgRole(value:string) {
        let _st = JSON.parse(localStorage.getItem('_st'));

        if (_st) {
            _st['orgRole'] = value;
        } else {
            _st = {orgRole: value};
        }

        localStorage.setItem("_st", JSON.stringify(_st));
    }

    getSelectedOrgRole() {
        let obj:any = JSON.parse(localStorage.getItem('_st'));
        return obj? obj.orgRole: null;
    }

    setOrgRoles(orgRoles:any[]) {
        let roles = orgRoles? orgRoles: [];
        let arr:any[] = this.getOrgRoles();

        for(let r of roles) {
            arr.push(r);
        }

        localStorage.setItem("orgRoles", JSON.stringify(arr));
    }

    getOrgRoles() {
        let obj:any = JSON.parse(localStorage.getItem('orgRoles'));
        return obj? obj: [];
    }

    setLatestNotifTime(value:number) {
        localStorage.setItem("notifTime", JSON.stringify(value));
    }

    getLatesNotifTime() {
        let obj:any = JSON.parse(localStorage.getItem('notifTime'));
        return obj? obj: null;
    }

    setCompanyType(value:any[]) {
        localStorage.setItem('orgTypes', JSON.stringify(value));
    }

    getCompanyType() {
        let obj:any = JSON.parse(localStorage.getItem('orgTypes'));

        return obj? obj:null;
    }

    setPrevRoute(value: string) {
        localStorage.setItem('prevRoute', value);
    }

    getPrevRoute() {
        let obj:any = localStorage.getItem('prevRoute');

        return obj? obj:null;
    }

    clearPrevRoute() {
        localStorage.removeItem('prevRoute');
    }

    setAuthRoute(value: string) {
        localStorage.setItem('authRoute', value);
    }

    getAuthRoute() {
        let obj:any = localStorage.getItem('authRoute');

        return obj? obj:null;
    }

    clearAuthRoute() {
        localStorage.removeItem('authRoute');
    }

    setLocationObj(locRequest: LocationRequest) {
        localStorage.setItem('_l', JSON.stringify(locRequest));
    }

    getLocationObj() {
        let obj: LocationRequest = JSON.parse(localStorage.getItem('_l'));

        return obj? obj:null;
    }

    clearLocationObj() {
        localStorage.removeItem("_l");
    }

}
