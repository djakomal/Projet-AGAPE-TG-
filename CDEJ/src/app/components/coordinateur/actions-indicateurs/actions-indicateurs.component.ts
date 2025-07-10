import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../../services/notifications.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-actions-indicateurs-coordinateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actions-indicateurs.component.html',
  styleUrl: './actions-indicateurs.component.css'
})
export class ActionsIndicateursCoordinateurComponent implements OnInit {
  userRole: string | null = null;
  isCoordinateur = false;
  currentUser = 'Coordinateur';

  secteurs = [
    { key: 'social', label: 'Social', icon: 'bi bi-people' },
    { key: 'medical', label: 'Médical', icon: 'bi bi-heart-pulse' },
    { key: 'comptable', label: 'Comptable', icon: 'bi bi-cash-coin' }
  ];
  actionsHistory: { label: string; icon: string; date: Date; type?: 'relancer' | 'valider'; user?: string }[] = [];
  actionInProgress: { [key: string]: boolean } = {};
  confirmDialog: null | { secteur: string; type: 'relancer' | 'valider' } = null;

  // Indicateurs stratégiques
  indicateurs = [
    { key: 'objectifs', label: 'Objectifs atteints', icon: 'bi bi-bullseye', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] },
    { key: 'croissance', label: 'Croissance', icon: 'bi bi-graph-up', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] },
    { key: 'innovation', label: 'Innovation', icon: 'bi bi-lightbulb', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] },
    { key: 'collaboration', label: 'Collaboration', icon: 'bi bi-people', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] }
  ];

  constructor(
    private notifications: NotificationsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.auth.getUserRole();
    this.isCoordinateur = this.userRole === 'coordinateur';
  }

  askConfirmation(secteur: string, type: 'relancer' | 'valider') {
    this.confirmDialog = { secteur, type };
  }

  confirmAction() {
    if (!this.confirmDialog) return;
    const { secteur, type } = this.confirmDialog;
    this.confirmDialog = null;
    if (type === 'relancer') {
      this.doRelancer(secteur);
    } else {
      this.doValider(secteur);
    }
  }

  cancelAction() {
    this.confirmDialog = null;
  }

  doRelancer(secteur: string) {
    this.actionInProgress[secteur + '_relancer'] = true;
    setTimeout(() => {
      const secteurObj = this.secteurs.find(s => s.key === secteur);
      const label = `Relance envoyée au secteur ${secteurObj?.label}`;
      this.notifications.info(label);
      this.actionsHistory.unshift({
        label: `${label} par ${this.currentUser}`,
        icon: 'bi bi-arrow-repeat text-primary',
        date: new Date(),
        type: 'relancer',
        user: this.currentUser
      });
      this.actionInProgress[secteur + '_relancer'] = false;
    }, 800);
  }

  doValider(secteur: string) {
    this.actionInProgress[secteur + '_valider'] = true;
    setTimeout(() => {
      const secteurObj = this.secteurs.find(s => s.key === secteur);
      const label = `Validation effectuée pour le secteur ${secteurObj?.label}`;
      this.notifications.success(label);
      this.actionsHistory.unshift({
        label: `${label} par ${this.currentUser}`,
        icon: 'bi bi-check2-circle text-success',
        date: new Date(),
        type: 'valider',
        user: this.currentUser
      });
      this.actionInProgress[secteur + '_valider'] = false;
    }, 800);
  }

  updateIndicateur(indicateurKey: string, valeur: number, commentaire: string) {
    const ind = this.indicateurs.find(i => i.key === indicateurKey);
    if (!ind) return;
    ind.value = valeur;
    ind.commentaire = commentaire;
    ind.historique.unshift({ valeur, commentaire, date: new Date(), user: this.currentUser });
  }

  getSecteurLabel(key: string): string {
    const secteur = this.secteurs.find(s => s.key === key);
    return secteur ? secteur.label : key;
  }
} 