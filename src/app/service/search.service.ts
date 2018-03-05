import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {StorageService} from "./storage.service";
/**
 * Created by Kingsley Ezeokeke on 3/4/2018.
 */


@Injectable()
export class SearchService {

    constructor(private ss: StorageService) {}

    search(terms: Observable<string>, type:string) {
        //noinspection TypeScriptValidateTypes
        return terms.debounceTime(100)
            .distinctUntilChanged()
            .map(term => this.searchOrgs(term));
    }

    searchOrgs(term) {
        let orgs = this.ss.getUsersOrg();

        if(orgs) {
            if(term) {
                return orgs.filter(obj => obj.name.toLowerCase().includes(term.toLowerCase()))
            }else {
                return orgs
            }
        }

        return []
    }
}