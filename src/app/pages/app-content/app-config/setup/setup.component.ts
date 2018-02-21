import {Component, OnInit, TemplateRef, NgZone} from '@angular/core';
import {LocationRequest, Timezones} from "../model/app-config.model";
import {AppConfigService} from "../services/app-config.service";
import {BsModalService, BsModalRef, ModalOptions} from "ngx-bootstrap/index";
import {MapsAPILoader} from "@agm/core";
import {} from '@types/googlemaps';
import {GeoMapService} from "../../../../service/geo-map.service";
import {NotifyService} from "../../../../service/notify.service";
import {Router} from "@angular/router";

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
    addRange:boolean;
    resumption:string;
    timezones:string[] = Timezones.list;
    addNewLoc:boolean;
    locationTypes = [
        {value: "SPECIFIC_ADDRESS", name: "Specific Address"},
        {value: "COUNTRY", name: "Country"},
        {value: "STATE", name: "State"},
    ]

    constructor(private aService:AppConfigService,
                private modalService:BsModalService,
                private loader:MapsAPILoader,
                private ngZone:NgZone,
                private mapService:GeoMapService,
                private ns:NotifyService,
                private router:Router,
                public modalRef:BsModalRef) {
    }

    ngOnInit() {
        this.fetchCountries();
        this.loader.load().then(() => {
        });
    }

    openModal(template:TemplateRef<any>, addRange) {
        !this.locRequest.address ? this.getCurrentPosition(false) : '';
        this.addRange = addRange;
        this.modalOptions.class = 'modal-lg mt-0';
        this.modalRef = this.modalService.show(template, this.modalOptions);

        if (!addRange) {
            setTimeout(()=> {
                this.autocomplete();
            }, 2000);
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
        this.locRequest.countryId = 0;
        this.locRequest.stateId = 0;
        this.locRequest.radiusThreshold = 0;
        this.locRequest.address = null;
    }

    addnewLocation() {
        this.addNewLoc = true;
        this.submit();
    }

    submit() {
        if (this.resumption) {
            this.locRequest.resumption = this.formatResumptionTime();
        } else {
            this.locRequest.resumption = null;
        }

        if (this.locRequest.locationType == 'SPECIFIC_ADDRESS') {
            this.locRequest.latitude = this.lat;
            this.locRequest.longitude = this.lng;
        }

        this.editMode ? this.editLocation() : this.saveLocation();
    }

    editLocation() {
        this.aService.editLocation(this.locRequest)
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess("Location was successfully updated");
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
        //noinspection TypeScriptValidateTypes
        this.aService.saveLocation(this.locRequest)
            .finally(() => {
                this.addNewLoc = false;
            })
            .subscribe(
                result => {
                    if (result.code == 0) {
                        this.ns.showSuccess("Location was successfully added");

                        if (this.addNewLoc) {
                            this.locRequest = new LocationRequest();
                        } else {
                            this.router.navigate(['/portal/config/add-attendees']);
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
        return new Date(this.resumption).getTime();
    }


    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    autocomplete() {
        //noinspection TypeScriptUnresolvedVariable
        let autocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById('autocompleteInput'), {});

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
    }

    mapClicked($event:any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
    }

    useAddress() {
        !this.addRange ? this.getSearchAddress(this.lat, this.lng) : '';
        this.modalRef.hide();
    }


}
