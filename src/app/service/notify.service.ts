import { Injectable } from '@angular/core';

@Injectable()
export class NotifyService {

  showError(error) {
    alert(error);
  }

}
