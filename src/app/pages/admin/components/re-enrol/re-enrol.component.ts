import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-re-enrol',
    templateUrl: './re-enrol.component.html',
    styleUrls: ['./re-enrol.component.css']
})
export class ReEnrolComponent implements OnInit {

    notifications: any[] = [
        {
            firstName: "Kue",
            lastName: "Eze"
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
