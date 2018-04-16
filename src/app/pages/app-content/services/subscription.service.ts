/**
 * Created by Kingsley Ezeokeke on 4/10/2018.
 */

import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../util/endpoints";
import {MediaType} from "../../../util/constants";
import {map, timeout} from "rxjs/operators";
import {AuthService} from "../../../components/auth/auth.service";

@Injectable()
export class SubscriptionService {

    constructor(private httpClient: HttpClient, private as: AuthService) {}


    fetchPlans():Observable<any> {

        return this.httpClient
            .get(Endpoints.FETCH_SUBSCRIPTION_PLANS, {
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

    fetchAllExchangeRates(): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_ALL_EXCHANGE_RATE, {
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

    generateTransactionRef(amount:number): Observable<any> {

        const body = `amount=${amount}`;

        return this.httpClient
            .post(Endpoints.GEENERATE_TRANSACTION_REF, body, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_JSON)
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
