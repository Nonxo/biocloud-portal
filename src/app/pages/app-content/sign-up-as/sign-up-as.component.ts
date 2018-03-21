import { Component, OnInit } from '@angular/core';
import {CreateOrgRequest} from "../model/app-content.model";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {Router} from "@angular/router";
import {PictureUtil} from "../../../util/PictureUtil";

@Component({
  selector: 'app-sign-up-as',
  templateUrl: './sign-up-as.component.html',
  styleUrls: ['./sign-up-as.component.css']
})
export class SignUpAsComponent implements OnInit {

    orgTypes: string[] = ["SCHOOL", "SECURITY", "HOSPITAL"];
    orgRequest:CreateOrgRequest = new CreateOrgRequest();
    uploadedFileName:string;

  constructor(private contentService: AppContentService,
              private ns: NotifyService,
              private ss: StorageService,
              private router: Router,
              private pictureUtil: PictureUtil) { }

  ngOnInit() {
  }

    getOrgRequestObject() {
        this.orgRequest.createdBy = this.ss.getLoggedInUserEmail();
    }

    saveOrg() {
      if(!this.isFormValid()) {
          return;
      }

        this.getOrgRequestObject();
        this.callOrgCreationService();
    }

    isFormValid(): boolean {
      if(!this.orgRequest.type) {
          this.ns.showError('Company Type is required');
          return false;
      }

      return true;
    }

    callOrgCreationService() {
        this.contentService.createOrg(this.orgRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.router.navigate(['/portal']);
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    fileChange(event){
        if (this.pictureUtil.restrictFilesSize(event.target.files[0].size)) {
          this.uploadedFileName = event.target.files[0].name;
            this.readFiles(event.target.files);
        } else {
            this.ns.showError('Picture size is more than 100kb. Select another');
            this.uploadedFileName = "";
            this.orgRequest.logo = "";
        }
    }

    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    readFiles(files, index = 0){
        let reader = new FileReader();

        if (index in files) {
            this.readFile(files[index], reader,(result) => {
                var img = document.createElement("img");
                img.src = result;

                this.pictureUtil.resize(img, 250, 250, (resized_jpeg, before, after)=> {
                    this.orgRequest.logo = resized_jpeg;
                    this.readFiles(files, index + 1);

                });
            });
        } else {
        }
    }

}
