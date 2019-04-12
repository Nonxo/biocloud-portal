import {Component, NgZone, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {LocationRequest, SupportMailRequest, TimezonePOJO} from "../model/app-config.model";
import {AppConfigService} from "../services/app-config.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/index";
import {MapsAPILoader} from "@agm/core";
import {GeoMapService} from "../../../../service/geo-map.service";
import {NotifyService} from "../../../../service/notify.service";
import {Router} from "@angular/router";
import {StorageService} from "../../../../service/storage.service";
import {DateUtil} from "../../../../util/DateUtil";
import {MessageService} from "../../../../service/message.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {TranslateService} from "@ngx-translate/core";
import {finalize} from "rxjs/internal/operators";

export const ADRESS_RETRIVED_SUCCESS_MESSAGE = "Address retrieved successfully";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit, OnDestroy {

    locRequest: LocationRequest = new LocationRequest();
    editMode: boolean;
    countries: any[] = [];
    states: any[] = [];
    modalOptions: ModalOptions = new ModalOptions();
    lat: number = 9.0820;
    lng: number = 8.6753;
    zoomSize: number = 15;
    draggable: boolean = true;
    showMap: boolean;
    addRange: boolean;
    resumption: string;
    countryCode: string;
    timezones: TimezonePOJO[] = [];
    filteredTimezones: TimezonePOJO[] = [];
    addNewLoc: boolean;
    inviteEmails: string[] = [];
    confirmees: string[] = [];
    separatorKeysCodes = [ENTER, COMMA];
    locationTypes = [
        {value: "COUNTRY", name: "Country"},
        {value: "STATE", name: "State"},
        {value: "SPECIFIC_ADDRESS", name: "Specific Address"}
    ];
    loading: boolean;
    resumptionTime: Date;
    clockoutTime: Date;
    searchValue: string;
    verifyLocation: string = 'false';
    changeAddress: boolean = false;
    tempName: string = "";
    helpOption: string;
    wrongLocationOption: string;
    supportRequest = new SupportMailRequest();

    constructor(private aService: AppConfigService,
                private modalService: BsModalService,
                private loader: MapsAPILoader,
                private ngZone: NgZone,
                private mapService: GeoMapService,
                private ns: NotifyService,
                private router: Router,
                public modalRef: BsModalRef,
                private ss: StorageService,
                private dateUtil: DateUtil,
                private mService: MessageService,
                private translate: TranslateService,
                private configService: AppConfigService) {
        translate.setDefaultLang('en/add-location');
        translate.use('en/add-location');

        this.mService.setTitle("Add Location");
    }

    ngOnInit() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        if (this.ss.getLocationObj()) {
            this.locRequest = this.ss.getLocationObj();
            this.editMode = true;
            this.setEditMode();
        }

        this.fetchCountries();
        this.fetchTimezones();

        //noinspection TypeScriptUnresolvedFunction
        this.loader.load().then(() => {
        });
    }


    setEditMode() {
        this.lat = this.locRequest.latitude;
        this.lng = this.locRequest.longitude;
        this.verifyLocation = String(this.locRequest.verifyLocation);

        if (this.locRequest.resumption) {
            this.resumptionTime = this.renderTime(this.locRequest.resumption);

            if (this.locRequest.clockOutTime) {
                this.clockoutTime = this.renderTime(this.locRequest.clockOutTime);
            }

        }
        if (this.locRequest.locationType == 'STATE') {
            this.fetchStates(this.locRequest.countryId);
        }
    }

    openModal(template: TemplateRef<any>, addRange) {
        !this.locRequest.address ? this.getCurrentPosition(false) : '';
        this.addRange = addRange;

        this.customSettings();

        this.modalOptions.class = 'modal-lg mt-0';
        this.modalRef = this.modalService.show(template, this.modalOptions);

    }

    setMapRestriction() {
        setTimeout(() => {
            this.autocomplete();
        }, 200);
    }

    customSettings() {
        if (this.addRange) {
            this.zoomSize = 20;
        } else {
            this.zoomSize = 15;
        }
    }

    fetchTimezones() {
        if (this.ss.getTimezones()) {
            this.timezones = this.ss.getTimezones();
        } else {
            this.aService.fetchTimezones()
                .subscribe(
                    result => {
                        if (result.code == 0) {
                            this.timezones = result.timezones
                            this.ss.setTimezones(this.timezones);
                        }
                    },
                    error => {
                    }
                )
        }

        this.filteredTimezones = this.timezones;

    }

    fetchCountries() {
        this.aService.fetchCountries()
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.countries = result.countries;
                    }
                },
                error => {
                }
            )
    }

    fetchStates(id: number) {
        if (this.locRequest.locationType == 'STATE') {
            this.states = [];
            this.aService.fetchStates(id)
                .subscribe(
                    result => {
                        if (result.code == 0) {
                            this.states = result.states;
                        }
                    },
                    error => {
                    }
                )
        }
    }

    clearData() {
        this.locRequest.latitude = null;
        this.locRequest.longitude = null;
        this.locRequest.countryId = 0;
        this.locRequest.stateId = 0;
        this.locRequest.radiusThreshold = 32;
        this.locRequest.address = null;
        this.showMap = false;
        this.searchValue = "";
        this.confirmees = [];

        if (this.locRequest.locationType == 'COUNTRY' || this.locRequest.locationType == 'STATE') {
            this.fetchCountries();
            this.verifyLocation = 'false';
        }

        if (this.locRequest.locationType == 'SPECIFIC_ADDRESS') {
            this.show();
        }
    }

    addnewLocation() {
        this.addNewLoc = true;
        this.submit();
    }

    submit() {

        if (this.resumptionTime) {
            if (!this.locRequest.resumptionTimezoneId) {
                this.ns.showError("You must select a timezone.");
                return;
            }

            //validate that timezone entered is valid
            if (!this.isValidTimezone()) {
                this.ns.showError("Invalid timezone selected. Please make sure you select any of the timezones suggested in the Auto-Complete dropdown");
                return;
            }

            this.locRequest.resumption = this.getTimeStamp(this.resumptionTime);
            //check if closing time is selected
            if (this.clockoutTime) {
                //check if closing time is less than resumption time
                if (this.clockoutTime.getTime() < this.resumptionTime.getTime()) {
                    this.ns.showError("Closing time should be greater than resumption time");
                    return;
                }

                this.locRequest.clockOutTime = this.getTimeStamp(this.clockoutTime);

                if (this.locRequest.gracePeriodInMinutes) {
                    let diff = this.dateUtil.getTimeStamp(this.clockoutTime) - this.dateUtil.getTimeStamp(this.resumptionTime);

                    if (diff < this.dateUtil.convertMinutesToMS(this.locRequest.gracePeriodInMinutes)) {
                        this.ns.showError("Your grace period should be less than " + (Math.round((diff/1000)/60) + 1) + " minute(s)");
                        return false;
                    }
                }

            } else {
                this.locRequest.clockOutTime = null;
            }

        } else {
            this.locRequest.resumption = null;
            this.locRequest.clockOutTime = null;
        }

        if (!this.isFormValid()) {
            return;
        }

        this.locRequest.verifyLocation = (this.verifyLocation == 'true');

        if (this.locRequest.confirmees && this.locRequest.confirmees.length > 0) {
            this.locRequest.verificationThreshold = this.locRequest.confirmees.length;
        }

        this.loading = true;
        this.editMode ? this.editLocation() : this.saveLocation();
    }

    isValidTimezone(): boolean {
        let filter: any[] = this.timezones.filter((obj) => obj.zoneId.toLowerCase() == (this.locRequest.resumptionTimezoneId.toLowerCase()));

        if (filter.length == 0) {
            return false;
        }

        return true;
    }

    isFormValid() {

        if (!this.locRequest.locationType) {
            return false;
        }

        if (this.locRequest.locationType == 'SPECIFIC_ADDRESS' && this.verifyLocation == 'false') {

            if (!this.locRequest.address) {
                this.ns.showError("You must select an Address");
                return false;
            }

            this.locRequest.latitude = this.lat;
            this.locRequest.longitude = this.lng;
        }

        if (this.locRequest.locationType == 'COUNTRY') {
            if (this.locRequest.countryId < 1) {
                this.ns.showError("You must select a Country");
                return false;
            }
        }

        if (this.locRequest.locationType == 'STATE') {
            if (this.locRequest.countryId < 1 || this.locRequest.stateId < 1) {
                this.ns.showError("You must select a State");
                return false;
            }
        }

        if (this.inviteEmails.length > 0) {
            this.inviteEmails = this.removeDuplicate(this.inviteEmails);
            if (!this.validateEmails('INVITE')) {
                return false
            }
        }

        if (this.confirmees.length > 0) {
            this.confirmees = this.removeDuplicate(this.confirmees);
            if (!this.validateEmails('VERIFY')) {
                return false
            }
        }

        return true;
    }

    removeDuplicate(arr: string[]): string[] {
        let set = new Set(arr);

        return Array.from(set);
    }

    validateEmails(type: string): boolean {
        let regex = /[^@\s]+@[^@\s]+\.[^@\s]+/;


        for (let a of type == 'INVITE' ? this.inviteEmails : this.confirmees) {
            if (a) {
                let res = regex.test(a);
                if (!res) {
                    this.ns.showError("Incorrect Email format detected: " + a);
                    return false;
                }
            }
        }

        type == 'INVITE' ? this.locRequest.inviteEmails = this.inviteEmails : this.locRequest.confirmees = this.confirmees;
        return true;
    }

    editLocation() {
        this.aService.editLocation(this.locRequest)
            .pipe(
            finalize(() => {
                this.loading = false;
            }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess("Location was successfully updated");
                        this.router.navigate(['/portal'])
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    saveLocation() {
        this.locRequest.createdBy = this.ss.getLoggedInUserEmail();

        // noinspection TypeScriptValidateTypes,TypeScriptUnresolvedFunction
        this.aService.saveLocation(this.locRequest)
            .pipe(
            finalize(() => {
                this.loading = false;
            }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess(result.description);

                        if (this.addNewLoc) {
                            this.locRequest = new LocationRequest();
                            this.getSearchAddress(this.lat, this.lng);
                            this.inviteEmails = [];
                            this.showMap = false;
                            this.clearResumptionTime();
                            this.countryCode = "";
                            this.confirmees = [];
                        } else {
                            this.router.navigate(['/portal']);
                        }

                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    /**
     * deprecated
     * @returns {number}
     */
    formatResumptionTime(): number {
        return this.dateUtil.getTime(this.resumption);
    }

    /**
     * returns timeStamp
     */
    getTimeStamp(date: Date): number {
        return date.getTime();
    }

    autocomplete() {
        let country = this.countryCode ? this.countryCode : "";

        //noinspection TypeScriptUnresolvedVariable
        let a = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById('autocompleteInput'), {});

        if (country != "") {
            a.setComponentRestrictions(
                {'country': country});
        } else {
            a.setComponentRestrictions(
                {'country': []});
        }

        a.addListener("place_changed", () => {
            this.ngZone.run(() => {
                //get the place result
                //noinspection TypeScriptUnresolvedVariable
                let place: google.maps.places.PlaceResult = a.getPlace();

                //noinspection TypeScriptUnresolvedVariable
                if (place.geometry === undefined || place.geometry === null) {
                    this.locRequest.address = "";
                    //check if coordinate was entered
                    this.checkValidCoordinate(place.name);

                    return;
                }

                //set latitude, longitude and zoom
                //noinspection TypeScriptUnresolvedVariable
                this.lat = place.geometry.location.lat();
                //noinspection TypeScriptUnresolvedVariable
                this.lng = place.geometry.location.lng();

                this.getSearchAddress(this.lat, this.lng);
            });

        });
    }

    checkValidCoordinate(value: string) {
        let splitParts = value.split(",");

        if (splitParts.length == 2) {
            if (!isNaN(+splitParts[0]) && !isNaN(+splitParts[1])) {
                this.lat = +splitParts[0];
                this.lng = +splitParts[1];

                this.getSearchAddress(this.lat, this.lng);
                return;
            }
        }

        this.getCoordinates(value);


    }


    getCoordinates(address: string) {
        this.mapService.getCoordinates(address)
            .subscribe(
                (result) => {
                    this.ngZone.run(() => {

                        this.lat = result.lat();
                        this.lng = result.lng();

                        this.locRequest.address = address;
                        // (<HTMLInputElement>document.getElementById("autocompleteInput")).value = " ";


                        // if(typeof result === 'string') {
                        //     this.locRequest.address = result;
                        //     debugger;
                        // } else {
                        //     this.ns.showError("Unable to get Address")
                        // }
                        //
                        // (<HTMLInputElement>document.getElementById("autocompleteInput")).value = " ";
                    });
                }
            )
    }

    getSearchAddress(lat: number, lng: number) {
        this.mapService.getAddress(lat, lng)
            .subscribe(
                result => {
                    // needs to run inside zone to update the map
                    this.ngZone.run(() => {

                        if (typeof result === 'string') {
                            this.locRequest.address = result;
                            this.ns.showSuccess(ADRESS_RETRIVED_SUCCESS_MESSAGE);
                        } else {
                            this.ns.showError("Unable to get Address")
                        }

                        // (<HTMLInputElement>document.getElementById("autocompleteInput")).value = " ";
                    });
                },
                error => {
                    this.locRequest.address = "";
                },
                () => console.log('Geocoding completed!')
            );
    }

    getCurrentPosition(withAddress: boolean) {
        this.mapService.getLocation({enableHighAccuracy: true}).subscribe((result) => {
                this.lat = result.coords.latitude;
                this.lng = result.coords.longitude;

                withAddress ? this.getSearchAddress(result.coords.latitude, result.coords.longitude) : '';
            },
            (e) => {
                this.ns.showError(e)
            })
    }

    markerDragEnd($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.getSearchAddress(this.lat, this.lng);
    }

    mapClicked($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.getSearchAddress(this.lat, this.lng);
    }

    useAddress() {
        this.getSearchAddress(this.lat, this.lng);
        this.modalRef.hide();
    }

    renderTime(timestamp: number) {
        let date = new Date(timestamp);
        return date;
        // return this.dateUtil.addZero(date.getHours()) + ":" + this.dateUtil.addZero(date.getMinutes());
    }

    show() {
        this.showMap = true;
        this.setMapRestriction();
    }

    zoomInMap() {
        this.zoomSize = 20;
    }

    addEmails(event, type: string) {
        let input, value;

        if (event && event.target) {
            input = event.target;
            value = event.target.value.toLowerCase();
        } else {
            input = event.input;
            value = event.value.toLowerCase();
        }

        let arr = value.split(" ");
        if (arr.length > 0) {
            for (let a of arr) {
                // Add email
                if ((a || '').trim()) {
                    if(type == 'INVITE') {
                        this.inviteEmails.push(a.trim())
                    }else {
                        this.confirmees.push(a.trim());
                    }
                }
            }
        } else {
            // Add email
            if ((value || '').trim()) {
                if(type == 'INVITE') {
                    this.inviteEmails.push(value.trim())
                }else {
                    this.confirmees.push(value.trim());
                    this.inviteEmails.push(value.trim());
                }
            }
        }


        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeEmail(email: any, type: string): void {
        let index = type == 'INVITE' ? this.inviteEmails.indexOf(email) : this.confirmees.indexOf(email);

        if (index >= 0) {
            type == 'INVITE' ? this.inviteEmails.splice(index, 1) : this.confirmees.splice(index, 1);
        }
    }

    clearResumptionTime() {
        this.resumptionTime = void 0;
        this.clockoutTime = void 0;

        this.locRequest.resumptionTimezoneId = null;
        this.locRequest.gracePeriodInMinutes = null;
    }

    clearClosingTime() {
        this.clockoutTime = void 0;
    }

    filter() {
        if (this.locRequest.resumptionTimezoneId == "") {
            this.filteredTimezones = this.timezones;
            return;
        }
        this.filteredTimezones = this.timezones.filter((obj) => obj.zoneId.toLowerCase().includes(this.locRequest.resumptionTimezoneId.toLowerCase()))
    }

    cancel() {
        this.editMode ? this.modalRef.hide() : this.router.navigate(['/portal']);
    }

    validateRadius() {
        if (this.locRequest.radiusThreshold > 200) {
            this.locRequest.radiusThreshold = 200;
        }
    }

    searchMaps() {
        this.checkValidCoordinate(this.searchValue);
    }

    onChangeAddress() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.changeAddress = !this.changeAddress;

        if(this.changeAddress) {
            this.verifyLocation == 'false'? this.show():'';
        }
    }

    ngOnDestroy() {
        this.ss.clearLocationObj();
        this.modalRef? this.modalRef.hide():'';
    }

    onLocationOptionChange() {
        if (this.verifyLocation == 'false') {
            this.show();
        }
    }

    getCountryName(id: number) {
        let obj = this.countries.filter( obj => obj.countryId == id)[0];
        return obj? obj.name:'';
    }

    getStateName(id: number) {
        let obj = this.states.filter( obj => obj.stateId == id)[0];
        return obj? obj.name:'';
    }

    validateLocName() {
        if(this.locRequest.name.length < 50) {
            return;
        }

        if(this.tempName.length > 49) {
            this.locRequest.name = this.tempName;
            return;
        }

        this.tempName = this.locRequest.name;
    }

    proceedForHelp() {
        switch(this.helpOption) {
            case "CANT_GET_LOCATION": {
                this.supportRequest.issue = "I can't get my location on the map";
                this.sendSupportEmail();
                break;
            }

            case "WRONG_LOCATION_CLOCK_IN": {
                if(this.confirmees.length > 0) {
                    this.verifyLocation = 'true';
                    this.submit();
                } else {
                    this.ns.showError("Please specify at least one employee to verify your location.")
                }
                break;
            }

            case "OTHER_ISSUES": {
                this.sendSupportEmail();
                break;
            }
            default: {
                this.ns.showError("Please select an option");
            }
        }
    }

    sendSupportEmail() {
        this.supportRequest.email = this.ss.getLoggedInUserEmail();
        this.supportRequest.customerName = this.ss.getUserName();
        this.supportRequest.phoneNo = this.ss.getUserPhone();

        this.configService.sendSupportEmail(this.supportRequest)
            .subscribe(
                (result) => {
                    this.ns.showSuccess("Message sent successfully");
                    this.modalRef.hide();
                },
                (error) => { this.ns.showError("An Error Occurred");}
            )
    }

}
