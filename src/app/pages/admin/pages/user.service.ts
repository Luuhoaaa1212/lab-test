// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserRole: string = '';

  setUserRole(role: string): void {
    this.currentUserRole = role;
  }

  getUserRole(): string {
    return this.currentUserRole;
  }
}