import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Endpoints } from "../../../util/endpoints";
import {
    CreateOrgRequest, AssignUserRequest, ApproveRequest, AdminRemovalRequest, UpdateProfile,
    AttendeesPOJO, HistoryPojo, UserPaginationPojo, ApproveCoordinate
} from "../model/app-content.model";
import { StorageService } from "../../../service/storage.service";
import { MediaType } from "../../../util/constants";
import set = Reflect.set;
import { timeout, map } from "rxjs/operators";
import { AuthService } from "../../../components/auth/auth.service";

@Injectable()
export class AppContentService {

    constructor(private httpClient: HttpClient, private ss: StorageService, private as: AuthService) {
    }

    createOrg(model: CreateOrgRequest): Observable<any> {

        return this.httpClient
            .post(Endpoints.CREATE_ORG, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    updateOrg(model: CreateOrgRequest): Observable<any> {
        let orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .post(Endpoints.CREATE_ORG + "/" + orgId, model, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }

    getOrgDetails(): Observable<any> {

        const body = "";

        return this.httpClient
            .get(Endpoints.RETRIEVE_ORG_DETAILS + body, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }

    fetchUsersOrg(): Observable<any> {
        const body = this.ss.getUserId();

        return this.httpClient
            .get(Endpoints.FETCH_USERS_ORG + body + "/orgs", {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }

    fetchOrgLocations(orgId: string): Observable<any> {
        let params = new HttpParams()
            .set('orgId', orgId)

        return this.httpClient
            .get(Endpoints.FETCH_ORG_LOCATIONS + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }

    fetchUsersInALocation(locId: string): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_USERS + locId + "/users", {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchUsersInAnOrg(orgId: string, model: UserPaginationPojo): Observable<any> {
        const params = new HttpParams()
            .set("pageNo", String((model.pageNo - 1) * model.pageSize))
            .set("pageSize", String(model.pageSize));

        return this.httpClient
            .get(Endpoints.FETCH_USERS_IN_AN_ORG + orgId + "/users?" + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchUsersInAnOrgCount(orgId: string): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_USERS_IN_AN_ORG + orgId + "/users/count", {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchWorkStatus(userId: string): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_WORK_STATUS + userId + "/workstatus", {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    activateLocation(status: boolean, locId: string): Observable<any> {
        return this.httpClient
            .post(Endpoints.DEACTIVATE_ACTIVATE_LOCATION + locId + "/" + status, null, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    deleteLocation(locId: string): Observable<any> {
        const params = new HttpParams()
            .set("locId", locId);

        return this.httpClient
            .post(Endpoints.DELETE_LOCATION + '', params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    totalEmployeeCount(userId: string, orgId: string): Observable<any> {
        let url = `${Endpoints.FETCH_TOTAL_EMPLOYEE_COUNT}/${userId}/orgs/${orgId}/attendees`;
        return this.httpClient.get(url, {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchAttendees(model: AttendeesPOJO): Observable<any> {
        let params;
        if (model.orgId) {
            params = new HttpParams()
                .set("orgId", model.orgId)
                .set("active", String(model.active))
                .set("param", model.param)
                .set("pageNo", String(model.pageNo))
                .set("pageSize", String(model.pageSize));
        } else {
            params = new HttpParams()
                .set("locId", model.locId)
                .set("active", String(model.active))
                .set("param", model.param)
                .set("pageNo", String(model.pageNo))
                .set("pageSize", String(model.pageSize));
        }

        return this.httpClient
            .get(Endpoints.FETCH_ATTENDEES + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchAttendeesCount(model: AttendeesPOJO) {
        let params;
        if (model.orgId) {
            params = new HttpParams()
                .set("orgId", model.orgId)
                .set("param", model.param)
                .set("active", String(model.active));
        } else {
            params = new HttpParams()
                .set("locId", model.locId)
                .set("param", model.param)
                .set("active", String(model.active));
        }

        return this.httpClient
            .get(Endpoints.FETCH_COUNT_ATTENDEES + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }


    assignUsersToLocation(model: AssignUserRequest): Observable<any> {
        return this.httpClient
            .post(Endpoints.ASSIGN_USERS, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchNotification(orgId: string): Observable<any> {
        let params = new HttpParams().set('orgId', orgId);
        return this.httpClient.get(Endpoints.FETCH_NOTIFICATION + params, {
            headers: new HttpHeaders()

        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }


    fetchNotificationDetails(invitesId: string): Observable<any> {
        return this.httpClient.get(Endpoints.FETCH_NOTIFICATION_DETAILS + invitesId, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    approveRejectNotification(inviteId: string, model: ApproveRequest): Observable<any> {
        return this.httpClient.post(Endpoints.APPROVE_REJECT_NOTIFICATION + inviteId + "/status", JSON.stringify(model), {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_JSON)
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    updateProfile(userId: string, model: UpdateProfile): Observable<any> {
        return this.httpClient.post(Endpoints.EDIT_USER_PROFILE + userId, JSON.stringify(model), {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_JSON)
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    retrieveUser(userId: string): Observable<any> {
        return this.httpClient.get(Endpoints.EDIT_USER_PROFILE + userId, {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_JSON)
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }


    activateDeactivateAttendees(model) {
        return this.httpClient
            .post(Endpoints.ACTIVATE_DEACTIVATE_ATTENDEE, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchPendingAttendees(orgId: string, locId: string): Observable<any> {
        const params = new HttpParams()
            .set("orgId", orgId)
            .set("locId", locId);

        return this.httpClient
            .get(Endpoints.FETCH_PENDING_ATTENDEES + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    removeAdmin(model: AdminRemovalRequest) {
        model.orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .post(Endpoints.REMOVE_ADMIN, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    clockInsHistory(orgId: string, pageSize: number, pageNo: number, locations: any[]): Observable<any> {
        let params = new HttpParams()
            .set('orgId', orgId)
            .set('pageSize', pageSize.toString())
            .set('pageNo', pageNo.toString());

        if (locations.length > 0) {
            for (let loc of locations) {
                params = params.append('locId', loc.locId);
            }
        }

        return this.httpClient.get(Endpoints.FETCH_CLOCKINS_HISTORY + params, {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    totalClockInsDaily(orgId: string, startDate: number, endDate: number): Observable<any> {
        let params = new HttpParams()
            .set('orgId', orgId)
            .set('startDate', String(startDate))
            .set('endDate', String(endDate));
        return this.httpClient.get(Endpoints.FETCH_CLOCKINS_COUNT + params, {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
        })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }

    fetchOrgUsersLocation(): Observable<any> {
        const userId = this.ss.getUserId();
        const orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .get(Endpoints.FETCH_USERS_ORG + userId + "/orgs/" + orgId + "/locations", {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )

    }

    retrieveClockinHistory(model: HistoryPojo): Observable<any> {
        const param = new HttpParams()
            .set("orgId", model.orgId)
            .set("locId", model.locId)
            .set("pageNo", String(model.pageNo))
            .set("pageSize", String(model.pageSize))
            .set("late", model.late)
            .set("email", model.email);

        return this.httpClient
            .get(Endpoints.FETCH_CLOCKINS_HISTORY + param, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchPuncScore(model: HistoryPojo, startTime: number, endTime: number): Observable<any> {
        const params = new HttpParams()
            .set("email", model.email)
            .set("orgId", model.orgId)
            .set("locId", model.locId)
            .set("startTime", startTime.toString())
            .set("endTime", endTime.toString());

        return this.httpClient
            .get(Endpoints.FETCH_PUNCTUALITY_SCORE + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchInvitedUsers(model: AttendeesPOJO): Observable<any> {
        const params = new HttpParams()
            .set("orgId", model.orgId)
            .set("locId", model.locId)
            .set("pageSize", String(model.pageSize))
            .set("pageNo", String(model.pageNo))
            .set("param", String(model.param))
            .set("status", "SENT");

        return this.httpClient
            .get(Endpoints.FETCH_INVITED_USERS + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchInvitedUsersCount(model: AttendeesPOJO): Observable<any> {
        const params = new HttpParams()
            .set("orgId", model.orgId)
            .set("locId", model.locId)
            .set("param", model.param)
            .set("status", "SENT");

        return this.httpClient
            .get(Endpoints.FETCH_INVITED_USERS_COUNT + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    assignLocusers(model: AssignUserRequest): Observable<any> {
        return this.httpClient
            .post(Endpoints.REASSIGN_LOC_USERS + model.oldlocId + "/" + model.newlocId, null, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchAttendeesLocation(userId: string): Observable<any> {
        let orgId = this.ss.getSelectedOrg().orgId;

        return this.httpClient
            .get(Endpoints.FETCH_ATTENDEES_LOCATION + userId + "/orgs/" + orgId + "/locations", {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchCompanyType(): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_COMPANY_TYPE, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchEmployeeRange(): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_EMPLOYEE_RANGE, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    approveCoordinates(model: ApproveCoordinate): Observable<any> {
        return this.httpClient
            .post(Endpoints.APPROVE_COORDINATES, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res: any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

}
