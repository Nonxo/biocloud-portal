import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {Router} from "@angular/router";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {DataService} from "../../../service/data.service";
import {HistoryPojo, UpdateProfile} from "../model/app-content.model";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'app-employee-overview',
    templateUrl: './employee-overview.component.html',
    styleUrls: ['./employee-overview.component.css']
})
export class EmployeeOverviewComponent implements OnInit, OnDestroy {

    sub$: any;
    userObj: any;
    model: UpdateProfile = new UpdateProfile();
    history: HistoryPojo = new HistoryPojo();
    clockInHistorys:any;

    constructor(private mService: MessageService,
                private contentService: AppContentService,
                private router: Router,
                private ns: NotifyService,
                private dataService: DataService) {
        this.mService.setTitle("Employee Overview");
    }

    ngOnInit() {
        this.userObj = this.dataService.getUserObj();
        if(isNullOrUndefined(this.userObj)) {
            this.router.navigate(['/portal/manage-users']);
        } else {
            this.getHistoryRequestObj();

            this.fetchUserDetail();
            this.fetchClockinHistory();
        }

    }

    getHistoryRequestObj() {
        this.history.orgId = this.userObj.orgId;
        this.history.locId = this.userObj.locId;
        this.history.email = this.userObj.email;
    }

    fetchClockinHistory() {
        this.contentService.retrieveClockinHistory(this.history)
            .subscribe (
                result => {
                    let res:any = result;
                    if(res.code == 0) {
                        this.clockInHistorys = res.clockInHistory? res.clockInHistory: [];
                    }else {
                        this.clockInHistorys = []
                    }
                },
                error => {this.clockInHistorys = []}
            )
    }

    fetchUserDetail() {
        this.contentService.retrieveUser(this.userObj.email)
            .subscribe(
                result => {
                    let res:any = result;
                    if(res.code == 0) {
                        this.model = res.user;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    ngOnDestroy() {
        this.dataService.setUserObj(null);
    }

}
