import { Injectable } from '@angular/core';
import { Enfant } from '../models/enfant.model';

@Injectable({ providedIn: 'root' })
export class EnfantMockService {
  private enfants: Enfant[] = [
    { id: '1', numero: 'E001', nom: 'Ali', prenom: 'Karim', age: 10, classe: 'CM1', resultat_annee: 'reussi', parrainId: '1', risqueExclusion: false },
    { id: '2', numero: 'E002', nom: 'Sara', prenom: 'Benali', age: 12, classe: 'CM2', resultat_annee: 'echoue', parrainId: null, risqueExclusion: true },
    { id: '3', numero: 'E003', nom: 'Youssef', prenom: 'Amine', age: 11, classe: 'CE2', resultat_annee: 'reussi', parrainId: '2', risqueExclusion: false },
    { id: '4', numero: 'E004', nom: 'Fatima', prenom: 'Zahra', age: 9, classe: 'CE1', resultat_annee: 'reussi', parrainId: '3', risqueExclusion: false },
    { id: '5', numero: 'E005', nom: 'Ahmed', prenom: 'Hassan', age: 13, classe: '6ème', resultat_annee: 'echoue', parrainId: null, risqueExclusion: true },
    { id: '6', numero: 'E006', nom: 'Amina', prenom: 'Khalil', age: 8, classe: 'CP', resultat_annee: 'reussi', parrainId: '4', risqueExclusion: false },
  ];

  getAll(): Enfant[] {
    return [...this.enfants];
  }

  getById(id: string): Enfant | undefined {
    return this.enfants.find(e => e.id === id);
  }

  add(enfant: Enfant): void {
    this.enfants.push(enfant);
  }

  update(id: string, enfant: Partial<Enfant>): void {
    const idx = this.enfants.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.enfants[idx] = { ...this.enfants[idx], ...enfant };
    }
  }

  delete(id: string): void {
    this.enfants = this.enfants.filter(e => e.id !== id);
  }
} 