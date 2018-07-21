import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../../service/storage.service";
import {SubscriptionService} from "../services/subscription.service";
import {NotifyService} from "../../../service/notify.service";
import {Router} from "@angular/router";
import {DataService} from "../../../service/data.service";

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.css']
})
export class SubscriptionHistoryComponent implements OnInit {

  public orgId:string;
  public subscription:any;
  public histories:any[] = [];
  public totalItems:number;
  public rowsOnPage:number = 10;
  public currentPage:number = 1;
  public maxSize:number;

  constructor(private ss: StorageService,
              private subService: SubscriptionService,
              private ns: NotifyService,
              private router: Router,
              private ds: DataService) {
    this.orgId = this.ss.getSelectedOrg().orgId;
  }

  ngOnInit() {
    this.fetchSubscriptionDetails();
    this.fetchSubscriptionHistory();
  }

  fetchSubscriptionDetails() {
    this.subService.fetchSubscriptionDetails(this.orgId)
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

    fetchSubscriptionHistory() {
        this.subService.fetchSubscriptionHistory(this.orgId, this.rowsOnPage, this.currentPage)
            .subscribe(
                result => {
                  if(result.code == 0) {
                    this.histories = result.data? result.data:[];
                    this.totalItems = result.count;
                  } else {
                    this.ns.showError(result.description);
                  }
                },
                error => {this.ns.showError("An Error Occurred");}
            )
    }

    pageChanged(event) {
      this.currentPage = event.page;
        this.fetchSubscriptionHistory();
    }

    resetValues() {
      this.currentPage = 1;
    }

    updateSize() {
        this.resetValues();
        this.fetchSubscriptionHistory();
    }

    viewReceipt(history) {
      this.ds.setSubHistory(history);
      this.router.navigate(["/receipt"]);
    }

    viewCardDetails() {
        this.router.navigate(["/portal/card-details"]);
    }

    goBack() {
        this.router.navigate(["/portal/subscribe"]);
    }

}
