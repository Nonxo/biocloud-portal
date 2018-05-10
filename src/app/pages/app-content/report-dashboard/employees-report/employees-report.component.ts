import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../../../service/storage.service";
import {ReportService} from "../../services/report.service";
import {DataService} from "../../../../service/data.service";
import {Router} from "@angular/router";
import {NotifyService} from "../../../../service/notify.service";
import {MessageService} from "../../../../service/message.service";

@Component({
  selector: 'app-employees-report',
  templateUrl: './employees-report.component.html',
  styleUrls: ['./employees-report.component.css']
})
export class EmployeesReportComponent implements OnInit {

  public userReport: any[] = [];
  public rowsOnPage: number = 1000;
  public orgId:string = "";
  public locId:string = "";
  public userEmail:string = "";

  constructor(private ss: StorageService,
              private reportService: ReportService,
              private dataService: DataService,
              private router: Router,
              private ns: NotifyService,
              private mService: MessageService) {
    this.orgId = this.ss.getSelectedOrg().orgId;
  }

  ngOnInit() {

    // if(this.dataService.getUserObj()) {
    //   let userObj: any = this.dataService.getUserObj();

    //   this.userEmail = userObj.email;
    //   this.locId = userObj.locId? userObj.locId: "";
    // } else { this.router.navigate(["/portal/report-dashboard"]); }

    // this.fetchUserReport();
  }

  fetchUserReport() {
    this.mService.setDisplay(true);
    this.reportService.fetchUserDailyReport(this.orgId, this.userEmail, this.locId)
      .finally(() => {this.mService.setDisplay(false);})
      .subscribe(
        result => {
          if(result.code == 0) {
            this.userReport = result.results? result.results: [];
          } else {
            this.ns.showError(result.description);
          }
        },
        error => {this.ns.showError("An Error Occurred.")}
      )
  }

}
