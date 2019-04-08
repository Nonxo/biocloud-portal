import {Component, Input, NgZone, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {InviteRequest, LocationRequest, SupportMailRequest, TimezonePOJO} from "../../../model/app-config.model";
import {AppConfigService} from "../../../services/app-config.service";
import {NotifyService} from "../../../../../../service/notify.service";
import {StorageService} from "../../../../../../service/storage.service";
import {MapsAPILoader} from "@agm/core";
import {GeoMapService} from "../../../../../../service/geo-map.service";
import {DateUtil} from '../../../../../../util/DateUtil';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Router} from "@angular/router";
import {finalize} from "rxjs/internal/operators";

@Component({
    selector: 'app-create-location',
    templateUrl: './create-location.component.html',
    styleUrls: ['./create-location.component.css']
})
export class CreateLocationComponent implements OnInit {

    modalRef: BsModalRef;

    @Input()
    step: number = 1;
    isNewShift: boolean = false;
    isDeleteShift: boolean = false;
    isSolutions: boolean = false;
    specificEmployee: boolean = false;
    isOtherIssues: boolean = false;
    locRequest: LocationRequest = new LocationRequest();
    loading: boolean = false;
    username: string;
    showMap: boolean = false;
    lat: number = 9.0820;
    lng: number = 8.6753;
    countryCode: string;
    searchValue: string;
    zoomSize: number = 15;
    timezones: TimezonePOJO[] = [];
    filteredTimezones: TimezonePOJO[] = [];
    resumptionTime: Date;
    clockoutTime: Date;
    items = ['king', 'eze'];
    countries: any[] = [];
    states: any[] = [];
    inviteEmails: string[] = [];
    confirmees: string[] = [];
    tempName: string = "";
    separatorKeysCodes = [ENTER, COMMA];
    inviteRequest = new InviteRequest();
    supportRequest = new SupportMailRequest();
    helpOption: string;
    @Input()
    onBoard: boolean;

    constructor(private modalService: BsModalService,
                private aService: AppConfigService,
                private ns: NotifyService,
                private ss: StorageService,
                private loader: MapsAPILoader,
                private ngZone: NgZone,
                private mapService: GeoMapService,
                private dateUtil: DateUtil,
                private configService: AppConfigService,
                private router: Router) {
        this.username = this.ss.getUserName();
    }

    ngOnInit() {
        let obj = this.ss.getOnBoardingObj();

        //noinspection TypeScriptUnresolvedFunction
        this.loader.load().then(() => {
        });

        if(this.onBoard && !obj && this.step != 1) {
            this.router.navigate(['/onboard']);
        }

        //check local storage for saved obj

        if(obj) {
            this.getOnBoardingObj(obj);
            if(this.locRequest.locationType) {
                switch(this.locRequest.locationType) {
                    case "COUNTRY": {
                        this.fetchCountries();
                        break;
                    }
                    case "STATE": {
                        this.fetchCountries();
                        this.fetchStates(this.locRequest.countryId);
                        break;
                    }
                    case "SPECIFIC_ADDRESS": {
                        setTimeout(() => {
                            this.show();
                        }, 200);
                        break
                    }
                }
            }
        }
        this.fetchTimezones();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
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
        // this.confirmees = [];

        if (this.locRequest.locationType == 'COUNTRY' || this.locRequest.locationType == 'STATE') {
            this.fetchCountries();

            // this.verifyLocation = 'false';
        }

        if (this.locRequest.locationType == 'SPECIFIC_ADDRESS') {
            this.show();
        }
    }

    validateRadius() {
        if (this.locRequest.radiusThreshold > 200) {
            this.locRequest.radiusThreshold = 200;
        }
    }

    filter() {
        if (this.locRequest.resumptionTimezoneId == "") {
            this.filteredTimezones = this.timezones;
            return;
        }
        this.filteredTimezones = this.timezones.filter((obj) => obj.zoneId.toLowerCase().includes(this.locRequest.resumptionTimezoneId.toLowerCase()))
    }


    show() {
        this.showMap = true;
        this.setMapRestriction();
    }

    setMapRestriction() {
        setTimeout(() => {
            this.autocomplete();
        }, 200);
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

    mapClicked($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.getSearchAddress(this.lat, this.lng);
    }

    markerDragEnd($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.getSearchAddress(this.lat, this.lng);
    }

    addShift() {
        this.isNewShift = true
        this.isDeleteShift = true
    }

    deleteShift() {
        this.isDeleteShift = false
    }

    cantGetLocation() {
        this.isSolutions = true;
        this.specificEmployee = false;
        this.isOtherIssues = false
    }

    otherIssues() {
        this.isSolutions = false;
        this.specificEmployee = false;
        this.isOtherIssues = true
    }

    specificEmployeeClockIn() {
        this.specificEmployee = true
    }

    searchAddressFromRecent() {
        this.specificEmployee = false
    }

    saveLocation() {
        this.loading = true;
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

                        this.locRequest = result.loc;
                        if(this.onBoard) {
                            this.setOnBoardingObj();
                            this.routeUser();
                        }
                        this.step += 1;

                        // !this.locRequest.locationType ? this.locRequest.locationType = 'SPECIFIC_ADDRESS' : '';
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }

    editLocation() {
        this.loading = true;
        this.aService.editLocation(this.locRequest)
            .pipe(
            finalize(() => {
                this.loading = false;
            }))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        if(this.onBoard) {
                            this.setOnBoardingObj();
                            this.routeUser();
                        }

                        this.step += 1;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    this.ns.showError("An Error Occurred");
                }
            )
    }
    routeUser() {
        switch(this.step) {
            case 1: {
                this.router.navigate(['/onboard/step-two']);
                break;
            };
            case 2: {
                this.router.navigate(['/onboard/step-three']);
                break;
            };
            case 3: {
                this.router.navigate(['/onboard/step-four']);
                break;
            };
            case 4: {
                this.router.navigate(['/portal']);
                break;
            }
        }
    }

    isFormValid() {

        if (!this.locRequest.locationType) {
            return false;
        }

        if (this.locRequest.locationType == 'SPECIFIC_ADDRESS') {

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

    validateEmails(type: string): boolean {
        let regex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
        let regex2 = /[^A-Za-z\-_.0-9@]/;


        for (let a of type == 'INVITE' ? this.inviteEmails : this.confirmees) {
            if (a) {
                let res = regex.test(a);
                let res2 = regex2.test(a);

                if (!res || res2) {
                    this.ns.showError("Incorrect Email format detected: " + a);
                    return false;
                }
            }
        }

        type == 'INVITE' ? this.locRequest.inviteEmails = this.inviteEmails : this.locRequest.confirmees = this.confirmees;
        return true;
    }

    removeDuplicate(arr: string[]): string[] {
        let set = new Set(arr);

        return Array.from(set);
    }

    validateLocName() {
        if (this.locRequest.name.length < 50) {
            return;
        }

        if (this.tempName.length > 49) {
            this.locRequest.name = this.tempName;
            return;
        }

        this.tempName = this.locRequest.name;
    }

    nextStep() {
        switch (this.step) {
            case 1: {
                this.locRequest.locId ? this.editLocation() : this.saveLocation();
                break;
            }
            case 2: {
                if(this.isFormValid()) {
                    this.editLocation();
                }
                break;
            }
            case 3: {
                if (this.isTimeSetupValid()) {
                    this.editLocation();
                }
                break;
            }
            case 4: {
                if(this.inviteEmails.length == 0) {
                    this.ns.showError("Please add employee emails or select the option to skip this step");
                    break;
                }

                if(this.isFormValid()) {
                    this.inviteRequest.locIds.push(this.locRequest.locId);
                    this.inviteRequest.emails = this.inviteEmails;
                    this.inviteRequest.role = 'ATTENDEE';
                    this.invite();
                }
                break;
            }
            case 5: {
                break;
            }
        }
    }

    previousStep() {
        switch (this.step) {
            case 1: {
                break;
            }

            case 2: {
                // !this.locRequest.locationType ? this.locRequest.locationType = 'SPECIFIC_ADDRESS' : '';
                this.onBoard? this.router.navigate(['/onboard/step-one']): this.step -= 1;
                break;
            }

            case 3: {
                this.onBoard? this.router.navigate(['/onboard/step-two']): this.step -= 1;
                break;
            }

            case 4: {
                this.onBoard? this.router.navigate(['/onboard/step-three']): this.step -= 1;
                break;
            }
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
                            this.timezones = result.timezones;
                            this.ss.setTimezones(this.timezones);
                        }
                    },
                    error => {
                    }
                )
        }

        this.filteredTimezones = this.timezones;

    }

    getCurrentPosition(withAddress: boolean) {
        this.mapService.getLocation().subscribe((result) => {
                this.lat = result.coords.latitude;
                this.lng = result.coords.longitude;

                withAddress ? this.getSearchAddress(result.coords.latitude, result.coords.longitude) : '';
            },
            (e) => {
                this.ns.showError(e)
            })
    }

    fetchCountries() {
        if (this.countries.length == 0) {
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

    isTimeSetupValid(): boolean {
        if (this.resumptionTime) {
            if (!this.locRequest.resumptionTimezoneId) {
                this.ns.showError("You must select a timezone.");
                return false;
            }

            //validate that timezone entered is valid
            if (!this.isValidTimezone()) {
                this.ns.showError("Invalid timezone selected. Please make sure you select any of the timezones suggested in the Auto-Complete dropdown");
                return false;
            }

            this.locRequest.resumption = this.dateUtil.getTimeStamp(this.resumptionTime);
            //check if closing time is selected
            if (this.clockoutTime) {
                //check if closing time is less than resumption time
                if (this.clockoutTime.getTime() < this.resumptionTime.getTime()) {
                    this.ns.showError("Closing time should be greater than resumption time");
                    return false;
                }

                this.locRequest.clockOutTime = this.dateUtil.getTimeStamp(this.clockoutTime);
            } else {
                this.locRequest.clockOutTime = null;
            }

        } else {
            this.locRequest.resumption = null;
            this.locRequest.clockOutTime = null;
            return true;
        }

        if (this.locRequest.gracePeriodInMinutes) {
            let diff = this.dateUtil.getTimeStamp(this.clockoutTime) - this.dateUtil.getTimeStamp(this.resumptionTime);

            if (diff < this.dateUtil.convertMinutesToMS(this.locRequest.gracePeriodInMinutes)) {
                this.ns.showError("Your grace period should be less than " + (Math.round((diff/1000)/60) + 1) + " minute(s)");
                return false;
            }
        }

        return true;
    }

    isValidTimezone(): boolean {
        let filter: any[] = this.timezones.filter((obj) => obj.zoneId.toLowerCase() == (this.locRequest.resumptionTimezoneId.toLowerCase()));

        if (filter.length == 0) {
            return false;
        }

        return true;
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
                    if (type == 'INVITE') {
                        this.inviteEmails.push(a.trim())
                    } else {
                        this.confirmees.push(a.trim());
                        this.inviteEmails.push(a.trim());
                    }
                }
            }
        } else {
            // Add email
            if ((value || '').trim()) {
                if (type == 'INVITE') {
                    this.inviteEmails.push(value.trim())
                } else {
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

    clearTime(type: string) {

        if(type == 'resumption') {
            this.resumptionTime = void 0;
        } else {
            this.clockoutTime = void 0;
        }
    }

    invite() {
        this.loading = true;
        this.configService.inviteAttendees(this.inviteRequest)
            .pipe(
            finalize(() => {this.loading = false;}))
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.inviteRequest = new InviteRequest();
                        this.step +=1;
                    } else {
                        this.ns.showError(result.description);
                    }
                },
                error => {
                    if(error.name == "TimeoutError") {
                        this.inviteRequest = new InviteRequest();
                        this.step +=1;
                    }else {
                    this.ns.showError("An Error Occurred.");
                    }
                }
            )
    }

    sendSupportEmail() {

        if(!this.helpOption) {
            this.ns.showError("Please select an option");
            return;
        }

        if(this.helpOption == 'CANT_GET_LOCATION') {
            this.supportRequest.issue = "I can't get my location on the map";
        }

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

    setOnBoardingObj() {
        let obj = {};

        obj['locRequest'] = this.locRequest;
        obj['lat'] = this.lat;
        obj['lng'] = this.lng;
        obj['resumptionTime'] = this.resumptionTime;
        obj['clockoutTime'] = this.clockoutTime;
        obj['inviteEmails'] = this.inviteEmails;

        this.ss.setOnBoardingObj(obj);
    }

    getOnBoardingObj(obj: any) {
        this.locRequest = obj.locRequest;
        this.lat = obj.lat;
        this.lng = obj.lng;
        this.resumptionTime = this.locRequest.resumption? new Date(this.locRequest.resumption): null;
        this.clockoutTime = this.locRequest.clockOutTime? new Date(this.locRequest.clockOutTime): null;
        this.inviteEmails = obj.inviteEmails;
    }

}
