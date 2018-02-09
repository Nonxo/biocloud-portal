import { Injectable } from '@angular/core';
import { AlertService } from 'ngx-alerts';

@Injectable()
export class NotifyService {

  constructor(private alertService: AlertService) {
  }

  showError(error) {
    // alert(error);
    this.alertService.danger(error);
  }

  showSuccess(msg) {
    // alert(error);
    this.alertService.success(msg);
  }

}
