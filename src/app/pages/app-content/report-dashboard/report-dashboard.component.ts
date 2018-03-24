import {Component, OnInit} from '@angular/core';
import {ReportModel} from "../model/app-content.model";
import {ReportService} from "../services/report.service";
import {StorageService} from "../../../service/storage.service";
import {AppContentService} from "../services/app-content.service";
import * as FileSaver from 'file-saver';
import {PictureUtil} from "../../../util/PictureUtil";
import {NotifyService} from "../../../service/notify.service";
import {MessageService} from "../../../service/message.service";

@Component({
    selector: 'app-report-dashboard',
    templateUrl: './report-dashboard.component.html',
    styleUrls: ['./report-dashboard.component.css']
})
export class ReportDashboardComponent implements OnInit {

    reportModel: ReportModel = new ReportModel();
    rowsOnPage: number = 10;
    data:any[] = [];
    totalSize:number;
    currentPage:number;
    maxSize:number = 5;
    currentTab:number = 0;
    locations:any[] =[];

    constructor(private reportService: ReportService,
                private ss: StorageService,
                private contentService: AppContentService,
                private picUtil: PictureUtil,
                private ns: NotifyService,
                private mService: MessageService) {
        this.reportModel.reportType = "early";
        this.reportModel.pageSize = this.rowsOnPage;
        this.reportModel.orgId = this.ss.getSelectedOrg().orgId;
    }

    ngOnInit() {
        this.mService.setTitle("Reports");

        this.fetchDailyReport();
        this.callLocationService();
    }

    fetchDailyReport() {
        this.reportService.fetchDailyReport(this.reportModel)
            .finally(() => {this.reportModel.export = false;})
            .subscribe(
                result => {
                    if(result.code == 0) {

                        if(this.reportModel.export) {
                            this.generateExcel(result.exportedData);
                        }else {
                            this.data = result.results? result.results: [];
                            this.totalSize = result.total;
                        }

                    } else {
                        // this.ns.showError(result.description);
                    }
                },
                error => {this.ns.showError("An Error Occurred.");}
            )
    }

    generateExcel(data:any) {
        let blob = this.picUtil.base64toBlob(data, 'application/pdf');
        FileSaver.saveAs(blob, this.reportModel.reportType.toUpperCase() + "-REPORT" + ".pdf");
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

        switch(event.index) {
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
                        this.locations = result.locations? result.locations: [];

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
        this.reportModel.export = true;
        this.fetchDailyReport();
    }

}
