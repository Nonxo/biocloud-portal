import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class DataService {

    private _logoutMessage: string;
    private locId: string;
    private userObj: any;
    private userPhoto = new BehaviorSubject<any>({image: null});
    private username = new BehaviorSubject<any>({username: null});
    private subHistory:any;
    private reportDate: Date;
    private reportStartDate: Date;
    private reportEndDate: Date;

    getLogoutMessage(): any {
        return this._logoutMessage;
    }

    setLogoutMessage(value: any) {
        this._logoutMessage = value;
    }

    getUserObj(): string {
        return this.userObj;
    }

    setUserObj(value: any) {
        this.userObj = value;
    }

    setLocId(value: string) {
        this.locId = value;
    }

    getLocId() {
        return this.locId;
    }

    setUserPhoto(img: string) {
        this.userPhoto.next({image: null});
    }

    clearUserPhoto() {
        this.userPhoto.next({image: null});
    }

    getUserPhoto(): Observable<any> {
        return this.userPhoto;
    }

    setUsername(name: string) {
        this.username.next({username: name})
    }

    clearUsername() {
        this.username.next(null);
    }

    getUsername() {
        return this.username;
    }

    getSubHistory() {
        return this.subHistory;
    }

    setSubHistory(subHistory:any) {
        this.subHistory = subHistory;
    }

    getReportDate() {
        return this.reportDate;
    }

    setReportDate(date: Date) {
        this.reportDate = date;
    }

    getReportStartDate() {
        return this.reportStartDate;
    }

    setReportStartDate(date: Date) {
        this.reportStartDate = date;
    }

    getReportEndDate() {
        return this.reportEndDate;
    }

    setReportEndDate(date: Date) {
        this.reportEndDate = date;
    }


}
