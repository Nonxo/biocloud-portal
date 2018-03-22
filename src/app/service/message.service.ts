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

    constructor() {}

    setSelectedOrg(value:string):void {
        this.selectedOrg.next(value);
    }

    getSelectedOrg(): Observable<string> {
        return this.selectedOrg.asObservable();
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

}