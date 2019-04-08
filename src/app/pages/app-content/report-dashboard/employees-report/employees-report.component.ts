import {Component, OnInit} from '@angular/core';
import {StorageService} from "../../../../service/storage.service";
import {ReportService} from "../../services/report.service";
import {DataService} from "../../../../service/data.service";
import {Router} from "@angular/router";
import {NotifyService} from "../../../../service/notify.service";
import {MessageService} from "../../../../service/message.service";
import {AppContentService} from "../../services/app-content.service";
import {finalize} from "rxjs/internal/operators";

@Component({
    selector: 'app-employees-report',
    templateUrl: './employees-report.component.html',
    styleUrls: ['./employees-report.component.css']
})
export class EmployeesReportComponent implements OnInit {

    public userReport: any[] = [];
    public rowsOnPage: number = 1000;
    public orgId: string = "";
    public locId: string = "";
    public userEmail: string = "";
    public model: any;
    public startDateTimestamp: number = new Date().getTime();
    public endDateTimestamp: number = new Date().getTime();

    constructor(private ss: StorageService,
                private reportService: ReportService,
                private dataService: DataService,
                private router: Router,
                private ns: NotifyService,
                private mService: MessageService,
                private contentService: AppContentService) {
        this.orgId = this.ss.getSelectedOrg().orgId;
    }

    ngOnInit() {

        if (this.dataService.getUserObj()) {
            let userObj: any = this.dataService.getUserObj();

            this.userEmail = userObj.email;
            this.locId = userObj.locId ? userObj.locId : "";

            this.startDateTimestamp = this.dataService.getReportStartDate().getTime();
            this.endDateTimestamp = this.dataService.getReportEndDate().getTime();

            this.fetchUserDetail();
        } else {
            this.router.navigate(["/portal/report-dashboard"]);
        }

        this.fetchUserReport();
    }

    fetchUserReport() {
        this.mService.setDisplay(true);
        this.reportService.fetchUserDailyReport(this.orgId, this.userEmail, this.locId, this.startDateTimestamp, this.endDateTimestamp)
            .pipe(
            finalize(() => {
                this.mService.setDisplay(false);
            }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.userReport = result.results ? result.results : [];
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.")
                }
            )
    }

    fetchUserDetail() {
        this.contentService.retrieveUser(this.userEmail)
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

    goBack() {
        this.router.navigate(["/portal/report-dashboard"]);
    }

}
