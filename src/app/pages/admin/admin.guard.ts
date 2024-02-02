import { UserService } from './pages/user.service';

// type CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;

// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAccess();
  }

  checkAccess(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.userService.getUserRole() === 'admin') {
      return true; // Cho phép truy cập nếu người dùng là admin
    } else {
      return this.router.createUrlTree(['/']); // Chuyển hướng về trang chính nếu không phải là admin
    }
  }
}
