import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/common/header/header.component';
import { SidebarComponent } from '../../components/common/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationsComponent } from '../../components/common/notifications/notifications.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    RouterModule,
    NotificationsComponent
  ],
  providers: [
    AuthService,
    NotificationsService
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userRole: 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur' | null = null;

  constructor(private auth: AuthService) {
    this.userRole = this.auth.getUserRole();
  }
}
