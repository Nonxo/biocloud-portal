import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportModel} from "../model/app-content.model";
import {ReportService} from "../services/report.service";
import {StorageService} from "../../../service/storage.service";
import {AppContentService} from "../services/app-content.service";
import * as FileSaver from 'file-saver';
import {PictureUtil} from "../../../util/PictureUtil";
import {NotifyService} from "../../../service/notify.service";
import {MessageService} from "../../../service/message.service";
import {DataService} from "../../../service/data.service";
import {Router} from "@angular/router";
import {DateUtil} from "../../../util/DateUtil";
import {MyDateAdapter} from "../../../util/adapters/date-adapter";
import {DateAdapter} from "@angular/material";

@Component({
    selector: 'app-report-dashboard',
    templateUrl: './report-dashboard.component.html',
    styleUrls: ['./report-dashboard.component.css'],
    providers: [
        {provide: DateAdapter, useClass: MyDateAdapter},
    ]
})
export class ReportDashboardComponent implements OnInit, OnDestroy {

    reportModel: ReportModel = new ReportModel();
    rowsOnPage: number = 10;
    data: any[] = [];
    totalSize: number;
    currentPage: number;
    maxSize: number = 5;
    currentTab: number = 0;
    locations: any[] = [];
    reportDate: number = new Date().getTime();
    dateObj: Date = new Date();
    userRole = this.ss.getSelectedOrgRole();
    selectedStartDate: Date = new Date();
    selectedEndDate: Date = new Date();
    absentDate: Date = new Date();
    reportPeriod: string = "DATE_RANGE";

    constructor(private reportService: ReportService,
                private ss: StorageService,
                private contentService: AppContentService,
                private picUtil: PictureUtil,
                private ns: NotifyService,
                private dataService: DataService,
                private router: Router,
                private mService: MessageService,
                private dateUtil: DateUtil) {
        this.reportModel.reportType = "early";
        this.reportModel.pageSize = this.rowsOnPage;
        this.reportModel.user = this.ss.getUserName();
        this.reportModel.orgId = this.ss.getSelectedOrg().orgId;

        if (this.dataService.getLocId()) {
            this.reportModel.locId = this.dataService.getLocId();
        } else {
            this.reportModel.locId = "";
        }

    }

    ngOnInit() {
        this.mService.setTitle("Reports");

        if(this.dataService.getReportStartDate() && this.dataService.getReportEndDate()) {
            this.selectedStartDate = this.dataService.getReportStartDate();
            this.selectedEndDate = this.dataService.getReportEndDate();
        }

        this.fetchDailyReport();
        this.callLocationService();
    }

    fetchDailyReport() {
        this.reportModel.startDate = this.selectedStartDate.getTime();
        this.reportModel.endDate = this.selectedEndDate.getTime();

        //if report type is absent report
        if(this.currentTab == 2) {
            this.reportModel.startDate = this.absentDate.getTime();
            this.reportModel.endDate = this.absentDate.getTime();
        }

        this.mService.setDisplay(true);
        this.reportService.fetchDailyReport(this.reportModel)
            .finally(() => {
                this.reportModel.export = false;
                this.mService.setDisplay(false);
            })
            .subscribe(
                result => {
                    if (result.code == 0) {

                        if (this.reportModel.export) {
                            this.generateReport(result.exportedData);
                        } else {
                            this.data = result.results ? result.results : [];
                            this.totalSize = result.total;
                            this.reportDate = new Date().getTime();
                        }

                    } else {
                        this.data = [];
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.data = [];
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    isFormValid() {

        if(this.selectedEndDate.getTime() < this.selectedStartDate.getTime()) {
            return false;
        }

        if(this.selectedStartDate.getTime() > this.dateUtil.getStartOfDay(new Date())) {

        }
    }

    generateReport(data: any) {

        if (this.reportModel.exportFormat == 'pdf') {
            let blob = this.picUtil.base64toBlob(data, 'application/pdf');
            FileSaver.saveAs(blob, this.reportModel.reportType.toUpperCase() + "-REPORT" + ".pdf");
        } else {
            let blob = this.picUtil.base64toBlob(data, 'application/vnd.ms-excel');
            FileSaver.saveAs(blob, this.reportModel.reportType.toUpperCase() + "-REPORT" + ".xlsx");
        }
    }

    pageChanged(event) {
        this.reportModel.pageNo = event.page;
        this.fetchDailyReport();
    }

    locationChange() {
        this.resetValues();
        this.fetchDailyReport();
    }

    resetValues() {
        this.data = [];
        this.currentPage = 1;
        this.reportModel.pageNo = 1;
    }

    /**
     * This method is trigged when tabs change
     * @param event
     */
    onTabChange(event) {
        this.resetValues();

        switch (event.index) {
            case 0: {
                this.reportModel.reportType = "early";
                this.currentTab = 0;
                break;
            }
            case 1: {
                this.reportModel.reportType = "late";
                this.currentTab = 1;
                break;
            }
            case 2: {
                this.reportModel.reportType = "absent";
                this.currentTab = 2;
                break;
            }
            case 3: {
                this.reportModel.reportType = "wrong_location";
                this.currentTab = 3;
                break;
            }
        }

        this.fetchDailyReport();
    }

    callLocationService() {
        this.contentService.fetchOrgUsersLocation()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.locations ? result.locations : [];

                        if (this.userRole == 'LOCATION_ADMIN') {
                            if (this.locations.length > 0) {
                                //if user is a location admin select the first location by default
                                this.reportModel.locId = this.locations[0].locId;
                            }
                        }

                    } else {
                        this.locations = [];
                    }
                },
                error => {
                    this.locations = [];
                }
            )
    }

    updateSize() {
        this.reportModel.pageSize = this.rowsOnPage;
        this.resetValues();
        this.fetchDailyReport();
    }

    downloadPdf() {
        this.reportModel.exportFormat = "pdf";
        this.reportModel.title = this.capitalizeFirstLetter(this.reportModel.reportType) + " Report";
        this.reportModel.export = true;
        this.fetchDailyReport();
    }

    downloadExcel() {
        this.reportModel.exportFormat = "sheet";
        this.reportModel.title = this.capitalizeFirstLetter(this.reportModel.reportType) + " Report";
        this.reportModel.export = true;
        this.fetchDailyReport();
    }

    viewDetails(user: any) {
        let obj = {};

        obj['email'] = user.email;
        obj['locId'] = this.reportModel.locId;

        this.dataService.setReportStartDate(this.selectedStartDate);
        this.dataService.setReportEndDate(this.selectedEndDate);

        this.dataService.setUserObj(obj);
        this.router.navigate(["/portal/report-dashboard/employee"]);
    }

    onDatePickerToggle() {

        if((this.selectedStartDate.getTime() > this.selectedEndDate.getTime()) && this.reportModel.reportType != "ABSENT") {
            this.ns.showError("End date should be greater than Start date.");
            return;
        }

        this.fetchDailyReport();
    }

    filterReport() {
        this.selectedStartDate = new Date();
        this.selectedEndDate = new Date();

        switch(this.reportPeriod) {
            case "DATE_RANGE": {
                break;
            }
            case "WEEKLY": {
                this.selectedStartDate = this.dateUtil.getFirstDayOfCurrentWeek(new Date());
                this.selectedEndDate = this.dateUtil.getLastDayOfCurrentWeek(new Date());

                this.fetchDailyReport();
                break;
            }
            case "MONTHLY": {
                this.selectedStartDate = this.dateUtil.getFirstDayOfCurrentMonth(new Date());
                this.selectedEndDate = this.dateUtil.getLastDayOfCurrentMonth(new Date());

                this.fetchDailyReport();
                break;
            }
        }
    }

    capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Events that should happen when this component is destroyed
     */
    ngOnDestroy() {
        this.dataService.setLocId(null);
    }

}
