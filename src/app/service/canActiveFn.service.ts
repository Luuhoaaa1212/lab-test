import { inject } from "@angular/core"
import { UserService } from "./auth.service"
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
function getCookie(cname:string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
export const CanActivate = () => {
    let user = getCookie("jwt");
    const router = inject(Router);
    if(user){
        return true;
    }else{
        router.navigate(['home'])
        return false;
    }
}
export const CanActivateRoles = () => {
  let token = getCookie("jwt");
  const router = inject(Router);
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token);
  if(decodedToken.admin){
      return true;
  }else{
      router.navigate(['home'])
      return false;
  }
}
export const CanActivateAdmin = () => {
  let token = getCookie("jwt");
  const router = inject(Router);
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token);
 
  if(decodedToken.admin){
    router.navigate(['admin/products'])
    return false;
  }else{
    router.navigate(['home'])
    return false;
  }
}