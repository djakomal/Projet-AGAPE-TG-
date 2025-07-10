import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ChatMessage {
  auteur: string;
  contenu: string;
  date: Date;
  destinataires: string[]; // Ex: ['agent_social', 'comptable']
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);

  sendMessage(message: ChatMessage) {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, message]);
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getInboxMessages(userRole: string | null): Observable<ChatMessage[]> {
    return this.getMessages().pipe(
      map(msgs =>
        msgs.filter(m =>
          Array.isArray(m.destinataires) &&
          userRole &&
          m.destinataires.includes(userRole)
        )
      )
    );
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }
} 