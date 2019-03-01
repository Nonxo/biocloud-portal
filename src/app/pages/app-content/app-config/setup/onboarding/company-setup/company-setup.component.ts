import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SharedService} from "../service/sharedService";

@Component({
    selector: 'app-company-setup',
    templateUrl: './company-setup.component.html',
    styleUrls: ['./company-setup.component.css']
})
export class CompanySetupComponent implements OnInit {

    constructor(private router: Router, private sharedService: SharedService) {
        this.sharedService.tab = 1
    }

    ngOnInit() {
    }

    saveOrg(event) {
        this.router.navigate(['/onboard/step-one']);
    }
}
