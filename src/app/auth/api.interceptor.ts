import {Observable, throwError as observableThrowError} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {DataService} from '../service/data.service';
import {StorageService} from '../service/storage.service';
import {AuthService} from "../components/auth/auth.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService, private ds: DataService, private ss: StorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(`Intercepting request ${req.method} ${req.url}`);

        const loggedInUserEmail = this.ss.getLoggedInUserEmail();

        const authReq = req.clone({
            headers: req.headers
                .set('br-auth-key', this.ss.authToken || '')
                .set('br-client-type', 'portal')
                .set('br-tag', loggedInUserEmail)
                .set('br-time', moment().toDate().getTime().toString())
        });

        //noinspection TypeScriptValidateTypes
        return next.handle(authReq).pipe(
        // .timeout(60000)
            map((value) => {
                const type = value.constructor.name;

                if (type !== 'HttpResponse') {
                    return value;
                }

                const body = (value as HttpResponse<any>).body;

                return value;


            }),
            catchError((err, caught) => {
                console.log(`Error occurred ${err}`);
                return observableThrowError(err);
            }),);
    }

}
