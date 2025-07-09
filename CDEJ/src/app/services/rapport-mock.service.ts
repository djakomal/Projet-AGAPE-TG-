import { Injectable } from '@angular/core';
import { Rapport } from '../models/rapport.model';

@Injectable({ providedIn: 'root' })
export class RapportMockService {
  private rapports: Rapport[] = [
    { id: '1', type: 'scolarite', periode: '2024-T1', donnees: { enfants: 10 }, cree_par: 'agent1' },
    { id: '2', type: 'financier', periode: '2024-T1', donnees: { total: 150 }, cree_par: 'comptable1' },
  ];

  getAll(): Rapport[] {
    return [...this.rapports];
  }

  getById(id: string): Rapport | undefined {
    return this.rapports.find(r => r.id === id);
  }

  add(rapport: Rapport): void {
    this.rapports.push(rapport);
  }

  update(id: string, rapport: Partial<Rapport>): void {
    const idx = this.rapports.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.rapports[idx] = { ...this.rapports[idx], ...rapport };
    }
  }

  delete(id: string): void {
    this.rapports = this.rapports.filter(r => r.id !== id);
  }
} 