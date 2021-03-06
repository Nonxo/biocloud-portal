/**
 * Created by Kingsley Ezeokeke on 2/13/2018.
 */

export class CreateOrgRequest {
    name:string;
    type:string;
    createdBy:string;
    employeeRange:any;
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
    orgType:string;
    walletId:number;
    employeeRange:any;
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
    phoneCode:string;
    phone:number;
    address:string;
    companyName:string;
    customerType: string;
    bio:string;
    userId:string;
    verifiableImg:string;


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
    startDate:number;
    endDate:number;
    param: string;
    companyName: string;
    locationName: string;

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
        this.startDate = null;
        this.endDate = null;
        this.param = "";
        this.companyName = "";
        this.locationName = "";
    }
}

export class AttendeesPOJO {
    orgId:string;
    locId:string;
    active:boolean;
    pageSize:number;
    pageNo:number;
    param:string;

    constructor() {
        this.active = true;
        this.pageSize = 10;
        this.pageNo = 1;
        this.param = "";
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

export class SubscriptionPlan {

    name:string;
    planId:string;
    description:string;
    pricePerMonth:number;
    pricePerAnnum:number;
    priceperDay:number;
    discount:number;
    enabled:boolean;
    maxAttendeeThreshold:number;
    autoRenew:boolean;
    planFeatures: string[];
    vat: number;

}

export class VerifyPaymentRequest {
    billingCycle:string;
    txRef:string;
    autoRenewal:boolean;
    orgId:string;
    conversionRate:number;
    transactionMode:string;
    vatAmount: number;
    couponCode: string;
    couponAmount: number;

    constructor(txRef:string, billingCycle:string, autoRenewal:boolean, orgId:string, conversionRate:number, transactionMode:string, vatAmount: number, code: string, couponAmount: number) {
        this.billingCycle = billingCycle;
        this.txRef = txRef;
        this.autoRenewal = autoRenewal;
        this.orgId = orgId;
        this.conversionRate = conversionRate;
        this.transactionMode = transactionMode;
        this.vatAmount = vatAmount;
        this.couponCode = code;
        this.couponAmount = couponAmount;
    }
}

export class SubscriptionChangeRequest {
    billingCycle:string;
    orgId: string;
    planId: string;
    currency: string;
    amount: number;
    vat: number;
    couponCode: string;
    couponAmount: number;

    constructor(billingCycle: string, orgId: string, planId: string, currency: string, amount: number, vat: number, code: string, couponAmount: number) {
        this.billingCycle = billingCycle;
        this.orgId = orgId;
        this.planId = planId;
        this.currency = currency;
        this.amount = amount;
        this.vat = vat;
        this.couponCode = code;
        this.couponAmount = couponAmount;
    }
}

export class DateColumn {
    id: number;
    title: string;
    startTime: number;
    endTime: number;
    status: string;

    constructor (id: number, title: string, startTime?: number, endTime?: number, status?: string) {
        this.id = id;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }
}

export class AttendanceStatusRequest {
    id: number;
    email: string;
    startTime: number;
    endTime: number;
    locId: string;
    orgId: string;

    constructor(id: number, email: string, startTime: number, endTime: number, locId: string, orgId: string) {
        this.id = id;
        this.email = email;
        this.startTime = startTime;
        this.endTime = endTime;
        this.locId = locId;
        this.orgId = orgId;
    }
}

export class DaysPresentRequest {
    id: number;
    weekId: number;
    email: string;
    currentStartTime: number;
    currentEndTime: number;
    locId: string;
    orgId: string;
    prevStartTime: number;
    prevEndTime: number;

    constructor() {
        this.id = 0;
        this.weekId = 0;
    }
}

export class ApproveCoordinate {
    latitude: number;
    longitude: number;
    radius: number;
    status: string;
    refId: string;
    locId: string;
    address: string;

    constructor(lat: number, lng: number, rad: number, status: string, refId: string, locId: string, address: string) {
        this.latitude = lat;
        this.longitude  = lng;
        this.radius = rad;
        this.status = status;
        this.refId = refId;
        this.locId = locId;
        this.address = address;
    }
}

export class Subscription {
    constructor(
        public activatedBy: string,
        public active: boolean,
        public amountPaid: number,
        public authToken: any,
        public autoRenew: boolean,
        public billingCycle: string,
        public couponAmount: number,
        public couponCode: string,
        public created: number,
        public currency: string,
        public endDate: number,
        public id: any,
        public lastModified: number,
        public orderRequestId: any,
        public orgId: string,
        public paymentMode: string,
        public subscriptionMode: string,
        public subscriptionPlanId: string,
        public subscriptionStatus: string,
        public totalAmount: number,
        public vat: number
    ) { }
}

export class Location {
    constructor(
        public active: boolean,
        public address: any,
        public clockOutTime: number,
        public confirmees: any,
        public country: any,
        public countryId: any,
        public created: number,
        public createdBy: string,
        public deleted: boolean,
        public gracePeriodInMinutes: number,
        public inviteEmails: any,
        public latitude: number,
        public locId: string,
        public locationType: string,
        public longitude: number,
        public name: string,
        public noOfAttendees: number,
        public noOfClockInForToday: number,
        public noOfPendingAttendees: number,
        public orgId: string,
        public radiusThreshold: number,
        public resumption: number,
        public resumptionTimezoneId: string,
        public state: any,
        public stateId: any,
        public verificationThreshold: number,
        public verifyLocation: boolean
    ) { }
}


