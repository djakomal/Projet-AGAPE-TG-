import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierMedicalMockService } from '../../../services/dossier-medical-mock.service';
import { SuiviSante } from '../../../models/dossier-medical.model';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-suivi-sante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suivi-sante.component.html',
  styleUrl: './suivi-sante.component.css'
})
export class SuiviSanteComponent {
  suivis: SuiviSante[] = [];
  filteredSuivis: SuiviSante[] = [];
  selected: SuiviSante | null = null;
  isEdit = false;
  searchTerm = '';
  newSuivi: SuiviSante = {
    id: '',
    enfant_id: '',
    enfant_nom: '',
    enfant_prenom: '',
    date_mesure: new Date(),
    poids: 0,
    taille: 0,
    imc: 0,
    tension_arterielle: '',
    temperature: 36.5,
    observations: '',
    recommandations: '',
    statut_nutritionnel: 'normal',
    vaccinations_a_jour: true,
    prochaines_vaccinations: []
  };

  constructor(
    private medicalService: DossierMedicalMockService,
    private notifications: NotificationsService
  ) {
    this.refresh();
  }

  refresh() {
    this.suivis = this.medicalService.getAllSuivis();
    this.filterSuivis();
  }

  filterSuivis() {
    if (!this.searchTerm.trim()) {
      this.filteredSuivis = [...this.suivis];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSuivis = this.suivis.filter(suivi =>
        suivi.enfant_nom?.toLowerCase().includes(term) ||
        suivi.enfant_prenom?.toLowerCase().includes(term) ||
        suivi.observations.toLowerCase().includes(term)
      );
    }
  }

  // Getters pour les statistiques
  get totalSuivis(): number {
    return this.suivis.length;
  }

  get enfantsNormaux(): number {
    return this.suivis.filter(s => s.statut_nutritionnel === 'normal').length;
  }

  get enfantsInsuffisants(): number {
    return this.suivis.filter(s => s.statut_nutritionnel === 'insuffisant').length;
  }

  get vaccinationsAJour(): number {
    return this.suivis.filter(s => s.vaccinations_a_jour).length;
  }

  select(suivi: SuiviSante) {
    this.selected = { ...suivi };
    this.isEdit = true;
  }

  startAdd() {
    this.selected = { ...this.newSuivi };
    this.isEdit = false;
  }

  calculateIMC(poids: number, taille: number): number {
    if (taille > 0) {
      return Math.round((poids / Math.pow(taille / 100, 2)) * 100) / 100;
    }
    return 0;
  }

  getStatutNutritionnelColor(statut: string): string {
    switch (statut) {
      case 'normal': return 'success';
      case 'insuffisant': return 'warning';
      case 'surpoids': return 'warning';
      case 'obesite': return 'danger';
      default: return 'secondary';
    }
  }

  getStatutNutritionnelLabel(statut: string): string {
    switch (statut) {
      case 'normal': return 'Normal';
      case 'insuffisant': return 'Insuffisant';
      case 'surpoids': return 'Surpoids';
      case 'obesite': return 'Obésité';
      default: return 'Inconnu';
    }
  }

  save() {
    if (this.selected) {
      // Calculer l'IMC automatiquement
      this.selected.imc = this.calculateIMC(this.selected.poids, this.selected.taille);
      
      if (this.isEdit) {
        this.medicalService.updateSuivi(this.selected.id, this.selected);
        this.notifications.success('Suivi de santé modifié avec succès');
      } else {
        this.selected.id = Date.now().toString();
        this.medicalService.addSuivi(this.selected);
        this.notifications.success('Suivi de santé ajouté avec succès');
      }
      this.selected = null;
      this.refresh();
    }
  }

  delete(suivi: SuiviSante) {
    if (confirm('Supprimer ce suivi de santé ?')) {
      this.medicalService.deleteSuivi(suivi.id);
      this.notifications.success('Suivi de santé supprimé');
      this.refresh();
    }
  }

  cancel() {
    this.selected = null;
  }
}
