import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {} from '@types/googlemaps';
/**
 * Created by Kingsley Ezeokeke on 2/14/2018.
 */

const GEOLOCATION_ERRORS = {
    'errors.location.unsupportedBrowser': 'Browser does not support location services. Please use another browser.',
    'errors.location.permissionDenied': 'You have rejected access to your location. Please turn on your location from your browser settings to proceed.',
    'errors.location.positionUnavailable': 'Unable to determine your location. Please turn on your location from your browser settings to proceed.',
    'errors.location.timeout': 'Service timeout has been reached. Please turn on your location from your browser settings to proceed.'
};


@Injectable()
export class GeoMapService {

    /**
     * returns the address of a geo location
     * @returns {Observable}
     */
    getAddress(lat:number, lng:number) {
        //noinspection TypeScriptUnresolvedVariable
        let geocoder = new google.maps.Geocoder();
        var latlng = {lat: lat, lng: lng};

        return Observable.create(observer => {
            geocoder.geocode( { 'location': latlng}, function(results, status) {
                //noinspection TypeScriptUnresolvedVariable
                if (status == google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].formatted_address);
                    observer.complete();
                } else {
                    // console.log('Error - ', results, ' & Status - ', status);
                    observer.next({});
                    observer.complete();
                }
            });
        })
    }

    /**
     * returns the coordinates of a geo address
     * @returns {Observable}
     */
    getCoordinates(address: string) {
        //noinspection TypeScriptUnresolvedVariable
        let geocoder = new google.maps.Geocoder();

        return Observable.create(observer => {
            geocoder.geocode( { 'address': address}, function(results, status) {
                //noinspection TypeScriptUnresolvedVariable
                if (status == google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    // console.log('Error - ', results, ' & Status - ', status);
                    observer.next({});
                    observer.complete();
                }
            });
        })
    }

    /**
     * get current location of a user
     * @param opts
     * @returns {Observable}
     */
    public getLocation(opts?): Observable<any> {
        return Observable.create(observer => {

            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log(position.coords.accuracy);
                        observer.next(position);
                        observer.complete();
                    },
                    (error) => {
                        switch (error.code) {
                            case 1:
                                observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                                break;
                            case 2:
                                observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                                break;
                            case 3:
                                observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                                break;
                        }
                    },
                    opts);
            }
            else {
                observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
            }

        });
    }

}
