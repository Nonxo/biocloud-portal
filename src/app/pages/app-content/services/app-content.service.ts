import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../util/endpoints";
import {CreateOrgRequest} from "../model/app-content.model";
import {StorageService} from "../../../service/storage.service";

@Injectable()
export class AppContentService {

  constructor(private httpClient: HttpClient, private ss: StorageService) { }

  createOrg(model:CreateOrgRequest): Observable<any> {

    return this.httpClient
        .post(Endpoints.CREATE_ORG, JSON.stringify(model), {
          headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
        })

  }

  getOrgDetails(): Observable<any> {

    const body = "";

    return this.httpClient
        .get(Endpoints.RETRIEVE_ORG_DETAILS + body , {
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

}
