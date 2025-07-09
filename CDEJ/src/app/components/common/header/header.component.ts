import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userRole: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.userRole = this.auth.getUserRole();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
