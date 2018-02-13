import { environment } from '../../environments/environment';

export class Endpoints {
  public static BASE_URL = `${environment.baseUrl}/bc`;
  public static LOGIN = `${Endpoints.BASE_URL}/access/api/login`;
  public static REGISTER = `${Endpoints.BASE_URL}/users/api/u`;
  public static FORGOT_PASSWORD = `${Endpoints.BASE_URL}/users/api/u/password`;
  public static VERIFY_CAPTCHA = `${Endpoints.BASE_URL}/users/api/u/captcha`;
}
