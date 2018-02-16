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
    resumption:string;
    resumptionTimezoneId:string;
    orgId:string;
    createdBy:string;
}

export class Timezones {
    public static list = ["UTC+01", "UTC+02", "UTC+03", "UTC+03:30", "UTC+04", "UTC+04:30", "UTC+05", "UTC+05:30", "UTC+05:45", "UTC+06", "UTC+06:30", "UTC+07", "UTC+08", "UTC+08:45", "UTC+09", "UTC+09:30", "UTC+10", "UTC+10:30", "UTC+11", "UTC+12", "UTC+12:45", "UTC+13", "UTC+13:45", "UTC+14", "UTC±00", "UTC-01", "UTC-02", "UTC-02:30", "UTC-03", "UTC-03:30", "UTC-04", "UTC-05", "UTC-06", "UTC-07", "UTC-08", "UTC-09", "UTC-09:30", "UTC-10", "UTC-11", "UTC-12"];
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