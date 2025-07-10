import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-inbox">
      <h3>Boîte de réception des directives</h3>
      <div class="inbox-role-debug">
        <strong>Rôle détecté :</strong> {{ userRole || 'Aucun (non connecté ou erreur)' }}
      </div>
      <div *ngIf="!userRole" class="inbox-warning">
        <em>Attention : aucun rôle utilisateur détecté. Veuillez vous reconnecter.</em>
      </div>
      <div *ngIf="(messages$ | async)?.length === 0 && userRole" class="empty-inbox">
        <em>Aucun message reçu.</em>
      </div>
      <div #history class="inbox-history">
        <div *ngFor="let msg of messages$ | async; let last = last; let i = index" class="inbox-message" [ngClass]="{ 'new': last }">
          <div class="inbox-header">
            <span class="inbox-author">{{ msg.auteur }}</span>
            <span class="inbox-date">{{ msg.date | date:'short' }}</span>
          </div>
          <div class="inbox-content">{{ msg.contenu }}</div>
          <div class="inbox-destinataires">
            <small>
              Pour :
              {{
                (msg.destinataires && msg.destinataires.length > 0)
                  ? msg.destinataires.map(getLabel).join(', ')
                  : 'Aucun'
              }}
            </small>
          </div>
          <div class="inbox-reply-form">
            <textarea
              [(ngModel)]="replyContent[i]"
              (keyup.enter)="sendReply(msg, i)"
              (blur)="sendReply(msg, i)"
            ></textarea>
            <button (click)="sendReply(msg, i)">Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements AfterViewInit {
  messages$: Observable<ChatMessage[]>;
  userRole: string | null;
  destinatairesList = [
    { label: 'Social', value: 'agent_social' },
    { label: 'Médical', value: 'agent_medical' },
    { label: 'Comptable', value: 'comptable' }
  ];
  replyContent: { [msgIndex: number]: string } = {};

  @ViewChild('history') historyRef?: ElementRef<HTMLDivElement>;

  constructor(private chatService: ChatService, private auth: AuthService) {
    this.userRole = this.auth.getUserRole();
    this.messages$ = this.chatService.getInboxMessages(this.userRole);
  }

  ngAfterViewInit() {
    this.messages$.subscribe(() => {
      setTimeout(() => {
        if (this.historyRef?.nativeElement) {
          this.historyRef.nativeElement.scrollTop = this.historyRef.nativeElement.scrollHeight;
        }
      }, 100);
    });
  }

  getLabel = (value: string) => {
    const found = this.destinatairesList.find(d => d.value === value);
    return found ? found.label : value;
  };

  sendReply(msg: ChatMessage, idx: number) {
    const content = this.replyContent[idx]?.trim();
    if (!content) return;
    // Réponse envoyée à l'auteur du message initial
    this.chatService.sendMessage({
      auteur: this.userRole || 'Utilisateur',
      contenu: content,
      date: new Date(),
      destinataires: [msg.auteur] // ou msg.destinataires pour répondre à tous
    });
    this.replyContent[idx] = '';
  }
} 