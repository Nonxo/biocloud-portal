import {Component, OnInit, ViewChild} from '@angular/core';
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
  modalRef:BsModalRef;
  pictureSizeErrorMessage:string;
  retrieveStatus:boolean = true;
  loading:false;
  @ViewChild('changePassword') changePassword;




  ngOnInit() {
    this.userId = this.ss.getUserId();
    this.fetchUser();
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
              private translate:TranslateService) {
    translate.setDefaultLang('en/profile');
    translate.use('en/profile');

  }






  fileChange(event){
    if (this.pictureUtil.restrictFilesSize(event.target.files[0].size)) {
      this.readFiles(event.target.files);
    } else {
      this.pictureSizeErrorMessage = '*Picture size is more than 100kb. Select another'
      setTimeout(() =>{
        this.pictureSizeErrorMessage = ''
      },);
    }
  }

  remove() {
    this.model.img = "";
    //Hit service to Update image
    this.contentService.updateProfile(this.userId,this.model.img)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.retrieveStatus = true;
            this.model = result.user
            if (this.model.img) {
              let str = this.model.img.replace(/ /g,"+");
              this.model.img = str
            }
          } else {
            this.ns.showSuccess(result.description);
          }
        },
        error => {
          this.ns.showError("An error Occurred")
        }
      )
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
          this.model.img = resized_jpeg;

          this.contentService.updateProfile(this.userId, this.model.img)
            .subscribe(
              result => {
                if (result.code == 0) {
                  this.dataService.setUserPhoto(this.model.img);
                  this.ns.showSuccess("Update Successful");
                } else {
                  this.ns.showError(result.description)
                }
              },
              error => {
                this.ns.showError("An Error Occurred While Updating Photo");
              });
          this.readFiles(files, index + 1);

        });
      });
  } else {
    }
  }

  fetchUser(){
    this.contentService.retrieveUser(this.userId)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.retrieveStatus = true;
            this.model = result.user;
           if (this.model.img) {
             let str = this.model.img.replace(/ /g,"+");
              this.model.img = str
            }
            this.ns.showSuccess(result.description)
          } else {
            this.ns.showError(result.description);
          }
        },

      )
  }

  openModalWithComponent() {
    this.modalRef = this.modalService.show(ChangePasswordComponent);
  }

  //passwordChange() {
  //  const payload = this.changePasswordForm.value;

   // this.authService.changePassword(payload.oldPw, payload.newPw)
   //   .finally(() => this.loading = false)
   //   .subscribe(
    //    res => {
    //      console.log(res);
    //      if (res.code == 0) {
    //        this.ss.authToken = res.token;
    //        this.ss.loggedInUser = res.bioUser;
    //        this.router.navigate(['/portal']);
     //     } else {
     //       this.ns.showError(res.description);
     //     }
    //    },
    //    error => {
    //      }
  //    );

 // }

  onSubmit() {
    this.userId = this.ss.getUserId();
    this.submitted = true;
    this.contentService.updateProfile(this.userId, this.model)
      .subscribe(
        result => {
          if (result.code == 0) {
            this.submitted = false
            this.ns.showSuccess(result.description);
          } else {
            this.ns.showError(result.description)
          }
        }
      )
  }



}
