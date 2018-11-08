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
import {SubscriptionChangeRequest, VerifyPaymentRequest} from "../model/app-content.model";

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

    generateTransactionRef(orgId:string, amount:number, currency:string, planId:string, txMode:string): Observable<any> {
        const params = new HttpParams()
            .set('amount', amount.toString())
            .set('currency', currency)
            .set('planId', planId)
            .set('txMode', txMode)
            .set('orgId', orgId);

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
        debugger;
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

    fetchSubscriptionDetails(orgId:string):Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_SUBSCRIPTION + "/" + orgId, {
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

    fetchSubscriptionHistory(orgId:string, pageSize:number, pageNo:number):Observable<any> {
        const body = new HttpParams()
            .set('pageSize', String(pageSize))
            .set('pageNo', String(pageNo));


        return this.httpClient
            .get(Endpoints.FETCH_SUBSCRIPTION + "/" + orgId + "/history?" + body, {
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

    fetchCards(orgId:string):Observable<any> {
        const body = new HttpParams()
            .set("orgId", orgId);

        return this.httpClient
            .get(Endpoints.FETCH_CARD + body, {
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

    deleteCard(orgId:string):Observable<any> {
        const body = new HttpParams()
            .set("orgId", orgId);

        return this.httpClient
            .get(Endpoints.DELETE_CARD + body, {
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

    changePlan(model: SubscriptionChangeRequest): Observable<any> {
        return this.httpClient
            .post(Endpoints.CHANGE_PLAN, JSON.stringify(model), {
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

    getProratedCost(model: SubscriptionChangeRequest): Observable<any> {
        const params = new HttpParams()
            .set("currency", model.currency)
            .set("orgId", model.orgId)
            .set("planId", model.planId)
            .set("billingCycle", model.billingCycle)
            .set("amount", String(model.amount));

        return this.httpClient
            .get(Endpoints.GET_PRORATED_COST + params, {
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

    setAutoRenew(orgId:string, status: boolean): Observable<any> {
        const params = new HttpParams()
            .set('orgId', orgId)
            .set('status', String(status));

        return this.httpClient
            .post(Endpoints.SET_AUTO_RENEW, params.toString(), {
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
