export interface Lettre {
  id: string;
  enfantId: string;
  enfantNom: string;
  enfantPrenom: string;
  destinataire: string;
  contenu: string;
  date: Date;
  dateEcriture: Date;
  dateEnvoi?: Date;
  statut: 'brouillon' | 'envoyee' | 'recue';
  type: 'remerciement' | 'demande' | 'nouvelle';
} 