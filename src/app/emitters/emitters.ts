import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  loginSuccessEvent: EventEmitter<void> = new EventEmitter<void>();

  login() {
    this.loginSuccessEvent.emit();
  }
}