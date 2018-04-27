import {Component, OnInit} from '@angular/core';
import {StorageService} from "../../../../service/storage.service";
import {SubscriptionService} from "../../services/subscription.service";
import {NotifyService} from "../../../../service/notify.service";
import {MessageService} from "../../../../service/message.service";

@Component({
    selector: 'app-subscription-card-details',
    templateUrl: './subscription-card-details.component.html',
    styleUrls: ['./subscription-card-details.component.css']
})
export class SubscriptionCardDetailsComponent implements OnInit {

    public orgId: string;
    public cardDetails:any[] = [];

    constructor(private ss: StorageService,
                private subService: SubscriptionService,
                private ns: NotifyService,
                private mService: MessageService) {
        this.orgId = this.ss.getSelectedOrg().orgId;
    }

    ngOnInit() {
        this.fetchCards();
    }

    fetchCards() {
        this.mService.setDisplay(true);
        this.subService.fetchCards(this.orgId)
            .finally(() => {this.mService.setDisplay(false);})
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.cardDetails = result.cardDetails? result.cardDetails:[];
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    deleteCard() {
        this.subService.deleteCard(this.orgId)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.ns.showSuccess(result.description);
                    };
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }


}
