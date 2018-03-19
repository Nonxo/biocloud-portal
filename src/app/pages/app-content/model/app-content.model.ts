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

    constructor() {
        this.emails = [];
    }
}

export class Invitation {
  firstName:string;
  lastName:string;
  email:string;
  phoneNumber:number;
  created:number;
  locId:string;
  img:string;
}

export class ApproveRequest {
  status: string;
  locIds: string[];

    constructor(status?:string) {
        this.status = status || null;
        this.locIds = [];
    }
}

export class ActivateDeactivateUserRequest {
    emails:string[];
    orgId:string;
    status:boolean;
    locId:string;

    constructor() {
        this.emails = [];
    }
}

export class UpdateProfile {
  fName:string;
  lName:string;
  email:string;
  img:string;
  phone:number;
  address:string;
  companyName:string;
  customerType: string;


  promoNotif: boolean;
  appNotif: boolean;

}







export class AdminRemovalRequest {
    userIds:string[];
    orgId:string;

    constructor() {
        this.userIds = [];
    }
}





