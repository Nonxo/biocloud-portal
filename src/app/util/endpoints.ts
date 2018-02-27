import { environment } from '../../environments/environment';

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
  public static DEACTIVATE_ACTIVATE_LOCATION = `${Endpoints.BASE_URL}/users/api/locations/`;
  public static FETCH_NOTIFICATION = `${Endpoints.BASE_URL}/users/api/org/invites?`;
  public static FETCH_NOTIFICATION_DETAILS= `${Endpoints.BASE_URL}/users/org/invites?`;
}
