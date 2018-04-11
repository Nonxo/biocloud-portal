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

@Component({
    selector: 'app-report-dashboard',
    templateUrl: './report-dashboard.component.html',
    styleUrls: ['./report-dashboard.component.css']
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
    userRole = this.ss.getSelectedOrgRole();

    constructor(private reportService: ReportService,
                private ss: StorageService,
                private contentService: AppContentService,
                private picUtil: PictureUtil,
                private ns: NotifyService,
                private dataService: DataService,
                private mService: MessageService) {
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

        this.fetchDailyReport();
        this.callLocationService();
    }

    fetchDailyReport() {
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
                        // this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
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
        this.reportModel.title = this.reportModel.reportType.toUpperCase() + "-REPORT";
        this.reportModel.export = true;
        this.fetchDailyReport();
    }

    downloadExcel() {
        this.reportModel.exportFormat = "sheet";
        this.reportModel.title = this.reportModel.reportType.toUpperCase() + "-REPORT";
        this.reportModel.export = true;
        this.fetchDailyReport();
    }

    /**
     * Events that should happen when this component is destroyed
     */
    ngOnDestroy() {
        this.dataService.setLocId(null);
    }

}
