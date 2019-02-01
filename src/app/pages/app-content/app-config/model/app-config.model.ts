/**
 * Created by Kingsley Ezeokeke on 2/13/2018.
 */

export class LocationRequest {
    id:string;
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
    verifyLocation: boolean;
    verificationThreshold: number;
    confirmees: string[];

    constructor() {
        this.verifyLocation = false;
        this.inviteEmails = [];
        this.confirmees = [];
        this.radiusThreshold = 32;
        this.locationType = '';
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
