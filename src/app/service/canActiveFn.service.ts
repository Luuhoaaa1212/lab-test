import { inject } from '@angular/core';
import { UserService } from './auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { getUrlBaseApi } from '../constant';
function getCookie(cname: string) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
 export const CanActivate = async () => {
  let user = getCookie('jwt');
  const apiUrl = getUrlBaseApi('auth')
  const res = await fetch(`${apiUrl}/check`, { credentials: 'include' })
  const router = inject(Router);
  console.log(res);
  
  if(res.status === 200) {
    return true;
  }else{
    router.navigate(['home']);
    return false;
  }
  
 
};



export const CanActivateRoles = () => {
  let token = getCookie('jwt');
  const router = inject(Router);
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token);
  if (decodedToken.admin) {
    return true;
  } else {
    router.navigate(['home']);
    return false;
  }
};
export const CanActivateAdmin = () => {
  let token = getCookie('jwt');
  const router = inject(Router);
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token);
  if (decodedToken?.admin) {
    router.navigate(['admin/products']);
    return false;
  } else {
    router.navigate(['home']);
    return false;
  }
};
