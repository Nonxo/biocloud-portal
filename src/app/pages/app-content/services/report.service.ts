/**
 * Created by Kingsley Ezeokeke on 3/21/2018.
 */


import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Endpoints} from "../../../util/endpoints";
import {DaysPresentRequest, ReportModel} from "../model/app-content.model";
import {MediaType} from "../../../util/constants";
import {map, timeout} from "rxjs/operators";
import {AuthService} from "../../../components/auth/auth.service";

@Injectable()
export class ReportService {

    constructor(private httpClient: HttpClient,private as: AuthService) {}

    fetchDailyReport(model: ReportModel):Observable<any> {
        const params = new HttpParams()
            .set("orgId", model.orgId)
            .set("locId", model.locId)
            .set("export", String(model.export))
            .set("exportFormat", model.exportFormat)
            .set("reportType", model.reportType)
            .set("pageSize", String(model.pageSize))
            .set("pageNo", String(model.pageNo))
            .set("title", model.title)
            .set("startDate", model.startDate.toString())
            .set("endDate", model.endDate.toString())
            .set("param", model.param)
            .set("companyName", model.companyName)
            .set("locationName", model.locationName)
            .set("user", model.user);

        return this.httpClient
            .get(Endpoints.FETCH_DAILY_REPORT + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchUserDailyReport(orgId: string, email: string, locId: string, startDate: number, endDate: number) {
        const params = new HttpParams()
            .set("orgId", orgId)
            .set("email", email)
            .set("locId", locId)
            .set("startDate", startDate.toString())
            .set("endDate", endDate.toString());

        return this.httpClient
            .get(Endpoints.FETCH_USER_DAILY_REPORT + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    fetchAttendanceStatus(model): Observable<any> {
        return this.httpClient
            .post(Endpoints.GET_ATTENDANCE_STATUS, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    getDaysPresent(model: DaysPresentRequest): Observable<any> {
        const params = new HttpParams()
            .set("id", model.id.toString())
            .set("weekId", model.weekId.toString())
            .set("orgId", model.orgId)
            .set("email", model.email)
            .set("locId", model.locId)
            .set("currentStartTime", model.currentStartTime.toString())
            .set("currentEndTime", model.currentEndTime.toString())
            .set("prevStartTime", model.prevStartTime.toString())
            .set("prevEndTime", model.prevEndTime.toString());

        return this.httpClient
            .get(Endpoints.GET_DAYS_PRESENT + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    getAvgTime(model: DaysPresentRequest): Observable<any> {
        const params = new HttpParams()
            .set("id", model.id.toString())
            .set("weekId", model.weekId.toString())
            .set("orgId", model.orgId)
            .set("email", model.email)
            .set("locId", model.locId)
            .set("currentStartTime", model.currentStartTime.toString())
            .set("currentEndTime", model.currentEndTime.toString())
            .set("prevStartTime", model.prevStartTime.toString())
            .set("prevEndTime", model.prevEndTime.toString());

        return this.httpClient
            .get(Endpoints.GET_AVG_TIME + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    generateMetabaseToken(orgId: string, startdate: string, enddate: string): Observable<any> {
        const params = new HttpParams()
            .set("orgId", orgId)
            .set("startdate", startdate)
            .set("enddate", enddate);

        return this.httpClient
            .get(Endpoints.GENERATE_METABASE_TOKEN + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }

    downloadQuickReport(locId: string, startDate: string, endDate: string, username: string, companyName: string): Observable<any> {
        const params = new HttpParams()
            .set("locId", locId)
            .set("startDate", startDate)
            .set("endDate", endDate)
            .set("username", username)
            .set("companyName", companyName);

        return this.httpClient
            .get(Endpoints.DOWNLOAD_QUICK_REORT + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            }).pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    this.as.checkUnauthorized(res.description);
                    return res
                })
            )
    }
}

