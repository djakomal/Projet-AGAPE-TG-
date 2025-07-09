export interface Budget {
  id: string;
  annee: number;
  mois: number;
  categorie: 'scolarite' | 'sante' | 'nutrition' | 'transport' | 'administration' | 'autres';
  montantAlloue: number;
  montantUtilise: number;
  montantRestant: number;
  statut: 'en_cours' | 'epuise' | 'ferme';
  dateCreation: Date;
  dateModification: Date;
  description?: string;
}

export interface Depense {
  id: string;
  budgetId: string;
  categorie: string;
  montant: number;
  description: string;
  dateDepense: Date;
  statut: 'en_attente' | 'validee' | 'rejetee';
  justificatif?: string;
  validePar?: string;
  dateValidation?: Date;
  motifRejet?: string;
}

export interface Transaction {
  id: string;
  type: 'entree' | 'sortie';
  montant: number;
  description: string;
  dateTransaction: Date;
  categorie: string;
  reference?: string;
  statut: 'en_attente' | 'confirmee' | 'annulee';
}

export interface RapportFinancier {
  id: string;
  periode: string;
  dateGeneration: Date;
  totalEntrees: number;
  totalSorties: number;
  solde: number;
  details: {
    scolarite: { budget: number; depenses: number; reste: number };
    sante: { budget: number; depenses: number; reste: number };
    nutrition: { budget: number; depenses: number; reste: number };
    transport: { budget: number; depenses: number; reste: number };
    administration: { budget: number; depenses: number; reste: number };
    autres: { budget: number; depenses: number; reste: number };
  };
} 