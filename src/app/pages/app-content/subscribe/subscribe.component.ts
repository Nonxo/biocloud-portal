import { Component, OnInit } from '@angular/core';
import {SubscriptionPlan} from "../model/app-content.model";
import {SubscriptionService} from "../services/subscription.service";
import {NotifyService} from "../../../service/notify.service";

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  public subscriptionPlans: SubscriptionPlan[] = [
      {name: "BASIC", pricePerMonth: 30000, maxAttendeeThreshold: 900, description: null, pricePerAnnum: 90000, priceperDay: 400, enabled:true},
      {name: "PREMIUM", pricePerMonth: 50000, maxAttendeeThreshold: 900, description: null, pricePerAnnum: 90000, priceperDay: 400, enabled:true}
      ];
  public monthlyPlan:boolean = true;
  public selectedCurrency:string = 'NGN';
  public exchangeRate:number = 360;

  constructor(private subService: SubscriptionService, private ns: NotifyService) { }

  ngOnInit() {
      this.fetchPlans();
  }

  fetchPlans() {
    this.subService.fetchPlans()
        .subscribe(
            result => {
                if(result.code == 0) {
                    this.subscriptionPlans = result.plans? result.plans: [];
                }else {
                    this.ns.showError(result.description);
                }
            },
            error => {this.ns.showError("An Error Occurred")}
        )
  }

  getPrice(plan:SubscriptionPlan) {
      if(this.selectedCurrency == 'NGN') {
          if(this.monthlyPlan) {
              return plan.pricePerMonth;
          } else {
              return plan.pricePerAnnum;
          }
      }else {
          if(this.monthlyPlan) {
              return plan.pricePerMonth/this.exchangeRate;
          } else {
              return plan.pricePerAnnum/this.exchangeRate;
          }
      }
  }

}
