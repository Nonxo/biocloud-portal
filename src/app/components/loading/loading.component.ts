import { Component, OnInit } from '@angular/core';
import {MessageService} from "../../service/message.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  display:boolean;

  constructor(private mService: MessageService) {

    this.mService.getDisplayStatus()
        .subscribe(
            result => {
              this.display = result;
            }
        )
  }

  ngOnInit() {
  }

}
