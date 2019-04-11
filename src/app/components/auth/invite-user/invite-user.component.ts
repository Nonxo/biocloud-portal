/**
 * Created by Kingsley Ezeokeke on 4/6/2018.
 */

import {Component, Inject, OnInit} from "@angular/core";
import {DOCUMENT} from '@angular/common';
import {DeviceDetectorService} from "ngx-device-detector";
import {Router} from "@angular/router";

export const OS = {
    WINDOWS: 'Windows',
    MAC: 'Mac',
    IOS: 'iOS',
    ANDROID: 'Android',
    LINUX: 'Linux',
    UNIX: 'Unix',
    FIREFOX_OS: 'Firefox-OS',
    CHROME_OS: 'Chrome-OS',
    WINDOWS_PHONE: 'Windows-Phone',
    UNKNOWN: 'Unknown'
};

@Component({
    selector:'',
    template:``
})

export class InviteUserComponent implements OnInit{

    os: string;

    constructor(@Inject(DOCUMENT) private document: any, private deviceService: DeviceDetectorService, private router: Router) {
        this.os = this.deviceService.os;
    }

    ngOnInit() {
        switch(this.os) {
            case OS['ANDROID']: {
                this.document.location.href = 'https://play.google.com/store/apps/details?id=com.seamfix.iclocker';
                break;
            }
            case OS['IOS']: {
                this.document.location.href = 'https://itunes.apple.com/ng/app/iclocker/id1440168749';
                break;
            }
            default : {
                this.router.navigate(['/auth']);
            }
        }

    }
}
