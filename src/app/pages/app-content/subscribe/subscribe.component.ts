import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    SubscriptionChangeRequest,
    SubscriptionPlan,
    VerifyPaymentRequest,
    Subscription
} from "../model/app-content.model";
import {SubscriptionService} from "../services/subscription.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap";
import {MessageService} from "../../../service/message.service";
import {BillingCycle, SubscriptionMode} from "../enums/enums";
import {DomSanitizer} from "@angular/platform-browser";
import {DateUtil} from "../../../util/DateUtil";
import {getDate} from 'ngx-bootstrap/chronos/utils/date-getters';

declare function getpaidSetup(data): void;
// declare var PaystackPop: any;

interface MyWindow extends Window {
    PaystackPop: any;
}

declare var window: MyWindow;

@Component({
    selector: 'app-subscribe',
    templateUrl: './subscribe.component.html',
    styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit, OnDestroy {

    public subscribed: boolean = false;
    private dateUtil: DateUtil;
    private couponCode: string;
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
    private userPhoneNumber: string;
    public modalRef: BsModalRef;
    public renewSub: boolean = true;
    public discountRate: number;
    public discountPrice: number;
    public discountPriceFromCoupon: number = 0;
    public couponDiscount: number;
    private flatRate: boolean;
    public vat: number;
    private orgId: string;
    public subscription: Subscription;
    public proratedAmount: number;
    public paymentGateway: string;
    @ViewChild("confirmPaymentTemplate") private confirmPaymentTemplate: TemplateRef<any>;
    @ViewChild("warningTemplate") private warningTemplate: TemplateRef<any>;
    modalOptions: ModalOptions = new ModalOptions();
    public couponError: string;
    public loading: boolean;
    public currentTab: number = 0;
    public checkedPlan: string;

    constructor(private subService: SubscriptionService,
                private modalService: BsModalService,
                private ns: NotifyService,
                private ss: StorageService,
                private mService: MessageService,
                public sanitizer: DomSanitizer) {
        this.userEmail = this.ss.getLoggedInUserEmail();
        this.userPhoneNumber = (this.ss.loggedInUser.phoneCode ? this.ss.loggedInUser.phoneCode : '') + this.ss.loggedInUser.phone;
        this.orgId = this.ss.getSelectedOrg().orgId;

    }

    ngOnInit() {
        this.mService.setTitle("Subscription");
        this.fetchSubscriptionDetails();
        this.fetchAllExchangeRates();
    }

    getDaysBeforeExpiry() {
        this.dateUtil = new DateUtil();
        return this.dateUtil.getDaysLeft(new Date().getTime(), this.subscription.endDate as number);
    }

    toggleSubscriptionType(isMonthly: boolean) {
        this.monthlyPlan = isMonthly;
    }

    setPlan(plan: SubscriptionPlan){
        this.selectedPlan = plan.maxAttendeeThreshold > 0 ? plan : null;
    }

    setPlanFromDropdown(event: any) {
        this.selectedPlan = this.subscriptionPlans.find(plan => plan.planId == event.target.value);
        this.checkedPlan = this.selectedPlan.planId;

        this.confirmPayment(null, true);
    }

    getCurrentSubscriptionPlan(): SubscriptionPlan{
        return this.subscriptionPlans.find(plan => plan.planId == this.subscription.subscriptionPlanId);
    }

    setSubscriptionFromDropdown(event: any) {
        var selectedSubscription: string = event.target.value;
        this.monthlyPlan = selectedSubscription.toLowerCase().search('month') != -1;

        this.confirmPayment(null, true);
    }

    updateAutoRenewal() {
        this.subService.setAutoRenew(this.orgId, !this.subscription.autoRenew)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        //alert(this.subscription.autoRenew)
                    } else {
                        this.ns.showError("An Error Occurred");
                    }

                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    onChange() {
        this.fetchSpecificExchangeRate();
    }

    openModal(template: TemplateRef<any>) {
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalRef = this.modalService.show(template, this.modalOptions);
    }

    fetchSubscriptionDetails() {
        this.subService.fetchSubscriptionDetails(this.orgId)
            .finally(() => {
                this.fetchPlans()
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.subscription = result.subscription;
                        this.selectedCurrency = (this.subscription.currency == '---' || !this.subscription.currency) ? 'NGN' : this.subscription.currency;
                        this.fetchSpecificExchangeRate();
                        if(!this.subscription.subscriptionPlanId.toLowerCase().startsWith(SubscriptionMode.TRIAL.toLowerCase())) {
                            this.subscribed = true;
                            this.checkedPlan = this.subscription.subscriptionPlanId;
                        }

                        this.mService.setUpdateSub(this.subscription);

                        //set billing cycle flag
                        if (this.subscription && this.subscription.billingCycle) {
                            this.subscription.billingCycle.toLowerCase() == BillingCycle.MONTHLY.toLowerCase() ? this.monthlyPlan = true : this.monthlyPlan = false;
                        }
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    fetchPlans() {
        this.mService.setDisplay(true);
        this.subService.fetchPlans()
            .finally(() => {
                this.mService.setDisplay(false);
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.subscriptionPlans = result.plans ? result.plans : [];
                        this.setDefaultPlan();
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

    setDefaultPlan() {
        this.selectedPlan = this.subscriptionPlans.filter(obj => this.subscription.subscriptionPlanId == obj.planId)[0];
    }

    setDiscountRate() {
        this.discountRate = this.subscriptionPlans[0].discount;
    }

    setDiscountPrice() {
        if (this.discountRate > 0 && !this.monthlyPlan) {
            this.discountPrice = Math.round((this.discountRate / 100) * this.totalAmount);
            return;
        }

        this.discountPrice = 0;

    }

    setVat() {
        if (this.selectedPlan.vat > 0 && this.selectedCurrency == 'NGN') {
            this.vat = Math.round((this.selectedPlan.vat / 100) * this.totalAmount);
            return;
        }

        this.vat = 0;
    }

    getPrice(plan: SubscriptionPlan, display: boolean): number {
        if (plan) {
            if (this.selectedCurrency == 'NGN') {
                if (this.monthlyPlan) {
                    return Math.round(plan.pricePerMonth);
                } else {
                    let discountPrice = Math.round((this.discountRate / 100) * plan.pricePerAnnum);
                    return display ? (Math.round(plan.pricePerAnnum - discountPrice) / 12) : Math.round(plan.pricePerAnnum);
                }
            } else {
                if (this.monthlyPlan) {
                    return Math.round(plan.pricePerMonth / this.exchangeRate);
                } else {
                    let discountPrice = Math.round((this.discountRate / 100) * (plan.pricePerAnnum / this.exchangeRate));
                    return display ? (Math.round((plan.pricePerAnnum / this.exchangeRate) - discountPrice) / 12) : Math.round(plan.pricePerAnnum / this.exchangeRate);
                }
            }
        }
    }

    getCouponDiscount() {
        this.couponError = "";
        this.loading = true;

        this.subService.getCouponDiscount(this.orgId, this.monthlyPlan ? BillingCycle.MONTHLY.toUpperCase() : BillingCycle.YEARLY.toUpperCase(), this.couponCode)
            .finally(() => {
                this.loading = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.resetCouponOffer();
                        this.getCouponOffer(result);
                    } else {
                        this.couponError = result.description;
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    resetCouponOffer() {
        if (this.couponDiscount) {
            this.amountToPay += this.couponDiscount;
        }
    }

    getCouponOffer(response: any) {

        switch (response.discountType) {

            case "PERCENTAGE": {
                this.couponDiscount = Math.round((response.discount / 100) * this.totalAmount);
                this.amountToPay -= this.couponDiscount;
                break;
            }

            case "AMOUNT": {
                if (this.selectedCurrency == "NGN") {
                    this.couponDiscount = response.discount;
                    this.amountToPay -= this.couponDiscount;
                } else {
                    this.couponDiscount = Math.round(response.discount / this.exchangeRate);
                    this.amountToPay -= this.couponDiscount;
                }

                break;
            }
        }

        if (this.amountToPay < 0) {
            this.amountToPay = 1;
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
                        this.paymentGateway = result.paymentGateway;
                        if (this.paymentGateway == 'PAYSTACK') {
                            this.payWithPaystack();
                        } else {
                            this.callRave();
                        }

                    } else if (result.code == -16) {
                        this.openModal(this.warningTemplate);
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
            customer_phone: this.userPhoneNumber,
            currency: this.selectedCurrency,
            payment_method: "card",
            txref: this.transactionRef,
            meta: [{metaname: 'brcrypt', metavalue: this.cipher}],
            onclose: function () {
            },
            callback: (response) => {
                let txRef = response.tx.txRef; // collect flwRef returned and pass to a 					server page to complete status check.
                let authToken = response.tx.chargeToken.embed_token;

                // console.log("This is the response returned after a charge", response);
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

    confirmPayment(template: TemplateRef<any>, fromDropdown: boolean) {
        if(!this.checkedPlan) {return;}

        if(!this.selectedPlan) {
            this.gotoContactPage();
            return;
        }

        if(this.selectedPlan && !this.selectedPlan.maxAttendeeThreshold) {
            this.modalRef? this.modalRef.hide():'';
            return;
        }

        this.couponDiscount = 0;
        this.couponCode = "";
        this.couponError = "";

        if (!this.subscription || this.subscription.subscriptionPlanId.toLowerCase().startsWith(SubscriptionMode.TRIAL.toLowerCase())) {
            // this.selectedPlan = plan;
            // this.renewSub = false;
            this.totalAmount = this.getPrice(this.selectedPlan, false);

            this.setDiscountPrice();
            this.setVat();
            this.amountToPay = (this.totalAmount + this.vat) - this.discountPrice;


            !fromDropdown ? this.openModal(template) : '';
        } else {
            this.getProratedCost(fromDropdown);
        }
    }

    getProratedCost(fromDropdown: boolean) {
        this.mService.setDisplay(true);
        this.subService.getProratedCost(new SubscriptionChangeRequest(this.monthlyPlan ? 'MONTHLY' : 'ANNUAL', this.orgId, this.selectedPlan.planId, this.selectedCurrency, 0, 0, null, 0))
            ._finally(() => {
                this.mService.setDisplay(false)
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.totalAmount = result.amount;
                        this.proratedAmount = result.amount;
                        this.setDiscountPrice();
                        this.setVat();
                        this.amountToPay = (this.proratedAmount + this.vat) - this.discountPrice;

                        !fromDropdown ? this.openModal(this.confirmPaymentTemplate) : '';
                    } else {
                        this.modalRef ? this.modalRef.hide() : '';
                        this.ns.showError(result.description);
                    }

                },
                error => {
                    this.ns.showError("An Error Occurred")
                }
            )
    }

    applyCoupon(couponCode: string) {

        if (couponCode != this.couponCode) {
            this.couponCode = couponCode;
            this.getCouponDiscount();
            // this.setDiscountPriceFromCoupon(this.discountPriceFromCoupon, this.flatRate);
        }

    }

    subscribe(plan) {
        this.modalRef.hide();
        this.planId = plan.planId;

        if (!this.subscription || this.subscription.subscriptionPlanId.toLowerCase().startsWith(SubscriptionMode.TRIAL.toLowerCase())) {
            this.generateTransactionRef();
        } else {
            this.changePlan();
            // this.callRave();
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

    verifyPayment(txRef, autoRenew: boolean) {
        var element = document.getElementById('paystack');
        element.parentNode.removeChild(element);
        this.mService.setDisplay(true);
        this.subService.verifyPayment(new VerifyPaymentRequest(txRef, this.monthlyPlan ? 'MONTHLY' : 'ANNUAL', autoRenew, this.orgId, this.exchangeRate, "SUBSCRIPTION", this.vat, this.couponCode, this.couponDiscount))
            ._finally(() => {
                this.mService.setDisplay(false);
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.fetchSubscriptionDetails();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    changePlan() {
        this.mService.setDisplay(true);
        this.subService.changePlan(new SubscriptionChangeRequest(this.monthlyPlan ? 'MONTHLY' : 'ANNUAL', this.orgId, this.selectedPlan.planId, this.selectedCurrency, this.amountToPay, this.vat, this.couponCode, this.couponDiscount))
            .finally(() => {
                this.mService.setDisplay(false)
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        //successfully debited card
                        this.ns.showSuccess(result.description);
                        this.fetchSubscriptionDetails();

                    } else if (result.code == -10) {
                        //no card saved for the org
                        this.cipher = result.cipher;
                        this.PUBKey = result.ravePayPublicKey;
                        this.transactionRef = result.transactionRef;
                        this.paymentGateway = result.paymentGateway;

                        if (this.paymentGateway == 'PAYSTACK') {
                            this.payWithPaystack();
                        } else {
                            this.callRave();
                        }

                    } else if (result.code == -16) {
                        this.openModal(this.warningTemplate);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    getRenewalDate() {
        let date = new Date(this.subscription.endDate);
        date.setDate(date.getDate() + 1);
        return date.getTime();
    }

    gotoContactPage() {
        window.open("https://seamfix.com/contact");
    }

    ngOnDestroy() {
        this.modalRef ? this.modalRef.hide() : '';
    }

    payWithPaystack() {
        this.mService.loadScript('https://js.paystack.co/v1/inline.js', 'paystack');
        this.mService.setDisplay(true);

        setTimeout(() => {
            this.mService.setDisplay(false);
            let amount = Math.round(this.amountToPay * 100);

            const handler = window.PaystackPop.setup({
                key: this.PUBKey,
                email: this.userEmail,
                amount: amount,
                currency: this.selectedCurrency,
                channels: ['card'],
                ref: this.transactionRef, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                firstname: '',
                lastname: '',
                // label: "Optional string that replaces customer email"
                metadata: {
                    metaname: 'brcrypt', metavalue: this.cipher,
                    custom_fields: [
                        {
                            display_name: "Mobile Number",
                            variable_name: "mobile_number",
                            value: this.userPhoneNumber
                        }
                    ]
                },
                callback: (response) => {
                    if (this.renewSub) {
                        this.transactionRef != response.reference? this.verifyPayment(this.transactionRef, true): this.verifyPayment(response.reference, true);

                    } else {
                        this.verifyPayment(response.reference, false);
                    }
                }
            });
            handler.openIframe();
        }, 2000);

    }

    onTabChange(event) {
        switch (event.index) {
            case 0: {
                this.currentTab = 0;
                this.checkedPlan = "";
                this.fetchSubscriptionDetails();
                this.fetchAllExchangeRates();
                break;
            }
            case 1: {
                this.currentTab = 1;
                break;

            }
            case 2: {
                this.currentTab = 2;
                break;
            }
        }

    }
}
