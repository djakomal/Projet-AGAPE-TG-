import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private addNotification(notification: Notification) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
    // Auto-dismiss après 4s
    setTimeout(() => this.removeNotification(notification), 4000);
  }

  success(message: string) {
    this.addNotification({ type: 'success', message });
  }
  error(message: string) {
    this.addNotification({ type: 'error', message });
  }
  info(message: string) {
    this.addNotification({ type: 'info', message });
  }

  removeNotification(notification: Notification) {
    this.notificationsSubject.next(
      this.notificationsSubject.value.filter(n => n !== notification)
    );
  }
}
