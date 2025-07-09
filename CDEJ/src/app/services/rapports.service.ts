import { Injectable } from '@angular/core';
import { EnfantMockService } from './enfant-mock.service';
import { LettreMockService } from './lettre-mock.service';

export interface StatistiquesGlobales {
  totalEnfants: number;
  enfantsParraines: number;
  enfantsNonParraines: number;
  tauxParrainage: number;
  totalLettres: number;
  lettresEnvoyees: number;
  lettresRecues: number;
  tauxEnvoi: number;
  enfantsSansLettre: number;
  enfantsRisqueExclusion: number;
  budgetTotal: number;
  budgetUtilise: number;
}

export interface StatistiquesParClasse {
  nomClasse: string;
  nombreEnfants: number;
  reussis: number;
  echoues: number;
  tauxReussite: number;
  enfantsParraines: number;
  budgetAlloue: number;
  budgetUtilise: number;
}

export interface StatistiquesParrainage {
  typeParrainage: string;
  nombre: number;
  montantTotal: number;
  montantMoyen: number;
}

export interface RapportMensuel {
  mois: string;
  annee: number;
  nouveauxEnfants: number;
  nouveauxParrainages: number;
  lettresEnvoyees: number;
  lettresRecues: number;
  enfantsExclus: number;
  budgetUtilise: number;
}

@Injectable({ providedIn: 'root' })
export class RapportsService {
  constructor(
    private enfantService: EnfantMockService,
    private lettreService: LettreMockService
  ) {}

  getStatistiquesGlobales(): StatistiquesGlobales {
    const enfants = this.enfantService.getAll();
    const lettres = this.lettreService.getAll();
    const enfantsSansLettre = this.lettreService.getEnfantsSansLettre(enfants);

    const totalEnfants = enfants.length;
    const enfantsParraines = enfants.filter(e => e.parrainId).length;
    const enfantsNonParraines = totalEnfants - enfantsParraines;
    const tauxParrainage = totalEnfants > 0 ? Math.round((enfantsParraines / totalEnfants) * 100) : 0;

    const totalLettres = lettres.length;
    const lettresEnvoyees = lettres.filter(l => l.statut === 'envoyee').length;
    const lettresRecues = lettres.filter(l => l.statut === 'recue').length;
    const tauxEnvoi = totalLettres > 0 ? Math.round((lettresEnvoyees / totalLettres) * 100) : 0;

    const enfantsRisqueExclusion = enfantsSansLettre.filter(e => e.risqueExclusion).length;

    return {
      totalEnfants,
      enfantsParraines,
      enfantsNonParraines,
      tauxParrainage,
      totalLettres,
      lettresEnvoyees,
      lettresRecues,
      tauxEnvoi,
      enfantsSansLettre: enfantsSansLettre.length,
      enfantsRisqueExclusion,
      budgetTotal: 0, // Placeholder, will be implemented
      budgetUtilise: 0 // Placeholder, will be implemented
    };
  }

  getStatistiquesParClasse(): StatistiquesParClasse[] {
    const enfants = this.enfantService.getAll();
    const classes = [...new Set(enfants.map(e => e.classe))];

    return classes.map(classe => {
      const enfantsClasse = enfants.filter(e => e.classe === classe);
      const reussis = enfantsClasse.filter(e => e.resultat_annee === 'reussi').length;
      const echoues = enfantsClasse.filter(e => e.resultat_annee === 'echoue').length;
      const enfantsParraines = enfantsClasse.filter(e => e.parrainId).length;
      const tauxReussite = enfantsClasse.length > 0 ? Math.round((reussis / enfantsClasse.length) * 100) : 0;

      return {
        nomClasse: classe,
        nombreEnfants: enfantsClasse.length,
        reussis,
        echoues,
        tauxReussite,
        enfantsParraines,
        budgetAlloue: 0, // Placeholder, will be implemented
        budgetUtilise: 0 // Placeholder, will be implemented
      };
    }).sort((a, b) => a.nomClasse.localeCompare(b.nomClasse));
  }

  getStatistiquesParrainage(): StatistiquesParrainage[] {
    // Simuler des données de parrainage par type
    return [
      {
        typeParrainage: 'Complet',
        nombre: 45,
        montantTotal: 27000,
        montantMoyen: 600
      },
      {
        typeParrainage: 'Partiel',
        nombre: 23,
        montantTotal: 13800,
        montantMoyen: 600
      },
      {
        typeParrainage: 'Temporaire',
        nombre: 12,
        montantTotal: 7200,
        montantMoyen: 600
      }
    ];
  }

  getRapportMensuel(mois: number, annee: number): RapportMensuel {
    // Simuler des données mensuelles
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    return {
      mois: moisNoms[mois - 1],
      annee,
      nouveauxEnfants: Math.floor(Math.random() * 5) + 1,
      nouveauxParrainages: Math.floor(Math.random() * 3) + 1,
      lettresEnvoyees: Math.floor(Math.random() * 20) + 10,
      lettresRecues: Math.floor(Math.random() * 15) + 8,
      enfantsExclus: Math.floor(Math.random() * 2),
      budgetUtilise: Math.floor(Math.random() * 5000) + 3000
    };
  }

  getRapportAnnuel(annee: number): RapportMensuel[] {
    const rapports: RapportMensuel[] = [];
    for (let mois = 1; mois <= 12; mois++) {
      rapports.push(this.getRapportMensuel(mois, annee));
    }
    return rapports;
  }

  // Méthode pour générer un rapport d'exclusion
  getRapportExclusion(): any[] {
    const enfants = this.enfantService.getAll();
    const enfantsSansLettre = this.lettreService.getEnfantsSansLettre(enfants);
    
    return enfantsSansLettre
      .filter(e => e.risqueExclusion)
      .map(e => ({
        ...e,
        dateInscription: new Date('2023-01-01'), // Simulé
        motifExclusion: 'Absence de lettre depuis plus de 6 mois',
        recommandation: 'Contacter la famille pour relancer l\'écriture de lettres'
      }));
  }

  // Méthode pour obtenir les données de graphiques
  getDonneesGraphiques() {
    const stats = this.getStatistiquesGlobales();
    const statsClasses = this.getStatistiquesParClasse();
    
    return {
      repartitionParrainage: {
        labels: ['Parrainés', 'Non parrainés'],
        data: [stats.enfantsParraines, stats.enfantsNonParraines]
      },
      tauxReussiteParClasse: {
        labels: statsClasses.map(s => s.nomClasse),
        data: statsClasses.map(s => s.tauxReussite)
      },
      evolutionLettres: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        data: [15, 18, 22, 19, 25, 28]
      }
    };
  }
} 