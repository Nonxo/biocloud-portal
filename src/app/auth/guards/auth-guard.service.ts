import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {StorageService} from "../../service/storage.service";
/**
 * Created by Kingsley Ezeokeke on 3/4/2018.
 */

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private router:Router, private ss: StorageService) {

    }

    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean | Promise<boolean> {
        return this.checkLogin(route.data['roles'], state.url);
    }


    checkLogin(roles:string[], url:string):Promise<boolean> {
        return Promise.resolve(this.ss.isUserLoggedIn().then(isOk => {
            if (isOk) {
                return true;
            } else {
                this.router.navigate(['/auth']);
                return false;
            }
        }));
    }

}
