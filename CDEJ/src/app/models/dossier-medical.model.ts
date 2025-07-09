export interface DossierMedical {
  id: string;
  enfant_id: string;
  enfant_nom?: string;
  enfant_prenom?: string;
  date_consultation: Date;
  type_consultation: 'preventive' | 'curative' | 'urgence' | 'suivi';
  symptomes: string;
  diagnostic: string;
  traitement: string;
  medicaments: string[];
  duree_traitement: number; // en jours
  cout_consultation: number;
  cout_medicaments: number;
  cout_total: number;
  statut: 'en_cours' | 'termine' | 'suivi_requis';
  notes_medecin: string;
  prochaine_visite?: Date;
  agent_medical: string;
}

export interface SuiviSante {
  id: string;
  enfant_id: string;
  enfant_nom?: string;
  enfant_prenom?: string;
  date_mesure: Date;
  poids: number; // en kg
  taille: number; // en cm
  imc: number;
  tension_arterielle: string;
  temperature: number;
  observations: string;
  recommandations: string;
  statut_nutritionnel: 'normal' | 'insuffisant' | 'surpoids' | 'obesite';
  vaccinations_a_jour: boolean;
  prochaines_vaccinations: string[];
}

export interface Maladie {
  id: string;
  nom: string;
  description: string;
  symptomes: string[];
  traitement_standard: string;
  duree_moyenne: number; // en jours
  cout_moyen: number;
  niveau_contagion: 'faible' | 'modere' | 'eleve';
  categorie: 'respiratoire' | 'digestive' | 'cutanee' | 'autre';
  prevention: string[];
}

export interface PaiementMedical {
  id: string;
  enfant_id: string;
  enfant_nom: string;
  montant: number;
  type_paiement: 'consultation' | 'medicaments' | 'analyses' | 'hospitalisation' | 'chirurgie' | 'autre';
  description: string;
  date_paiement: string; // Format YYYY-MM-DD
  statut: 'en_attente' | 'paye' | 'annule' | 'rembourse';
  mode_paiement: 'especes' | 'cheque' | 'virement' | 'carte' | 'assurance';
  reference: string;
  notes: string;
}