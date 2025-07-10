import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { NotificationsService } from '../../../services/notifications.service';
import { AuthService } from '../../../services/auth.service';

interface TacheAdministrative {
  id: number;
  titre: string;
  description: string;
  priorite: 'basse' | 'moyenne' | 'haute';
  statut: 'à faire' | 'en cours' | 'terminée';
  dateEcheance: Date;
  assigne: string;
}

@Component({
  selector: 'app-gestion-administrative',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-administrative.component.html',
  styleUrl: './gestion-administrative.component.css'
})
export class GestionAdministrativeComponent implements OnInit {
  taches: TacheAdministrative[] = [];
  tacheForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  showForm = false;
  isSubmitting = false;
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  secteurs = [
    { value: 'agent_social', label: 'Secteur Social' },
    { value: 'agent_medical', label: 'Secteur Médical' },
    { value: 'comptable', label: 'Secteur Comptable' }
  ];

  // Gestion des agents
  agents: any[] = [];
  agentEditIndex: number | null = null;
  agentEditEmail = '';
  agentEditPassword = '';
  agentEditError = '';
  agentEditSuccess = '';

  constructor(
    private fb: FormBuilder,
    private chat: ChatService,
    private notifications: NotificationsService,
    private auth: AuthService
  ) {
    this.tacheForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      priorite: ['moyenne', Validators.required],
      dateEcheance: ['', Validators.required],
      assigne: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chargerTaches();
    this.chargerAgents();
  }

  chargerTaches(): void {
    // Simulation de données
    this.taches = [
      {
        id: 1,
        titre: 'Révision du budget trimestriel',
        description: 'Analyser et ajuster le budget pour le prochain trimestre',
        priorite: 'haute',
        statut: 'en cours',
        dateEcheance: new Date('2024-02-15'),
        assigne: 'comptable'
      },
      {
        id: 2,
        titre: 'Planification des réunions d\'équipe',
        description: 'Organiser les réunions mensuelles avec les différentes équipes',
        priorite: 'moyenne',
        statut: 'à faire',
        dateEcheance: new Date('2024-02-20'),
        assigne: 'agent_social'
      },
      {
        id: 3,
        titre: 'Mise à jour des procédures',
        description: 'Réviser et mettre à jour les procédures administratives',
        priorite: 'basse',
        statut: 'terminée',
        dateEcheance: new Date('2024-02-10'),
        assigne: 'agent_medical'
      }
    ];
  }

  // Gestion des agents
  chargerAgents() {
    this.agents = this.auth.getAllUsers().filter(u => u.role !== 'coordinateur');
  }

  startEditAgent(i: number) {
    this.agentEditIndex = i;
    this.agentEditEmail = this.agents[i].email;
    this.agentEditPassword = '';
    this.agentEditError = '';
    this.agentEditSuccess = '';
  }

  cancelEditAgent() {
    this.agentEditIndex = null;
    this.agentEditEmail = '';
    this.agentEditPassword = '';
    this.agentEditError = '';
    this.agentEditSuccess = '';
  }

  saveAgentEdit(i: number) {
    const original = this.agents[i];
    this.agentEditError = '';
    this.agentEditSuccess = '';
    // Changement email
    if (this.agentEditEmail !== original.email) {
      const res = this.auth.updateUserEmail(original.email, this.agentEditEmail);
      if (!res.success) {
        this.agentEditError = res.error || 'Erreur lors du changement d\'email';
        return;
      } else {
        this.agents[i].email = this.agentEditEmail;
      }
    }
    // Changement mot de passe
    if (this.agentEditPassword) {
      if (this.agentEditPassword.length < 6) {
        this.agentEditError = 'Le mot de passe doit contenir au moins 6 caractères';
        return;
      }
      const res = this.auth.adminChangePassword(this.agentEditEmail, this.agentEditPassword);
      if (!res.success) {
        this.agentEditError = res.error || 'Erreur lors du changement de mot de passe';
        return;
      }
    }
    this.agentEditSuccess = 'Modifications enregistrées';
    setTimeout(() => {
      this.cancelEditAgent();
      this.chargerAgents();
    }, 1200);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.annulerModification();
    }
  }

  getTachesEnCours(): number {
    return this.taches.filter(t => t.statut === 'en cours').length;
  }

  getTachesTerminees(): number {
    return this.taches.filter(t => t.statut === 'terminée').length;
  }

  getFilteredTaches(): TacheAdministrative[] {
    return this.taches.filter(tache => {
      const matchesSearch = !this.searchTerm || 
        tache.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tache.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tache.assigne.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || tache.statut === this.statusFilter;
      const matchesPriority = !this.priorityFilter || tache.priorite === this.priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
  }

  trackByTacheId(index: number, tache: TacheAdministrative): number {
    return tache.id;
  }

  getTaskCardClasses(tache: TacheAdministrative): string {
    return `priorite-${tache.priorite} statut-${tache.statut}`;
  }

  getEcheanceClass(dateEcheance: Date): string {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'echeance-depassee';
    if (diffDays <= 3) return 'echeance-urgente';
    if (diffDays <= 7) return 'echeance-proche';
    return 'echeance-normale';
  }

  ajouterTache(): void {
    if (this.tacheForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        const nouvelleTache: TacheAdministrative = {
          id: this.taches.length + 1,
          ...this.tacheForm.value,
          statut: 'à faire'
        };
        this.taches.push(nouvelleTache);
        this.tacheForm.reset({ priorite: 'moyenne' });
        this.showForm = false;
        this.isSubmitting = false;

        // Notification et message aux rôles concernés
        const roles: string[] = [nouvelleTache.assigne];
        if (roles.length > 0) {
          this.chat.sendMessage({
            auteur: 'Coordinateur',
            contenu: `Nouvelle tâche administrative : ${nouvelleTache.titre}`,
            date: new Date(),
            destinataires: roles
          });
          const secteurLabel = this.secteurs.find(s => s.value === nouvelleTache.assigne)?.label || nouvelleTache.assigne;
          this.notifications.info(`Tâche envoyée au secteur : ${secteurLabel}`);
        }
      }, 1000);
    }
  }

  modifierTache(tache: TacheAdministrative): void {
    this.isEditing = true;
    this.editingId = tache.id;
    this.showForm = true; // S'assurer que le formulaire est ouvert
    this.tacheForm.patchValue({
      titre: tache.titre,
      description: tache.description,
      priorite: tache.priorite,
      dateEcheance: tache.dateEcheance.toISOString().split('T')[0],
      assigne: tache.assigne
    });
  }

  sauvegarderModification(): void {
    if (this.tacheForm.valid && this.editingId) {
      this.isSubmitting = true;
      setTimeout(() => {
        const index = this.taches.findIndex(t => t.id === this.editingId);
        if (index !== -1) {
          const ancienneTache = this.taches[index];
          this.taches[index] = {
            ...this.taches[index],
            ...this.tacheForm.value,
            dateEcheance: new Date(this.tacheForm.value.dateEcheance)
          };
          
          // Notification de modification
          const secteurLabel = this.secteurs.find(s => s.value === this.tacheForm.value.assigne)?.label || this.tacheForm.value.assigne;
          this.notifications.info(`Tâche modifiée et envoyée au secteur : ${secteurLabel}`);
          
          // Envoyer un message si le secteur a changé
          if (ancienneTache.assigne !== this.tacheForm.value.assigne) {
            this.chat.sendMessage({
              auteur: 'Coordinateur',
              contenu: `Tâche modifiée : ${this.tacheForm.value.titre}`,
              date: new Date(),
              destinataires: [this.tacheForm.value.assigne]
            });
          }
        }
        this.annulerModification();
        this.isSubmitting = false;
      }, 1000);
    }
  }

  annulerModification(): void {
    this.isEditing = false;
    this.editingId = null;
    this.tacheForm.reset({ priorite: 'moyenne' });
  }

  supprimerTache(id: number): void {
    this.taches = this.taches.filter(t => t.id !== id);
  }

  changerStatut(tache: TacheAdministrative, nouveauStatut: 'à faire' | 'en cours' | 'terminée'): void {
    tache.statut = nouveauStatut;
  }

  onStatutChange(tache: TacheAdministrative, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.changerStatut(tache, target.value as 'à faire' | 'en cours' | 'terminée');
    }
  }

  getPrioriteClass(priorite: string): string {
    switch (priorite) {
      case 'haute': return 'priorite-haute';
      case 'moyenne': return 'priorite-moyenne';
      case 'basse': return 'priorite-basse';
      default: return '';
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'terminée': return 'statut-terminee';
      case 'en cours': return 'statut-encours';
      case 'à faire': return 'statut-afaire';
      default: return '';
    }
  }

  getSecteurLabel(value: string): string {
    const secteur = this.secteurs.find(s => s.value === value);
    return secteur ? secteur.label : value;
  }
}
