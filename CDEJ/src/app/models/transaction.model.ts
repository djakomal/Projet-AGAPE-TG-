export interface Transaction {
  id: string;
  type: 'donation' | 'subvention' | 'depense';
  montant: number;
  date: Date;
  agent_demandeur: string;
  statut: 'validee' | 'en_attente' | 'rejetee';
} 