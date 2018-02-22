import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../../util/endpoints";
import {LocationRequest, InviteRequest} from "../model/app-config.model";
import {StorageService} from "../../../../service/storage.service";

@Injectable()
export class AppConfigService {

  constructor(private httpClient: HttpClient, private ss: StorageService) { }


  fetchCountries(): Observable<any> {
    return this.httpClient
        .get(Endpoints.FETCH_COUNTRIES, {
          headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded')
        })
  }


  fetchStates(id:number): Observable<any> {
    return this.httpClient
        .get(Endpoints.FETCH_STATES + id + "/states", {
          headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded')
        })
  }

    saveLocation(model:LocationRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg()? this.ss.getSelectedOrg().orgId:null;
        model.createdBy = this.ss.getLoggedInUserEmail();

        return this.httpClient
            .post(Endpoints.SAVE_LOCATION, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

    inviteAttendees(model:InviteRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg()? this.ss.getSelectedOrg().orgId: null;
        model.role = "ATTENDEE";

        return this.httpClient
            .post(Endpoints.SEND_INVITES, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

    downloadTemplate(): Observable<any> {
        let params = new HttpParams()
        .set('orgId', this.ss.getSelectedOrg()? this.ss.getSelectedOrg().orgId: null)
        .set('name', 'TEMPLATE');

        return this.httpClient
            .get(Endpoints.DOWNLOAD_TEMPLATE_BULK + params.toString(), {
                responseType: "blob",
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

    uploadTemplate(file: File) : Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orgId', this.ss.getSelectedOrg()? this.ss.getSelectedOrg().orgId: null);

        return this.httpClient.post(Endpoints.UPLOAD_TEMPLATE_BULK, formData)
    }

    editLocation(model:LocationRequest): Observable<any>{
        model.orgId = this.ss.getSelectedOrg()? this.ss.getSelectedOrg().orgId:null;
        model.createdBy = this.ss.getLoggedInUserEmail();

        let body = JSON.parse(JSON.stringify(model));
        delete body.created;
        delete body.active;
        delete body.lastModified;
        delete body.locId;

        return this.httpClient
            .post(Endpoints.EDIT_LOCATION + model.locId, JSON.stringify(body), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

}
