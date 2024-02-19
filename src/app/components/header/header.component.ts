import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  RouterModule,
  Router,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Cart } from '../../interfaces';
import { UserService } from '../../service/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AuthenticationService } from '../../emitters/emitters';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    BadgeModule,
    OverlayPanelModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './header.component.html',
  styles: ['div.active { background-color: red }'],
  providers: [ConfirmationService, MessageService],
})
export class HeaderComponent implements OnInit {
  totalCart: number = 0;
  allCart: any = {};
  cartState$: Observable<Cart[]>;
  isUser: boolean = false;
  userName: string = '';
  loginSuccessSubscription: Subscription = new Subscription();

  constructor(
    private store: Store<{ carts: Cart[] }>,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.cartState$ = this.store.select('carts');
  }

  ngOnInit(): void {
    this.loginSuccessSubscription =
      this.authService.loginSuccessEvent.subscribe(() => {
        this.userService.getUser().subscribe(
          (user) => {
            this.isUser = true;
            this.userName = user.username;
          },
          (error) => {
            console.log(error);
            this.isUser = false;
            this.userName = '';
          }
        );
      });
    this.cartState$.subscribe((updatedCartState) => {
      this.allCart = updatedCartState;
      this.totalCart = this.allCart.quantity;
    });

    this.userService.getUser().subscribe(
      (user) => {
        this.isUser = true;
        this.userName = user.username;
      },
      (error) => {
        this.isUser = false;
        this.userName = '';
      }
    );
  }
  deleteCookie(cookieName: string) {
    document.cookie = cookieName + '=; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  }

  handleLogout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to sign out?',
      header: 'Confirmation Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.logoutUser().subscribe(
          (data) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Log out successfully',
            });
            // setTimeout(() => {
            //   location.reload();
            // }, 700);
            this.router.navigate(['home']);
            
            this.authService.login();
          },
          (err) => {
            console.log(err);
          }
        );
      },
    });
  }
  ngOnDestroy() {
    this.loginSuccessSubscription.unsubscribe();
  }
}
