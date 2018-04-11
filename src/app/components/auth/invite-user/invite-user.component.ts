/**
 * Created by Kingsley Ezeokeke on 4/6/2018.
 */

import {Component, Inject, OnInit} from "@angular/core";
import { DOCUMENT } from '@angular/common';

@Component({
    selector:'',
    template:``
})

export class InviteUserComponent implements OnInit{

    constructor(@Inject(DOCUMENT) private document: any) {}

    ngOnInit() {
        this.document.location.href = 'https://play.google.com/store/apps/details?id=com.seamfix.iclocker';
    }
}