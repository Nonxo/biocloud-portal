/**
 * Created by Kingsley Ezeokeke on 2/13/2018.
 */

export class CreateOrgRequest {
    name:string;
    type:string;
    createdBy:string;
}

export class Org {
    active:boolean;
    created:number;
    createdBy:string;
    lastModified:number;
    logo:string;
    name:string;
    orgCode:string;
    orgId:string;
    productName:string;
    sector:string;
    walletId:number;
}

export class AssignUserRequest {
    oldlocId:string;
    newlocId:string;
    emails:string[];
    role:string;

    constructor() {
        this.emails = [];
        this.role = "ATTENDEE";
    }
}

export class Invitation {
  firstName:string;
  lastName:string;
  email:string;
  phoneNumber:number;
  created:number;
}
