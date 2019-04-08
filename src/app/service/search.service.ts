import {map} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {debounceTime, distinctUntilChanged} from 'rxjs/internal/operators';

/**
 * Created by Kingsley Ezeokeke on 3/4/2018.
 */


@Injectable()
export class SearchService {

    constructor(private ss:StorageService) {
    }

    search(terms:Observable<any>) {
        //noinspection TypeScriptValidateTypes
        return terms.pipe(debounceTime(100))
            .pipe(distinctUntilChanged()).pipe(
            map(term => this.searchOrgs(term.searchValue, term.searchType)));
    }

    searchOrgs(term:any, type:string) {
        switch (type) {
            case 'ADMIN':
            {
                let users = this.ss.getAdminUsers();

                if (users) {
                    if (term) {
                        return users.filter(obj => obj.firstName.toLowerCase().includes(term.toLowerCase())
                        || obj.lastName.toLowerCase().includes(term.toLowerCase())
                        || obj.email.toLowerCase().includes(term.toLowerCase()))
                    } else {
                        return users
                    }
                }

                return []
            }
            case 'ORG':
            {
                let orgs = this.ss.getUsersOrg();

                if (orgs) {
                    if (term) {
                        return orgs.filter(obj => obj.name.toLowerCase().includes(term.toLowerCase()))
                    } else {
                        return orgs
                    }
                }

                return []
            }
        }

    }
}
