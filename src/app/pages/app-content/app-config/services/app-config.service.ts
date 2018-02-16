import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
        model.orgId = this.ss.getSelectedOrg();
        model.createdBy = this.ss.getLoggedInUserEmail();

        return this.httpClient
            .post(Endpoints.SAVE_LOCATION, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

    inviteAttendees(model:InviteRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg();
        model.role = "ATTENDEE";

        return this.httpClient
            .post(Endpoints.SEND_INVITES, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

}
