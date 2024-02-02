import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink,ToastModule],
  templateUrl: './signup.component.html',
  providers: [MessageService]
})
export class SignupComponent {
  myForm = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(4)])
  });
  constructor(
    private userService:UserService,
    private messageService: MessageService,
    private router: Router

  ){
    
  }

  onSubmit() {
    if(this.myForm.valid) {
      this.userService.postData(this.myForm.value).subscribe(data=>{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Đăng ký thành công' });
        setTimeout(()=>{
          this.router.navigate(['/login']);
        },500)
      },
      (error)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
      )
    };   
  }

}
