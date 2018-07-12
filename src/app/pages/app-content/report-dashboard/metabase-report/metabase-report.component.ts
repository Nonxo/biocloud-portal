import {Component, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ReportService} from "../../services/report.service";
import {StorageService} from "../../../../service/storage.service";

@Component({
  selector: 'app-metabase-report',
  templateUrl: './metabase-report.component.html',
  styleUrls: ['./metabase-report.component.css']
})
export class MetabaseReportComponent implements OnInit, OnChanges {

    orgId: string;
    token: string;
    iframeUrl: string;

  constructor(public sanitizer: DomSanitizer,
              private reportService: ReportService,
              private ss: StorageService) {
      this.orgId = this.ss.getSelectedOrg().orgId;
  }

  ngOnInit() {
      this.getToken();
  }

  ngOnChanges() {
      debugger;
  }

  getToken() {
      this.reportService.generateMetabaseToken(this.orgId)
          .subscribe(
              result => {
                  this.token = result.token;
                  this.iframeUrl = this.iframeUrl = "http://reports.seamfix.com:3000" + "/embed/dashboard/" + this.token + "#bordered=true&titled=true";
              },
              error => {}
          )
  }

}
