import {Component, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ReportService} from "../../services/report.service";
import {StorageService} from "../../../../service/storage.service";
import {MessageService} from "../../../../service/message.service";

@Component({
  selector: 'app-metabase-report',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class MetabaseReportComponent implements OnInit {

    orgId: string;
    token: string;
    iframeUrl: string;

  constructor(public sanitizer: DomSanitizer,
              private reportService: ReportService,
              private ss: StorageService,
              private mService: MessageService) {
      this.orgId = this.ss.getSelectedOrg().orgId;
  }

  ngOnInit() {
      this.getToken();
      this.mService.setTitle("Analytics");
  }

  getToken() {
      this.reportService.generateMetabaseToken(this.orgId)
          .subscribe(
              result => {
                  this.token = result.token;
                  this.iframeUrl = this.iframeUrl = "https://analytics.seamfix.com" + "/embed/dashboard/" + this.token + "#bordered=true&titled=true";
              },
              error => {}
          )
  }

}
