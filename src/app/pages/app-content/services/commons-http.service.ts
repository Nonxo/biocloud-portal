/**
 * Created by Kingsley Ezeokeke on 3/20/2018.
 */

import {Injectable} from "@angular/core";
import {AppContentService} from "./app-content.service";
import {NotifyService} from "../../../service/notify.service";

@Injectable()
export class CommonsHttpService {

    constructor(private contentService: AppContentService, private ns: NotifyService) {}

    callLocationService() {
        this.contentService.fetchOrgUsersLocation()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        return result.locations? result.locations:[];
                    } else {
                        this.ns.showError(result.description);
                        return [];
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                    return [];
                }
            )

    }
}