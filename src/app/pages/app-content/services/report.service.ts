/**
 * Created by Kingsley Ezeokeke on 3/21/2018.
 */


import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Endpoints} from "../../../util/endpoints";
import {ReportModel} from "../model/app-content.model";
import {MediaType} from "../../../util/constants";

@Injectable()
export class ReportService {

    constructor(private httpClient: HttpClient) {}

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
            .set("user", model.user);

        return this.httpClient
            .get(Endpoints.FETCH_DAILY_REPORT + params, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
    }
}