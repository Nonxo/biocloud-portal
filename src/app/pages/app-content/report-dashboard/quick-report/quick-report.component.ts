import {Component, OnInit} from '@angular/core';
import {
    AttendanceStatusRequest,
    AttendeesPOJO,
    DateColumn,
    DaysPresentRequest,
    ReportModel
} from "../../model/app-content.model";
import {ReportService} from "../../services/report.service";
import {StorageService} from "../../../../service/storage.service";
import {AppContentService} from "../../services/app-content.service";
import {PictureUtil} from "../../../../util/PictureUtil";
import {NotifyService} from "../../../../service/notify.service";
import {DataService} from "../../../../service/data.service";
import {Router} from "@angular/router";
import {MessageService} from "../../../../service/message.service";
import {DateUtil} from "../../../../util/DateUtil";
import {SearchService} from "../../../../service/search.service";
import * as FileSaver from "file-saver";
import {finalize} from "rxjs/internal/operators";

@Component({
    selector: 'app-quick-report',
    templateUrl: './quick-report.component.html',
    styleUrls: ['./quick-report.component.css']
})
export class QuickReportComponent implements OnInit {

    searchValue: string = '';
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
    attendeePOJO: AttendeesPOJO = new AttendeesPOJO();
    pageSize: number = 10;
    pageNo: number = 1;
    startRange = this.dateUtil.getFirstDayOfCurrentWeek(new Date()).getTime();
    endRange = this.dateUtil.getLastDayOfCurrentWeek(new Date()).getTime();
    currentDayMarker: number;
    weeksArray: any[] = [];
    daysPresentRequest: DaysPresentRequest = new DaysPresentRequest();
    statPeriod: string = 'THIS_WEEK';
    years: number[] = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
    months: any[] = [
        {id: 1, name: "JANUARY"},
        {id: 2, name: "FEBRUARY"},
        {id: 3, name: "MARCH"},
        {id: 4, name: "APRIL"},
        {id: 5, name: "MAY"},
        {id: 6, name: "JUNE"},
        {id: 7, name: "JULY"},
        {id: 8, name: "AUGUST"},
        {id: 9, name: "SEPTEMBER"},
        {id: 10, name: "OCTOBER"},
        {id: 11, name: "NOVEMBER"},
        {id: 12, name: "DECEMBER"}
        ];
    weeks: any[] = [];
    selectedMonth: number;
    selectedYear: number;
    selectedWeek: number;
    searchType: string;
    companyName: string;
    username: string;


    constructor(private reportService: ReportService,
                private ss: StorageService,
                private contentService: AppContentService,
                private picUtil: PictureUtil,
                private ns: NotifyService,
                private dataService: DataService,
                private router: Router,
                private mService: MessageService,
                private dateUtil: DateUtil,
                private searchService: SearchService) {
        if(this.ss.getSelectedOrg()) {
            this.reportModel.orgId = this.ss.getSelectedOrg().orgId;
            this.companyName = this.ss.getSelectedOrg().name;
        }

        this.username = this.ss.getUserName();
        this.ss.clearPrevRoute();

    }

    ngOnInit() {
        this.mService.setTitle("Quick Reports");
        this.callLocationService();
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

                            this.fetchAttendeesCount();

                    } else {
                        this.locations = [];
                    }
                },
                error => {
                    this.locations = [];
                }
            )
    }

    getDate() {
        // let startRange = 1525190429000;
        // let endRange = 1526148069000;

        let currentDateEndTime = this.dateUtil.getEndOfDay(new Date());

        let days = this.dateUtil.getDaysLeft(this.startRange, this.endRange) + 1;
        this.currentDayMarker = this.startRange;


        // let currentDayMarker = startRange;

        for (let i = 0; i < days; i++) {

            if (i < days) {
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
                                this.populateReport(result, startTime, currentDateEndTime);
                            },
                            error => {
                            }
                        )
                }

                this.currentDayMarker = endTime + 1;
            }


        }

        this.pageNo = this.pageNo + 1;

    }

    populateReport(result: any, startTime, currentDateEndTime) {
        for (let emp of this.employees) {
            if (emp.email == result.email) {
                if(startTime > currentDateEndTime) {
                    emp.attendance[result.id - 1].status = "N/A";
                } else if(this.dateUtil.getStartOfDay(new Date(emp.created)) > startTime) {
                    emp.attendance[result.id - 1].status = "N/A";
                }else {
                    emp.attendance[result.id - 1].status = result.status;
                }
                break;
            }
        }
    }

    getDaysPresent() {
        let days = this.dateUtil.getDaysLeft(this.startRange, this.endRange) + 1;
        let inActiveDays = 0;

        if(this.dateUtil.getStartOfDay(new Date()) < this.endRange) {
            inActiveDays = this.dateUtil.getDaysLeft(this.dateUtil.getStartOfDay(new Date()), this.endRange);
        }


        let weeks = Math.ceil(days / 7);
        for (let i = 0; i < weeks; i++) {
            this.weeksArray.push({id: i});
        }

        for (let i = 0; i < this.employees.length; i++) {

            for (let j = 0; j < weeks; j++) {
                this.employees[i]['weeks'] = [];
                this.employees[i].weeks.push({
                    id: j,
                    tde: 0,
                    tdl: 0,
                    tda: 0,
                    startTime: this.dateUtil.getStartOfDay(new Date(this.startRange)),
                    endTime: this.dateUtil.getEndOfDay(new Date(this.endRange))
                });

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
                            this.employees[result.id].weeks[result.weekId].tdeTrend = result.earlyTrend;
                            this.employees[result.id].weeks[result.weekId].tdl = result.daysLate;
                            this.employees[result.id].weeks[result.weekId].tdlTrend = result.lateTrend;
                            this.employees[result.id].weeks[result.weekId].tda = inActiveDays > (days - result.daysPresent)? 0: days - result.daysPresent - inActiveDays - this.getUserIneligibleDays(this.employees[result.id].created, days);
                        },
                        error => {
                        }
                    )
            }


        }

    }

    /**
     *
     * @param {number} created => date user was created
     * @param days
     */
    getUserIneligibleDays(created:number, days) {
        if(this.dateUtil.getStartOfDay(new Date(created)) > this.dateUtil.getEndOfDay(new Date(this.endRange))) {
            return days;
        }

        let eligibleDays = this.dateUtil.getDaysLeft(this.dateUtil.getStartOfDay(new Date(created)), this.dateUtil.getEndOfDay(new Date(this.endRange))) - 1;
        if(eligibleDays < days) {
            return days - eligibleDays - 1;
        }

        return 0;
    }

    fetchAttendees() {
        this.mService.setDisplay(true);
        this.contentService.fetchAttendees(this.attendeePOJO)
            .pipe(
            finalize(() => {
                this.mService.setDisplay(false);
            }))
            .subscribe(
                result => {
                    this.employees = result.attendees? result.attendees:[];

                    if(this.statPeriod == 'THIS_WEEK' || this.statPeriod == 'OTHER_WEEKS') {
                        this.getDate();
                        this.getDaysPresent();
                    }else {
                        this.getDaysPresent();
                    }

                },
                error => {
                }
            )
    }

    fetchAttendeesCount() {
        if(this.locations.length > 0) {
            this.weeksArray = [];
            this.dateColumn = [];
            this.daysPresentRequest = new DaysPresentRequest();

            this.reportModel.locId = this.reportModel.locId ? this.reportModel.locId : this.locations[0] ? this.locations[0].locId : '';

            this.attendeePOJO.locId = this.reportModel.locId;
            // this.attendeePOJO.orgId = this.reportModel.orgId;

            this.contentService.fetchAttendeesCount(this.attendeePOJO)
                .subscribe(
                    result => {
                        let res: any = result;
                        if (res.code == 0) {
                            this.totalSize = res.total;
                            this.fetchAttendees();
                        } else {
                            this.ns.showError(res.description);
                            this.totalSize = 0;
                            this.mService.setDisplay(false)
                        }
                    },
                    error => {
                        this.ns.showError("An Error Occurred");
                        this.totalSize = 0;
                        this.mService.setDisplay(false)
                    }
                )
        }
    }

    gotoOverview(email: string) {
        this.ss.setPrevRoute("/portal/quick-report");

        this.dataService.setUserObj({
            email,
            orgId: this.reportModel.orgId,
            locId: this.reportModel.locId
        });
        this.router.navigate(['/portal/overview']);
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

    pageChanged(event) {
        this.attendeePOJO.pageNo = event.page;
        this.fetchAttendeesCount();

    }

    locationChange() {
        this.resetValues();
        this.statPeriod = 'THIS_WEEK';
        this.startRange = this.dateUtil.getFirstDayOfCurrentWeek(new Date()).getTime();
        this.endRange = this.dateUtil.getLastDayOfCurrentWeek(new Date()).getTime();
        this.selectedWeek = null;
        this.selectedMonth = null;
        this.selectedYear = null;

        this.fetchAttendeesCount();

    }

    updateSize() {
        this.resetValues();
        this.attendeePOJO.pageSize = this.rowsOnPage;

        this.fetchAttendeesCount();
    }

    onTabChange(event) {

    }

    onFilterToggle() {
        switch(this.statPeriod) {
            case 'OTHER_WEEKS':
                if((this.selectedMonth && !isNaN(this.selectedMonth)) && (this.selectedYear &&!isNaN(this.selectedYear))) {
                    let weekInaMonth = this.dateUtil.weeksInAmonth(this.selectedMonth, this.selectedYear);

                    this.weeks = [];

                    for(let i = 1; i <= weekInaMonth; i++) {
                        this.weeks.push({id: i - 1, title: "WEEK " + i});
                    }
                }

                if((this.selectedMonth && !isNaN(this.selectedMonth)) &&
                    (this.selectedYear &&!isNaN(this.selectedYear)) &&
                    (this.selectedWeek && !isNaN(this.selectedWeek))) {
                    this.onWeekFilter();
                }
                break;
            case 'OTHER_MONTHS':
                if((this.selectedMonth && !isNaN(this.selectedMonth)) && (this.selectedYear &&!isNaN(this.selectedYear))) {
                    let firstDateOfTheMonth = this.dateUtil.getFirstDayOfCurrentMonth(new Date(this.selectedYear, this.selectedMonth, 0));


                    let firstDay = this.dateUtil.getFirstDayOfCurrentMonth(firstDateOfTheMonth);
                    let lastDay = this.dateUtil.getLastDayOfCurrentMonth(firstDateOfTheMonth);

                    this.startRange = firstDay.getTime();
                    this.endRange = lastDay.getTime();


                    this.fetchAttendeesCount();
                }
                break;
        }



    }

    onWeekFilter() {
        if(!isNaN(this.selectedWeek)) {
            let firstDateOfTheWeek = this.dateUtil.getFirstDayOfAweek(this.selectedYear, this.selectedMonth, this.selectedWeek);


            let firstDay = this.dateUtil.getFirstDayOfCurrentWeek(firstDateOfTheWeek);
            let lastDay = this.dateUtil.getLastDayOfCurrentWeek(firstDateOfTheWeek);

            this.startRange = firstDay.getTime();
            this.endRange = lastDay.getTime();


            this.fetchAttendeesCount();
        }

    }

    search() {
        this.resetValues();
        this.attendeePOJO.param = this.searchValue;
        this.fetchAttendeesCount();
    }

    filter() {
        this.selectedWeek = null;
        this.selectedMonth = null;
        this.selectedYear = null;

        switch(this.statPeriod) {
            case 'THIS_WEEK':
                this.startRange = this.dateUtil.getFirstDayOfCurrentWeek(new Date()).getTime();
                this.endRange = this.dateUtil.getLastDayOfCurrentWeek(new Date()).getTime();

                this.fetchAttendeesCount();
                break;

            case 'THIS_MONTH':
                this.startRange = this.dateUtil.getFirstDayOfCurrentMonth(new Date()).getTime();
                this.endRange = this.dateUtil.getLastDayOfCurrentMonth(new Date()).getTime();

                this.fetchAttendeesCount();
                break;

        }

    }

    downloadReport() {
        this.mService.setDisplay(true);
        this.reportService.downloadQuickReport(this.attendeePOJO.locId, this.dateUtil.getDateString(new Date(this.startRange)), this.dateUtil.getDateString(new Date(this.endRange)), this.username, this.companyName)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.generateReport(result.exportedData);
                    }else {
                        this.ns.showError("An Error Occurred.");
                    }
                    this.mService.setDisplay(false)
                },
                error => {
                    this.mService.setDisplay(false);
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    generateReport(data: any) {
            let blob = this.picUtil.base64toBlob(data, 'application/vnd.ms-excel');
            FileSaver.saveAs(blob, "QUICK" + "-REPORT" + ".xlsx");

        }
}

