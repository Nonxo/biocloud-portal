import {Component, OnInit} from '@angular/core';
import {SubscriptionPlan} from "../model/app-content.model";
import {SubscriptionService} from "../services/subscription.service";
import {NotifyService} from "../../../service/notify.service";

declare function getpaidSetup(data): void;

@Component({
    selector: 'app-subscribe',
    templateUrl: './subscribe.component.html',
    styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

    public subscriptionPlans: SubscriptionPlan[] = [
        {
            name: "BASIC",
            pricePerMonth: 30000,
            maxAttendeeThreshold: 900,
            description: null,
            pricePerAnnum: 90000,
            priceperDay: 400,
            enabled: true
        },
        {
            name: "PREMIUM",
            pricePerMonth: 50000,
            maxAttendeeThreshold: 900,
            description: null,
            pricePerAnnum: 90000,
            priceperDay: 400,
            enabled: true
        }
    ];
    public monthlyPlan: boolean = true;
    public selectedCurrency: string = 'NGN';
    public exchangeRate: number = 360;
    private amount: number;
    public exchangeRates: any[] = [];

    constructor(private subService: SubscriptionService, private ns: NotifyService) {
    }

    ngOnInit() {
        this.fetchPlans();
        this.fetchAllExchangeRates();
    }

    fetchPlans() {
        this.subService.fetchPlans()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.subscriptionPlans = result.plans ? result.plans : [];
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred")
                }
            )
    }

    getPrice(plan: SubscriptionPlan) {
        if (this.selectedCurrency == 'NGN') {
            if (this.monthlyPlan) {
                return plan.pricePerMonth;
            } else {
                return plan.pricePerAnnum;
            }
        } else {
            if (this.monthlyPlan) {
                return plan.pricePerMonth / this.exchangeRate;
            } else {
                return plan.pricePerAnnum / this.exchangeRate;
            }
        }
    }

    generateTransactionRef(amount:number) {
        this.subService.generateTransactionRef(amount)
            .subscribe(
                result => {debugger;},
                error => {debugger;}
            )
    }

    subscribe(plan) {

        const amount = this.getPrice(plan)
        const API_publicKey = "FLWPUBK-d5445503ec4feba528363691104e7408-X";

        this.generateTransactionRef(amount);

        getpaidSetup({
            PBFPubKey: API_publicKey,
            customer_email: "user@example.com",
            amount: amount,
            customer_phone: "234099940409",
            currency: this.selectedCurrency,
            payment_method: "both",
            txref: "rave-123456",
            meta: [{metaname: "flightID", metavalue: "AP1234"}],
            onclose: function () {
            },
            callback: function (response) {
                debugger;
                var flw_ref = response.tx.flwRef; // collect flwRef returned and pass to a 					server page to complete status check.
                console.log("This is the response returned after a charge", response);
                if (
                    response.tx.chargeResponseCode == "00" ||
                    response.tx.chargeResponseCode == "0"
                ) {
                    // redirect to a sucess page
                } else {
                    // verify transaction status
                }
            }
        });
    }

    fetchAllExchangeRates() {
        this.subService.fetchAllExchangeRates()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.exchangeRates = result.rates ? result.rates : [];
                    }
                },
                error => {
                    debugger;
                }
            )
    }

}
