import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../../service/auth.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule,ConfirmDialogModule,ToastModule],
  templateUrl: './sidebar.component.html',
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private messageService: MessageService,
    private router:Router
  ) {}
  deleteCookie(cookieName: string) {
    document.cookie = cookieName + '=; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  }
  handleLogoutAdmin(event: Event) {
    
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
            this.deleteCookie('jwt');

            setTimeout(() => {
              location.reload();
            }, 700);
            this.router.navigate(['/home']);
          },
          (err) => {
            console.log(err);
          }
        );
      },
    });
  }
}
