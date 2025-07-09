import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetMockService } from '../../../services/budget-mock.service';
import { NotificationsService } from '../../../services/notifications.service';
import { Budget, Depense, Transaction } from '../../../models/budget.model';

@Component({
  selector: 'app-gestion-financiere',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-financiere.component.html',
  styleUrl: './gestion-financiere.component.css'
})
export class GestionFinanciereComponent implements OnInit {
  budgets: Budget[] = [];
  depenses: Depense[] = [];
  transactions: Transaction[] = [];
  
  // Filtres
  anneeSelectionnee = new Date().getFullYear();
  categorieSelectionnee = '';
  statutSelectionne = '';
  
  // Formulaires
  showBudgetForm = false;
  showDepenseForm = false;
  showTransactionForm = false;
  
  // Nouveaux éléments
  nouveauBudget: Partial<Budget> = {};
  nouvelleDepense: Partial<Depense> = {};
  nouvelleTransaction: Partial<Transaction> = {};
  
  // Statistiques
  totalBudget = 0;
  totalDepenses = 0;
  totalEntrees = 0;
  totalSorties = 0;
  solde = 0;

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
  }

  calculerStatistiques() {
    this.totalBudget = this.budgetService.getTotalBudget(this.anneeSelectionnee);
    this.totalDepenses = this.budgetService.getTotalDepenses(this.anneeSelectionnee);
    this.totalEntrees = this.budgetService.getTotalEntrees(this.anneeSelectionnee);
    this.totalSorties = this.budgetService.getTotalSorties(this.anneeSelectionnee);
    this.solde = this.budgetService.getSolde(this.anneeSelectionnee);
  }

  // Filtres
  getBudgetsFiltres(): Budget[] {
    let budgets = this.budgets.filter(b => b.annee === this.anneeSelectionnee);
    
    if (this.categorieSelectionnee) {
      budgets = budgets.filter(b => b.categorie === this.categorieSelectionnee);
    }
    
    if (this.statutSelectionne) {
      budgets = budgets.filter(b => b.statut === this.statutSelectionne);
    }
    
    return budgets;
  }

  getDepensesFiltrees(): Depense[] {
    let depenses = this.depenses;
    
    if (this.categorieSelectionnee) {
      depenses = depenses.filter(d => d.categorie === this.categorieSelectionnee);
    }
    
    if (this.statutSelectionne) {
      depenses = depenses.filter(d => d.statut === this.statutSelectionne);
    }
    
    return depenses;
  }

  getTransactionsFiltrees(): Transaction[] {
    let transactions = this.transactions.filter(t => 
      t.dateTransaction.getFullYear() === this.anneeSelectionnee
    );
    
    if (this.categorieSelectionnee) {
      transactions = transactions.filter(t => t.categorie === this.categorieSelectionnee);
    }
    
    if (this.statutSelectionne) {
      transactions = transactions.filter(t => t.statut === this.statutSelectionne);
    }
    
    return transactions;
  }

  // Actions sur les budgets
  ajouterBudget() {
    if (this.nouveauBudget.montantAlloue && this.nouveauBudget.categorie) {
      const budget: Omit<Budget, 'id'> = {
        annee: this.anneeSelectionnee,
        mois: new Date().getMonth() + 1,
        montantAlloue: this.nouveauBudget.montantAlloue!,
        montantUtilise: 0,
        montantRestant: this.nouveauBudget.montantAlloue!,
        statut: 'en_cours',
        dateCreation: new Date(),
        dateModification: new Date(),
        description: this.nouveauBudget.description || '',
        categorie: this.nouveauBudget.categorie!
      };
      
      this.budgetService.addBudget(budget);
      this.notifications.success('Budget ajouté avec succès');
      this.resetBudgetForm();
      this.refresh();
    } else {
      this.notifications.error('Veuillez remplir tous les champs obligatoires');
    }
  }

  modifierBudget(budget: Budget) {
    this.budgetService.updateBudget(budget.id, budget);
    this.notifications.success('Budget modifié avec succès');
    this.refresh();
  }

  supprimerBudget(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      this.budgetService.deleteBudget(id);
      this.notifications.success('Budget supprimé avec succès');
      this.refresh();
    }
  }

  // Actions sur les dépenses
  ajouterDepense() {
    if (this.nouvelleDepense.montant && this.nouvelleDepense.description && this.nouvelleDepense.categorie) {
      const depense: Omit<Depense, 'id'> = {
        budgetId: this.nouvelleDepense.budgetId || '',
        categorie: this.nouvelleDepense.categorie!,
        montant: this.nouvelleDepense.montant!,
        description: this.nouvelleDepense.description!,
        dateDepense: new Date(),
        statut: 'en_attente',
        justificatif: this.nouvelleDepense.justificatif || ''
      };
      
      this.budgetService.addDepense(depense);
      this.notifications.success('Dépense ajoutée avec succès');
      this.resetDepenseForm();
      this.refresh();
    } else {
      this.notifications.error('Veuillez remplir tous les champs obligatoires');
    }
  }

  validerDepense(depense: Depense) {
    depense.statut = 'validee';
    depense.validePar = 'comptable1';
    depense.dateValidation = new Date();
    this.budgetService.updateDepense(depense.id, depense);
    this.notifications.success('Dépense validée avec succès');
    this.refresh();
  }

  rejeterDepense(depense: Depense, motif: string) {
    depense.statut = 'rejetee';
    depense.motifRejet = motif;
    this.budgetService.updateDepense(depense.id, depense);
    this.notifications.success('Dépense rejetée');
    this.refresh();
  }

  supprimerDepense(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.budgetService.deleteDepense(id);
      this.notifications.success('Dépense supprimée avec succès');
      this.refresh();
    }
  }

  // Actions sur les transactions
  ajouterTransaction() {
    if (this.nouvelleTransaction.montant && this.nouvelleTransaction.description && this.nouvelleTransaction.type) {
      const transaction: Omit<Transaction, 'id'> = {
        type: this.nouvelleTransaction.type!,
        montant: this.nouvelleTransaction.montant!,
        description: this.nouvelleTransaction.description!,
        dateTransaction: new Date(),
        categorie: this.nouvelleTransaction.categorie || 'autres',
        reference: this.nouvelleTransaction.reference || '',
        statut: 'en_attente'
      };
      
      this.budgetService.addTransaction(transaction);
      this.notifications.success('Transaction ajoutée avec succès');
      this.resetTransactionForm();
      this.refresh();
    } else {
      this.notifications.error('Veuillez remplir tous les champs obligatoires');
    }
  }

  confirmerTransaction(transaction: Transaction) {
    transaction.statut = 'confirmee';
    this.budgetService.updateTransaction(transaction.id, transaction);
    this.notifications.success('Transaction confirmée');
    this.refresh();
  }

  annulerTransaction(transaction: Transaction) {
    transaction.statut = 'annulee';
    this.budgetService.updateTransaction(transaction.id, transaction);
    this.notifications.success('Transaction annulée');
    this.refresh();
  }

  supprimerTransaction(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      this.budgetService.deleteTransaction(id);
      this.notifications.success('Transaction supprimée avec succès');
      this.refresh();
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
      case 'en_cours': return 'bg-primary';
      case 'epuise': return 'bg-danger';
      case 'ferme': return 'bg-secondary';
      case 'validee': return 'bg-success';
      case 'en_attente': return 'bg-warning';
      case 'rejetee': return 'bg-danger';
      case 'confirmee': return 'bg-success';
      case 'annulee': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getTypeClass(type: string): string {
    return type === 'entree' ? 'text-success' : 'text-danger';
  }

  // Reset des formulaires
  resetBudgetForm() {
    this.nouveauBudget = {};
    this.showBudgetForm = false;
  }

  resetDepenseForm() {
    this.nouvelleDepense = {};
    this.showDepenseForm = false;
  }

  resetTransactionForm() {
    this.nouvelleTransaction = {};
    this.showTransactionForm = false;
  }

  // Génération de rapports
  genererRapport() {
    const rapport = {
      annee: this.anneeSelectionnee,
      totalBudget: this.totalBudget,
      totalDepenses: this.totalDepenses,
      totalEntrees: this.totalEntrees,
      totalSorties: this.totalSorties,
      solde: this.solde,
      budgets: this.getBudgetsFiltres(),
      depenses: this.getDepensesFiltrees(),
      transactions: this.getTransactionsFiltrees()
    };
    
    console.log('Rapport financier:', rapport);
    this.notifications.success('Rapport généré avec succès');
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
}
