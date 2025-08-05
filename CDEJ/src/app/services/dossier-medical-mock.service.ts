import { Injectable } from '@angular/core';
import { DossierMedical, SuiviSante, Maladie, PaiementMedical } from '../models/dossier-medical.model';

@Injectable({ providedIn: 'root' })
export class DossierMedicalMockService {
  private dossiers: DossierMedical[] = [
    {
      id: '1',
      enfant_id: '1',
      enfant_nom: 'Dupont',
      enfant_prenom: 'Marie',
      date_consultation: new Date('2024-01-15'),
      type_consultation: 'curative',
      symptomes: 'Fièvre, toux, fatigue',
      diagnostic: 'Grippe saisonnière',
      traitement: 'Repos, paracétamol, hydratation',
      medicaments: ['Paracétamol 500mg', 'Vitamine C'],
      duree_traitement: 7,
      cout_consultation: 25,
      cout_medicaments: 15,
      cout_total: 40,
      statut: 'termine',
      notes_medecin: 'Enfant en bonne forme, surveillance de la température',
      agent_medical: 'Dr. Martin'
    },
    {
      id: '2',
      enfant_id: '2',
      enfant_nom: 'Martin',
      enfant_prenom: 'Lucas',
      date_consultation: new Date('2024-02-10'),
      type_consultation: 'preventive',
      symptomes: 'Aucun symptôme',
      diagnostic: 'Bilan de santé annuel',
      traitement: 'Aucun traitement nécessaire',
      medicaments: [],
      duree_traitement: 0,
      cout_consultation: 30,
      cout_medicaments: 0,
      cout_total: 30,
      statut: 'termine',
      notes_medecin: 'Enfant en excellente santé, vaccinations à jour',
      agent_medical: 'Dr. Dubois'
    },
    {
      id: '3',
      enfant_id: '3',
      enfant_nom: 'Bernard',
      enfant_prenom: 'Emma',
      date_consultation: new Date('2024-02-20'),
      type_consultation: 'urgence',
      symptomes: 'Douleur abdominale intense, nausées',
      diagnostic: 'Appendicite suspectée',
      traitement: 'Hospitalisation pour observation',
      medicaments: ['Antibiotiques', 'Antidouleurs'],
      duree_traitement: 14,
      cout_consultation: 50,
      cout_medicaments: 80,
      cout_total: 130,
      statut: 'en_cours',
      notes_medecin: 'Surveillance étroite requise, possible intervention chirurgicale',
      prochaine_visite: new Date('2024-03-05'),
      agent_medical: 'Dr. Martin'
    }
  ];

  private suivis: SuiviSante[] = [
    {
      id: '1',
      enfant_id: '1',
      enfant_nom: 'Dupont',
      enfant_prenom: 'Marie',
      date_mesure: new Date('2024-01-15'),
      poids: 28.5,
      taille: 135,
      imc: 15.6,
      tension_arterielle: '110/70',
      temperature: 37.2,
      observations: 'Enfant en bonne forme physique',
      recommandations: 'Continuer l\'activité physique régulière',
      statut_nutritionnel: 'normal',
      vaccinations_a_jour: true,
      prochaines_vaccinations: ['ROR - 12 ans']
    },
    {
      id: '2',
      enfant_id: '2',
      enfant_nom: 'Martin',
      enfant_prenom: 'Lucas',
      date_mesure: new Date('2024-02-10'),
      poids: 32.0,
      taille: 142,
      imc: 15.9,
      tension_arterielle: '105/65',
      temperature: 36.8,
      observations: 'Croissance normale, bon développement',
      recommandations: 'Augmenter légèrement l\'apport en protéines',
      statut_nutritionnel: 'normal',
      vaccinations_a_jour: true,
      prochaines_vaccinations: []
    }
  ];

  private maladies: Maladie[] = [
    {
      id: '1',
      nom: 'Grippe saisonnière',
      description: 'Infection virale respiratoire courante',
      symptomes: ['Fièvre', 'Toux', 'Fatigue', 'Douleurs musculaires'],
      traitement_standard: 'Repos, hydratation, paracétamol',
      duree_moyenne: 7,
      cout_moyen: 25,
      niveau_contagion: 'eleve',
      categorie: 'respiratoire',
      prevention: ['Vaccination annuelle', 'Hygiène des mains', 'Éviter les contacts rapprochés']
    },
    {
      id: '2',
      nom: 'Varicelle',
      description: 'Maladie virale très contagieuse',
      symptomes: ['Éruption cutanée', 'Démangeaisons', 'Fièvre légère'],
      traitement_standard: 'Crème apaisante, antihistaminiques',
      duree_moyenne: 10,
      cout_moyen: 35,
      niveau_contagion: 'eleve',
      categorie: 'cutanee',
      prevention: ['Vaccination', 'Isolement des malades']
    },
    {
      id: '3',
      nom: 'Gastro-entérite',
      description: 'Inflammation de l\'estomac et des intestins',
      symptomes: ['Diarrhée', 'Vomissements', 'Douleurs abdominales'],
      traitement_standard: 'Réhydratation, régime alimentaire adapté',
      duree_moyenne: 3,
      cout_moyen: 20,
      niveau_contagion: 'modere',
      categorie: 'digestive',
      prevention: ['Hygiène des mains', 'Eau potable', 'Alimentation saine']
    }
  ];

  private paiements: PaiementMedical[] = [
    {
      id: '1',
      enfant_id: '1',
      enfant_nom: 'Dupont Marie',
      montant: 40,
      type_paiement: 'consultation',
      description: 'Consultation médicale + médicaments',
      date_paiement: '2024-01-15',
      statut: 'paye',
      mode_paiement: 'especes',
      reference: 'FAC-2024-001',
      notes: 'Paiement consultation + médicaments'
    },
    {
      id: '2',
      enfant_id: '2',
      enfant_nom: 'Martin Lucas',
      montant: 30,
      type_paiement: 'consultation',
      description: 'Bilan de santé annuel',
      date_paiement: '2024-02-10',
      statut: 'paye',
      mode_paiement: 'carte',
      reference: 'FAC-2024-002',
      notes: 'Bilan de santé annuel'
    },
    {
      id: '3',
      enfant_id: '3',
      enfant_nom: 'Bernard Emma',
      montant: 25,
      type_paiement: 'medicaments',
      description: 'Achat de médicaments',
      date_paiement: '2024-03-05',
      statut: 'en_attente',
      mode_paiement: 'cheque',
      reference: 'FAC-2024-003',
      notes: 'Médicaments pour traitement'
    },
    {
      id: '4',
      enfant_id: '1',
      enfant_nom: 'Dupont Marie',
      montant: 150,
      type_paiement: 'analyses',
      description: 'Analyses sanguines',
      date_paiement: '2024-03-15',
      statut: 'paye',
      mode_paiement: 'virement',
      reference: 'FAC-2024-004',
      notes: 'Analyses de routine'
    },
    {
      id: '5',
      enfant_id: '2',
      enfant_nom: 'Martin Lucas',
      montant: 80,
      type_paiement: 'consultation',
      description: 'Consultation spécialisée',
      date_paiement: '2024-03-20',
      statut: 'en_attente',
      mode_paiement: 'assurance',
      reference: 'FAC-2024-005',
      notes: 'Consultation cardiologue'
    }
  ];

  // Méthodes pour les dossiers médicaux
  getAllDossiers(): DossierMedical[] {
    return [...this.dossiers];
  }

  getDossierById(id: string): DossierMedical | undefined {
    return this.dossiers.find(d => d.id === id);
  }

  addDossier(dossier: DossierMedical): void {
    this.dossiers.push(dossier);
  }

  updateDossier(id: string, dossier: Partial<DossierMedical>): void {
    const idx = this.dossiers.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.dossiers[idx] = { ...this.dossiers[idx], ...dossier };
    }
  }

  deleteDossier(id: string): void {
    this.dossiers = this.dossiers.filter(d => d.id !== id);
  }

  // Méthodes pour le suivi santé
  getAllSuivis(): SuiviSante[] {
    return [...this.suivis];
  }

  getSuiviById(id: string): SuiviSante | undefined {
    return this.suivis.find(s => s.id === id);
  }

  addSuivi(suivi: SuiviSante): void {
    this.suivis.push(suivi);
  }

  updateSuivi(id: string, suivi: Partial<SuiviSante>): void {
    const idx = this.suivis.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.suivis[idx] = { ...this.suivis[idx], ...suivi };
    }
  }

  deleteSuivi(id: string): void {
    this.suivis = this.suivis.filter(s => s.id !== id);
  }

  // Méthodes pour les maladies
  getAllMaladies(): Maladie[] {
    return [...this.maladies];
  }

  getMaladieById(id: string): Maladie | undefined {
    return this.maladies.find(m => m.id === id);
  }

  addMaladie(maladie: Maladie): void {
    this.maladies.push(maladie);
  }

  updateMaladie(id: string, maladie: Partial<Maladie>): void {
    const idx = this.maladies.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.maladies[idx] = { ...this.maladies[idx], ...maladie };
    }
  }

  deleteMaladie(id: string): void {
    this.maladies = this.maladies.filter(m => m.id !== id);
  }

  // Méthodes pour les paiements
  getAllPaiements(): PaiementMedical[] {
    return [...this.paiements];
  }

  getAllPaiementsMedicaux(): PaiementMedical[] {
    return [...this.paiements];
  }

  getPaiementById(id: string): PaiementMedical | undefined {
    return this.paiements.find(p => p.id === id);
  }

  addPaiement(paiement: PaiementMedical): void {
    this.paiements.push(paiement);
  }

  addPaiementMedical(paiement: PaiementMedical): void {
    this.paiements.push(paiement);
  }

  updatePaiementMedical(id: string, paiement: Partial<PaiementMedical>): void {
    const idx = this.paiements.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.paiements[idx] = { ...this.paiements[idx], ...paiement };
    }
  }

  deletePaiementMedical(id: string): void {
    this.paiements = this.paiements.filter(p => p.id !== id);
  }

  // Méthodes de statistiques
  getStatistiques() {
    const totalDossiers = this.dossiers.length;
    const totalCout = this.dossiers.reduce((sum, d) => sum + d.cout_total, 0);
    const dossiersEnCours = this.dossiers.filter(d => d.statut === 'en_cours').length;
    const consultationsPreventives = this.dossiers.filter(d => d.type_consultation === 'preventive').length;

    return {
      totalDossiers,
      totalCout,
      dossiersEnCours,
      consultationsPreventives,
      coutMoyen: totalDossiers > 0 ? totalCout / totalDossiers : 0
    };
  }
}