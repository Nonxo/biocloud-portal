import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ReportService} from "../../services/report.service";
import {StorageService} from "../../../../service/storage.service";
import {MessageService} from "../../../../service/message.service";
import {DateUtil} from "../../../../util/DateUtil";
import {NotifyService} from "../../../../service/notify.service";
import {finalize} from "rxjs/internal/operators";

@Component({
  selector: 'app-metabase-report',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class MetabaseReportComponent implements OnInit {

    orgId: string;
    token: string;
    iframeUrl: string;
    dateObj: Date = new Date();
    selectedStartDate: Date = new Date();
    selectedEndDate: Date = new Date();
    startdate: string;
    enddate: string;
    reportPeriod: string = "TODAY";

  constructor(public sanitizer: DomSanitizer,
              private reportService: ReportService,
              private ss: StorageService,
              private mService: MessageService,
              private dateUtil: DateUtil,
              private ns: NotifyService) {
      this.orgId = this.ss.getSelectedOrg().orgId;
  }

  ngOnInit() {
      this.startdate = this.dateUtil.getDateString(this.selectedStartDate);
      this.enddate = this.dateUtil.getDateString(this.selectedEndDate);
      this.getToken();
      this.mService.setTitle("Analytics");
  }

  getToken() {
      this.mService.setDisplay(true);
      this.reportService.generateMetabaseToken(this.orgId, this.startdate, this.enddate)
          .pipe(
          finalize(() => {this.mService.setDisplay(false)}))
          .subscribe(
              result => {
                  this.token = result.token;
                  this.iframeUrl = this.iframeUrl = result.url + "/embed/dashboard/" + this.token + "#bordered=true&titled=true";
              },
              error => {}
          )
  }

    onDatePickerToggle() {

      if(this.selectedEndDate.getTime() < this.selectedStartDate.getTime()) {
          this.ns.showError("End date must be less than start date");
          return;
      }

        this.startdate = this.dateUtil.getDateString(this.selectedStartDate);
        this.enddate = this.dateUtil.getDateString(this.selectedEndDate);

        this.iframeUrl = "";
        this.getToken();
    }

    filterReport() {
        this.selectedStartDate = new Date();
        this.selectedEndDate = new Date();

        switch(this.reportPeriod) {
            case "DATE_RANGE": {
                break;
            }
            case "THIS_WEEK": {
                this.selectedStartDate = this.dateUtil.getFirstDayOfCurrentWeek(new Date());
                this.selectedEndDate = new Date();

                break;
            }
            case "THIS_MONTH": {
                this.selectedStartDate = this.dateUtil.getFirstDayOfCurrentMonth(new Date());
                this.selectedEndDate = new Date();

                break;
            }
        }

        if(this.reportPeriod != 'DATE_RANGE') {
            this.startdate = this.dateUtil.getDateString(this.selectedStartDate);
            this.enddate = this.dateUtil.getDateString(this.selectedEndDate);

            this.iframeUrl = "";
            this.getToken();
        }


    }

}
