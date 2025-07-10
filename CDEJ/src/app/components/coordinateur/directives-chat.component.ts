import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Observable } from 'rxjs';

const DESTINATAIRES = [
  { label: 'Social', value: 'agent_social' },
  { label: 'Médical', value: 'agent_medical' },
  { label: 'Comptable', value: 'comptable' }
];

@Component({
  selector: 'app-directives-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="directives-chat">
      <!-- Icône flottante pour ouvrir la zone d'envoi -->
      <button class="fab-send" (click)="showForm = true" *ngIf="!showForm" title="Envoyer une directive">
        <i class="bi bi-plus-lg"></i>
      </button>

      <!-- Formulaire animé -->
      <div class="chat-form-card" *ngIf="showForm">
        <div class="chat-form-header">
          <span>Nouvelle directive</span>
          <button class="btn-close-form" (click)="showForm = false" title="Fermer">&times;</button>
        </div>
        <form (ngSubmit)="envoyer()" class="chat-form">
          <select multiple [(ngModel)]="destinataires" name="destinataires" class="chat-select" required>
            <option *ngFor="let d of destinatairesList" [value]="d.value">{{ d.label }}</option>
          </select>
          <input [(ngModel)]="message" name="message" class="chat-input" placeholder="Votre directive..." required />
          <button type="submit" class="chat-send" [disabled]="!message.trim() || destinataires.length === 0">Envoyer</button>
        </form>
      </div>

      <!-- Historique -->
      <div class="chat-history">
        <div *ngFor="let msg of messages$ | async" class="chat-message">
          <span class="chat-author">{{ msg.auteur }}:</span>
          <span class="chat-content">{{ msg.contenu }}</span>
          <span class="chat-date">{{ msg.date | date:'shortTime' }}</span>
          <span class="chat-destinataires">→ {{ getDestinatairesLabel(msg) }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./directives-chat.component.css']
})
export class DirectivesChatComponent {
  message = '';
  destinataires: string[] = [];
  destinatairesList = DESTINATAIRES;
  messages$: Observable<ChatMessage[]>;
  showForm = false;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.getMessages();
  }

  envoyer() {
    if (this.message.trim() && this.destinataires.length > 0) {
      this.chatService.sendMessage({
        auteur: 'Coordinateur',
        contenu: this.message,
        date: new Date(),
        destinataires: this.destinataires
      });
      this.message = '';
      this.destinataires = [];
      this.showForm = false;
    }
  }

  getLabel(value: string): string {
    const found = this.destinatairesList.find(d => d.value === value);
    return found ? found.label : value;
  }

  getDestinatairesLabel(msg: ChatMessage): string {
    if (!msg.destinataires || msg.destinataires.length === 0) return '';
    return msg.destinataires.map(d => this.getLabel(d)).join(', ');
  }
} 