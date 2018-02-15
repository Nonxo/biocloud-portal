import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../../util/endpoints";
import {LocationRequest} from "../model/app-config.model";

@Injectable()
export class AppConfigService {

  constructor(private httpClient: HttpClient) { }


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

    placesAutocomplete(): Observable<any> {
        return this.httpClient
            .get("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Amoeba&types=establishment&location=37.76999,-122.44696&radius=500&key=AIzaSyDX0uywgARFKu6Tsr6qC4v6acFdtrCxfAI", {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
    }

    saveLocation(model:LocationRequest): Observable<any> {
        model.orgId = "a0ca5431-7228-44ca-9592-a5e321e87837";
        model.createdBy = "elast@gustr.com";

        return this.httpClient
            .post(Endpoints.SAVE_LOCATION, JSON.stringify(model), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
    }

}
