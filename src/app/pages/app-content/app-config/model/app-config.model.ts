/**
 * Created by Kingsley Ezeokeke on 2/13/2018.
 */

export class LocationRequest {
    locId:string;
    longitude:number;
    latitude:number;
    radiusThreshold:number;
    locationType:string;
    name:string;
    countryId:number;
    stateId:number;
    address:string;
    gracePeriodInMinutes:number;
    resumption:number;
    resumptionTimezoneId:string;
    orgId:string;
    createdBy:string;
}

export class InviteRequest {
    orgId:string;
    email:string;
    role:string;
    locIds:string[];

    constructor() {
        this.locIds = [];
    }
}

export class TimezonePOJO {
    zoneId:string;
    offset:string;
}