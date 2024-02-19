// auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieManagerService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private router: Router,
    private cookieManagerService: CookieManagerService
  ) {}

  canActivate(): boolean {
    let user = this.cookieManagerService.getCookie('jwt');
    

    if (user) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }

  canActivateRoles(): boolean {
    let token = this.cookieManagerService.getCookie('jwt');
    const decodedToken = this.decodeToken(token);

    if (decodedToken.admin) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }

  canActivateAdmin(): boolean {
    let token = this.cookieManagerService.getCookie('jwt');
    const decodedToken = this.decodeToken(token);

    if (decodedToken.admin) {
      this.router.navigate(['admin/products']);
      return false;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }

  private decodeToken(token: string): any {
    const helper = new JwtHelperService();
    return helper.decodeToken(token);
  }
}
