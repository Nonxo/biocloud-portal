import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../util/endpoints";
import {CreateOrgRequest, AssignUserRequest} from "../model/app-content.model";
import {StorageService} from "../../../service/storage.service";
import {MediaType} from "../../../util/constants";

@Injectable()
export class AppContentService {

    constructor(private httpClient:HttpClient, private ss:StorageService) {
    }

    createOrg(model:CreateOrgRequest):Observable<any> {

        return this.httpClient
            .post(Endpoints.CREATE_ORG, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })

    }

    getOrgDetails():Observable<any> {

        const body = "";

        return this.httpClient
            .get(Endpoints.RETRIEVE_ORG_DETAILS + body, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })

    }

    fetchUsersOrg():Observable<any> {
        const body = this.ss.getUserId();

        return this.httpClient
            .get(Endpoints.FETCH_USERS_ORG + body + "/orgs", {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })

    }

    fetchOrgLocations(orgId:string):Observable<any> {
        let params = new HttpParams()
            .set('orgId', orgId)

        return this.httpClient
            .get(Endpoints.FETCH_ORG_LOCATIONS + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })

    }

    fetchUsersInALocation(locId:string):Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_USERS + locId + "/users", {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
    }

    fetchUsersInAnOrg(orgId:string):Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_USERS_IN_AN_ORG + orgId + "/users", {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }

    activateLocation(status:boolean, locId:string): Observable<any> {
        return this.httpClient
            .post(Endpoints.DEACTIVATE_ACTIVATE_LOCATION + locId + "/" + status,null, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }

    fetchAttendees(org:boolean, id:string):Observable<any> {

        let params;

        if(org) {
            params = new HttpParams()
                .set("orgId", id);
        } else {
            params = new HttpParams()
                .set("locId", id);
        }


        return this.httpClient
            .get(Endpoints.FETCH_ATTENDEES + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }

    assignUsersToLocation(model:AssignUserRequest):Observable<any> {
        return this.httpClient
            .post(Endpoints.ASSIGN_USERS, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
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
