import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieManagerService {
  constructor(private cookieService: CookieService) {}

  getCookie(cname: string): string {
    return this.cookieService.get(cname);
  }
}
