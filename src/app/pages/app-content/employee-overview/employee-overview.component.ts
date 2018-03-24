import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "../../../service/message.service";
import {Router} from "@angular/router";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {DataService} from "../../../service/data.service";

@Component({
    selector: 'app-employee-overview',
    templateUrl: './employee-overview.component.html',
    styleUrls: ['./employee-overview.component.css']
})
export class EmployeeOverviewComponent implements OnInit, OnDestroy {

    sub$: any;
    email: string;
    model:any;

    constructor(private mService: MessageService,
                private contentService: AppContentService,
                private router: Router,
                private ns: NotifyService,
                private dataService: DataService) {
        this.mService.setTitle("Employee Overview");
    }

    ngOnInit() {
        this.email = this.dataService.getEmail();
        if(!this.email) {
            this.router.navigate(['/portal/manage-users']);
        }

        this.fetchUserDetail();
    }


    fetchUserDetail() {
        this.contentService.retrieveUser(this.email)
            .subscribe(
                result => {
                    let res:any = result;
                    if(res.code == 0) {
                        this.model = res.user;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    ngOnDestroy() {
        this.dataService.setEmail(null);
    }

}
