import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/admin/pages/home/home.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,CommonModule,ReactiveFormsModule,FormsModule,HeaderComponent,HomeComponent,FooterComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Assignment'
  rule:boolean = true;
  constructor(private router: Router) {}

  isAdminPage(): boolean {
    // Kiểm tra xem trang hiện tại có phải là trang admin không
    return this.router.url.startsWith('/admin');
  }
  ngOnInit(): void {
    initFlowbite();
  }
}
