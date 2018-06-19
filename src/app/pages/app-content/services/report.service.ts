/**
 * Created by Kingsley Ezeokeke on 3/21/2018.
 */


import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Endpoints} from "../../../util/endpoints";
import {ReportModel} from "../model/app-content.model";
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
}
