import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Endpoints} from "../../../../util/endpoints";
import {AssignAdminRequest, InviteRequest, LocationRequest, SupportMailRequest} from "../model/app-config.model";
import {StorageService} from "../../../../service/storage.service";
import {MediaType} from "../../../../util/constants";
import {map, timeout} from "rxjs/operators";
import {AuthService} from "../../../../components/auth/auth.service";

@Injectable()
export class AppConfigService {

    constructor(private httpClient: HttpClient, private ss: StorageService, private as: AuthService) { }


    fetchCountries(): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_COUNTRIES, {
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


    fetchStates(id: number): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_STATES + id + "/states", {
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

    saveLocation(model: LocationRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null;
        model.createdBy = this.ss.getLoggedInUserEmail();

        delete model.id;

        return this.httpClient
            .post(Endpoints.SAVE_LOCATION, JSON.stringify(model), {
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

    inviteAttendees(model: InviteRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null;

        return this.httpClient
            .post(Endpoints.SEND_INVITES, JSON.stringify(model), {
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

    downloadTemplate(): Observable<any> {
        let params = new HttpParams()
            .set('orgId', this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null)
            .set('name', 'TEMPLATE');

        return this.httpClient
            .get(Endpoints.DOWNLOAD_TEMPLATE_BULK + params.toString(), {
                responseType: "blob",
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            })
    }

    uploadTemplate(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orgId', this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null);

        return this.httpClient.post(Endpoints.UPLOAD_TEMPLATE_BULK, formData)
    }

    editLocation(model: LocationRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null;
        model.createdBy = this.ss.getLoggedInUserEmail();

        delete model.id;

        let body = JSON.parse(JSON.stringify(model));
        delete body.created;
        delete body.active;
        delete body.lastModified;
        delete body.locId;
        delete body.suggestedLng;
        delete body.suggestedLat;
        delete body.locId;

        return this.httpClient
            .post(Endpoints.EDIT_LOCATION + model.locId, JSON.stringify(body), {
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

    fetchTimezones(): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_TIMEZONES, {
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

    assignAdmins(model: AssignAdminRequest): Observable<any> {
        model.orgId = this.ss.getSelectedOrg() ? this.ss.getSelectedOrg().orgId : null;

        return this.httpClient
            .post(Endpoints.ASSIGN_ADMINS_LOCATIONS, JSON.stringify(model), {
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

    sendSupportEmail(model: SupportMailRequest) {
        return this.httpClient
            .post(Endpoints.SEND_SUPPORT_EMAIL, JSON.stringify(model), {
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

    getTimezoneByCoords(latitude: number, longitude: number) {
        return this.httpClient
            .get(Endpoints.GET_TIMEZONE_BY_COORDS + latitude + '/' + longitude, {
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

    fetchCountryTimezones(id: number): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_COUNTRY_TIMEZONES + id , {
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

}
