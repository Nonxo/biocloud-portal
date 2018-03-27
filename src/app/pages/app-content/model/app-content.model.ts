/**
 * Created by Kingsley Ezeokeke on 2/13/2018.
 */

export class CreateOrgRequest {
    name:string;
    type:string;
    createdBy:string;
    logo:string;
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
        this.newlocId = "";
        this.oldlocId = "";
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
  verifiableImg:string;
  orgName:string;
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
  bio:string;
  userId:string;


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

export class ReportModel {
    orgId:string;
    locId:string;
    export:boolean;
    exportFormat:string;
    reportType:string;
    pageSize:number;
    pageNo:number;
    title:string;
    user:string;

    constructor() {
        this.orgId = "";
        this.locId = "";
        this.export = false;
        this.exportFormat = "";
        this.reportType = "";
        this.pageSize = 0;
        this.pageNo = 1;
        this.title = "";
        this.user = "";
    }
}

export class AttendeesPOJO {
    orgId:string;
    locId:string;
    active:boolean;
    pageSize:number;
    pageNo:number;

    constructor() {
        this.active = true;
        this.pageSize = 10;
        this.pageNo = 1;
    }

}

export class HistoryPojo {
    email:string;
    late:string;
    locId:string;
    orgId:string;
    startDate:string;
    endDate:string;
    pageNo:number;
    pageSize:number;

    constructor() {
        this.late = "";
        this.locId = "";
        this.orgId = "";
        this.startDate = "";
        this.endDate = "";
        this.pageNo = 1;
        this.pageSize = 10;
    }
}

export class UserPaginationPojo {
    orgId:string;
    pageSize:number;
    pageNo:number;

    constructor() {
        this.pageSize = 10;
        this.pageNo = 1;
    }
}





