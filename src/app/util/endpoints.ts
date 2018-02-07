import { environment } from '../../environments/environment';

export class Endpoints {
  public static BASE_URL = `${environment.baseUrl}/br`;
  public static LOGIN = `${Endpoints.BASE_URL}/access/api/login/bcta`;
  public static REGISTER = `${Endpoints.BASE_URL}/users/api/u/sign-up/bcta`;
  public static FORGOT_PASSWORD = `${Endpoints.BASE_URL}/signup`;
}
