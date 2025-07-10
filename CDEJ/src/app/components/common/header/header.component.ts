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
  userRole: string | null = null;
  inboxCount$: Observable<number>;

  constructor(private auth: AuthService, private router: Router, private chat: ChatService) {
    this.userRole = this.auth.getUserRole();
    this.inboxCount$ = this.chat.getInboxMessages(this.userRole).pipe(map(msgs => msgs.length));
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
