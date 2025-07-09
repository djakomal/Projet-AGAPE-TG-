import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierMedicalMockService } from '../../../services/dossier-medical-mock.service';
import { Maladie } from '../../../models/dossier-medical.model';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-gestion-maladies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-maladies.component.html',
  styleUrl: './gestion-maladies.component.css'
})
export class GestionMaladiesComponent {
  maladies: Maladie[] = [];
  filteredMaladies: Maladie[] = [];
  selected: Maladie | null = null;
  isEdit = false;
  searchTerm = '';
  selectedCategory = '';
  selectedContagion = '';
  
  newMaladie: Maladie = {
    id: '',
    nom: '',
    description: '',
    symptomes: [],
    traitement_standard: '',
    duree_moyenne: 0,
    cout_moyen: 0,
    niveau_contagion: 'faible',
    categorie: 'autre',
    prevention: []
  };

  categories = [
    { value: 'respiratoire', label: 'Respiratoire' },
    { value: 'digestive', label: 'Digestive' },
    { value: 'cutanee', label: 'Cutannée' },
    { value: 'autre', label: 'Autre' }
  ];

  niveauxContagion = [
    { value: 'faible', label: 'Faible' },
    { value: 'modere', label: 'Modéré' },
    { value: 'eleve', label: 'Élevé' }
  ];

  constructor(
    private medicalService: DossierMedicalMockService,
    private notifications: NotificationsService
  ) {
    this.refresh();
  }

  refresh() {
    this.maladies = this.medicalService.getAllMaladies();
    this.filterMaladies();
  }

  filterMaladies() {
    let filtered = [...this.maladies];

    // Filtre par recherche textuelle
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(maladie =>
        maladie.nom.toLowerCase().includes(term) ||
        maladie.description.toLowerCase().includes(term) ||
        maladie.symptomes.some(s => s.toLowerCase().includes(term))
      );
    }

    // Filtre par catégorie
    if (this.selectedCategory) {
      filtered = filtered.filter(maladie => maladie.categorie === this.selectedCategory);
    }

    // Filtre par niveau de contagion
    if (this.selectedContagion) {
      filtered = filtered.filter(maladie => maladie.niveau_contagion === this.selectedContagion);
    }

    this.filteredMaladies = filtered;
  }

  // Getters pour les statistiques
  get totalMaladies(): number {
    return this.maladies.length;
  }

  get maladiesRespiratoires(): number {
    return this.maladies.filter(m => m.categorie === 'respiratoire').length;
  }

  get maladiesContagieuses(): number {
    return this.maladies.filter(m => m.niveau_contagion === 'eleve').length;
  }

  get coutTotalMoyen(): number {
    const total = this.maladies.reduce((sum, m) => sum + m.cout_moyen, 0);
    return this.maladies.length > 0 ? Math.round(total / this.maladies.length) : 0;
  }

  select(maladie: Maladie) {
    this.selected = { ...maladie };
    this.isEdit = true;
  }

  startAdd() {
    this.selected = { ...this.newMaladie };
    this.isEdit = false;
  }

  getContagionColor(niveau: string): string {
    switch (niveau) {
      case 'faible': return 'success';
      case 'modere': return 'warning';
      case 'eleve': return 'danger';
      default: return 'secondary';
    }
  }

  getContagionLabel(niveau: string): string {
    switch (niveau) {
      case 'faible': return 'Faible';
      case 'modere': return 'Modéré';
      case 'eleve': return 'Élevé';
      default: return 'Inconnu';
    }
  }

  getCategorieLabel(categorie: string): string {
    switch (categorie) {
      case 'respiratoire': return 'Respiratoire';
      case 'digestive': return 'Digestive';
      case 'cutanee': return 'Cutannée';
      case 'autre': return 'Autre';
      default: return 'Inconnue';
    }
  }

  addSymptome() {
    if (this.selected && this.selected.symptomes) {
      const nouveauSymptome = prompt('Entrez le nouveau symptôme:');
      if (nouveauSymptome && nouveauSymptome.trim()) {
        this.selected.symptomes.push(nouveauSymptome.trim());
      }
    }
  }

  removeSymptome(index: number) {
    if (this.selected && this.selected.symptomes) {
      this.selected.symptomes.splice(index, 1);
    }
  }

  addPrevention() {
    if (this.selected && this.selected.prevention) {
      const nouvellePrevention = prompt('Entrez la nouvelle mesure de prévention:');
      if (nouvellePrevention && nouvellePrevention.trim()) {
        this.selected.prevention.push(nouvellePrevention.trim());
      }
    }
  }

  removePrevention(index: number) {
    if (this.selected && this.selected.prevention) {
      this.selected.prevention.splice(index, 1);
    }
  }

  save() {
    if (this.selected) {
      if (this.isEdit) {
        this.medicalService.updateMaladie(this.selected.id, this.selected);
        this.notifications.success('Maladie modifiée avec succès');
      } else {
        this.selected.id = Date.now().toString();
        this.medicalService.addMaladie(this.selected);
        this.notifications.success('Maladie ajoutée avec succès');
      }
      this.selected = null;
      this.refresh();
    }
  }

  delete(maladie: Maladie) {
    if (confirm(`Supprimer la maladie "${maladie.nom}" ?`)) {
      this.medicalService.deleteMaladie(maladie.id);
      this.notifications.success('Maladie supprimée');
      this.refresh();
    }
  }

  cancel() {
    this.selected = null;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedContagion = '';
    this.filterMaladies();
  }
}
