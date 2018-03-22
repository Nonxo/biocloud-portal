import {Component, OnInit, TemplateRef, NgZone} from '@angular/core';
import {LocationRequest, TimezonePOJO} from "../model/app-config.model";
import {AppConfigService} from "../services/app-config.service";
import {BsModalService, BsModalRef, ModalOptions} from "ngx-bootstrap/index";
import {MapsAPILoader} from "@agm/core";
import {} from '@types/googlemaps';
import {GeoMapService} from "../../../../service/geo-map.service";
import {NotifyService} from "../../../../service/notify.service";
import {Router} from "@angular/router";
import {StorageService} from "../../../../service/storage.service";
import {DateUtil} from "../../../../util/DateUtil";
import {MessageService} from "../../../../service/message.service";
import {ENTER, COMMA} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

    locRequest:LocationRequest = new LocationRequest();
    editMode:boolean;
    countries:any[] = [];
    states:any[] = [];
    modalOptions:ModalOptions = new ModalOptions();
    lat:number = 9.0820;
    lng:number = 8.6753;
    zoomSize:number = 15;
    draggable:boolean = true;
    showMap:boolean;
    addRange:boolean;
    resumption:string;
    countryCode:string;
    timezones:TimezonePOJO[] = [];
    addNewLoc:boolean;
    inviteEmails:string[] = [];
    separatorKeysCodes = [ENTER, COMMA];
    locationTypes = [
        {value: "COUNTRY", name: "Country"},
        {value: "STATE", name: "State"},
        {value: "SPECIFIC_ADDRESS", name: "Specific Address"}
    ]

    constructor(private aService:AppConfigService,
                private modalService:BsModalService,
                private loader:MapsAPILoader,
                private ngZone:NgZone,
                private mapService:GeoMapService,
                private ns:NotifyService,
                private router:Router,
                public modalRef:BsModalRef,
                private ss:StorageService,
                private dateUtil:DateUtil,
                private mService:MessageService,
                private translate:TranslateService) {
        translate.setDefaultLang('en/add-location');
        translate.use('en/add-location');
    }

    ngOnInit() {

        if (this.editMode) {
            this.setEditMode();
        } else {
            this.fetchCountries();
        }

        this.fetchTimezones();

        //noinspection TypeScriptUnresolvedFunction
        this.loader.load().then(() => {
        });
    }

    setEditMode() {
        if (this.locRequest.resumption) {
            this.resumption = this.renderResumptionTime(this.locRequest.resumption);
        }

        if (this.locRequest.locationType == 'COUNTRY') {
            this.fetchCountries();
        }

        if (this.locRequest.locationType == 'STATE') {
            this.fetchCountries();
            this.fetchStates(this.locRequest.countryId);
        }
    }

    openModal(template:TemplateRef<any>, addRange) {
        !this.locRequest.address ? this.getCurrentPosition(false) : '';
        this.addRange = addRange;

        this.customSettings();

        this.modalOptions.class = 'modal-lg mt-0';
        this.modalRef = this.modalService.show(template, this.modalOptions);

    }

    setMapRestriction() {
        setTimeout(()=> {
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

    fetchStates(id:number) {
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

        if (this.locRequest.locationType == 'COUNTRY' || this.locRequest.locationType == 'STATE') {
            this.fetchCountries();
        }
    }

    addnewLocation() {
        this.addNewLoc = true;
        this.submit();
    }

    submit() {
        if (this.resumption) {
            if (!this.locRequest.resumptionTimezoneId) {
                this.ns.showError("You must select a timezone.");
                return;
            }
            this.locRequest.resumption = this.formatResumptionTime();
        } else {
            this.locRequest.resumption = null;
        }

        if (!this.isFormValid()) {
            return;
        }

        this.editMode ? this.editLocation() : this.saveLocation();
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
            if (!this.validateEmails()) {
                return false
            }
        }

        return true;
    }

    validateEmails():boolean {
        let regex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

        for (let a of this.inviteEmails) {
            if (a) {
                let res = regex.test(a);
                if (!res) {
                    this.ns.showError("Incorrect Email format detected: " + a);
                    return false;
                }
            }
        }

        this.locRequest.inviteEmails = this.inviteEmails;
        return true;
    }

    editLocation() {
        this.aService.editLocation(this.locRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess("Location was successfully updated");
                        this.mService.setEditLocation(true);
                        this.modalRef.hide();
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
        //noinspection TypeScriptValidateTypes,TypeScriptUnresolvedFunction
        this.aService.saveLocation(this.locRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess("Location was successfully added");

                        if (this.addNewLoc) {
                            this.locRequest = new LocationRequest();
                            this.inviteEmails = [];
                            this.showMap = false;
                            this.resumption = "";
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

    formatResumptionTime() {
        return this.dateUtil.getTime(this.resumption);
    }

    autocomplete() {
        let country = this.countryCode? this.countryCode:"";

        //noinspection TypeScriptUnresolvedVariable
        let autocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById('autocompleteInput'), {});

        if (country != "") {
            autocomplete.setComponentRestrictions(
                {'country': country});
        } else {
            autocomplete.setComponentRestrictions(
                {'country': []});
        }

        autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                //get the place result
                //noinspection TypeScriptUnresolvedVariable
                let place:google.maps.places.PlaceResult = autocomplete.getPlace();


                //noinspection TypeScriptUnresolvedVariable
                if (place.geometry === undefined || place.geometry === null) {
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


    getSearchAddress(lat:number, lng:number) {
        this.mapService.getAddress(lat, lng)
            .subscribe(
                result => {
                    // needs to run inside zone to update the map
                    this.ngZone.run(() => {
                        this.locRequest.address = result;
                        document.getElementById("autocompleteInput").value = result;
                    });
                },
                error => console.log(error),
                () => console.log('Geocoding completed!')
            );
    }

    getCurrentPosition(withAddress:boolean) {
        this.mapService.getLocation().subscribe((result) => {
                this.lat = result.coords.latitude;
                this.lng = result.coords.longitude;

                withAddress ? this.getSearchAddress(result.coords.latitude, result.coords.longitude) : '';
            },
            (e) => {
                this.ns.showError(e)
            })
    }

    markerDragEnd($event:any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.getSearchAddress(this.lat, this.lng);
    }

    mapClicked($event:any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.getSearchAddress(this.lat, this.lng);
    }

    useAddress() {
        this.getSearchAddress(this.lat, this.lng);
        this.modalRef.hide();
    }

    renderResumptionTime(resumptionTime:number) {
        let date = new Date(resumptionTime);
        return this.dateUtil.addZero(date.getHours()) + ":" + this.dateUtil.addZero(date.getMinutes());
    }

    show() {
        this.showMap = true;
        this.setMapRestriction();
    }

    zoomInMap() {
        this.zoomSize = 20;
    }

    addEmails(event:MatChipInputEvent) {
        let input = event.input;
        let value = event.value;

        let arr = value.split(" ");

        if(arr.length > 0) {
            for(let a of arr) {
                // Add email
                if ((a || '').trim()) {
                    this.inviteEmails.push(a.trim());
                }
            }
        }else {
            // Add email
            if ((value || '').trim()) {
                this.inviteEmails.push(value.trim());
            }
        }



        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeEmail(email:any):void {
        let index = this.inviteEmails.indexOf(email);

        if (index >= 0) {
            this.inviteEmails.splice(index, 1);
        }
    }

    cancel() {
        this.editMode? this.modalRef.hide(): this.router.navigate(['/portal']);
    }

}
