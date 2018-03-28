import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../components/auth/auth.service";
import {Router} from "@angular/router";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {UpdateProfile} from "../model/app-content.model";
import {PictureUtil} from "../../../util/PictureUtil";
import {AppContentService} from "../services/app-content.service";
import {DataService} from "../../../service/data.service";
import {ChangePasswordComponent} from "../../change-password/change-password.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "../../../service/message.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId:string;
  model: UpdateProfile = new UpdateProfile();
  changePasswordForm:FormGroup;
  submitted:boolean;
  hide:boolean;
  data:Object[] = [];
  base64Img:any = null;
  modalRef:BsModalRef;
  email: string;
  response:any;
  pictureSizeErrorMessage:string;
  retrieveStatus:boolean = true;
  loading:boolean;
  @ViewChild('changePassword') changePassword;




  ngOnInit() {
    this.mService.setTitle("Profile");
    this.userId = this.ss.getUserId();
    this.email = this.ss.getLoggedInUserEmail();
    this.fetchUser();
    this.workStatus();
    this.changePasswordForm = this.fb.group({
      oldPw: ['', Validators.required],
      newPw: ['', Validators.required],
    });



  }



  constructor(private authService:AuthService,
              private contentService:AppContentService,
              private router:Router,
              private dataService:DataService,
              private ns:NotifyService,
              private modalService:BsModalService,
              private fb:FormBuilder,
              private pictureUtil:PictureUtil,
              private ss:StorageService,
              private translate:TranslateService,
              private mService: MessageService) {
    translate.setDefaultLang('en/profile');
    translate.use('en/profile');

  }






    fileChange(event) {
        if (this.pictureUtil.restrictFilesSize(event.target.files[0].size)) {
            this.readFiles(event.target.files);
        } else {
            this.pictureSizeErrorMessage = '*Picture size is more than 100kb. Select another'
            setTimeout(() => {
                this.pictureSizeErrorMessage = ''
            },);
        }
    }

    remove() {
      this.model.img = "";
      this.onSubmit();

    }


    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    readFiles(files, index = 0) {
        let reader = new FileReader();

        if (index in files) {
            this.readFile(files[index], reader, (result) => {
                var img = document.createElement("img");
                img.src = result;

                this.pictureUtil.resize(img, 250, 250, (resized_jpeg, before, after) => {
                    this.model.img = resized_jpeg;
                    this.readFiles(files, index + 1);
                    this.onSubmit();

                });
            });
        } else {
        }
    }

    fetchUser() {
      this.mService.setDisplay(true)
        this.contentService.retrieveUser(this.userId)
          .finally(() => {
            this.mService.setDisplay(false)
          })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.retrieveStatus = true;
                        this.transformUserObj(result.user);
                        if (this.model.img) {
                            let str = this.model.img.replace(/ /g, "+");
                            this.model.img = str
                        }
                    } else {
                        // this.ns.showError(result.description);
                    }
                },
            )
    }

    transformUserObj(userObj: any) {
        this.model.fName = userObj.fName;
        this.model.lName = userObj.lName;
        this.model.companyName = userObj.companyName;
        this.model.phone = userObj.phone;
        this.model.email = userObj.email;
        this.model.address = userObj.address;
        this.model.img = userObj.img;
        this.model.bio = userObj.bio;
    }

    openeditProfileModal(template: TemplateRef<any>) {
        this.openModal(template);
    }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openaboutProfileModal(template: TemplateRef<any>) {
    this.openModal(template);
  }


    onSubmit() {
        this.userId = this.ss.getUserId();
        this.submitted = true;
        this.loading = true;
        this.contentService.updateProfile(this.userId, this.model)
          .finally(() => {
            this.loading = false
          })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.modalRef.hide();
                    } else {
                        this.ns.showError(result.description)
                    }
                }
            )
    }

  workStatus() {
    this.contentService.fetchWorkStatus(this.userId)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.data = result.data ? result.data : [];


          }
        }
      )
  }


  changePasswordResponse(event) {
    if (event.code == 0) {
      this.ns.showSuccess(event.description);
    } else {
      if (event.code == 600) {
        this.ns.showError('An error has occurred')
      } else {
        this.ns.showError(event.description);
      }
    }
  }


}
