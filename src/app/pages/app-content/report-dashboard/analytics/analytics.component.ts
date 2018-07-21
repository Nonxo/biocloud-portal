import {Component, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ReportService} from "../../services/report.service";
import {StorageService} from "../../../../service/storage.service";
import {MessageService} from "../../../../service/message.service";
import {DateUtil} from "../../../../util/DateUtil";

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
    selectedStartDate: Date = this.dateUtil.getFirstDayOfCurrentMonth(new Date());
    selectedEndDate: Date = new Date();
    startdate: string;
    enddate: string;
    reportPeriod: string = "THIS_MONTH";

  constructor(public sanitizer: DomSanitizer,
              private reportService: ReportService,
              private ss: StorageService,
              private mService: MessageService,
              private dateUtil: DateUtil) {
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
          .finally(() => {this.mService.setDisplay(false)})
          .subscribe(
              result => {
                  this.token = result.token;
                  this.iframeUrl = this.iframeUrl = result.url + "/embed/dashboard/" + this.token + "#bordered=true&titled=true";
              },
              error => {}
          )
  }

    onDatePickerToggle() {
        this.startdate = this.dateUtil.getDateString(this.selectedStartDate);
        this.enddate = this.dateUtil.getDateString(this.selectedEndDate);

        this.iframeUrl = "";
        this.getToken();
    }

    filterReport() {
      if(this.reportPeriod == 'THIS_MONTH') {
          this.selectedStartDate = this.dateUtil.getFirstDayOfCurrentMonth(new Date());
          this.selectedEndDate = new Date();

          this.iframeUrl = "";
          this.getToken();
      }
    }

}
