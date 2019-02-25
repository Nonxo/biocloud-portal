import {Component, OnDestroy} from "@angular/core";
import {SharedService} from "./service/sharedService";
import {StorageService} from "../../../../../service/storage.service";

@Component({
    selector: 'onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['onboarding.component.css']
})

export class OnboardingComponent implements OnDestroy {

    tab: number = 1;

    constructor(public sharedService: SharedService, private ss: StorageService) {}

    public ngOnDestroy() {
        this.ss.clearOnBoardingObj();
    }

}
