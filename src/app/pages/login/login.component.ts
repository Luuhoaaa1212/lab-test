import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../service/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../emitters/emitters';

import { Router, RouterLink } from '@angular/router';
import { catchError, throwError } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    ToastModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  providers: [MessageService],
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthenticationService
  ) {}
  myForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  onSubmit() {
    if (this.myForm.valid) {
      this.userService
        .getData(this.myForm.value)
        .pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.name,
              });
            } else {
              console.error('Lỗi không xác định:', error.message);
            }
            return throwError(error);
          })
        )
        .subscribe((response) => {
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response?.message?.name,
          });
          setTimeout(() => {
            this.router.navigate(['home']);
            this.authService.login();
          }, 700);
        });
    }
  }
}
