import { Injectable } from '@angular/core';
import { Budget, Depense, Transaction } from '../models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetMockService {
  private budgets: Budget[] = [
    {
      id: '1',
      annee: 2024,
      mois: 1,
      categorie: 'scolarite',
      montantAlloue: 50000,
      montantUtilise: 35000,
      montantRestant: 15000,
      statut: 'en_cours',
      dateCreation: new Date('2024-01-01'),
      dateModification: new Date('2024-01-15'),
      description: 'Budget scolarité janvier 2024'
    },
    {
      id: '2',
      annee: 2024,
      mois: 1,
      categorie: 'sante',
      montantAlloue: 30000,
      montantUtilise: 28000,
      montantRestant: 2000,
      statut: 'en_cours',
      dateCreation: new Date('2024-01-01'),
      dateModification: new Date('2024-01-20'),
      description: 'Budget santé janvier 2024'
    },
    {
      id: '3',
      annee: 2024,
      mois: 1,
      categorie: 'nutrition',
      montantAlloue: 25000,
      montantUtilise: 25000,
      montantRestant: 0,
      statut: 'epuise',
      dateCreation: new Date('2024-01-01'),
      dateModification: new Date('2024-01-25'),
      description: 'Budget nutrition janvier 2024'
    },
    {
      id: '4',
      annee: 2024,
      mois: 1,
      categorie: 'transport',
      montantAlloue: 15000,
      montantUtilise: 12000,
      montantRestant: 3000,
      statut: 'en_cours',
      dateCreation: new Date('2024-01-01'),
      dateModification: new Date('2024-01-18'),
      description: 'Budget transport janvier 2024'
    },
    {
      id: '5',
      annee: 2024,
      mois: 1,
      categorie: 'administration',
      montantAlloue: 20000,
      montantUtilise: 18000,
      montantRestant: 2000,
      statut: 'en_cours',
      dateCreation: new Date('2024-01-01'),
      dateModification: new Date('2024-01-22'),
      description: 'Budget administration janvier 2024'
    }
  ];

  private depenses: Depense[] = [
    {
      id: '1',
      budgetId: '1',
      categorie: 'scolarite',
      montant: 15000,
      description: 'Achat fournitures scolaires',
      dateDepense: new Date('2024-01-10'),
      statut: 'validee',
      justificatif: 'Facture fournitures.pdf',
      validePar: 'comptable1',
      dateValidation: new Date('2024-01-12')
    },
    {
      id: '2',
      budgetId: '1',
      categorie: 'scolarite',
      montant: 20000,
      description: 'Frais de scolarité',
      dateDepense: new Date('2024-01-15'),
      statut: 'validee',
      justificatif: 'Reçus scolarité.pdf',
      validePar: 'comptable1',
      dateValidation: new Date('2024-01-16')
    },
    {
      id: '3',
      budgetId: '2',
      categorie: 'sante',
      montant: 15000,
      description: 'Médicaments et soins',
      dateDepense: new Date('2024-01-08'),
      statut: 'validee',
      justificatif: 'Ordonnances.pdf',
      validePar: 'comptable1',
      dateValidation: new Date('2024-01-09')
    },
    {
      id: '4',
      budgetId: '2',
      categorie: 'sante',
      montant: 13000,
      description: 'Consultations médicales',
      dateDepense: new Date('2024-01-20'),
      statut: 'en_attente',
      justificatif: 'Factures consultations.pdf'
    },
    {
      id: '5',
      budgetId: '3',
      categorie: 'nutrition',
      montant: 25000,
      description: 'Repas et collations',
      dateDepense: new Date('2024-01-25'),
      statut: 'validee',
      justificatif: 'Factures alimentation.pdf',
      validePar: 'comptable1',
      dateValidation: new Date('2024-01-26')
    }
  ];

  private transactions: Transaction[] = [
    {
      id: '1',
      type: 'entree',
      montant: 150000,
      description: 'Don parrainage',
      dateTransaction: new Date('2024-01-01'),
      categorie: 'parrainage',
      reference: 'DON001',
      statut: 'confirmee'
    },
    {
      id: '2',
      type: 'sortie',
      montant: 35000,
      description: 'Paiement fournitures scolaires',
      dateTransaction: new Date('2024-01-10'),
      categorie: 'scolarite',
      reference: 'SORT001',
      statut: 'confirmee'
    },
    {
      id: '3',
      type: 'entree',
      montant: 50000,
      description: 'Subvention gouvernementale',
      dateTransaction: new Date('2024-01-05'),
      categorie: 'subvention',
      reference: 'SUB001',
      statut: 'confirmee'
    },
    {
      id: '4',
      type: 'sortie',
      montant: 28000,
      description: 'Paiement soins médicaux',
      dateTransaction: new Date('2024-01-08'),
      categorie: 'sante',
      reference: 'SORT002',
      statut: 'confirmee'
    }
  ];

  // Méthodes pour les budgets
  getAllBudgets(): Budget[] {
    return [...this.budgets];
  }

  getBudgetById(id: string): Budget | undefined {
    return this.budgets.find(b => b.id === id);
  }

  getBudgetsByCategorie(categorie: string): Budget[] {
    return this.budgets.filter(b => b.categorie === categorie);
  }

  getBudgetsByAnnee(annee: number): Budget[] {
    return this.budgets.filter(b => b.annee === annee);
  }

  addBudget(budget: Omit<Budget, 'id'>): void {
    const nouveauBudget: Budget = {
      ...budget,
      id: Date.now().toString()
    };
    this.budgets.push(nouveauBudget);
  }

  updateBudget(id: string, budget: Partial<Budget>): void {
    const idx = this.budgets.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.budgets[idx] = { ...this.budgets[idx], ...budget, dateModification: new Date() };
    }
  }

  deleteBudget(id: string): void {
    this.budgets = this.budgets.filter(b => b.id !== id);
  }

  // Méthodes pour les dépenses
  getAllDepenses(): Depense[] {
    return [...this.depenses];
  }

  getDepenseById(id: string): Depense | undefined {
    return this.depenses.find(d => d.id === id);
  }

  getDepensesByStatut(statut: string): Depense[] {
    return this.depenses.filter(d => d.statut === statut);
  }

  getDepensesByCategorie(categorie: string): Depense[] {
    return this.depenses.filter(d => d.categorie === categorie);
  }

  addDepense(depense: Omit<Depense, 'id'>): void {
    const nouvelleDepense: Depense = {
      ...depense,
      id: Date.now().toString()
    };
    this.depenses.push(nouvelleDepense);
  }

  updateDepense(id: string, depense: Partial<Depense>): void {
    const idx = this.depenses.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.depenses[idx] = { ...this.depenses[idx], ...depense };
    }
  }

  deleteDepense(id: string): void {
    this.depenses = this.depenses.filter(d => d.id !== id);
  }

  // Méthodes pour les transactions
  getAllTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id);
  }

  getTransactionsByType(type: string): Transaction[] {
    return this.transactions.filter(t => t.type === type);
  }

  getTransactionsByCategorie(categorie: string): Transaction[] {
    return this.transactions.filter(t => t.categorie === categorie);
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const nouvelleTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    this.transactions.push(nouvelleTransaction);
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): void {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.transactions[idx] = { ...this.transactions[idx], ...transaction };
    }
  }

  deleteTransaction(id: string): void {
    this.transactions = this.transactions.filter(t => t.id !== id);
  }

  // Méthodes de calcul
  getTotalBudget(annee: number): number {
    return this.budgets
      .filter(b => b.annee === annee)
      .reduce((total, budget) => total + budget.montantAlloue, 0);
  }

  getTotalDepenses(annee: number): number {
    return this.depenses
      .filter(d => {
        const budget = this.budgets.find(b => b.id === d.budgetId);
        return budget && budget.annee === annee;
      })
      .reduce((total, depense) => total + depense.montant, 0);
  }

  getTotalEntrees(annee: number): number {
    return this.transactions
      .filter(t => t.type === 'entree' && t.dateTransaction.getFullYear() === annee)
      .reduce((total, transaction) => total + transaction.montant, 0);
  }

  getTotalSorties(annee: number): number {
    return this.transactions
      .filter(t => t.type === 'sortie' && t.dateTransaction.getFullYear() === annee)
      .reduce((total, transaction) => total + transaction.montant, 0);
  }

  getSolde(annee: number): number {
    return this.getTotalEntrees(annee) - this.getTotalSorties(annee);
  }
} 