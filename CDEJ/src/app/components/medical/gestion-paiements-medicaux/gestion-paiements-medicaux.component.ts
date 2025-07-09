import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierMedicalMockService } from '../../../services/dossier-medical-mock.service';
import { PaiementMedical } from '../../../models/dossier-medical.model';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-gestion-paiements-medicaux',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-paiements-medicaux.component.html',
  styleUrl: './gestion-paiements-medicaux.component.css'
})
export class GestionPaiementsMedicauxComponent {
  paiements: PaiementMedical[] = [];
  filteredPaiements: PaiementMedical[] = [];
  selected: PaiementMedical | null = null;
  isEdit = false;
  searchTerm = '';
  selectedStatus = '';
  selectedType = '';
  selectedMonth = '';
  selectedYear = '';
  
  newPaiement: PaiementMedical = {
    id: '',
    enfant_id: '',
    enfant_nom: '',
    montant: 0,
    type_paiement: 'consultation',
    description: '',
    date_paiement: new Date().toISOString().split('T')[0],
    statut: 'en_attente',
    mode_paiement: 'especes',
    reference: '',
    notes: ''
  };

  typesPaiement = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'medicaments', label: 'Médicaments' },
    { value: 'analyses', label: 'Analyses' },
    { value: 'hospitalisation', label: 'Hospitalisation' },
    { value: 'chirurgie', label: 'Chirurgie' },
    { value: 'autre', label: 'Autre' }
  ];

  statuts = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'paye', label: 'Payé' },
    { value: 'annule', label: 'Annulé' },
    { value: 'rembourse', label: 'Remboursé' }
  ];

  modesPaiement = [
    { value: 'especes', label: 'Espèces' },
    { value: 'cheque', label: 'Chèque' },
    { value: 'virement', label: 'Virement' },
    { value: 'carte', label: 'Carte bancaire' },
    { value: 'assurance', label: 'Assurance' }
  ];

  mois = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  annees = Array.from({ length: 5 }, (_, i) => {
    const annee = new Date().getFullYear() - 2 + i;
    return { value: annee.toString(), label: annee.toString() };
  });

  constructor(
    private medicalService: DossierMedicalMockService,
    private notifications: NotificationsService
  ) {
    this.refresh();
  }

  refresh() {
    this.paiements = this.medicalService.getAllPaiementsMedicaux();
    this.filterPaiements();
  }

  filterPaiements() {
    let filtered = [...this.paiements];

    // Filtre par recherche textuelle
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(paiement =>
        paiement.enfant_nom.toLowerCase().includes(term) ||
        paiement.description.toLowerCase().includes(term) ||
        (paiement.reference && paiement.reference.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (this.selectedStatus) {
      filtered = filtered.filter(paiement => paiement.statut === this.selectedStatus);
    }

    // Filtre par type
    if (this.selectedType) {
      filtered = filtered.filter(paiement => paiement.type_paiement === this.selectedType);
    }

    // Filtre par mois
    if (this.selectedMonth) {
      filtered = filtered.filter(paiement => {
        const mois = new Date(paiement.date_paiement).getMonth() + 1;
        return mois.toString().padStart(2, '0') === this.selectedMonth;
      });
    }

    // Filtre par année
    if (this.selectedYear) {
      filtered = filtered.filter(paiement => {
        const annee = new Date(paiement.date_paiement).getFullYear();
        return annee.toString() === this.selectedYear;
      });
    }

    this.filteredPaiements = filtered;
  }

  // Getters pour les statistiques
  get totalPaiements(): number {
    return this.paiements.length;
  }

  get montantTotal(): number {
    return this.paiements.reduce((sum, p) => sum + p.montant, 0);
  }

  get paiementsPayes(): number {
    return this.paiements.filter(p => p.statut === 'paye').length;
  }

  get paiementsEnAttente(): number {
    return this.paiements.filter(p => p.statut === 'en_attente').length;
  }

  get montantEnAttente(): number {
    return this.paiements
      .filter(p => p.statut === 'en_attente')
      .reduce((sum, p) => sum + p.montant, 0);
  }

  select(paiement: PaiementMedical) {
    this.selected = { ...paiement };
    this.isEdit = true;
  }

  startAdd() {
    this.selected = { ...this.newPaiement };
    this.isEdit = false;
  }

  getStatusColor(statut: string): string {
    switch (statut) {
      case 'paye': return 'success';
      case 'en_attente': return 'warning';
      case 'annule': return 'danger';
      case 'rembourse': return 'info';
      default: return 'secondary';
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'paye': return 'Payé';
      case 'en_attente': return 'En attente';
      case 'annule': return 'Annulé';
      case 'rembourse': return 'Remboursé';
      default: return 'Inconnu';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'consultation': return 'Consultation';
      case 'medicaments': return 'Médicaments';
      case 'analyses': return 'Analyses';
      case 'hospitalisation': return 'Hospitalisation';
      case 'chirurgie': return 'Chirurgie';
      case 'autre': return 'Autre';
      default: return 'Inconnu';
    }
  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'especes': return 'Espèces';
      case 'cheque': return 'Chèque';
      case 'virement': return 'Virement';
      case 'carte': return 'Carte bancaire';
      case 'assurance': return 'Assurance';
      default: return 'Inconnu';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  }

  save() {
    if (this.selected) {
      if (this.isEdit) {
        this.medicalService.updatePaiementMedical(this.selected.id, this.selected);
        this.notifications.success('Paiement modifié avec succès');
      } else {
        this.selected.id = Date.now().toString();
        this.medicalService.addPaiementMedical(this.selected);
        this.notifications.success('Paiement ajouté avec succès');
      }
      this.selected = null;
      this.refresh();
    }
  }

  delete(paiement: PaiementMedical) {
    if (confirm(`Supprimer le paiement de ${paiement.enfant_nom} (${this.formatMontant(paiement.montant)}) ?`)) {
      this.medicalService.deletePaiementMedical(paiement.id);
      this.notifications.success('Paiement supprimé');
      this.refresh();
    }
  }

  cancel() {
    this.selected = null;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedMonth = '';
    this.selectedYear = '';
    this.filterPaiements();
  }

  // Méthodes pour la gestion des statuts
  marquerCommePaye(paiement: PaiementMedical) {
    paiement.statut = 'paye';
    this.medicalService.updatePaiementMedical(paiement.id, paiement);
    this.notifications.success('Paiement marqué comme payé');
    this.refresh();
  }

  marquerCommeRembourse(paiement: PaiementMedical) {
    paiement.statut = 'rembourse';
    this.medicalService.updatePaiementMedical(paiement.id, paiement);
    this.notifications.success('Paiement marqué comme remboursé');
    this.refresh();
  }

  annulerPaiement(paiement: PaiementMedical) {
    if (confirm(`Annuler le paiement de ${paiement.enfant_nom} ?`)) {
      paiement.statut = 'annule';
      this.medicalService.updatePaiementMedical(paiement.id, paiement);
      this.notifications.success('Paiement annulé');
      this.refresh();
    }
  }
}
