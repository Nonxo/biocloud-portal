import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {Router} from "@angular/router";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {DataService} from "../../../service/data.service";
import {DaysPresentRequest, HistoryPojo, UpdateProfile} from "../model/app-content.model";
import {isNullOrUndefined} from "util";
import {ReportService} from "../services/report.service";
import {DateUtil} from "../../../util/DateUtil";
import {StorageService} from "../../../service/storage.service";

@Component({
    selector: 'app-employee-overview',
    templateUrl: './employee-overview.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./employee-overview.component.css']
})
export class EmployeeOverviewComponent implements OnInit, OnDestroy {

    sub$: any;
    userObj: any;
    model: UpdateProfile = new UpdateProfile();
    history: HistoryPojo = new HistoryPojo();
    clockInHistorys: any = [];
    punctualityScore: number = 0;
    active: string = "poor";
    locations: any[] = [];
    daysPresentRequest: DaysPresentRequest = new DaysPresentRequest();
    totalDaysPresent: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    totalDaysEarly: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    totalDaysLate: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    totalDaysAbsent: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    avgClockIn: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    avgClockOut: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    punctuality: any[] = [{title: "This week"}, {title: "This Month"}, {title: "This year"}];
    selectedRangeForDaysPresent: any;
    selectedRangeForDaysEarly: any;
    selectedRangeForDaysLate: any;
    selectedRangeForDaysAbsent: any;
    selectedRangeForClockInTime: any;
    selectedRangeForClockOutTime: any;
    selectedRangeForPunc: any;
    startRange: number = 1525190429000;
    endRange: number = 1531245317000;

    constructor(private mService: MessageService,
                private contentService: AppContentService,
                private router: Router,
                private ns: NotifyService,
                private dataService: DataService,
                private reportService: ReportService,
                private dateUtil: DateUtil,
                private ss: StorageService) {
        this.mService.setTitle("Employee Overview");
    }

    ngOnInit() {
        this.userObj = this.dataService.getUserObj();
        if (isNullOrUndefined(this.userObj)) {

            if(this.ss.getPrevRoute()) {
                this.router.navigate([this.ss.getPrevRoute()]);
            }else {
                this.router.navigate(['/portal/manage-users']);
            }

        } else {
            this.getHistoryRequestObj();

            this.fetchUserDetail();
            this.fetchClockinHistory();
            // this.fetchPuncScore();
            this.fetchDaysPresent();
            // this.getAverageTime();
        }

    }

    getHistoryRequestObj() {
        this.history.orgId = this.userObj.orgId;
        this.history.locId = this.userObj.locId;
        this.history.email = this.userObj.email;
    }

    fetchClockinHistory() {
        this.contentService.retrieveClockinHistory(this.history)
            .subscribe(
                result => {
                    let res: any = result;
                    if (res.code == 0) {
                        this.clockInHistorys = res.clockInHistory ? res.clockInHistory : [];
                    } else {
                        this.clockInHistorys = []
                    }
                },
                error => {
                    this.clockInHistorys = []
                }
            )
    }

    fetchUserDetail() {
        this.contentService.retrieveUser(this.userObj.email)
            .subscribe(
                result => {
                    let res: any = result;
                    if (res.code == 0) {
                        this.model = res.user;
                        this.getUsersLocation();
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    // fetchPuncScore() {
    //     this.contentService.fetchPuncScore(this.history)
    //         .subscribe(
    //             result => {
    //                 if (result.code == 0) {
    //                     this.punctualityScore = result.punctualityScore;
    //
    //                     this.calculatePuncScore();
    //                 }
    //             },
    //             error => {
    //             }
    //         )
    // }

    calculatePuncScore() {
        if (this.punctualityScore < 26) {
            this.active = "poor";
        } else if (this.punctualityScore < 75) {
            this.active = "average";
        } else if (this.punctualityScore <= 100) {
            this.active = "excellent";
        }
    }

    getUsersLocation() {
        this.contentService.fetchAttendeesLocation(this.model.userId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.locations = result.data;
                    }
                },
                error => {
                }
            )
    }

    fetchDaysPresent() {
        this.fetchWeeklyStat();
        // this.fetchMonthlyStat();

        //fetch current month

        //fetch current year
    }

    getAverageTime(daysPresentRequest) {
        this.daysPresentRequest.email = this.userObj.email;
        this.daysPresentRequest.orgId = this.userObj.orgId;
        this.daysPresentRequest.locId = this.userObj.locId;
        this.daysPresentRequest.currentStartTime = this.dateUtil.getStartOfDay(new Date(this.startRange));
        this.daysPresentRequest.currentEndTime = this.dateUtil.getEndOfDay(new Date(this.endRange));
        this.daysPresentRequest.prevStartTime = this.dateUtil.getPreviousWeekTimeStamp(this.dateUtil.getStartOfDay(new Date(this.startRange)) - 1)
        this.daysPresentRequest.prevEndTime = this.dateUtil.getStartOfDay(new Date(this.startRange)) - 1;


        this.reportService.getAvgTime(this.daysPresentRequest)
            .subscribe(
                result => {

                },
                error => {
                }
            )
    }

    fetchWeeklyStat() {
        let startRange = this.dateUtil.getFirstDayOfCurrentWeek(new Date()).getTime();
        let endRange = this.dateUtil.getLastDayOfCurrentWeek(new Date()).getTime();

        let days = this.dateUtil.getDaysLeft(startRange, endRange) + 1;
        let inActiveDays = 0;
        if(this.dateUtil.getStartOfDay(new Date()) < endRange) {
            inActiveDays = this.dateUtil.getDaysLeft(this.dateUtil.getStartOfDay(new Date()), endRange);
        }

        //fetch current week
        this.daysPresentRequest.email = this.userObj.email;
        this.daysPresentRequest.orgId = this.userObj.orgId;
        this.daysPresentRequest.locId = this.userObj.locId;
        this.daysPresentRequest.currentStartTime = this.dateUtil.getStartOfDay(new Date(startRange));
        this.daysPresentRequest.currentEndTime = this.dateUtil.getEndOfDay(new Date(endRange));
        this.daysPresentRequest.prevStartTime = this.dateUtil.getPreviousWeekTimeStamp(this.dateUtil.getStartOfDay(new Date(startRange)) - 1)
        this.daysPresentRequest.prevEndTime = this.dateUtil.getStartOfDay(new Date(startRange)) - 1;
        this.reportService.getDaysPresent(this.daysPresentRequest)
            .subscribe(
                result => {
                    this.totalDaysPresent[0].daysPresent = result.daysPresent;
                    // this.totalDaysPresent[0].daysPresent = result.daysPresent;
                    this.totalDaysEarly[0].daysEarly = result.daysEarly;
                    this.totalDaysEarly[0].trend = result.earlyTrend;
                    this.totalDaysLate[0].daysLate = result.daysLate;
                    this.totalDaysLate[0].trend = result.lateTrend;
                    this.totalDaysAbsent[0].daysAbsent = inActiveDays > (days - result.daysPresent)? 0: days - result.daysPresent - inActiveDays;

                    this.selectedRangeForDaysPresent = this.totalDaysPresent[0];
                    this.selectedRangeForDaysEarly = this.totalDaysEarly[0];
                    this.selectedRangeForDaysLate = this.totalDaysLate[0];
                    this.selectedRangeForDaysAbsent = this.totalDaysAbsent[0];

                    this.fetchMonthlyStat();
                },
                error => {
                }
            )

        this.reportService.getAvgTime(this.daysPresentRequest)
            .subscribe(
                result => {
                    this.avgClockIn[0].time = result.avgClockInTime;
                    this.avgClockOut[0].time = result.avgClockOutTime;

                    this.selectedRangeForClockInTime = this.avgClockIn[0];
                    this.selectedRangeForClockOutTime = this.avgClockOut[0];
                },
                error => {
                }
            )

        this.contentService.fetchPuncScore(this.history, this.dateUtil.getStartOfDay(new Date(startRange)), this.dateUtil.getEndOfDay(new Date(endRange)))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.punctuality[0].punctualityScore = result.punctualityScore

                        this.selectedRangeForPunc = this.punctuality[0];
                        this.punctualityScore = this.punctuality[0].punctualityScore;
                        this.calculatePuncScore();
                    }
                },
                error => {
                }
            )
    }

    fetchMonthlyStat() {
        let startRange = this.dateUtil.getFirstDayOfCurrentMonth(new Date()).getTime();
        let endRange = this.dateUtil.getLastDayOfCurrentMonth(new Date()).getTime();

        let days = this.dateUtil.getDaysLeft(startRange, endRange) + 1;
        let inActiveDays = 0;
        if(this.dateUtil.getStartOfDay(new Date()) < endRange) {
            inActiveDays = this.dateUtil.getDaysLeft(this.dateUtil.getStartOfDay(new Date()), endRange);
        }

        //fetch current week
        this.daysPresentRequest.email = this.userObj.email;
        this.daysPresentRequest.orgId = this.userObj.orgId;
        this.daysPresentRequest.locId = this.userObj.locId;
        this.daysPresentRequest.currentStartTime = this.dateUtil.getStartOfDay(new Date(startRange));
        this.daysPresentRequest.currentEndTime = this.dateUtil.getEndOfDay(new Date(endRange));
        this.daysPresentRequest.prevStartTime = this.dateUtil.getPreviousMonthTimeStamp(this.dateUtil.getStartOfDay(new Date(startRange)) - 1)
        this.daysPresentRequest.prevEndTime = this.dateUtil.getStartOfDay(new Date(startRange)) - 1;
        this.reportService.getDaysPresent(this.daysPresentRequest)
            .subscribe(
                result => {
                    this.totalDaysPresent[1].daysPresent = result.daysPresent;
                    // this.totalDaysPresent[0].daysPresent = result.daysPresent;
                    this.totalDaysEarly[1].daysEarly = result.daysEarly;
                    this.totalDaysEarly[1].trend = result.earlyTrend;
                    this.totalDaysLate[1].daysLate = result.daysLate;
                    this.totalDaysLate[1].trend = result.lateTrend;
                    this.totalDaysAbsent[1].daysAbsent = inActiveDays > (days - result.daysPresent)? 0: days - result.daysPresent - inActiveDays;

                    // this.selectedRangeForDaysPresent = this.totalDaysPresent[1];
                    // this.selectedRangeForDaysEarly = this.totalDaysEarly[1];
                    // this.selectedRangeForDaysLate = this.totalDaysLate[1];

                    this.fetchYearlyStat();
                },
                error => {
                }
            )

        this.reportService.getAvgTime(this.daysPresentRequest)
            .subscribe(
                result => {
                    this.avgClockIn[1].time = result.avgClockInTime;
                    this.avgClockOut[1].time = result.avgClockOutTime;

                },
                error => {
                }
            )

        this.contentService.fetchPuncScore(this.history, this.dateUtil.getStartOfDay(new Date(startRange)), this.dateUtil.getEndOfDay(new Date(endRange)))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.punctuality[1].punctualityScore = result.punctualityScore

                    }
                },
                error => {
                }
            )
    }

    fetchYearlyStat() {
        let startRange = this.dateUtil.getFirstDayOfCurrentYear(new Date()).getTime();
        let endRange = this.dateUtil.getLastDayOfCurrentYear(new Date()).getTime();

        let days = this.dateUtil.getDaysLeft(startRange, endRange) + 1;
        let inActiveDays = 0;
        if(this.dateUtil.getStartOfDay(new Date()) < endRange) {
            inActiveDays = this.dateUtil.getDaysLeft(this.dateUtil.getStartOfDay(new Date()), endRange);
        }

        //fetch current week
        this.daysPresentRequest.email = this.userObj.email;
        this.daysPresentRequest.orgId = this.userObj.orgId;
        this.daysPresentRequest.locId = this.userObj.locId;
        this.daysPresentRequest.currentStartTime = this.dateUtil.getStartOfDay(new Date(startRange));
        this.daysPresentRequest.currentEndTime = this.dateUtil.getEndOfDay(new Date(endRange));
        this.daysPresentRequest.prevStartTime = this.dateUtil.getPreviousYearTimeStamp(this.dateUtil.getStartOfDay(new Date(startRange)) - 1)
        this.daysPresentRequest.prevEndTime = this.dateUtil.getStartOfDay(new Date(startRange)) - 1;
        this.reportService.getDaysPresent(this.daysPresentRequest)
            .subscribe(
                result => {
                    this.totalDaysPresent[2].daysPresent = result.daysPresent;
                    // this.totalDaysPresent[0].daysPresent = result.daysPresent;
                    this.totalDaysEarly[2].daysEarly = result.daysEarly;
                    this.totalDaysEarly[2].trend = result.earlyTrend;
                    this.totalDaysLate[2].daysLate = result.daysLate;
                    this.totalDaysLate[2].trend = result.lateTrend;
                    this.totalDaysAbsent[2].daysAbsent = inActiveDays > (days - result.daysPresent)? 0: days - result.daysPresent - inActiveDays;

                    // this.selectedRangeForDaysPresent = this.totalDaysPresent[1];
                    // this.selectedRangeForDaysEarly = this.totalDaysEarly[1];
                    // this.selectedRangeForDaysLate = this.totalDaysLate[1];
                },
                error => {
                }
            )

        this.reportService.getAvgTime(this.daysPresentRequest)
            .subscribe(
                result => {
                    this.avgClockIn[2].time = result.avgClockInTime;
                    this.avgClockOut[2].time = result.avgClockOutTime;

                },
                error => {
                }
            )

        this.contentService.fetchPuncScore(this.history, this.dateUtil.getStartOfDay(new Date(startRange)), this.dateUtil.getEndOfDay(new Date(endRange)))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.punctuality[2].punctualityScore = result.punctualityScore;
                    }
                },
                error => {
                }
            )
    }

    filterDaysPresent(type?: string) {
        if (type == "week") {
            this.selectedRangeForDaysPresent = this.totalDaysPresent[0];
        } else if (type == "month") {
            this.selectedRangeForDaysPresent = this.totalDaysPresent[1];
        }else if (type == "year") {
            this.selectedRangeForDaysPresent = this.totalDaysPresent[2];
        }
    }

    filterDaysEarly(type?: string) {
        if (type == "week") {
            this.selectedRangeForDaysEarly = this.totalDaysEarly[0];
        } else if (type == "month") {
            this.selectedRangeForDaysEarly = this.totalDaysEarly[1];
        }
        else if (type == "year") {
            this.selectedRangeForDaysEarly = this.totalDaysEarly[2];
        }
    }

    filterDaysLate(type?: string) {
        if (type == "week") {
            this.selectedRangeForDaysLate = this.totalDaysLate[0];
        } else if (type == "month") {
            this.selectedRangeForDaysLate = this.totalDaysLate[1];
        } else if (type == "year") {
            this.selectedRangeForDaysLate = this.totalDaysLate[2];
        }
    }

    filterDaysAbsent(type?: string) {
        if (type == "week") {
            this.selectedRangeForDaysAbsent = this.totalDaysAbsent[0];
        } else if (type == "month") {
            this.selectedRangeForDaysAbsent = this.totalDaysAbsent[1];
        } else if (type == "year") {
            this.selectedRangeForDaysAbsent = this.totalDaysAbsent[2];
        }
    }

    filterClockIn(type?: string) {
        if (type == "week") {
            this.selectedRangeForClockInTime = this.avgClockIn[0];
        } else if (type == "month") {
            this.selectedRangeForClockInTime = this.avgClockIn[1];
        } else if (type == "year") {
            this.selectedRangeForClockInTime = this.avgClockIn[2];
        }
    }

    filterClockOut(type?: string) {
        if (type == "week") {
            this.selectedRangeForClockOutTime = this.avgClockOut[0];
        } else if (type == "month") {
            this.selectedRangeForClockOutTime = this.avgClockOut[1];
        } else if (type == "year") {
            this.selectedRangeForClockOutTime = this.avgClockOut[2];
        }
    }

    filterPuncScore(type?: string) {
        if (type == "week") {
            this.selectedRangeForPunc = this.punctuality[0];
            this.punctualityScore = this.punctuality[0].punctualityScore;
        } else if (type == "month") {
            this.selectedRangeForPunc = this.punctuality[1];
            this.punctualityScore = this.punctuality[1].punctualityScore;
        } else if (type == "year") {
            this.selectedRangeForPunc = this.punctuality[2];
            this.punctualityScore = this.punctuality[2].punctualityScore;
        }

        this.calculatePuncScore();
    }

    goBack() {
        let route = this.ss.getPrevRoute();

        if (this.ss.getPrevRoute()) {
            this.router.navigate([route]);
        } else {
            this.router.navigate(['/portal/manage-users'])
        }
    }

    ngOnDestroy() {
        this.dataService.setUserObj(null);
        // this.ss.clearPrevRoute();
    }

}
