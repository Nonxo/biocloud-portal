import {Component, OnInit, TemplateRef} from '@angular/core';
import {SubscriptionPlan} from "../model/app-content.model";
import {SubscriptionService} from "../services/subscription.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

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
    public exchangeRate: number;
    private amount: number;
    public exchangeRates: any[] = [];
    private transactionRef: string;
    private PUBKey: string;
    private cipher: string;
    private amountToPay: number;
    private userEmail: string;
    public modalRef:BsModalRef;

    constructor(private subService: SubscriptionService, private modalService: BsModalService, private ns: NotifyService, private ss: StorageService) {
        this.userEmail = this.ss.getLoggedInUserEmail()
    }

    ngOnInit() {
        this.fetchPlans();
        this.fetchAllExchangeRates();
    }

    onChange() {
        this.fetchSpecificExchangeRate();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
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
                return Math.ceil(plan.pricePerMonth);
            } else {
                return Math.ceil(plan.pricePerAnnum);
            }
        } else {
            if (this.monthlyPlan) {
                return Math.ceil(plan.pricePerMonth / this.exchangeRate);
            } else {
                return Math.ceil(plan.pricePerAnnum / this.exchangeRate);
            }
        }
    }

    generateTransactionRef() {
        this.subService.generateTransactionRef(this.amountToPay, this.selectedCurrency)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.cipher = result.cipher;
                        this.PUBKey = result.ravePayPublicKey;
                        this.transactionRef = result.transactionRef;

                        this.callRave();
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    callRave() {
        getpaidSetup({
            PBFPubKey: this.PUBKey,
            customer_email: this.userEmail,
            amount: this.amountToPay,
            customer_phone: "234099940409",
            currency: this.selectedCurrency,
            payment_method: "both",
            txref: this.transactionRef,
            meta: [{metaname: "flightID", metavalue: "AP1234"}],
            onclose: function () {
            },
            callback: function (response) {
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

    subscribe(plan) {
        this.amountToPay = this.getPrice(plan);
        this.generateTransactionRef();
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
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    fetchSpecificExchangeRate() {
        this.subService.fetchSpecificExchangeRate(this.selectedCurrency)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.exchangeRate = result.rate.rate;
                    }
                },
                error => {this.ns.showError("An Error Occurred");}
            )
    }

}
