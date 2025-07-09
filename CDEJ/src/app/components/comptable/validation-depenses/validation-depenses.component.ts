import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetMockService } from '../../../services/budget-mock.service';
import { NotificationsService } from '../../../services/notifications.service';
import { Depense } from '../../../models/budget.model';

@Component({
  selector: 'app-validation-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation-depenses.component.html',
  styleUrl: './validation-depenses.component.css'
})
export class ValidationDepensesComponent implements OnInit {
  depenses: Depense[] = [];
  depensesEnAttente: Depense[] = [];
  depensesValidees: Depense[] = [];
  depensesRejetees: Depense[] = [];
  
  // Filtres
  statutSelectionne = 'en_attente';
  categorieSelectionnee = '';
  montantMin = 0;
  montantMax = 100000;
  
  // Formulaires
  showRejetForm = false;
  depenseSelectionnee: Depense | null = null;
  motifRejet = '';
  
  // Statistiques
  totalEnAttente = 0;
  totalValidees = 0;
  totalRejetees = 0;
  montantTotalEnAttente = 0;
  montantTotalValidees = 0;
  montantTotalRejetees = 0;

  constructor(
    private budgetService: BudgetMockService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.depenses = this.budgetService.getAllDepenses();
    this.calculerStatistiques();
    this.filtrerDepenses();
  }

  calculerStatistiques() {
    this.depensesEnAttente = this.depenses.filter(d => d.statut === 'en_attente');
    this.depensesValidees = this.depenses.filter(d => d.statut === 'validee');
    this.depensesRejetees = this.depenses.filter(d => d.statut === 'rejetee');
    
    this.totalEnAttente = this.depensesEnAttente.length;
    this.totalValidees = this.depensesValidees.length;
    this.totalRejetees = this.depensesRejetees.length;
    
    this.montantTotalEnAttente = this.depensesEnAttente.reduce((total, d) => total + d.montant, 0);
    this.montantTotalValidees = this.depensesValidees.reduce((total, d) => total + d.montant, 0);
    this.montantTotalRejetees = this.depensesRejetees.reduce((total, d) => total + d.montant, 0);
  }

  filtrerDepenses() {
    let depenses = this.depenses;
    
    if (this.statutSelectionne) {
      depenses = depenses.filter(d => d.statut === this.statutSelectionne);
    }
    
    if (this.categorieSelectionnee) {
      depenses = depenses.filter(d => d.categorie === this.categorieSelectionnee);
    }
    
    depenses = depenses.filter(d => d.montant >= this.montantMin && d.montant <= this.montantMax);
    
    return depenses;
  }

  // Actions sur les dépenses
  validerDepense(depense: Depense) {
    depense.statut = 'validee';
    depense.validePar = 'comptable1';
    depense.dateValidation = new Date();
    this.budgetService.updateDepense(depense.id, depense);
    this.notifications.success('Dépense validée avec succès');
    this.refresh();
  }

  rejeterDepense(depense: Depense) {
    this.depenseSelectionnee = depense;
    this.showRejetForm = true;
  }

  confirmerRejet() {
    if (this.depenseSelectionnee && this.motifRejet.trim()) {
      this.depenseSelectionnee.statut = 'rejetee';
      this.depenseSelectionnee.motifRejet = this.motifRejet;
      this.budgetService.updateDepense(this.depenseSelectionnee.id, this.depenseSelectionnee);
      this.notifications.success('Dépense rejetée avec succès');
      this.resetRejetForm();
      this.refresh();
    } else {
      this.notifications.error('Veuillez saisir un motif de rejet');
    }
  }

  annulerRejet() {
    this.resetRejetForm();
  }

  validerToutesDepenses() {
    const depensesEnAttente = this.depenses.filter(d => d.statut === 'en_attente');
    if (depensesEnAttente.length === 0) {
      this.notifications.info('Aucune dépense en attente à valider');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir valider toutes les ${depensesEnAttente.length} dépenses en attente ?`)) {
      depensesEnAttente.forEach(depense => {
        depense.statut = 'validee';
        depense.validePar = 'comptable1';
        depense.dateValidation = new Date();
        this.budgetService.updateDepense(depense.id, depense);
      });
      this.notifications.success(`${depensesEnAttente.length} dépenses validées avec succès`);
      this.refresh();
    }
  }

  rejeterToutesDepenses() {
    const depensesEnAttente = this.depenses.filter(d => d.statut === 'en_attente');
    if (depensesEnAttente.length === 0) {
      this.notifications.info('Aucune dépense en attente à rejeter');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir rejeter toutes les ${depensesEnAttente.length} dépenses en attente ?`)) {
      const motif = prompt('Motif de rejet pour toutes les dépenses :');
      if (motif) {
        depensesEnAttente.forEach(depense => {
          depense.statut = 'rejetee';
          depense.motifRejet = motif;
          this.budgetService.updateDepense(depense.id, depense);
        });
        this.notifications.success(`${depensesEnAttente.length} dépenses rejetées avec succès`);
        this.refresh();
      }
    }
  }

  // Utilitaires
  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'bg-warning';
      case 'validee': return 'bg-success';
      case 'rejetee': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getCategorieClass(categorie: string): string {
    switch (categorie) {
      case 'scolarite': return 'text-primary';
      case 'sante': return 'text-success';
      case 'nutrition': return 'text-warning';
      case 'transport': return 'text-info';
      case 'administration': return 'text-secondary';
      default: return 'text-dark';
    }
  }

  getJustificatifIcon(depense: Depense): string {
    return depense.justificatif ? 'bi-check-circle text-success' : 'bi-exclamation-triangle text-warning';
  }

  getJustificatifText(depense: Depense): string {
    return depense.justificatif ? 'Présent' : 'Manquant';
  }

  // Reset des formulaires
  resetRejetForm() {
    this.depenseSelectionnee = null;
    this.motifRejet = '';
    this.showRejetForm = false;
  }

  // Génération de rapports
  genererRapportValidation() {
    const rapport = {
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      totalEnAttente: this.totalEnAttente,
      totalValidees: this.totalValidees,
      totalRejetees: this.totalRejetees,
      montantTotalEnAttente: this.montantTotalEnAttente,
      montantTotalValidees: this.montantTotalValidees,
      montantTotalRejetees: this.montantTotalRejetees,
      depensesEnAttente: this.depensesEnAttente,
      depensesValidees: this.depensesValidees,
      depensesRejetees: this.depensesRejetees
    };
    
    console.log('Rapport de validation:', rapport);
    this.notifications.success('Rapport de validation généré');
  }

  imprimerRapport() {
    this.notifications.info('Impression du rapport en cours...');
    setTimeout(() => {
      window.print();
      this.notifications.success('Impression lancée');
    }, 1000);
  }

  exporterPDF() {
    this.notifications.info('Export PDF en cours...');
    setTimeout(() => {
      this.notifications.success('Rapport exporté en PDF');
    }, 2000);
  }

  // Méthodes pour les alertes
  getAlertes(): any[] {
    const alertes = [];
    
    if (this.totalEnAttente > 10) {
      alertes.push({
        type: 'warning',
        message: `${this.totalEnAttente} dépenses en attente de validation`
      });
    }
    
    if (this.montantTotalEnAttente > 50000) {
      alertes.push({
        type: 'danger',
        message: `Montant élevé en attente : ${this.formatMontant(this.montantTotalEnAttente)}`
      });
    }
    
    if (this.totalRejetees > 5) {
      alertes.push({
        type: 'info',
        message: `${this.totalRejetees} dépenses rejetées ce mois`
      });
    }
    
    return alertes;
  }

  // Méthodes pour les graphiques (simulation)
  getDonneesGraphiques() {
    return {
      repartitionStatuts: {
        labels: ['En attente', 'Validées', 'Rejetées'],
        data: [this.totalEnAttente, this.totalValidees, this.totalRejetees]
      },
      repartitionMontants: {
        labels: ['En attente', 'Validées', 'Rejetées'],
        data: [this.montantTotalEnAttente, this.montantTotalValidees, this.montantTotalRejetees]
      },
      evolutionValidation: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        data: [15, 22, 18, 25]
      }
    };
  }

  // Méthodes pour les pourcentages
  getPourcentageStatut(statut: string): number {
    const total = this.totalEnAttente + this.totalValidees + this.totalRejetees;
    if (total === 0) return 0;
    
    switch (statut) {
      case 'en_attente': return Math.round((this.totalEnAttente / total) * 100);
      case 'validee': return Math.round((this.totalValidees / total) * 100);
      case 'rejetee': return Math.round((this.totalRejetees / total) * 100);
      default: return 0;
    }
  }

  getPourcentageMontant(statut: string): number {
    const total = this.montantTotalEnAttente + this.montantTotalValidees + this.montantTotalRejetees;
    if (total === 0) return 0;
    
    switch (statut) {
      case 'en_attente': return Math.round((this.montantTotalEnAttente / total) * 100);
      case 'validee': return Math.round((this.montantTotalValidees / total) * 100);
      case 'rejetee': return Math.round((this.montantTotalRejetees / total) * 100);
      default: return 0;
    }
  }

  showMotifRejet(depense: Depense) {
    if (depense.motifRejet) {
      alert(`Motif de rejet : ${depense.motifRejet}`);
    } else {
      alert('Aucun motif de rejet spécifié');
    }
  }
}
