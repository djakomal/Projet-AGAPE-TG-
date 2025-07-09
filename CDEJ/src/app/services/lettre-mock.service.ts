import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Lettre {
  id: string;
  enfantId: string;
  enfantNom: string;
  enfantPrenom: string;
  destinataire: string;
  contenu: string;
  dateEcriture: Date;
  dateEnvoi?: Date;
  statut: 'brouillon' | 'envoyee' | 'recue';
  type: 'remerciement' | 'demande' | 'nouvelle' | 'autre';
}

export interface EnfantSansLettre {
  enfantId: string;
  nom: string;
  prenom: string;
  derniereLettre?: Date;
  moisSansLettre: number;
  risqueExclusion: boolean;
}

@Injectable({ providedIn: 'root' })
export class LettreMockService {
  private lettres: Lettre[] = [
    {
      id: '1',
      enfantId: '1',
      enfantNom: 'Ali',
      enfantPrenom: 'Karim',
      destinataire: 'Parrain Jean',
      contenu: 'Cher parrain, je vous remercie pour votre soutien...',
      dateEcriture: new Date('2024-01-15'),
      dateEnvoi: new Date('2024-01-16'),
      statut: 'envoyee',
      type: 'remerciement'
    },
    {
      id: '2',
      enfantId: '2',
      enfantNom: 'Sara',
      enfantPrenom: 'Benali',
      destinataire: 'Parrain Marie',
      contenu: 'Bonjour, j\'aimerais vous parler de mes études...',
      dateEcriture: new Date('2024-02-20'),
      dateEnvoi: new Date('2024-02-21'),
      statut: 'envoyee',
      type: 'demande'
    }
  ];

  private lettresSubject = new BehaviorSubject<Lettre[]>(this.lettres);
  public lettres$ = this.lettresSubject.asObservable();

  getAll(): Lettre[] {
    return [...this.lettres];
  }

  getById(id: string): Lettre | undefined {
    return this.lettres.find(l => l.id === id);
  }

  getByEnfantId(enfantId: string): Lettre[] {
    return this.lettres.filter(l => l.enfantId === enfantId);
  }

  add(lettre: Omit<Lettre, 'id'>): void {
    const nouvelleLettre: Lettre = {
      ...lettre,
      id: Date.now().toString()
    };
    this.lettres.push(nouvelleLettre);
    this.lettresSubject.next([...this.lettres]);
  }

  update(id: string, lettre: Partial<Lettre>): void {
    const idx = this.lettres.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.lettres[idx] = { ...this.lettres[idx], ...lettre };
      this.lettresSubject.next([...this.lettres]);
    }
  }

  delete(id: string): void {
    this.lettres = this.lettres.filter(l => l.id !== id);
    this.lettresSubject.next([...this.lettres]);
  }

  // Méthode pour obtenir les enfants sans lettre
  getEnfantsSansLettre(enfants: any[]): EnfantSansLettre[] {
    const maintenant = new Date();
    const sixMoisEnMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois en millisecondes

    return enfants.map(enfant => {
      const lettresEnfant = this.getByEnfantId(enfant.id);
      const derniereLettre = lettresEnfant.length > 0 
        ? new Date(Math.max(...lettresEnfant.map(l => l.dateEcriture.getTime())))
        : undefined;

      let moisSansLettre = 0;
      if (derniereLettre) {
        const diffEnMs = maintenant.getTime() - derniereLettre.getTime();
        moisSansLettre = Math.floor(diffEnMs / (30 * 24 * 60 * 60 * 1000));
      } else {
        // Si jamais de lettre, calculer depuis la date d'inscription (simulé)
        const dateInscription = new Date('2023-01-01'); // Date simulée
        const diffEnMs = maintenant.getTime() - dateInscription.getTime();
        moisSansLettre = Math.floor(diffEnMs / (30 * 24 * 60 * 60 * 1000));
      }

      return {
        enfantId: enfant.id,
        nom: enfant.nom,
        prenom: enfant.prenom,
        derniereLettre,
        moisSansLettre,
        risqueExclusion: moisSansLettre >= 6
      };
    }).filter(enfant => enfant.moisSansLettre > 0); // Seulement ceux qui n'ont pas écrit récemment
  }

  // Méthode pour obtenir les statistiques des lettres
  getStatistiques() {
    const total = this.lettres.length;
    const envoyees = this.lettres.filter(l => l.statut === 'envoyee').length;
    const recues = this.lettres.filter(l => l.statut === 'recue').length;
    const brouillons = this.lettres.filter(l => l.statut === 'brouillon').length;

    return {
      total,
      envoyees,
      recues,
      brouillons,
      tauxEnvoi: total > 0 ? Math.round((envoyees / total) * 100) : 0
    };
  }
}