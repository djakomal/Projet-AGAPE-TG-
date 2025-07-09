import { Injectable } from '@angular/core';
import { Parrain } from '../models/parrain.model';

@Injectable({ providedIn: 'root' })
export class ParrainMockService {
  private parrains: Parrain[] = [
    { id: '1', nom: 'M. Dupont', contact: 'dupont@email.com', enfant_parraine: ['1'] },
    { id: '2', nom: 'Mme Martin', contact: 'martin@email.com', enfant_parraine: ['3'] },
  ];

  getAll(): Parrain[] {
    return [...this.parrains];
  }

  getById(id: string): Parrain | undefined {
    return this.parrains.find(p => p.id === id);
  }

  add(parrain: Parrain): void {
    this.parrains.push(parrain);
  }

  update(id: string, parrain: Partial<Parrain>): void {
    const idx = this.parrains.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.parrains[idx] = { ...this.parrains[idx], ...parrain };
    }
  }

  delete(id: string): void {
    this.parrains = this.parrains.filter(p => p.id !== id);
  }
} 