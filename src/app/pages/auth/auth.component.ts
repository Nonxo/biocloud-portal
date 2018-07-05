import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    register: boolean;


    constructor() {
    }

    ngOnInit() {
    }

    onTabChange(event) {

        switch (event.index) {
            case 0: {
                break;
            }
            case 1: {
                this.register = true;
                break;
            }

        }
    }

}
