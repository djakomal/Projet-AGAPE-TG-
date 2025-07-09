import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionMockService {
  private transactions: Transaction[] = [
    { id: '1', type: 'donation', montant: 100, date: new Date('2024-01-01'), agent_demandeur: 'agent1', statut: 'validee' },
    { id: '2', type: 'depense', montant: 50, date: new Date('2024-02-10'), agent_demandeur: 'agent2', statut: 'en_attente' },
  ];

  getAll(): Transaction[] {
    return [...this.transactions];
  }

  getById(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id);
  }

  add(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  update(id: string, transaction: Partial<Transaction>): void {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.transactions[idx] = { ...this.transactions[idx], ...transaction };
    }
  }

  delete(id: string): void {
    this.transactions = this.transactions.filter(t => t.id !== id);
  }
} 