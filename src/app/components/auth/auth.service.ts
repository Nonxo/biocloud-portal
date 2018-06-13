import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Endpoints} from '../../util/endpoints';
import {ApproveRequest} from "../../pages/app-content/model/app-content.model";
import {MediaType} from "../../util/constants";
import {StorageService} from "../../service/storage.service";
import {DataService} from "../../service/data.service";
import {Router} from "@angular/router";
import {map, timeout} from "rxjs/operators";

@Injectable()
export class AuthService {

    staticAuthKey = '57662cef-cd4a-4e5b-87dc-f0ef7481ef84';
    urlEncodeHeader = {
        'sc-auth-key': this.staticAuthKey,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    constructor(private httpClient: HttpClient,
                private ss: StorageService,
                private ds: DataService,
                private router: Router) {
    }

    login(email, pw): Observable<any> {
        let params = new HttpParams()
            .set('email', email)
            .set('pw', pw)
        return this.httpClient.post(Endpoints.LOGIN, params.toString(), {
            headers: this.urlEncodeHeader
        });
    }

    changePassword(email, oldPw, newPw): Observable<any> {
        let params = new HttpParams()
            .set('email', email)
            .set('oldPw', oldPw)
            .set('newPw', newPw)
        return this.httpClient.post(Endpoints.CHANGE_PASSWORD, params.toString(), {
            headers: this.urlEncodeHeader
        });
    }

    register(registerPayload): Observable<any> {
        return this.httpClient.post(Endpoints.REGISTER, registerPayload, {
                headers: {'sc-auth-key': this.staticAuthKey}
            }
        );
    }

    forgotPassword(email): Observable<any> {
        let params = new HttpParams()
            .set('email', email)

        return this.httpClient.post(Endpoints.FORGOT_PASSWORD, params.toString(), {
            headers: this.urlEncodeHeader
        });
    }

    validateCaptcha(token): Observable<any> {
        let params = new HttpParams()
            .set('resp', token)

        return this.httpClient.post(Endpoints.VERIFY_CAPTCHA, params.toString(), {
            headers: this.urlEncodeHeader
        });
    }

    test() {
        this.httpClient.get('https://jsonplaceholder.typicode.com/posts')
            .subscribe(
                res => console.log(res),
                err => console.log(err)
            );
    }

    approveAdminNotification(inviteId: string): Observable<any> {
        return this.httpClient.post(Endpoints.APPROVE_ADMIN_NOTIFICATION + inviteId + "/status", null, {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_JSON)
        })
    }

    hasAnyAuthority(roles: string[]): Promise<boolean> {
        let role = this.ss.getSelectedOrgRole();

        if (!role) {
            return Promise.resolve(false);
        }

        if (roles) {
            for (let i = 0; i < roles.length; i++) {
                if (role == roles[i]) {
                    return Promise.resolve(true);
                }
            }
        }

        return Promise.resolve(false);
    }

    acceptCompliance(email): Observable<any> {
        let body = {};
        body['email'] = email;
        body['deviceType'] = "WEB";

        return this.httpClient.post(Endpoints.ACCEPT_GDPR_COMPLIANCE, JSON.stringify(body), {
            headers: new HttpHeaders()
                .set('Content-Type', MediaType.APPLICATION_JSON)
                .set('sc-auth-key', this.staticAuthKey)
        });
    }

    fetchCountries(): Observable<any> {
        return this.httpClient
            .get(Endpoints.FETCH_COUNTRIES, {
                headers: new HttpHeaders()
                    .set('Content-Type', MediaType.APPLICATION_FORM_URLENCODED)
            })
            .pipe(
                timeout(50000),
                map(response => {
                    let res:any = response;
                    return res
                })
            )
    }

    logout(): void {
        // clear token remove user from local storage to log user out

        localStorage.removeItem('_u');
        localStorage.removeItem('_tkn');
        localStorage.removeItem('_orgs');
        localStorage.removeItem('_st');
        localStorage.removeItem('orgRoles');
    }

    checkUnauthorized(message): void {
        if (message == 401) {
            this.logout();
            this.router.navigate(['/auth']);
        } else if (message == 'Token provided is invalid') {
            this.ds.setLogoutMessage('Your session has expired. Please login again');
            this.logout();
            this.router.navigate(['/auth']);
        } else if (message == 'Your session has expired, please login again') {
            this.ds.setLogoutMessage('Your session has expired. Please login again');
            this.logout();
            this.router.navigate(['/auth']);
        } else if (message == 'Not Authorized') {
            this.ds.setLogoutMessage('Your session has expired. Please login again');
            this.logout();
            this.router.navigate(['/auth']);
        } else if (message == 'Correct your device time and try again') {
            this.ds.setLogoutMessage('Correct your device time and try again');
            this.logout();
            this.router.navigate(['/auth']);
        }
    }
}
