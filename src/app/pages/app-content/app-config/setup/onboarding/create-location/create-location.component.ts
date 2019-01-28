import {Component, NgZone, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LocationRequest, TimezonePOJO} from "../../../model/app-config.model";
import {AppConfigService} from "../../../services/app-config.service";
import {NotifyService} from "../../../../../../service/notify.service";
import {StorageService} from "../../../../../../service/storage.service";
import {MapsAPILoader} from "@agm/core";
import {GeoMapService} from "../../../../../../service/geo-map.service";

@Component({
    selector: 'app-create-location',
    templateUrl: './create-location.component.html',
    styleUrls: ['./create-location.component.css']
})
export class CreateLocationComponent implements OnInit {

    modalRef: BsModalRef;

    step: number = 2;
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

    constructor(private modalService: BsModalService,
                private aService: AppConfigService,
                private ns: NotifyService,
                private ss: StorageService,
                private loader: MapsAPILoader,
                private ngZone: NgZone,
                private mapService: GeoMapService,) {
        this.username = this.ss.getUserName();
    }
//TODO add check to ensure grace period doesnt exceed the difference between resumption time and closing time
    ngOnInit() {

        this.fetchTimezones();

        //noinspection TypeScriptUnresolvedFunction
        this.loader.load().then(() => {
        });
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
            // this.fetchCountries();
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
        this.locRequest.createdBy = this.ss.getLoggedInUserEmail();

        // noinspection TypeScriptValidateTypes,TypeScriptUnresolvedFunction
        this.aService.saveLocation(this.locRequest)
            .finally(() => {
                this.loading = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {

                        this.locRequest = result.loc;

                        this.step = 2;
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
        this.aService.editLocation(this.locRequest)
            .finally(() => {
                this.loading = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
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

    validateLocName() {
    }

    nextStep() {
        switch (this.step) {
            case 1: {
                this.locRequest.locId ? this.editLocation() : this.saveLocation();
                break;
            }

            case 2: {
                !this.locRequest.locationType ? this.locRequest.locationType = 'SPECIFIC_ADDRESS' : '';
                this.step = 3;
                break;
            }

            case 3: {
                this.step = 4;
                break;
            }

            case 4: {
                this.step = 5;
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
                !this.locRequest.locationType ? this.locRequest.locationType = 'SPECIFIC_ADDRESS' : '';
                this.step = 1;
                break;
            }

            case 3: {
                this.step = 2;
                break;
            }

            case 4: {
                this.step = 3;
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

}
