import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInboxComponent } from '../chat-inbox.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ChatInboxComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showInbox = false;
  showUserMenu = false;
  userRole: string | null = null;
  userEmail: string | null = null;
  userNom: string | null = null;
  inboxCount$: Observable<number>;

  constructor(private auth: AuthService, private router: Router, private chat: ChatService) {
    this.userRole = this.auth.getUserRole();
    this.userEmail = this.auth.getUserEmail();
    this.userNom = this.auth.getUserNom();
    this.inboxCount$ = this.chat.getInboxMessages(this.userRole).pipe(map(msgs => msgs.length));
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }

  navigateToProfile() {
    this.closeUserMenu();
    this.router.navigate(['/profile']);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  getRoleDisplayName(role: string | null): string {
    switch (role) {
      case 'coordinateur': return 'Coordinateur';
      case 'agent_social': return 'Agent Social';
      case 'agent_medical': return 'Agent Médical';
      case 'comptable': return 'Comptable';
      default: return 'Utilisateur';
    }
  }
}
