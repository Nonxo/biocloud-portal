import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-flow-two',
    templateUrl: './flow-two.component.html',
    styleUrls: ['./flow-two.component.css']
})
export class FlowTwoComponent implements OnInit {

    loginFlag: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    viewLoginPage(value: boolean) {
        this.loginFlag = value;
    }

}
