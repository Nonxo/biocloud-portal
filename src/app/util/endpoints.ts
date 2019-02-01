import {environment} from '../../environments/environment';

export class Endpoints {
    public static BASE_URL = `${environment.baseUrl}/bc`;
    public static LOGIN = `${Endpoints.BASE_URL}/access/api/login`;
    public static REGISTER = `${Endpoints.BASE_URL}/users/api/u`;
    public static FORGOT_PASSWORD = `${Endpoints.BASE_URL}/users/api/u/password`;
    public static VERIFY_CAPTCHA = `${Endpoints.BASE_URL}/users/api/u/captcha`;
    public static CREATE_ORG = `${Endpoints.BASE_URL}/users/api/org`;
    public static RETRIEVE_ORG_DETAILS = `${Endpoints.BASE_URL}/users/api/org/`;
    public static FETCH_USERS_ORG = `${Endpoints.BASE_URL}/users/api/u/`;
    public static FETCH_ORG_LOCATIONS = `${Endpoints.BASE_URL}/users/api/locations?`;
    public static FETCH_COUNTRIES = `${Endpoints.BASE_URL}/users/api/countries`;
    public static FETCH_STATES = `${Endpoints.BASE_URL}/users/api/countries/`;
    public static SAVE_LOCATION = `${Endpoints.BASE_URL}/users/api/locations`;
    public static SEND_INVITES = `${Endpoints.BASE_URL}/users/api/org/invites`;
    public static EDIT_LOCATION = `${Endpoints.BASE_URL}/users/api/locations/`;
    public static DOWNLOAD_TEMPLATE_BULK = `${Endpoints.BASE_URL}/users/api/org/invites/bulk/download?`;
    public static UPLOAD_TEMPLATE_BULK = `${Endpoints.BASE_URL}/users/api/org/invites/bulk/upload`;
    public static FETCH_USERS = `${Endpoints.BASE_URL}/users/api/locations/`;
    public static FETCH_USERS_IN_AN_ORG = `${Endpoints.BASE_URL}/users/api/org/`;
    public static FETCH_TIMEZONES = `${Endpoints.BASE_URL}/users/api/locations/get-timezones`;
    public static FETCH_ATTENDEES = `${Endpoints.BASE_URL}/users/api/attendees?`;
    public static FETCH_COUNT_ATTENDEES = `${Endpoints.BASE_URL}/users/api/attendees/count?`;
    public static ASSIGN_USERS = `${Endpoints.BASE_URL}/users/api/attendees`;
    public static DEACTIVATE_ACTIVATE_LOCATION = `${Endpoints.BASE_URL}/users/api/locations/`;
    public static FETCH_NOTIFICATION = `${Endpoints.BASE_URL}/users/api/notifications/admin/fetch?`;
    public static FETCH_NOTIFICATION_DETAILS = `${Endpoints.BASE_URL}/users/api/org/invites/`;
    public static APPROVE_REJECT_NOTIFICATION = `${Endpoints.BASE_URL}/users/api/org/invites/`;
    public static APPROVE_ADMIN_NOTIFICATION = `${Endpoints.BASE_URL}/users/api/org/invites/web/`;
    public static ACTIVATE_DEACTIVATE_ATTENDEE = `${Endpoints.BASE_URL}/users/api/attendees/status`;
    public static CHANGE_PASSWORD = `${Endpoints.BASE_URL}/users/api/u/password/change`;
    public static FETCH_PENDING_ATTENDEES = `${Endpoints.BASE_URL}/users/api/attendees/pending?`;
    public static ASSIGN_ADMINS_LOCATIONS = `${Endpoints.BASE_URL}/users/api/locations/admins`;
    public static EDIT_USER_PROFILE = `${Endpoints.BASE_URL}/users/api/u/`;
    public static REMOVE_ADMIN = `${Endpoints.BASE_URL}/users/api/locations/admins/remove`;
    public static FETCH_CLOCKINS_HISTORY = `${Endpoints.BASE_URL}/attendance/api/clock-in/history?`;
    public static FETCH_CLOCKINS_COUNT = `${Endpoints.BASE_URL}/attendance/api/clock-in/history/count?`;
    public static FETCH_USERS_LOCATION = `${Endpoints.BASE_URL}/users/api/u/`;
    public static FETCH_DAILY_REPORT = `${Endpoints.BASE_URL}/reports/api/alog/gen?`;
    public static FETCH_TOTAL_EMPLOYEE_COUNT = `${Endpoints.BASE_URL}/users/api/u`;
    public static FETCH_WORK_STATUS = `${Endpoints.BASE_URL}/users/api/u/`;
    public static FETCH_PUNCTUALITY_SCORE = `${Endpoints.BASE_URL}/attendance/api/clock-in/punctuality-score?`;
    public static FETCH_INVITED_USERS = `${Endpoints.BASE_URL}/users/api/org/invites?`;
    public static FETCH_INVITED_USERS_COUNT = `${Endpoints.BASE_URL}/users/api/org/invites/count?`;
    public static REASSIGN_LOC_USERS = `${Endpoints.BASE_URL}/users/api/attendees/location/`;
    public static FETCH_ATTENDEES_LOCATION = `${Endpoints.BASE_URL}/users/api/attendees/`;
    public static FETCH_COMPANY_TYPE = `${Endpoints.BASE_URL}/users/api/org/orgType`;
    public static FETCH_USER_DAILY_REPORT = `${Endpoints.BASE_URL}/reports/api/alog/user?`;
    public static ACCEPT_GDPR_COMPLIANCE = `${Endpoints.BASE_URL}/users/api/u/gdpr-compliance/accept`;
    public static FETCH_SUBSCRIPTION_PLANS = `${Endpoints.BASE_URL}/users/api/subscriptions/plans`;
    public static FETCH_ALL_EXCHANGE_RATE = `${Endpoints.BASE_URL}/users/api/subscriptions/rates/all`;
    public static FETCH_SPECIFIC_EXCHANGE_RATE = `${Endpoints.BASE_URL}/users/api/subscriptions/rate?`;
    public static GEENERATE_TRANSACTION_REF = `${Endpoints.BASE_URL}/users/api/subscriptions/gtr`;
    public static VERIFY_PAYMENT = `${Endpoints.BASE_URL}/users/api/subscriptions/payment/verify`;
    public static FETCH_SUBSCRIPTION = `${Endpoints.BASE_URL}/users/api/subscriptions/org`;
    public static DELETE_CARD = `${Endpoints.BASE_URL}/users/api/subscriptions/card/delete?`;
    public static FETCH_CARD = `${Endpoints.BASE_URL}/users/api/subscriptions/card?`;
    public static CHANGE_PLAN = `${Endpoints.BASE_URL}/users/api/subscriptions/change-plan`;
    public static GET_ATTENDANCE_STATUS = `${Endpoints.BASE_URL}/reports/api/alog/attendance-status`;
    public static GET_DAYS_PRESENT = `${Endpoints.BASE_URL}/reports/api/alog/total-days-present?`;
    public static GET_AVG_TIME = `${Endpoints.BASE_URL}/reports/api/alog/total-avg-time?`;
    public static GENERATE_METABASE_TOKEN = `${Endpoints.BASE_URL}/reports/api/alog/generate-metabase-token?`;
    public static GET_PRORATED_COST = `${Endpoints.BASE_URL}/users/api/subscriptions/get-prorated-cost?`;
    public static FETCH_EMPLOYEE_RANGE = `${Endpoints.BASE_URL}/users/api/org/get-employee-range`;
    public static DOWNLOAD_QUICK_REORT = `${Endpoints.BASE_URL}/reports/api/alog/generate-quick-report?`;
    public static SET_AUTO_RENEW = `${Endpoints.BASE_URL}/users/api/subscriptions/set-auto-renew`;
    public static GET_AB_TEST_STATUS = `${Endpoints.BASE_URL}/access/api/abtest/get-status`;
    public static VERIFY_SOCIAL_MEDIA_SIGN_IN = `${Endpoints.BASE_URL}/users/api/social/login`;
    public static APPROVE_COORDINATES = `${Endpoints.BASE_URL}/users/api/locations/approve`;
    public static VERIFY_EMAIL = `${Endpoints.BASE_URL}/users/api/verify/`;
    public static VERIFY_USER_TOKEN = `${Endpoints.BASE_URL}/users/api/verify?`;
    public static GET_COUPON_DISCOUNT = `${Endpoints.BASE_URL}/users/api/subscriptions/verify-coupon`;
    public static DELETE_LOCATION = `${Endpoints.BASE_URL}/users/api/locations/delete/`;
    public static SEND_SUPPORT_EMAIL = `${Endpoints.BASE_URL}/users/api/u/getHelp`;
}
