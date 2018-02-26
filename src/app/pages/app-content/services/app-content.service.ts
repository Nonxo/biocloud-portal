import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../util/endpoints";
import {CreateOrgRequest} from "../model/app-content.model";
import {StorageService} from "../../../service/storage.service";

@Injectable()
export class AppContentService {

  constructor(private httpClient: HttpClient, private ss: StorageService) {
  }

  createOrg(model: CreateOrgRequest): Observable<any> {

    return this.httpClient
      .post(Endpoints.CREATE_ORG, JSON.stringify(model), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
      })

  }

  getOrgDetails(): Observable<any> {

    const body = "";

    return this.httpClient
      .get(Endpoints.RETRIEVE_ORG_DETAILS + body, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })

  }

  fetchUsersOrg(): Observable<any> {
    const body = this.ss.getUserId();

    return this.httpClient
      .get(Endpoints.FETCH_USERS_ORG + body + "/orgs", {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })

  }

  fetchOrgLocations(orgId: string): Observable<any> {
    let params = new HttpParams()
      .set('orgId', orgId)

    return this.httpClient
      .get(Endpoints.FETCH_ORG_LOCATIONS + params, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })

  }

  fetchNotification(orgId: string): Observable<any> {
    let params = new HttpParams().set('orgId', orgId)
    return this.httpClient.get(Endpoints.FETCH_NOTIFICATION + params, {
      headers: new HttpHeaders()

    })

  }


  fetchNotificationDetails(inviteId: string): Observable<any> {
    return this.httpClient.get(Endpoints.FETCH_NOTIFICATION_DETAILS + inviteId, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }

  approveRejectNotification(inviteId:string, action:string): Observable<any> {
    return this.httpClient.post(Endpoints.APPROVE_REJECT_NOTIFICATION + inviteId + "/" + action, null, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }

}
