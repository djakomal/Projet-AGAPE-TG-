import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesChatComponent } from '../directives-chat.component';
import { PerformanceService, SectorStats } from '../../../services/performance.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../../../services/notifications.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

interface Statistique {
  titre: string;
  valeur: number;
  unite: string;
  variation: number;
  icone: string;
  couleur: string;
}

interface ActiviteRecente {
  id: number;
  type: 'tache' | 'membre' | 'equipe' | 'projet';
  titre: string;
  description: string;
  date: Date;
  statut: 'termine' | 'en_cours' | 'en_attente';
}

interface ProjetEnCours {
  id: number;
  nom: string;
  equipe: string;
  progression: number;
  dateDebut: Date;
  dateFin: Date;
  statut: 'en_cours' | 'en_retard' | 'a_jour';
}

@Component({
  selector: 'app-vue-ensemble',
  standalone: true,
  imports: [CommonModule, DirectivesChatComponent, FormsModule],
  templateUrl: './vue-ensemble.component.html',
  styleUrl: './vue-ensemble.component.css'
})
export class VueEnsembleComponent implements OnInit {
  progression$: Observable<number>;
  stats$: Observable<SectorStats>;
  statistiques: Statistique[] = [];
  activitesRecentes: ActiviteRecente[] = [];
  projetsEnCours: ProjetEnCours[] = [];
  performanceGenerale = 0;
  secteurs = [
    { key: 'social', label: 'Social', icon: 'bi bi-people' },
    { key: 'medical', label: 'Médical', icon: 'bi bi-heart-pulse' },
    { key: 'comptable', label: 'Comptable', icon: 'bi bi-cash-coin' }
  ];
  actionsHistory: { label: string; icon: string; date: Date; type?: 'relancer' | 'valider'; user?: string }[] = [];
  actionInProgress: { [key: string]: boolean } = {};
  currentUser = 'Coordinateur';
  confirmDialog: null | { secteur: string; type: 'relancer' | 'valider' } = null;
  userRole: string | null = null;
  isCoordinateur = false;

  // Indicateurs stratégiques
  indicateurs = [
    { key: 'objectifs', label: 'Objectifs atteints', icon: 'bi bi-bullseye', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] },
    { key: 'croissance', label: 'Croissance', icon: 'bi bi-graph-up', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] },
    { key: 'innovation', label: 'Innovation', icon: 'bi bi-lightbulb', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] },
    { key: 'collaboration', label: 'Collaboration', icon: 'bi bi-people', value: 0, commentaire: '', historique: [] as { valeur: number, commentaire: string, date: Date, user: string }[] }
  ];

  updateIndicateur(indicateurKey: string, valeur: number, commentaire: string) {
    const ind = this.indicateurs.find(i => i.key === indicateurKey);
    if (!ind) return;
    ind.value = valeur;
    ind.commentaire = commentaire;
    ind.historique.unshift({ valeur, commentaire, date: new Date(), user: this.currentUser });
  }

  constructor(
    private perf: PerformanceService,
    private notifications: NotificationsService,
    private auth: AuthService
  ) {
    this.progression$ = this.perf.getAllStats().pipe(
      map(stats => Math.round((stats.social + stats.medical + stats.comptable) / 3))
    );
    this.stats$ = this.perf.getAllStats();
  }

  ngOnInit(): void {
    this.chargerDonnees();
    this.userRole = this.auth.getUserRole();
    this.isCoordinateur = this.userRole === 'coordinateur';
  }

  chargerDonnees(): void {
    // Statistiques principales
    this.statistiques = [
      {
        titre: 'Équipes actives',
        valeur: 8,
        unite: 'équipes',
        variation: 12.5,
        icone: '👥',
        couleur: '#3498db'
      },
      {
        titre: 'Membres total',
        valeur: 45,
        unite: 'personnes',
        variation: 8.2,
        icone: '👤',
        couleur: '#27ae60'
      },
      {
        titre: 'Projets en cours',
        valeur: 15,
        unite: 'projets',
        variation: -5.3,
        icone: '📋',
        couleur: '#f39c12'
      },
      {
        titre: 'Tâches terminées',
        valeur: 127,
        unite: 'tâches',
        variation: 15.7,
        icone: '✅',
        couleur: '#e74c3c'
      },
      {
        titre: 'Performance moyenne',
        valeur: 87,
        unite: '%',
        variation: 3.2,
        icone: '📊',
        couleur: '#9b59b6'
      },
      {
        titre: 'Budget utilisé',
        valeur: 78,
        unite: '%',
        variation: -2.1,
        icone: '💰',
        couleur: '#1abc9c'
      }
    ];

    // Activités récentes
    this.activitesRecentes = [
      {
        id: 1,
        type: 'tache',
        titre: 'Révision du budget trimestriel',
        description: 'Tâche administrative terminée par Marie Dupont',
        date: new Date('2024-02-14T10:30:00'),
        statut: 'termine'
      },
      {
        id: 2,
        type: 'membre',
        titre: 'Nouveau membre recruté',
        description: 'Sophie Martin rejoint l\'équipe médicale',
        date: new Date('2024-02-13T14:15:00'),
        statut: 'en_cours'
      },
      {
        id: 3,
        type: 'equipe',
        titre: 'Équipe sociale',
        description: 'Performance améliorée de 15% ce mois',
        date: new Date('2024-02-12T09:45:00'),
        statut: 'termine'
      },
      {
        id: 4,
        type: 'projet',
        titre: 'Campagne de sensibilisation',
        description: 'Projet en cours de planification',
        date: new Date('2024-02-11T16:20:00'),
        statut: 'en_attente'
      },
      {
        id: 5,
        type: 'tache',
        titre: 'Mise à jour des procédures',
        description: 'Documentation administrative mise à jour',
        date: new Date('2024-02-10T11:30:00'),
        statut: 'termine'
      }
    ];

    // Projets en cours
    this.projetsEnCours = [
      {
        id: 1,
        nom: 'Programme de soutien scolaire',
        equipe: 'Équipe Sociale',
        progression: 75,
        dateDebut: new Date('2024-01-15'),
        dateFin: new Date('2024-03-15'),
        statut: 'en_cours'
      },
      {
        id: 2,
        nom: 'Campagne de vaccination',
        equipe: 'Équipe Médicale',
        progression: 90,
        dateDebut: new Date('2024-01-20'),
        dateFin: new Date('2024-02-28'),
        statut: 'a_jour'
      },
      {
        id: 3,
        nom: 'Formation des bénévoles',
        equipe: 'Équipe Administrative',
        progression: 45,
        dateDebut: new Date('2024-02-01'),
        dateFin: new Date('2024-04-01'),
        statut: 'en_retard'
      },
      {
        id: 4,
        nom: 'Évaluation des besoins',
        equipe: 'Équipe Sociale',
        progression: 60,
        dateDebut: new Date('2024-01-25'),
        dateFin: new Date('2024-03-10'),
        statut: 'en_cours'
      }
    ];

    // Calcul de la performance générale
    this.calculerPerformanceGenerale();
  }

  calculerPerformanceGenerale(): void {
    const performanceMoyenne = this.statistiques.find(s => s.titre === 'Performance moyenne');
    const projetsAjour = this.projetsEnCours.filter(p => p.statut === 'a_jour').length;
    const totalProjets = this.projetsEnCours.length;
    
    let score = performanceMoyenne ? performanceMoyenne.valeur : 0;
    score += (projetsAjour / totalProjets) * 10;
    
    this.performanceGenerale = Math.round(score);
  }

  relancer(secteur: string) {
    this.askConfirmation(secteur, 'relancer');
  }

  valider(secteur: string) {
    this.askConfirmation(secteur, 'valider');
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

  getStatValue(stats: SectorStats, key: string): number {
    return stats[key as keyof SectorStats] as number;
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'termine': return 'statut-termine';
      case 'en_cours': return 'statut-encours';
      case 'en_attente': return 'statut-attente';
      case 'a_jour': return 'statut-ajour';
      case 'en_retard': return 'statut-retard';
      default: return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'tache': return '📋';
      case 'membre': return '👤';
      case 'equipe': return '👥';
      case 'projet': return '🚀';
      default: return '📌';
    }
  }

  getVariationClass(variation: number): string {
    return variation >= 0 ? 'variation-positive' : 'variation-negative';
  }

  getProgressionClass(progression: number): string {
    if (progression >= 80) return 'progression-excellente';
    if (progression >= 60) return 'progression-bonne';
    if (progression >= 40) return 'progression-moyenne';
    return 'progression-faible';
  }

  getJoursRestants(dateFin: Date): number {
    const aujourdhui = new Date();
    const diffTime = dateFin.getTime() - aujourdhui.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formaterDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formaterHeure(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSecteurLabel(key: string): string {
    const secteur = this.secteurs.find(s => s.key === key);
    return secteur ? secteur.label : key;
  }
}
