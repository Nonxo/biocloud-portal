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
    clockOutTime:number;
    resumptionTimezoneId:string;
    orgId:string;
    createdBy:string;
    inviteEmails:string[];

    constructor() {
        this.inviteEmails = [];
        this.radiusThreshold = 32;
        this.locationType = 'SPECIFIC_ADDRESS';
    }
}

export class InviteRequest {
    orgId:string;
    emails:string[];
    role:string;
    locIds:string[];

    constructor() {
        this.emails = [];
        this.locIds = [];
    }
}

export class AssignAdminRequest {
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
