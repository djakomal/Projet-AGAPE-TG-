import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, Notification } from '../../../services/notifications.service';
import { Observable, Subscription } from 'rxjs';
import { ChatService, ChatMessage } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications$: Observable<Notification[]>;
  private chatSub?: Subscription;
  private lastMessageDate?: Date;
  private userRole: string | null;

  constructor(
    public notificationsService: NotificationsService,
    private chatService: ChatService,
    private authService: AuthService
  ) {
    this.notifications$ = notificationsService.notifications$;
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit() {
    this.chatSub = this.chatService.getMessages().subscribe(messages => {
      if (messages.length === 0) return;
      const last = messages[messages.length - 1];
      // Pour éviter la double notification lors du premier chargement
      if (!this.lastMessageDate || last.date > this.lastMessageDate) {
        if (
          last.auteur === 'Coordinateur' &&
          Array.isArray(last.destinataires) &&
          this.userRole &&
          last.destinataires.includes(this.userRole)
        ) {
          this.notificationsService.info(`Directive: ${last.contenu}`);
        }
        this.lastMessageDate = last.date;
      }
    });
  }

  ngOnDestroy() {
    this.chatSub?.unsubscribe();
  }

  remove(notification: Notification) {
    this.notificationsService.removeNotification(notification);
  }
}
