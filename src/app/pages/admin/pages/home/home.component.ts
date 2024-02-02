import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterOutlet,RouterModule],
  templateUrl: './home.component.html',
  styles: ['.active { color: red; }']
})
export class HomeComponent {

}
