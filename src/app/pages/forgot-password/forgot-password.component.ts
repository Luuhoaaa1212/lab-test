import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: './forgot-password.component.html',
  providers: [MessageService],
})
export class ForgotPasswordComponent {
  visible: boolean = false;
  visibleModal: boolean = false;
  emailForm: FormGroup;
  codeValue: string = '';
  data: any = {};

  passNew: string = '';
  passNewRepeat: string = '';

  private jwtHelper = new JwtHelperService();

  constructor(
    private formBuilder: FormBuilder,
    private useService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.emailForm = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.useService.sendMail(this.emailForm.value).subscribe(
        (data) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: `Mã code đã được gửi đến gmail ${this.emailForm.value.email}`,
          });
          this.data = data;
          setTimeout(() => {
            this.visible = true;
          }, 800);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.name,
          });
        }
      );
    } else {
      console.log('Form not valid. Please check the fields.');
    }
  }
  handleCodeEmmail() {
    const isExpired = this.jwtHelper.isTokenExpired(this.data?.accessTokenCode);
    if (isExpired) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Mã code đã hết thời hạn nhập !',
      });
    } else {
      const decodedToken = this.jwtHelper.decodeToken(
        this.data?.accessTokenCode
      );
      const soNguyen = parseInt(decodedToken.code.replace(/\s/g, ''), 10);
      if (soNguyen === Number(this.codeValue)) {
        this.visible = false;
        this.visibleModal = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Mã code không chính xác !',
        });
      }
    }
  }
  deleteCookie(cookieName: string) {
    document.cookie = cookieName + '=; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  }
  handleUpdatePassWord() {
    if (this.passNewRepeat.trim() === this.passNew.trim()) {
      const email = this.emailForm.value.email;
      const passNew = this.passNew;
      const data = { email, passNew };
      this.useService.updateUser(data).subscribe(
        (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Cập nhật mật khẩu thành công',
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 800);
          this.deleteCookie('jwt');
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Lỗi cập nhật mật khảu !',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Nhập lại mật khẩu không đúng !',
      });
    }
  }

  closeDialog() {
    this.visible = false;
  }

  get email() {
    return this.emailForm.get('email');
  }
}
