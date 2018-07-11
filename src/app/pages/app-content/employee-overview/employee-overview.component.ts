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
    clockInHistorys:any = [];
    punctualityScore:number = 0;
    active:string = "poor";
    locations:any[] = [];
    daysPresentRequest: DaysPresentRequest = new DaysPresentRequest();
    totalDaysPresent: any[] = [{title: "This week"},{title: "This Month"},{title: "This year"}];
    totalDaysEarly: any[] = [{title: "This week"},{title: "This Month"},{title: "This year"}];
    totalDaysLate: any[] = [{title: "This week"},{title: "This Month"},{title: "This year"}];
    totalDaysAbsent: any[] = [{title: "This week"},{title: "This Month"},{title: "This year"}];
    selectedRangeForDaysPresent: any;
    selectedRangeForDaysEarly: any;
    selectedRangeForDaysLate: any;
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
        if(isNullOrUndefined(this.userObj)) {
            this.router.navigate(['/portal/manage-users']);
        } else {
            this.getHistoryRequestObj();

            this.fetchUserDetail();
            this.fetchClockinHistory();
            this.fetchPuncScore();
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
            .subscribe (
                result => {
                    let res:any = result;
                    if(res.code == 0) {
                        this.clockInHistorys = res.clockInHistory? res.clockInHistory: [];
                    }else {
                        this.clockInHistorys = []
                    }
                },
                error => {this.clockInHistorys = []}
            )
    }

    fetchUserDetail() {
        this.contentService.retrieveUser(this.userObj.email)
            .subscribe(
                result => {
                    let res:any = result;
                    if(res.code == 0) {
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

    fetchPuncScore() {
        this.contentService.fetchPuncScore(this.history)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.punctualityScore = result.punctualityScore;

                        this.calculatePuncScore();
                    }
                },
                error => {}
            )
    }

    calculatePuncScore() {
        if(this.punctualityScore < 26) {
            this.active = "poor";
        }else if (this.punctualityScore < 75) {
            this.active = "average";
        }else if (this.punctualityScore <= 100) {
            this.active = "excellent";
        }
    }

    getUsersLocation() {
        this.contentService.fetchAttendeesLocation(this.model.userId)
            .subscribe(
                result => {
                    if(result.code == 0) {
                        this.locations = result.data;
                    }
                },
                error => {}
            )
    }

    fetchDaysPresent() {
        this.fetchWeeklyStat();
        // this.fetchMonthlyStat();

        //fetch current month

        //fetch current year
    }

    getAverageTime() {
        this.daysPresentRequest.email = this.userObj.email;
        this.daysPresentRequest.orgId = this.userObj.orgId;
        this.daysPresentRequest.locId = this.userObj.locId;
        this.daysPresentRequest.currentStartTime = this.dateUtil.getStartOfDay(new Date(this.startRange));
        this.daysPresentRequest.currentEndTime = this.dateUtil.getEndOfDay(new Date(this.endRange));
        this.daysPresentRequest.prevStartTime = this.dateUtil.getPreviousWeekTimeStamp(this.dateUtil.getStartOfDay(new Date(this.startRange)) - 1)
        this.daysPresentRequest.prevEndTime = this.dateUtil.getStartOfDay(new Date(this.startRange)) - 1;


        this.reportService.getAvgTime(this.daysPresentRequest)
            .subscribe(
                result => {},
                error => {}
            )
    }

    fetchWeeklyStat() {
        let startRange = this.dateUtil.getFirstDayOfCurrentWeek(new Date()).getTime();
        let endRange = this.dateUtil.getLastDayOfCurrentWeek(new Date()).getTime();

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

                    this.selectedRangeForDaysPresent = this.totalDaysPresent[0];
                    this.selectedRangeForDaysEarly = this.totalDaysEarly[0];
                    this.selectedRangeForDaysLate = this.totalDaysLate[0];

                    this.fetchMonthlyStat();
                },
                error => {}
            )
    }

    fetchMonthlyStat() {
        let startRange = this.dateUtil.getFirstDayOfCurrentMonth(new Date()).getTime();
        let endRange = this.dateUtil.getLastDayOfCurrentMonth(new Date()).getTime();

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
                    this.totalDaysPresent[1].daysPresent = result.daysPresent;
                    // this.totalDaysPresent[0].daysPresent = result.daysPresent;
                    this.totalDaysEarly[1].daysEarly = result.daysEarly;
                    this.totalDaysEarly[1].trend = result.earlyTrend;
                    this.totalDaysLate[1].daysLate = result.daysLate;
                    this.totalDaysLate[1].trend = result.lateTrend;

                    this.selectedRangeForDaysPresent = this.totalDaysPresent[1];
                    this.selectedRangeForDaysEarly = this.totalDaysEarly[1];
                    this.selectedRangeForDaysLate = this.totalDaysLate[1];
                },
                error => {}
            )
    }

    filterDaysPresent(type?: string) {
        if(type == "week") {
            this.selectedRangeForDaysPresent = this.totalDaysPresent[0];
        } else if(type == "month") {
            this.selectedRangeForDaysPresent = this.totalDaysPresent[1];
        }
    }

    filterDaysEarly(type?: string) {
        if(type == "week") {
            this.selectedRangeForDaysEarly = this.totalDaysEarly[0];
        } else if(type == "month") {
            this.selectedRangeForDaysEarly = this.totalDaysEarly[1];
        }
    }

    filterDaysLate(type?: string) {
        if(type == "week") {
            this.selectedRangeForDaysLate = this.totalDaysLate[0];
        } else if(type == "month") {
            this.selectedRangeForDaysLate = this.totalDaysLate[1];
        }
    }

    goBack() {
        let route = this.ss.getPrevRoute();

        if(this.ss.getPrevRoute()) {
            this.router.navigate([]);
        }else {
            this.router.navigate(['/portal/manage-users'])
        }
    }

    ngOnDestroy() {
        this.dataService.setUserObj(null);
        this.ss.clearPrevRoute();
    }

}
