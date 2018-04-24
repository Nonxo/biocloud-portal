import {Component, OnInit, TemplateRef} from '@angular/core';
import {SubscriptionPlan, VerifyPaymentRequest} from "../model/app-content.model";
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
            planId: "BAS-123",
            pricePerMonth: 30000,
            maxAttendeeThreshold: 900,
            discount: 20,
            description: null,
            pricePerAnnum: 90000,
            priceperDay: 400,
            enabled: true
        },
        {
            name: "PREMIUM",
            planId: "PREM-112",
            pricePerMonth: 50000,
            maxAttendeeThreshold: 900,
            discount: 20,
            description: null,
            pricePerAnnum: 90000,
            priceperDay: 400,
            enabled: true
        }
    ];
    public monthlyPlan: boolean = true;
    public selectedCurrency: string = 'NGN';
    public selectedPlan: SubscriptionPlan;
    public exchangeRate: number;
    private amount: number;
    public exchangeRates: any[] = [];
    private transactionRef: string;
    private PUBKey: string;
    private cipher: string;
    public amountToPay: number;
    public totalAmount: number;
    private planId: string;
    private userEmail: string;
    public modalRef: BsModalRef;
    public renewSub: boolean;
    public discountRate:number;
    public discountPrice:number;
    private orgId:string;
    public subscription:any;

    constructor(private subService: SubscriptionService,
                private modalService: BsModalService,
                private ns: NotifyService,
                private ss: StorageService) {
        this.userEmail = this.ss.getLoggedInUserEmail();
        this.orgId = this.ss.getSelectedOrg().orgId;
    }

    ngOnInit() {
        this.fetchSubscriptionDetails();
        this.fetchAllExchangeRates();
    }

    onChange() {
        this.fetchSpecificExchangeRate();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    fetchSubscriptionDetails() {
        this.subService.fetchSubscriptionDetails(this.orgId)
            .finally(() => {this.fetchPlans()})
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.subscription = result.subscription;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred");}
            )
    }

    fetchPlans() {
        this.subService.fetchPlans()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.subscriptionPlans = result.plans ? result.plans : [];
                        this.setDiscountRate();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred")
                }
            )
    }

    setDiscountRate() {
        this.discountRate = this.subscriptionPlans[0].discount;
    }

    setDiscountPrice() {
        if(this.discountRate > 0 && !this.monthlyPlan) {
            this.discountPrice =  Math.ceil((this.discountRate/100) * this.totalAmount);
            return;
        }

        this.discountPrice = 0;

    }

    getPrice(plan: SubscriptionPlan):number {
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
        this.subService.generateTransactionRef(this.orgId, this.amountToPay, this.selectedCurrency, this.planId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.cipher = result.cipher;
                        this.PUBKey = result.ravePayPublicKey;
                        this.transactionRef = result.transactionRef;

                        this.callRave();
                    } else {
                        this.ns.showError(result.description);
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
            payment_method: this.renewSub? "card":"both",
            txref: this.transactionRef,
            meta: [{metaname: 'brcrypt', metavalue: this.cipher}],
            onclose: function () {
            },
            callback: (response) => {
                let txRef = response.tx.txRef; // collect flwRef returned and pass to a 					server page to complete status check.
                let authToken = response.tx.chargeToken.embed_token;

                console.log("This is the response returned after a charge", response);
                if (
                    response.tx.chargeResponseCode == "00" ||
                    response.tx.chargeResponseCode == "0"
                ) {

                    if (this.renewSub) {
                        this.verifyPayment(txRef, authToken);
                    }

                    // redirect to a success page
                    this.verifyPayment(txRef, null);
                } else {
                    // verify transaction status
                }
            }
        });
    }

    confirmPayment(plan: SubscriptionPlan, template: TemplateRef<any>) {
        this.selectedPlan = plan;
        this.renewSub = false;
        this.totalAmount = this.getPrice(plan);

        this.setDiscountPrice();
        this.amountToPay = this.totalAmount - this.discountPrice;
        this.openModal(template);
    }

    subscribe(plan) {
        this.modalRef.hide();
        this.planId = plan.planId;
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
                    if (result.code == 0) {
                        this.exchangeRate = result.rate.rate;
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    verifyPayment(txRef, authToken:string) {

        this.subService.verifyPayment(new VerifyPaymentRequest(txRef, this.monthlyPlan? 'MONTHLY':'ANNUAL', authToken, this.orgId, this.exchangeRate))
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess(result.description);
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

}
