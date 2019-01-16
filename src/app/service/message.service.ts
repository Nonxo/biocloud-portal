/**
 * Created by Kingsley Ezeokeke on 2/13/2018.
 */
import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class MessageService {

    private selectedOrg = new Subject<string>();
    private editLocation = new Subject<boolean>();
    private homeLinkActive = new Subject<boolean>();
    private title = new Subject<string>();
    private display = new Subject<boolean>();
    private userImage = new Subject<string>();
    private updateSub = new Subject<any>();
    private updateNotif = new Subject<boolean>();
    private updateLocation = new Subject<boolean>();
    private createOrg = new Subject<boolean>();

    constructor() {}

    setSelectedOrg(value:string):void {
        this.selectedOrg.next(value);
    }

    getSelectedOrg(): Observable<string> {
        return this.selectedOrg.asObservable();
    }

    setUserImage(value:string):void {
      this.userImage.next(value);
    }

    getUserImage(): Observable<string> {
      return this.userImage.asObservable();
    }

    setEditLocation(value:boolean):void {
        this.editLocation.next(value);
    }

    isEditLocation(): Observable<boolean> {
        return this.editLocation.asObservable();
    }

    setHomeLinkActive(value:boolean):void {
        this.homeLinkActive.next(value);
    }

    isHomeLinkActive(): Observable<boolean> {
        return this.homeLinkActive.asObservable();
    }

    setTitle(value:string):void {
        this.title.next(value);
    }

    getTitle(): Observable<string> {
        return this.title.asObservable();
    }

    setDisplay(value:boolean):void {
        this.display.next(value);
    }

    getDisplayStatus(): Observable<boolean> {
        return this.display.asObservable();
    }

    setUpdateSub(value: any): void {
        this.updateSub.next(value);
    }

    getUpdateSub(): Observable<any> {
        return this.updateSub.asObservable();
    }

    setUpdateNotif(value: boolean) {
        this.updateNotif.next(value);
    }

    getUpdateNotif(): Observable<boolean> {
        return this.updateNotif.asObservable();
    }

    setUpdateLocation(value: boolean) {
        this.updateLocation.next(value);
    }

    getUpdateLocation(): Observable<boolean> {
        return this.updateLocation.asObservable();
    }

    setCreateOrg(value: boolean) {
        this.createOrg.next(value);
    }

    isCreateOrg(): Observable<boolean> {
        return this.createOrg.asObservable();
    }

    loadScript(url, id) {
        if(document.getElementById(id) == null) {
            let node = document.createElement('script');
            node.id = id;
            node.src = url;
            node.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }
}
