import {Component, OnInit, TemplateRef} from '@angular/core';
import {StorageService} from "../../../../service/storage.service";
import {SubscriptionService} from "../../services/subscription.service";
import {NotifyService} from "../../../../service/notify.service";
import {MessageService} from "../../../../service/message.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {VerifyPaymentRequest} from "../../model/app-content.model";
declare function getpaidSetup(data): void;

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
          }else {
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
    this.subService.generateTransactionRef(this.orgId, this.amountToPay, this.selectedCurrency, this.planId, "ADD_CARD")
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
      payment_method: "card",
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

            this.verifyPayment(txRef, true);

        } else {
          // verify transaction status
        }
      }
    });
  }

  verifyPayment(txRef, autoRenew:boolean) {
    this.mService.setDisplay(true);
    this.subService.verifyPayment(new VerifyPaymentRequest(txRef, null, autoRenew, this.orgId, null, "ADD_CARD"))
      .finally(() => {this.mService.setDisplay(false);})
      .subscribe(
        result => {
          if(result.code == 0) {
            this.ns.showSuccess(result.description);
            this.fetchCards();
          }else {
            this.ns.showError(result.description);
          }
        },
        error => {
          this.ns.showError("An Error Occurred");
        }
      )
  }

  proceed() {
    this.modalRef.hide();
    this.generateTransactionRef();
  }
}
