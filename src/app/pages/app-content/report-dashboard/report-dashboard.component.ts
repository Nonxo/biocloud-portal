import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    AttendanceStatusRequest, AttendeesPOJO, DateColumn, DaysPresentRequest,
    ReportModel
} from "../model/app-content.model";
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
    dateColumn: DateColumn[] = [];
    employees: any[] = [];
    attendeePOJO: AttendeesPOJO;
    pageSize: number = 10;
    pageNo: number = 1;
    startRange: number = 1525190429000;
    endRange: number = 1525699118000;
    currentDayMarker: number = this.startRange;
    weeksArray: any[] = [];
    daysPresentRequest: DaysPresentRequest = new DaysPresentRequest();

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

        this.employees = [];
        this.weeksArray = [];
        this.dateColumn = [];
        this.attendeePOJO = new AttendeesPOJO();
        this.daysPresentRequest = new DaysPresentRequest();
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

            case 4: {
                this.currentTab = 4;
                this.reportModel.locId = this.reportModel.locId? this.reportModel.locId:this.locations[0]? this.locations[0].locId:'';

                this.attendeePOJO = new AttendeesPOJO();
                this.attendeePOJO.locId = this.reportModel.locId;
                this.attendeePOJO.orgId = this.reportModel.orgId;
                this.attendeePOJO.pageSize = 10;
                this.attendeePOJO.pageNo = 1;
                this.contentService.fetchAttendees(this.attendeePOJO)
                    .subscribe(
                        result => {
                            this.employees = result.attendees;
                            this.getDate();
                            this.getDaysPresent();
                        },
                        error => {debugger;}
                    )

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

    getDate() {
        // let startRange = 1525190429000;
        // let endRange = 1526148069000;

        let days = this.dateUtil.getDaysLeft(this.startRange, this.endRange) + 1;


        // let currentDayMarker = startRange;

        for(let i = 0; i < days; i++) {

            if(i < days) {
                let startTime = this.dateUtil.getStartOfDay(new Date(this.currentDayMarker));
                let endTime = this.dateUtil.getEndOfDay(new Date(this.currentDayMarker));

                this.dateColumn.push(new DateColumn(i + 1, "Day " + (i + 1), startTime, endTime));

                for (let employee of this.employees) {
                    !employee.attendance ? employee.attendance = [] : "";

                    employee.attendance.push(new DateColumn(i + 1, "Day " + (i + 1), startTime, endTime, ""));

                    //make service call to get details of employee for a particular day
                    this.reportService.fetchAttendanceStatus(new AttendanceStatusRequest(i + 1, employee.email, startTime, endTime, this.reportModel.locId, this.reportModel.orgId))
                        .subscribe(
                            result => {
                                for (let emp of this.employees) {
                                    if (emp.email == result.email) {
                                        emp.attendance[result.id - 1].status = result.status;
                                        break;
                                    }
                                }
                            },
                            error => {
                                debugger;
                            }
                        )
                }

                this.currentDayMarker = endTime + 1;
            }


        }

        this.pageNo = this.pageNo + 1;

        console.log(this.dateColumn);

    }

    getDaysPresent() {
        let days = this.dateUtil.getDaysLeft(this.startRange, this.endRange) + 1;

        let weeks = Math.ceil(days/7);
        for(let i = 0; i < weeks; i++) {
            this.weeksArray.push({id: i});
        }

        for(let i = 0; i < this.employees.length; i++) {

            for(let j = 0; j < weeks; i++) {
                this.employees[i].weeks? '':this.employees[i].weeks = [];
                this.employees[i].weeks.push({id: j, tde: 0, tdl: 0, tda: 0, startTime: this.dateUtil.getStartOfDay(new Date(this.startRange)), endTime: this.dateUtil.getEndOfDay(new Date(this.endRange))});

                this.daysPresentRequest.id = i;
                this.daysPresentRequest.weekId = j;
                this.daysPresentRequest.email = this.employees[i].email;
                this.daysPresentRequest.orgId = this.reportModel.orgId;
                this.daysPresentRequest.locId = this.reportModel.locId;
                this.daysPresentRequest.currentStartTime = this.dateUtil.getStartOfDay(new Date(this.startRange));
                this.daysPresentRequest.currentEndTime = this.dateUtil.getEndOfDay(new Date(this.endRange));
                this.daysPresentRequest.prevStartTime = this.dateUtil.getPreviousWeekTimeStamp(this.dateUtil.getStartOfDay(new Date(this.startRange)) - 1)
                this.daysPresentRequest.prevEndTime = this.dateUtil.getStartOfDay(new Date(this.startRange)) - 1;

                this.reportService.getDaysPresent(this.daysPresentRequest)
                    .subscribe(
                        result => {
                            this.employees[result.id].weeks[result.weekId].tde = result.daysEarly;
                            this.employees[result.id].weeks[result.weekId].tdl = result.daysLate;
                            this.employees[result.id].weeks[result.weekId].tda = days - result.daysPresent;
                        },
                        error => {debugger}
                    )
            }


        }
    }

    onScroll() {
        this.getDate();
    }

}
