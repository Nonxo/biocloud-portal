/**
 * Created by Kingsley Ezeokeke on 4/10/2018.
 */

import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Endpoints} from "../../../util/endpoints";
import {MediaType} from "../../../util/constants";
import {map, timeout} from "rxjs/operators";
import {AuthService} from "../../../components/auth/auth.service";
import {VerifyPaymentRequest} from "../model/app-content.model";

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

    fetchSpecificExchangeRate(target:string) {
        const body = new HttpParams()
            .set('base', "NGN")
            .set('target', target);

        return this.httpClient
            .get(Endpoints.FETCH_SPECIFIC_EXCHANGE_RATE + body, {
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

    generateTransactionRef(amount:number, currency:string, planId): Observable<any> {
        const params = new HttpParams()
            .set('amount', amount.toString())
            .set('currency', currency)
            .set('planId', planId)

        return this.httpClient
            .post(Endpoints.GEENERATE_TRANSACTION_REF, params.toString(), {
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

    verifyPayment(model: VerifyPaymentRequest): Observable<any> {
        return this.httpClient
            .post(Endpoints.VERIFY_PAYMENT, JSON.stringify(model), {
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
