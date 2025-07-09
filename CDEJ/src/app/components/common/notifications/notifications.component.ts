import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, Notification } from '../../../services/notifications.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications$: Observable<Notification[]>;

  constructor(public notificationsService: NotificationsService) {
    this.notifications$ = notificationsService.notifications$;
  }

  remove(notification: Notification) {
    this.notificationsService.removeNotification(notification);
  }
}
