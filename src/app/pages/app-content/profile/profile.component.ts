import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../components/auth/auth.service";
import { Router } from "@angular/router";
import { NotifyService } from "../../../service/notify.service";
import { StorageService } from "../../../service/storage.service";
import { UpdateProfile } from "../model/app-content.model";
import { PictureUtil } from "../../../util/PictureUtil";
import { AppContentService } from "../services/app-content.service";
import { DataService } from "../../../service/data.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "../../../service/message.service";
import { environment } from "../../../../environments/environment";


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    selectedPhoneCode: any = "234";
    selectedCountryCode: any;
    selectedCountry: any;
    userId: string;
    bio: string;
    openDropdown: boolean;
    searchField: string;
    model: UpdateProfile = new UpdateProfile();
    tmpModel: UpdateProfile = new UpdateProfile();
    changePasswordForm: FormGroup;
    submitted: boolean;
    hide: boolean;
    data: Object[] = [];
    base64Img: any = null;
    modalRef: BsModalRef;
    email: string;
    response: any;
    pictureSizeErrorMessage: string;
    retrieveStatus: boolean = true;
    loading: boolean;
    @ViewChild('changePassword') changePassword;
    countries: any[] = [];
    filteredCountries: any[] = [];
    baseUrl: string = environment.baseUrl;
    searchParam: string;
    fNameIsInvalid: boolean = false;
    lNameIsInvalid: boolean = false;
    invalidInputErrorMsg = 'Only letters and hyphens are allowed'


    ngOnInit() {
        this.mService.setTitle("Profile");
        this.userId = this.ss.getUserId();
        this.email = this.ss.getLoggedInUserEmail();
        this.fetchBio();
        this.fetchUser();
        this.workStatus();
        this.changePasswordForm = this.fb.group({
            oldPw: ['', Validators.required],
            newPw: ['', Validators.required],
        });


    }


    constructor(private authService: AuthService,
        private contentService: AppContentService,
        private router: Router,
        private dataService: DataService,
        private ns: NotifyService,
        private modalService: BsModalService,
        private fb: FormBuilder,
        private pictureUtil: PictureUtil,
        private ss: StorageService,
        private translate: TranslateService,
        private mService: MessageService) {
        translate.setDefaultLang('en/profile');
        translate.use('en/profile');

        this.fetchCountries();

    }
    cancel() {
        // this.fetchUser();
        this.modalRef.hide();
    }

    showDd() {
        if (!this.openDropdown) {
            //first load filteredCountries afresh else the old searched countries will still be displayed
            this.filteredCountries = this.countries;

            this.openDropdown = true;
        } else {
            this.openDropdown = false;
        }
    }


    fileChange(event) {
        if (!this.validateImageFile(event.target.files[0].name)) {
            this.ns.showError('File format not supported');
            event.target.value = '';
            return;
        }
        if (this.pictureUtil.restrictFilesSize(event.target.files[0].size)) {
            this.readFiles(event.target.files);
        } else {
            this.ns.showError('Picture size is more than 100kb. Select another');
        }

        event.target.value = '';
    }

    remove() {
        this.tmpModel.img = "";
        this.mService.setUserImage("");
        this.onSubmit();
        this.ss.setUserImage("")

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
                    this.tmpModel.img = resized_jpeg;
                    this.mService.setUserImage(this.tmpModel.img);
                    this.ss.setUserImage(this.tmpModel.img);
                    this.readFiles(files, index + 1);
                    this.onSubmit();

                });
            });
        } else {
        }
    }

    fetchUser() {
        this.mService.setDisplay(true);
        this.contentService.retrieveUser(this.userId)
            .finally(() => {
                this.mService.setDisplay(false)
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.retrieveStatus = true;
                        this.transformUserObj(result.user, result.user.bio);
                    } else {
                        // this.ns.showError(result.description);
                    }
                },
            )
    }

    fetchBio() {
        this.contentService.retrieveUser(this.userId)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.retrieveStatus = true;
                        this.bio = result.user.bio;
                    } else {
                    }
                },
            )
    }

    transformUserObj(userObj: any, bio: string) {
        this.model.fName = userObj.fName;
        this.model.lName = userObj.lName;
        this.model.companyName = userObj.companyName;
        this.model.phone = userObj.phone;
        this.model.email = userObj.email;
        this.model.address = userObj.address;
        this.model.img = userObj.img;
        this.model.phoneCode = userObj.phoneCode ? userObj.phoneCode : "234";
        this.model.bio = bio;

        if (this.model.img) {
            let str = this.model.img.replace(/ /g, "+");
            this.model.img = str
        }

        this.tmpModel = JSON.parse(JSON.stringify(this.model));

        if (this.model.phoneCode) {
            this.selectPhoneCode();
            this.selectCountryCode(this.model.phoneCode);
        }
        // else {
        //     //legacy
        //     this.selectedPhoneCode = "234";
        //     this.selectCountryCode();
        // }
    }

    openeditProfileModal(template: TemplateRef<any>) {
        this.tmpModel = JSON.parse(JSON.stringify(this.model));

        this.selectCountryCode(this.tmpModel.phoneCode);
        this.selectPhoneCode();


        this.openModal(template);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    openaboutProfileModal(template: TemplateRef<any>) {
        this.openModal(template);
    }

    closeAboutMeModal() {
        this.tmpModel.bio = this.bio;
        this.modalRef.hide();
    }


    onSubmit() {
        this.tmpModel.phoneCode = this.selectedPhoneCode;

        if (!this.tmpModel.phoneCode) {
            this.ns.showError("Please select a country code for phone number");
            return;
        }

        this.userId = this.ss.getUserId();
        this.submitted = true;
        this.loading = true;

        this.contentService.updateProfile(this.userId, this.tmpModel)
            .finally(() => {

                this.loading = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.model = this.tmpModel;
                        this.bio = this.tmpModel.bio;

                        this.ns.showSuccess(result.description);
                        this.modalRef ? this.modalRef.hide() : '';
                        this.fetchBio();
                    } else {
                        this.ns.showError(result.description)
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.")
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

    onClickedOutside(e: Event) {
        this.openDropdown = false;
        this.searchField = "";

        //load filteredCountries afresh else the old searched countries will still be displayed
        this.filteredCountries = this.countries;
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

    fetchCountries() {
        this.authService.fetchCountries()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.countries = result.countries ? result.countries : [];
                        this.filteredCountries = this.countries;
                    }
                },
                error => {
                }
            )
    }

    onSelectChange() {
        this.selectedCountryCode = this.tmpModel.phoneCode;
        setTimeout(() => {
            this.tmpModel.phoneCode = "";
        }, 200);
        this.selectPhoneCode();
    }

    selectCountryCode(phoneCode: string) {
        let obj = this.countries.filter((obj) => obj.phoneCode == phoneCode)[0];

        if (obj) {
            this.selectedCountryCode = obj.code;
        }
    }

    selectPhoneCode() {
        let obj = this.countries.filter((obj) => obj.code == this.selectedCountryCode)[0];

        if (obj) {
            this.selectedPhoneCode = obj.phoneCode;
        }
    }


    search(searchParam: string) {
        if (searchParam) {
            this.filteredCountries = this.countries.filter(obj => obj.name.toLowerCase().includes(searchParam.toLowerCase()));
        } else {
            this.filteredCountries = this.countries;
        }

    }

    openc(event) {
        if (!event) {
            this.searchParam = '';
            this.filteredCountries = this.countries;
        }
    }

    onKeyUp() {
        let str = this.tmpModel.phone.toString();
        this.tmpModel.phone = +str.replace(/[^0-9]/g, "");
    }

    validateImageFile(fileName: string) {
        return /([a-zA-Z0-9\s_\\.\-\(\):])+(.bmp|.jpeg|.jpg|.png)$/i.test(fileName);
    }

    ngOnDestroy() {
        this.modalRef ? this.modalRef.hide() : '';
    }

    validateXters(input: string, formElement: string) {
        if (input && !/([a-zA-Z\-]+)$/i.test(input)) {
            if (formElement == "fName") this.fNameIsInvalid = true;
            if (formElement == "lName") this.lNameIsInvalid = true;
        } else {
            if (formElement == "fName") this.fNameIsInvalid = false;
            if (formElement == "lName") this.lNameIsInvalid = false;
        }
    }

}
