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
  base64Img:any = null;
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
            this.transformUserObj(result.user);

           if (this.model.img) {
             let str = this.model.img.replace(/ /g,"+");
              this.model.img = str
            }
          } else {
            this.ns.showError(result.description);
          }
        },

      )
  }

  transformUserObj(userObj:any) {
    this.model.fName = userObj.fName;
    this.model.lName = userObj.lName;
    this.model.companyName = userObj.companyName;
    this.model.phone = userObj.phoneNumber;
    this.model.email = userObj.email;
    this.model.address = userObj.address;
    this.model.img = userObj.img;
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
            this.ns.showSuccess(result.description);
          } else {
            this.ns.showError(result.description)
          }
        }
      )
  }



}
