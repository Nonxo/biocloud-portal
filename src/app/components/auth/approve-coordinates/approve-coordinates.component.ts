import { Component, OnInit } from '@angular/core';
import {AppContentService} from "../../../pages/app-content/services/app-content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApproveCoordinate} from "../../../pages/app-content/model/app-content.model";
import {NotifyService} from "../../../service/notify.service";

@Component({
  selector: 'app-approve-coordinates',
  templateUrl: './approve-coordinates.component.html',
  styleUrls: ['./approve-coordinates.component.css']
})
export class ApproveCoordinatesComponent implements OnInit {

    locId: string;
    rad: number;
    lat: number;
    lng: number;
    status: string;
    id: string;
    successResponse: boolean;

    constructor(private route:ActivatedRoute,
                private contentService:AppContentService,
                private router:Router,
                private ns: NotifyService) {
        this.route
            .queryParams
            .subscribe(params => {
                    // Defaults to null if no query param provided.
                    this.locId = params['locId'] || null;
                    this.rad = +params['rad'] || null;
                    this.lat = +params['lat'] || null;
                    this.lng = +params['lng'] || null;
                    this.status = params['status'] || null;
                    this.id = params['id'] || null;

                    this.approveCoordinates();
                }
            )
    }

  ngOnInit() {
  }

  approveCoordinates() {
      let model = new ApproveCoordinate(this.lat, this.lng, this.rad, this.status, this.id, this.locId);

      this.contentService.approveCoordinates(model)
          .subscribe(
              result => {
                  this.successResponse = true;
              },
              error => {
                  this.ns.showError("An Error Occurred.");
              }
          )
  }

  gotoLogin() {
    this.router.navigate(['/auth'], {queryParams: {login: true}});
    }

}
