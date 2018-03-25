import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../util/endpoints";
import {
    CreateOrgRequest, AssignUserRequest, ApproveRequest, AdminRemovalRequest, UpdateProfile,
    AttendeesPOJO, HistoryPojo, UserPaginationPojo
} from "../model/app-content.model";
import {StorageService} from "../../../service/storage.service";
import {MediaType} from "../../../util/constants";
import set = Reflect.set;

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

    updateOrg(model:CreateOrgRequest):Observable<any> {
        let orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .post(Endpoints.CREATE_ORG + "/" + orgId, model, {
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

    fetchUsersInAnOrg(orgId:string, model:UserPaginationPojo):Observable<any> {
        const params = new HttpParams()
            .set("pageNo", String(model.pageNo))
            .set("pageSize", String(model.pageSize));

        return this.httpClient
            .get(Endpoints.FETCH_USERS_IN_AN_ORG + orgId + "/users?" + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }

    fetchUsersInAnOrgCount(orgId:string):Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_USERS_IN_AN_ORG + orgId + "/users/count", {
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

    totalEmployeeCount(userId:string,orgId:string): Observable<any> {
      let url = `${Endpoints.FETCH_TOTAL_EMPLOYEE_COUNT}/${userId}/orgs/${orgId}/attendees`;
      return this.httpClient.get(url, {
        headers: new HttpHeaders()
          .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
      })
    }

    fetchAttendees(model: AttendeesPOJO):Observable<any> {
        let params;
        if (model.orgId) {
            params = new HttpParams()
                .set("orgId", model.orgId)
                .set("active", String(model.active))
                .set("pageNo", String(model.pageNo))
                .set("pageSize", String(model.pageSize));
        } else {
            params = new HttpParams()
                .set("locId", model.locId)
                .set("active", String(model.active))
                .set("pageNo", String(model.pageNo))
                .set("pageSize", String(model.pageSize));
        }

        return this.httpClient
            .get(Endpoints.FETCH_ATTENDEES + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }

    fetchAttendeesCount(model: AttendeesPOJO) {
        let params;
        if (model.orgId) {
            params = new HttpParams()
                .set("orgId", model.orgId)
                .set("active", String(model.active));
        } else {
            params = new HttpParams()
                .set("locId", model.locId)
                .set("active", String(model.active));
        }

        return this.httpClient
            .get(Endpoints.FETCH_COUNT_ATTENDEES + params, {
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

    fetchNotification(orgId:string):Observable<any> {
        let params = new HttpParams().set('orgId', orgId);
        return this.httpClient.get(Endpoints.FETCH_NOTIFICATION + params, {
            headers: new HttpHeaders()

        })

    }


  fetchNotificationDetails(invitesId: string): Observable<any> {
    return this.httpClient.get(Endpoints.FETCH_NOTIFICATION_DETAILS + invitesId, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }

    approveRejectNotification(inviteId:string, model:ApproveRequest):Observable<any> {
        return this.httpClient.post(Endpoints.APPROVE_REJECT_NOTIFICATION + inviteId + "/status", JSON.stringify(model), {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_JSON)
        })
    }

  updateProfile(userId:string, model:UpdateProfile): Observable<any> {
      return this.httpClient.post(Endpoints.EDIT_USER_PROFILE + userId, JSON.stringify(model), {
        headers: new HttpHeaders()
          .set('Content-Type', MediaType.APPLICATION_JSON)
      })
  }

  retrieveUser(userId:string): Observable<any> {
            return this.httpClient.get(Endpoints.EDIT_USER_PROFILE + userId, {
        headers: new HttpHeaders()
          .set('Content-Type', MediaType.APPLICATION_JSON)
      })
  }



    activateDeactivateAttendees(model) {
        return this.httpClient
            .post(Endpoints.ACTIVATE_DEACTIVATE_ATTENDEE, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
    }

    fetchPendingAttendees(orgId:string, locId:string):Observable<any> {
        const params = new HttpParams()
            .set("orgId", orgId)
            .set("locId", locId);

        return this.httpClient
            .get(Endpoints.FETCH_PENDING_ATTENDEES + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }

    removeAdmin(model:AdminRemovalRequest) {
        model.orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .post(Endpoints.REMOVE_ADMIN, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
    }

    clockInsHistory(orgId:string, pageSize:number, pageNo:number):Observable<any> {
      let params = new HttpParams()
        .set('orgId', orgId)
        .set('pageSize', pageSize.toString())
        .set('pageNo', pageNo.toString());
        return this.httpClient.get(Endpoints.FETCH_CLOCKINS_HISTORY + params, {
        headers: new  HttpHeaders()
          .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
      })
    }

  totalClockInsDaily(orgId:string, startDate:number, endDate:number):Observable<any> {
      let params = new HttpParams()
        .set('orgId', orgId)
        .set('startDate', String(startDate))
        .set('endDate', String(endDate));
      return this.httpClient.get(Endpoints.FETCH_CLOCKINS_COUNT + params, {
        headers: new HttpHeaders()
          .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
      })

  }

    fetchOrgUsersLocation():Observable<any> {
        const userId = this.ss.getUserId();
        const orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .get(Endpoints.FETCH_USERS_ORG + userId + "/orgs/" + orgId + "/locations", {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })

    }

    retrieveClockinHistory(model: HistoryPojo):Observable<any> {
        const param = new HttpParams()
            .set("orgId", model.orgId)
            .set("locId", model.locId)
            .set("pageNo", String(model.pageNo))
            .set("pageSize", String(model.pageSize))
            .set("late", model.late)
            .set("email", model.email);

        return this.httpClient
            .get(Endpoints.FETCH_CLOCKIN_HISTORY + param, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }


}
