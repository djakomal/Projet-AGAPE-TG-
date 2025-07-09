import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetMockService } from '../../../services/budget-mock.service';
import { NotificationsService } from '../../../services/notifications.service';
import { Budget, Depense, Transaction, RapportFinancier } from '../../../models/budget.model';

@Component({
  selector: 'app-rapports-financiers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapports-financiers.component.html',
  styleUrl: './rapports-financiers.component.css'
})
export class RapportsFinanciersComponent implements OnInit {
  budgets: Budget[] = [];
  depenses: Depense[] = [];
  transactions: Transaction[] = [];
  
  // Filtres
  anneeSelectionnee = new Date().getFullYear();
  moisSelectionne = new Date().getMonth() + 1;
  typeRapport = 'global';
  
  // Statistiques
  totalBudget = 0;
  totalDepenses = 0;
  totalEntrees = 0;
  totalSorties = 0;
  solde = 0;
  
  // Détails par catégorie
  detailsParCategorie: any = {};
  
  // Rapports
  rapportFinancier: RapportFinancier | null = null;
  rapportMensuel: any = null;
  rapportAnnuel: any = null;

  constructor(
    private budgetService: BudgetMockService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.budgets = this.budgetService.getAllBudgets();
    this.depenses = this.budgetService.getAllDepenses();
    this.transactions = this.budgetService.getAllTransactions();
    this.calculerStatistiques();
    this.genererRapportFinancier();
  }

  calculerStatistiques() {
    this.totalBudget = this.budgetService.getTotalBudget(this.anneeSelectionnee);
    this.totalDepenses = this.budgetService.getTotalDepenses(this.anneeSelectionnee);
    this.totalEntrees = this.budgetService.getTotalEntrees(this.anneeSelectionnee);
    this.totalSorties = this.budgetService.getTotalSorties(this.anneeSelectionnee);
    this.solde = this.budgetService.getSolde(this.anneeSelectionnee);
    
    this.calculerDetailsParCategorie();
  }

  calculerDetailsParCategorie() {
    const categories = ['scolarite', 'sante', 'nutrition', 'transport', 'administration', 'autres'];
    
    this.detailsParCategorie = {};
    
    categories.forEach(categorie => {
      const budgetsCategorie = this.budgets.filter(b => 
        b.categorie === categorie && b.annee === this.anneeSelectionnee
      );
      const depensesCategorie = this.depenses.filter(d => {
        const budget = this.budgets.find(b => b.id === d.budgetId);
        return budget && budget.categorie === categorie && budget.annee === this.anneeSelectionnee;
      });
      
      const budgetTotal = budgetsCategorie.reduce((total, b) => total + b.montantAlloue, 0);
      const depensesTotal = depensesCategorie.reduce((total, d) => total + d.montant, 0);
      const reste = budgetTotal - depensesTotal;
      
      this.detailsParCategorie[categorie] = {
        budget: budgetTotal,
        depenses: depensesTotal,
        reste: reste,
        tauxUtilisation: budgetTotal > 0 ? Math.round((depensesTotal / budgetTotal) * 100) : 0
      };
    });
  }

  genererRapportFinancier() {
    this.rapportFinancier = {
      id: Date.now().toString(),
      periode: `${this.anneeSelectionnee}`,
      dateGeneration: new Date(),
      totalEntrees: this.totalEntrees,
      totalSorties: this.totalSorties,
      solde: this.solde,
      details: {
        scolarite: this.detailsParCategorie.scolarite || { budget: 0, depenses: 0, reste: 0 },
        sante: this.detailsParCategorie.sante || { budget: 0, depenses: 0, reste: 0 },
        nutrition: this.detailsParCategorie.nutrition || { budget: 0, depenses: 0, reste: 0 },
        transport: this.detailsParCategorie.transport || { budget: 0, depenses: 0, reste: 0 },
        administration: this.detailsParCategorie.administration || { budget: 0, depenses: 0, reste: 0 },
        autres: this.detailsParCategorie.autres || { budget: 0, depenses: 0, reste: 0 }
      }
    };
  }

  genererRapportMensuel() {
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    this.rapportMensuel = {
      mois: moisNoms[this.moisSelectionne - 1],
      annee: this.anneeSelectionnee,
      budgetTotal: this.getBudgetMensuel(),
      depensesTotal: this.getDepensesMensuelles(),
      entreesTotal: this.getEntreesMensuelles(),
      sortiesTotal: this.getSortiesMensuelles(),
      solde: this.getSoldeMensuel(),
      details: this.getDetailsMensuels()
    };
  }

  genererRapportAnnuel() {
    this.rapportAnnuel = {
      annee: this.anneeSelectionnee,
      budgetTotal: this.totalBudget,
      depensesTotal: this.totalDepenses,
      entreesTotal: this.totalEntrees,
      sortiesTotal: this.totalSorties,
      solde: this.solde,
      evolutionMensuelle: this.getEvolutionMensuelle(),
      details: this.detailsParCategorie
    };
  }

  // Méthodes de calcul pour les rapports mensuels
  getBudgetMensuel(): number {
    return this.budgets
      .filter(b => b.annee === this.anneeSelectionnee && b.mois === this.moisSelectionne)
      .reduce((total, b) => total + b.montantAlloue, 0);
  }

  getDepensesMensuelles(): number {
    return this.depenses
      .filter(d => {
        const budget = this.budgets.find(b => b.id === d.budgetId);
        return budget && budget.annee === this.anneeSelectionnee && budget.mois === this.moisSelectionne;
      })
      .reduce((total, d) => total + d.montant, 0);
  }

  getEntreesMensuelles(): number {
    return this.transactions
      .filter(t => t.type === 'entree' && 
                   t.dateTransaction.getFullYear() === this.anneeSelectionnee &&
                   t.dateTransaction.getMonth() + 1 === this.moisSelectionne)
      .reduce((total, t) => total + t.montant, 0);
  }

  getSortiesMensuelles(): number {
    return this.transactions
      .filter(t => t.type === 'sortie' && 
                   t.dateTransaction.getFullYear() === this.anneeSelectionnee &&
                   t.dateTransaction.getMonth() + 1 === this.moisSelectionne)
      .reduce((total, t) => total + t.montant, 0);
  }

  getSoldeMensuel(): number {
    return this.getEntreesMensuelles() - this.getSortiesMensuelles();
  }

  getDetailsMensuels(): any {
    const categories = ['scolarite', 'sante', 'nutrition', 'transport', 'administration', 'autres'];
    const details: any = {};
    
    categories.forEach(categorie => {
      const budgetsCategorie = this.budgets.filter(b => 
        b.categorie === categorie && b.annee === this.anneeSelectionnee && b.mois === this.moisSelectionne
      );
      const depensesCategorie = this.depenses.filter(d => {
        const budget = this.budgets.find(b => b.id === d.budgetId);
        return budget && budget.categorie === categorie && 
               budget.annee === this.anneeSelectionnee && budget.mois === this.moisSelectionne;
      });
      
      const budgetTotal = budgetsCategorie.reduce((total, b) => total + b.montantAlloue, 0);
      const depensesTotal = depensesCategorie.reduce((total, d) => total + d.montant, 0);
      
      details[categorie] = {
        budget: budgetTotal,
        depenses: depensesTotal,
        reste: budgetTotal - depensesTotal
      };
    });
    
    return details;
  }

  getEvolutionMensuelle(): any[] {
    const evolution = [];
    
    for (let mois = 1; mois <= 12; mois++) {
      const budgetsMois = this.budgets.filter(b => b.annee === this.anneeSelectionnee && b.mois === mois);
      const depensesMois = this.depenses.filter(d => {
        const budget = this.budgets.find(b => b.id === d.budgetId);
        return budget && budget.annee === this.anneeSelectionnee && budget.mois === mois;
      });
      
      const budgetTotal = budgetsMois.reduce((total, b) => total + b.montantAlloue, 0);
      const depensesTotal = depensesMois.reduce((total, d) => total + d.montant, 0);
      
      evolution.push({
        mois: mois,
        budget: budgetTotal,
        depenses: depensesTotal,
        reste: budgetTotal - depensesTotal
      });
    }
    
    return evolution;
  }

  // Utilitaires
  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  }

  getDetailCategorie(categorie: string, propriete: 'budget' | 'depenses' | 'reste'): number {
    if (this.rapportFinancier && this.rapportFinancier.details) {
      const detail = this.rapportFinancier.details[categorie as keyof typeof this.rapportFinancier.details];
      return detail ? detail[propriete] : 0;
    }
    return 0;
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

  getTauxUtilisationClass(taux: number): string {
    if (taux >= 90) return 'text-danger';
    if (taux >= 75) return 'text-warning';
    return 'text-success';
  }

  // Génération de rapports
  genererRapport(type: string) {
    switch (type) {
      case 'global':
        this.genererRapportFinancier();
        break;
      case 'mensuel':
        this.genererRapportMensuel();
        break;
      case 'annuel':
        this.genererRapportAnnuel();
        break;
    }
    
    this.notifications.success(`Rapport ${type} généré avec succès`);
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

  telechargerRapport() {
    const rapport = this.rapportFinancier;
    if (!rapport) {
      this.notifications.error('Aucun rapport à télécharger');
      return;
    }
    
    const contenu = this.genererContenuRapport(rapport);
    const blob = new Blob([contenu], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-financier-${this.anneeSelectionnee}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    this.notifications.success('Rapport téléchargé avec succès');
  }

  private genererContenuRapport(rapport: RapportFinancier): string {
    let contenu = `RAPPORT FINANCIER CDEJ\n`;
    contenu += `========================\n\n`;
    contenu += `Période: ${rapport.periode}\n`;
    contenu += `Date de génération: ${rapport.dateGeneration.toLocaleDateString('fr-FR')}\n\n`;
    
    contenu += `RÉSUMÉ GLOBAL\n`;
    contenu += `-------------\n`;
    contenu += `Total entrées: ${this.formatMontant(rapport.totalEntrees)}\n`;
    contenu += `Total sorties: ${this.formatMontant(rapport.totalSorties)}\n`;
    contenu += `Solde: ${this.formatMontant(rapport.solde)}\n\n`;
    
    contenu += `DÉTAILS PAR CATÉGORIE\n`;
    contenu += `---------------------\n`;
    
    Object.keys(rapport.details).forEach(categorie => {
      const detail = rapport.details[categorie as keyof typeof rapport.details];
      contenu += `${categorie.toUpperCase()}:\n`;
      contenu += `  - Budget: ${this.formatMontant(detail.budget)}\n`;
      contenu += `  - Dépenses: ${this.formatMontant(detail.depenses)}\n`;
      contenu += `  - Reste: ${this.formatMontant(detail.reste)}\n\n`;
    });
    
    return contenu;
  }

  // Méthodes pour les alertes
  getAlertes(): any[] {
    const alertes = [];
    
    if (this.solde < 0) {
      alertes.push({
        type: 'danger',
        message: `Solde négatif : ${this.formatMontant(this.solde)}`
      });
    }
    
    if (this.totalDepenses > this.totalBudget * 0.9) {
      alertes.push({
        type: 'warning',
        message: 'Budget presque épuisé (90% utilisé)'
      });
    }
    
    Object.keys(this.detailsParCategorie).forEach(categorie => {
      const detail = this.detailsParCategorie[categorie];
      if (detail.tauxUtilisation > 100) {
        alertes.push({
          type: 'danger',
          message: `Budget dépassé pour ${categorie} : ${detail.tauxUtilisation}%`
        });
      }
    });
    
    return alertes;
  }
}      