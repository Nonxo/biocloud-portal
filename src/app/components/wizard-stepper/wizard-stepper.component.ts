import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-wizard-stepper',
    templateUrl: './wizard-stepper.component.html',
    styleUrls: ['./wizard-stepper.component.css']
})
export class WizardStepperComponent implements OnInit {

    tab: number = 1;


    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    saveOrg(event) {
        this.switcher();
    }

    switcher() {
        switch (this.tab) {
            case 1: {
                this.tab += 1;
                break;
            }
            case 2: {
                this.router.navigate(['/portal']);
                break;
            }
        }
    }

}
