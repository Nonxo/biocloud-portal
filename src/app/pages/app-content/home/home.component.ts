import { Component, OnInit} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  locationsSubscription:any;
  orgId:string;
  locations:any = [];

  constructor(private mService: MessageService, private ns: NotifyService, private contentService: AppContentService) {
  }

  ngOnInit() {

    this.locationsSubscription = this.mService.getSelectedOrg()
        .subscribe(
            result => {
              this.orgId = result;
              this.callLocationService();
            }
        )

  }

  callLocationService() {
    this.contentService.fetchOrgLocations(this.orgId)
        .subscribe(
            result => {
              if(result.code == 0) {
                this.locations = result.locations;
              }else {
                this.ns.showError(result.description);
              }
            },
            error => {this.ns.showError("An Error Occurred");}
        )
  }

}
