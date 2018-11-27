import {Component, OnInit, TemplateRef} from '@angular/core';
import {StorageService} from "../../../../service/storage.service";
import {SubscriptionService} from "../../services/subscription.service";
import {NotifyService} from "../../../../service/notify.service";
import {MessageService} from "../../../../service/message.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {VerifyPaymentRequest} from "../../model/app-content.model";

declare function getpaidSetup(data): void;
declare var PaystackPop: any;

@Component({
    selector: 'app-subscription-card-details',
    templateUrl: './subscription-card-details.component.html',
    styleUrls: ['./subscription-card-details.component.css']
})
export class SubscriptionCardDetailsComponent implements OnInit {

    public orgId: string;
    public cardDetails: any[] = [];
    public modalRef: BsModalRef;
    public amountToPay: number = 50;
    public selectedCurrency: string = "NGN";
    public planId: string = "ADD_CARD";
    private transactionRef: string;
    private PUBKey: string;
    private cipher: string;
    private userEmail: string;
    public exchangeRates: any[] = [];
    public exchangeRate: number;
    public loading: boolean;
    public subscription: any;
    public prevAutoRenewStatus: boolean;
    private paymentGateway: string;

    constructor(private ss: StorageService,
                private subService: SubscriptionService,
                private ns: NotifyService,
                private modalService: BsModalService,
                private mService: MessageService) {
        this.userEmail = this.ss.getLoggedInUserEmail();
        this.orgId = this.ss.getSelectedOrg().orgId;
    }

    ngOnInit() {
        this.fetchCards();
        this.fetchAllExchangeRates();
        this.fetchSubscriptionDetails();
    }

    fetchSubscriptionDetails() {
        this.subService.fetchSubscriptionDetails(this.orgId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.subscription = result.subscription;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    fetchCards() {
        this.mService.setDisplay(true);
        this.subService.fetchCards(this.orgId)
            .finally(() => {
                this.mService.setDisplay(false);
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.cardDetails = result.cardDetails ? result.cardDetails : [];
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    deleteCard() {
        this.subService.deleteCard(this.orgId)
            .finally(() => {
                this.modalRef.hide()
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.fetchCards();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    generateTransactionRef() {
        this.loading = true;
        this.subService.generateTransactionRef(this.orgId, this.getPrice(), this.selectedCurrency, this.planId, "ADD_CARD")
            .finally(() => {
                this.loading = false;
                this.modalRef.hide();
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.cipher = result.cipher;
                        this.PUBKey = result.ravePayPublicKey;
                        this.transactionRef = result.transactionRef;
                        this.paymentGateway = result.paymentGateway;

                        if(this.paymentGateway == 'PAYSTACK') {
                            this.payWithPaystack();
                        } else {
                            this.callRave();
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

    payWithPaystack() {
        let amount = Math.round(this.getPrice() * 100);

        let handler = PaystackPop.setup({
            key: this.PUBKey,
            email: this.userEmail,
            amount: amount,
            currency: this.selectedCurrency,
            ref: this.transactionRef , // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
            firstname: '',
            lastname: '',
            // label: "Optional string that replaces customer email"
            metadata: {
                metaname: 'brcrypt', metavalue: this.cipher,
                custom_fields: [
                    {
                        display_name: "Mobile Number",
                        variable_name: "mobile_number",
                        value: "+2348012345678"
                    }
                ]
            },
            callback: (response) => {
                    this.verifyPayment(response.reference, true);
            }
        });
        handler.openIframe();
    }

    callRave() {
        getpaidSetup({
            PBFPubKey: this.PUBKey,
            customer_email: this.userEmail,
            amount: this.getPrice(),
            customer_phone: "234099940409",
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

                    this.verifyPayment(txRef, true);

                } else {
                    // verify transaction status
                }
            }
        });
    }

    verifyPayment(txRef, autoRenew: boolean) {
        this.mService.setDisplay(true);
        this.subService.verifyPayment(new VerifyPaymentRequest(txRef, null, autoRenew, this.orgId, null, "ADD_CARD",0, null, 0))
            .finally(() => {
                this.mService.setDisplay(false);
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.fetchCards();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
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

    onChange() {
        this.fetchSpecificExchangeRate();
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

    getPrice(): number {
        if (this.selectedCurrency == 'NGN') {
            return Math.ceil(this.amountToPay);
        } else {
            return Math.ceil(this.amountToPay / this.exchangeRate);
        }
    }

    updateAutoRenewal() {
        this.prevAutoRenewStatus = this.subscription.autoRenew ? false : true;
        this.subService.setAutoRenew(this.orgId, this.subscription.autoRenew ? true : false)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                    } else {
                        this.subscription.autoRenew = this.prevAutoRenewStatus;
                        this.ns.showError("An Error Occurred");
                    }

                },
                error => {
                    this.subscription.autoRenew = this.prevAutoRenewStatus;
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    proceed() {
        this.modalRef.hide();
        this.generateTransactionRef();
    }
}
