import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SubscriptionChangeRequest, SubscriptionPlan, VerifyPaymentRequest} from "../model/app-content.model";
import {SubscriptionService} from "../services/subscription.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {MessageService} from "../../../service/message.service";
import {BillingCycle, SubscriptionMode} from "../enums/enums";
import {DomSanitizer} from "@angular/platform-browser";

declare function getpaidSetup(data): void;

@Component({
    selector: 'app-subscribe',
    templateUrl: './subscribe.component.html',
    styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit, OnDestroy {

    public subscriptionPlans: SubscriptionPlan[] = [];
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
    @ViewChild("confirmPaymentTemplate")private confirmPaymentTemplate: TemplateRef<any>;
    iframeUrl:string;

    constructor(private subService: SubscriptionService,
                private modalService: BsModalService,
                private ns: NotifyService,
                private ss: StorageService,
                private mService: MessageService,
                public sanitizer: DomSanitizer) {
        this.userEmail = this.ss.getLoggedInUserEmail();
        this.orgId = this.ss.getSelectedOrg().orgId;

        this.iframeUrl = "http://reports.seamfix.com:3000" + "/embed/dashboard/" + "eyJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjE2MX0sInBhcmFtcyI6e319.U9E7vYy6-W69LjVlSUpQBKeGD1d0jW6BjqYweRNt3Jk" + "#bordered=true&titled=true";
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

                        //set billing cycle flag
                        if(this.subscription && this.subscription.billingCycle) {
                            this.subscription.billingCycle.toLowerCase() == BillingCycle.MONTHLY.toLowerCase()? this.monthlyPlan = true: this.monthlyPlan = false;
                        }

                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred");}
            )
    }

    fetchPlans() {
        this.mService.setDisplay(true);
        this.subService.fetchPlans()
            .finally(() => {this.mService.setDisplay(false);})
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
        this.subService.generateTransactionRef(this.orgId, this.amountToPay, this.selectedCurrency, this.planId, "SUBSCRIPTION")
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
                        this.verifyPayment(txRef, true);
                    } else {
                        // redirect to a success page
                        this.verifyPayment(txRef, false);
                    }

                } else {
                    // verify transaction status
                }
            }
        });
    }

    confirmPayment(plan: SubscriptionPlan, template: TemplateRef<any>) {
        if(!this.subscription || this.subscription.subscriptionMode.toLowerCase() == SubscriptionMode.TRIAL.toLowerCase()) {
            this.selectedPlan = plan;
            this.renewSub = false;
            this.totalAmount = this.getPrice(plan);

            this.setDiscountPrice();
            this.amountToPay = this.totalAmount - this.discountPrice;
            this.openModal(template);
        }else {
            this.selectedPlan = plan;
            this.changePlan();
        }
    }

    subscribe(plan) {
        this.modalRef.hide();
        this.planId = plan.planId;

        if(!this.subscription || this.subscription.subscriptionMode.toLowerCase() == SubscriptionMode.TRIAL.toLowerCase()) {
            this.generateTransactionRef();
        }else {
            this.callRave();
        }

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

    verifyPayment(txRef, autoRenew:boolean) {
        this.mService.setDisplay(true);
        this.subService.verifyPayment(new VerifyPaymentRequest(txRef, this.monthlyPlan? 'MONTHLY':'ANNUAL', autoRenew, this.orgId, this.exchangeRate, "SUBSCRIPTION"))
            .finally(() => {this.mService.setDisplay(false);})
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.fetchSubscriptionDetails();
                    }else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    changePlan() {
        this.subService.changePlan(new SubscriptionChangeRequest(this.monthlyPlan? 'MONTHLY':'ANNUAL',this.orgId, this.selectedPlan.planId))
            .subscribe(
                result => {
                    if(result.code == 0) {
                        //successfully debited card
                        this.ns.showSuccess(result.description);
                        this.fetchSubscriptionDetails();

                    } else if (result.code == -10) {
                        //no card saved for the org
                        this.cipher = result.cipher;
                        this.PUBKey = result.ravePayPublicKey;
                        this.transactionRef = result.transactionRef;

                        this.amountToPay = result.amount;

                        this.openModal(this.confirmPaymentTemplate);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => { this.ns.showError("An Error Occurred");}
            )
    }

    getRenewalDate() {
        let date = new Date(this.subscription.endDate);
        date.setDate(date.getDate() + 1);
        return date.getTime();
    }

    ngOnDestroy() {
        this.modalRef? this.modalRef.hide():'';
    }

}
