import {StorageService} from "../../service/storage.service";
import {Injectable} from "@angular/core";
import {Router, RouterStateSnapshot, CanActivate, ActivatedRouteSnapshot} from "@angular/router";
import {AuthService} from "../../components/auth/auth.service";
/**
 * Created by Kingsley Ezeokeke on 3/4/2018.
 */

@Injectable()
export class SessionGuard implements CanActivate {


    constructor(private router:Router, private ss: StorageService, private as: AuthService) {

    }

    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean | Promise<boolean> {
        return this.checkLogin(route.data['roles'], state.url);
    }


    checkLogin(roles:string[], url:string):Promise<boolean> {
        return Promise.resolve(this.ss.isUserLoggedIn().then(isOk => {
            if (isOk) {
                this.router.navigate[('/portal')]
                return false;
            } else {
                this.as.logout();
                return true;
            }
        }));
    }

}

