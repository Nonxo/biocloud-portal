import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Endpoints} from '../../util/endpoints';
import {ApproveRequest} from "../../pages/app-content/model/app-content.model";
import {MediaType} from "../../util/constants";
import {StorageService} from "../../service/storage.service";

@Injectable()
export class AuthService {

    staticAuthKey = '57662cef-cd4a-4e5b-87dc-f0ef7481ef84';
    urlEncodeHeader = {
        'sc-auth-key': this.staticAuthKey,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    constructor(private httpClient:HttpClient, private ss: StorageService) {
    }

    login(email, pw):Observable<any> {
        let params = new HttpParams()
            .set('email', email)
            .set('pw', pw)
        return this.httpClient.post(Endpoints.LOGIN, params.toString(), {
            headers: this.urlEncodeHeader
        });
    }

    changePassword(email, oldPw, newPw):Observable<any> {
      let params = new HttpParams()
        .set('email', email)
        .set('oldPw', oldPw)
        .set('newPw', newPw)
      return this.httpClient.post(Endpoints.CHANGE_PASSWORD, params.toString(), {
        headers: this.urlEncodeHeader
      });
    }

    register(registerPayload):Observable<any> {
        return this.httpClient.post(Endpoints.REGISTER, registerPayload, {
                headers: {'sc-auth-key': this.staticAuthKey}
            }
        );
    }

    forgotPassword(email):Observable<any> {
        let params = new HttpParams()
            .set('email', email)

        return this.httpClient.post(Endpoints.FORGOT_PASSWORD, params.toString(), {
            headers: this.urlEncodeHeader
        });
    }

    validateCaptcha(token):Observable<any> {
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

    approveAdminNotification(inviteId:string): Observable<any> {
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
        
        for (let i = 0; i < roles.length; i++) {
            if (role == roles[i]) {
                return Promise.resolve(true);

            }
        }

        return Promise.resolve(false);
    }

    logout(): void {
        // clear token remove user from local storage to log user out

        localStorage.removeItem('_u');
        localStorage.removeItem('_tkn');
        localStorage.removeItem('_orgs');
        localStorage.removeItem('_st');
        localStorage.removeItem('orgRoles');
    }
}
