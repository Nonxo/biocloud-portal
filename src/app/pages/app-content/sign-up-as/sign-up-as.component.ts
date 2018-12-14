import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {CreateOrgRequest} from "../model/app-content.model";
import {AppContentService} from "../services/app-content.service";
import {NotifyService} from "../../../service/notify.service";
import {StorageService} from "../../../service/storage.service";
import {Router} from "@angular/router";
import {PictureUtil} from "../../../util/PictureUtil";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ImageCroppedEvent} from 'ngx-image-cropper/src/image-cropper.component';

@Component({
    selector: 'app-sign-up-as',
    templateUrl: './sign-up-as.component.html',
    styleUrls: ['./sign-up-as.component.css']
})
export class SignUpAsComponent implements OnInit {

    orgTypes: string[] = [];
    orgRequest: CreateOrgRequest = new CreateOrgRequest();
    uploadedFileName: string;
    loading: boolean;
    range: any[] = [];
    employeeRangeUpperLimit: string;
    bsModalRef: BsModalRef;
    @ViewChild("cropImageTemplate") public cropImageTemplate: TemplateRef<any>;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    cropperReady = false;


    @Output()
    onOrgSave = new EventEmitter<boolean>();

    constructor(private contentService: AppContentService,
                private ns: NotifyService,
                private ss: StorageService,
                private router: Router,
                private pictureUtil: PictureUtil,
                private modalService: BsModalService) {
    }

    ngOnInit() {
        this.fetchEmployeeRange();
        this.fetchCompanyType();
    }

    fetchCompanyType() {
        if (this.ss.getCompanyType() && this.ss.getCompanyType().length > 0) {
            this.orgTypes = this.ss.getCompanyType();
        } else {
            this.contentService.fetchCompanyType()
                .subscribe(
                    result => {
                        if (result.code == 0) {
                            this.orgTypes = result.orgTypes;
                            this.ss.setCompanyType(this.orgTypes);
                        }
                    },
                    error => {
                    }
                )
        }
    }

    fetchEmployeeRange() {
        this.contentService.fetchEmployeeRange()
            .subscribe(
                result => {
                    this.range = result.range ? result.range : [];
                    this.range.sort((a,b) => a.upperLimit - b.upperLimit);
                },
                error => {

                }
            )
    }

    getOrgRequestObject() {
        this.orgRequest.createdBy = this.ss.getLoggedInUserEmail();
    }

    saveOrg() {
        this.transformEmployeeRangeObj();
        if (!this.isFormValid()) {
            return;
        }

        this.loading = true;
        this.getOrgRequestObject();
        this.callOrgCreationService();
    }

    transformEmployeeRangeObj() {
        if (this.range.length > 0) {
            for (let r of this.range) {
                if (r.upperLimit == this.employeeRangeUpperLimit) {
                    this.orgRequest.employeeRange = r;
                    break;
                }

            }
        }
    }

    isFormValid(): boolean {
        if (!this.orgRequest.type) {
            this.ns.showError('Company type is required');
            return false;
        }

        if (!this.orgRequest.employeeRange) {
            this.ns.showError('Company size is required');
            return false;
        }

        return true;
    }

    callOrgCreationService() {
        this.contentService.createOrg(this.orgRequest)
            .finally(() => {
                this.loading = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);
                        this.updateOrgRoles(result.organisation);
                        this.ss.setSelectedOrg(result.organisation);

                        //if orgs exist already in cache, update cache
                        if (this.ss.getUsersOrg()) {
                            this.ss.updateUsersOrg(result.organisation);
                        }

                        // this.router.navigate(['/portal/config']);
                        this.onOrgSave.emit(true);

                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred.");
                }
            )
    }

    updateOrgRoles(org: any) {
        let arr = [{orgId: org.orgId, role: "GENERAL_ADMIN"}];

        this.ss.setOrgRoles(arr);
    }

    fileChange(event) {

        if(!this.validateImageFile(event.target.files[0].name)) {
            this.ns.showError('File format not supported');
            event.target.value = '';
            return;
        }
        if (this.pictureUtil.restrictFilesSize(event.target.files[0].size)) {
            this.uploadedFileName = event.target.files[0].name;
            this.imageChangedEvent = event;
            this.openModal();
            // this.readFiles(event.target.files);
        } else {
            this.ns.showError('Picture size is more than 100kb. Select another');
            this.uploadedFileName = "";
            this.orgRequest.logo = "";
        }
    }

    validateImageFile(fileName: string) {
        return /([a-zA-Z0-9\s_\\.\-\(\):])+(.bmp|.jpeg|.jpg|.png)$/i.test(fileName);
    }

    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    openModal() {
        this.bsModalRef = this.modalService.show(this.cropImageTemplate);
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    imageLoaded() {
        this.cropperReady = true;
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    clearImage() {
        this.croppedImage = '';
        this.uploadedFileName = "";
        this.bsModalRef.hide();
    }

    saveImage() {
        let splitParts = this.croppedImage.split(",");

        this.orgRequest.logo = splitParts[1];
        this.bsModalRef.hide();
    }

    readFiles(files, index = 0) {
        let reader = new FileReader();

        if (index in files) {
            this.readFile(files[index], reader, (result) => {
                var img = document.createElement("img");
                img.src = result;

                this.pictureUtil.resize(img, 250, 250, (resized_jpeg, before, after) => {
                    this.orgRequest.logo = resized_jpeg;
                    this.readFiles(files, index + 1);

                });
            });
        } else {
        }
    }

}
