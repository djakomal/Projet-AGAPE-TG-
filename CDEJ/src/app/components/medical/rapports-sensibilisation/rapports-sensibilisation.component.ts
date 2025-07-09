import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierMedicalMockService } from '../../../services/dossier-medical-mock.service';
import { NotificationsService } from '../../../services/notifications.service';

interface StatistiquesGlobales {
  totalEnfants: number;
  consultationsTotal: number;
  coutTotal: number;
  coutMoyen: number;
  suiviNutritionnel: number;
  maladiesIdentifiees: number;
  paiementsTotal: number;
  montantPaiements: number;
}

interface GroupeAge {
  dossiers: number;
  suivis: number;
  cout: number;
}

interface StatistiquesMaladies {
  nombre: number;
  cout: number;
  pourcentage: number;
}

interface StatistiquesFinancieres {
  totalPaiements: number;
  montantTotal: number;
  montantMoyen: number;
  paiementsEnAttente: number;
  montantEnAttente: number;
  coutTotalDossiers: number;
}

interface RapportAnnuel {
  annee: number;
  consultations: number;
  coutTotal: number;
  paiements: number;
  montantPaiements: number;
  evolution: string;
  objectifs: {
    consultations: number;
    vaccination: string;
    prevention: string;
  };
}

interface RisqueExclusion {
  enfant: string;
  risque: string;
  raison: string;
  montant: number;
}

interface RisquesExclusion {
  total: number;
  eleve: number;
  modere: number;
  faible: number;
  details: RisqueExclusion[];
}

@Component({
  selector: 'app-rapports-sensibilisation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapports-sensibilisation.component.html',
  styleUrl: './rapports-sensibilisation.component.css'
})
export class RapportsSensibilisationComponent {
  selectedReport = 'global';
  selectedPeriod = 'mois';
  selectedYear = new Date().getFullYear().toString();
  
  annees = Array.from({ length: 5 }, (_, i) => {
    const annee = new Date().getFullYear() - 2 + i;
    return { value: annee.toString(), label: annee.toString() };
  });

  constructor(
    private medicalService: DossierMedicalMockService,
    private notifications: NotificationsService
  ) {}

  // Statistiques globales
  get statistiquesGlobales(): StatistiquesGlobales {
    const dossiers = this.medicalService.getAllDossiers();
    const suivis = this.medicalService.getAllSuivis();
    const maladies = this.medicalService.getAllMaladies();
    const paiements = this.medicalService.getAllPaiementsMedicaux();

    return {
      totalEnfants: dossiers.length,
      consultationsTotal: dossiers.length,
      coutTotal: dossiers.reduce((sum, d) => sum + d.cout_total, 0),
      coutMoyen: dossiers.length > 0 ? Math.round(dossiers.reduce((sum, d) => sum + d.cout_total, 0) / dossiers.length) : 0,
      suiviNutritionnel: suivis.length,
      maladiesIdentifiees: maladies.length,
      paiementsTotal: paiements.length,
      montantPaiements: paiements.reduce((sum, p) => sum + p.montant, 0)
    };
  }

  // Statistiques par classe d'âge
  get statistiquesParAge(): { [key: string]: GroupeAge } {
    const dossiers = this.medicalService.getAllDossiers();
    const suivis = this.medicalService.getAllSuivis();

    const groupes: { [key: string]: GroupeAge } = {
      '0-5 ans': { dossiers: 0, suivis: 0, cout: 0 },
      '6-10 ans': { dossiers: 0, suivis: 0, cout: 0 },
      '11-15 ans': { dossiers: 0, suivis: 0, cout: 0 },
      '16+ ans': { dossiers: 0, suivis: 0, cout: 0 }
    };

    // Simulation basée sur les données existantes
    groupes['6-10 ans'].dossiers = Math.floor(dossiers.length * 0.4);
    groupes['11-15 ans'].dossiers = Math.floor(dossiers.length * 0.35);
    groupes['16+ ans'].dossiers = Math.floor(dossiers.length * 0.25);
    groupes['0-5 ans'].dossiers = dossiers.length - groupes['6-10 ans'].dossiers - groupes['11-15 ans'].dossiers - groupes['16+ ans'].dossiers;

    return groupes;
  }

  // Statistiques des maladies
  get statistiquesMaladies(): { [key: string]: StatistiquesMaladies } {
    const maladies = this.medicalService.getAllMaladies();
    const paiements = this.medicalService.getAllPaiementsMedicaux();

    const categories: { [key: string]: StatistiquesMaladies } = {
      'Respiratoire': { nombre: 0, cout: 0, pourcentage: 0 },
      'Digestive': { nombre: 0, cout: 0, pourcentage: 0 },
      'Cutannée': { nombre: 0, cout: 0, pourcentage: 0 },
      'Autre': { nombre: 0, cout: 0, pourcentage: 0 }
    };

    maladies.forEach(maladie => {
      switch (maladie.categorie) {
        case 'respiratoire':
          categories['Respiratoire'].nombre++;
          categories['Respiratoire'].cout += maladie.cout_moyen;
          break;
        case 'digestive':
          categories['Digestive'].nombre++;
          categories['Digestive'].cout += maladie.cout_moyen;
          break;
        case 'cutanee':
          categories['Cutannée'].nombre++;
          categories['Cutannée'].cout += maladie.cout_moyen;
          break;
        default:
          categories['Autre'].nombre++;
          categories['Autre'].cout += maladie.cout_moyen;
      }
    });

    const total = maladies.length;
    Object.keys(categories).forEach(cat => {
      categories[cat].pourcentage = total > 0 ? Math.round((categories[cat].nombre / total) * 100) : 0;
    });

    return categories;
  }

  // Statistiques financières
  get statistiquesFinancieres(): StatistiquesFinancieres {
    const paiements = this.medicalService.getAllPaiementsMedicaux();
    const dossiers = this.medicalService.getAllDossiers();

    const stats: StatistiquesFinancieres = {
      totalPaiements: paiements.length,
      montantTotal: paiements.reduce((sum, p) => sum + p.montant, 0),
      montantMoyen: paiements.length > 0 ? Math.round(paiements.reduce((sum, p) => sum + p.montant, 0) / paiements.length) : 0,
      paiementsEnAttente: paiements.filter(p => p.statut === 'en_attente').length,
      montantEnAttente: paiements.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0),
      coutTotalDossiers: dossiers.reduce((sum, d) => sum + d.cout_total, 0)
    };

    return stats;
  }

  // Rapports annuels
  get rapportAnnuel(): RapportAnnuel {
    const annee = parseInt(this.selectedYear);
    const dossiers = this.medicalService.getAllDossiers();
    const paiements = this.medicalService.getAllPaiementsMedicaux();

    return {
      annee: annee,
      consultations: dossiers.length,
      coutTotal: dossiers.reduce((sum, d) => sum + d.cout_total, 0),
      paiements: paiements.length,
      montantPaiements: paiements.reduce((sum, p) => sum + p.montant, 0),
      evolution: '+12%', // Simulation
      objectifs: {
        consultations: 150,
        vaccination: '95%',
        prevention: '80%'
      }
    };
  }

  // Risques d'exclusion
  get risquesExclusion(): RisquesExclusion {
    const dossiers = this.medicalService.getAllDossiers();
    const paiements = this.medicalService.getAllPaiementsMedicaux();

    const risques: RisquesExclusion = {
      total: 0,
      eleve: 0,
      modere: 0,
      faible: 0,
      details: [
        { enfant: 'Dupont Marie', risque: 'Élevé', raison: 'Paiements en retard', montant: 150 },
        { enfant: 'Martin Lucas', risque: 'Modéré', raison: 'Suivi irrégulier', montant: 80 },
        { enfant: 'Bernard Emma', risque: 'Faible', raison: 'Consultation manquée', montant: 25 }
      ]
    };

    // Simulation des risques
    risques.total = 3;
    risques.eleve = 1;
    risques.modere = 1;
    risques.faible = 1;

    return risques;
  }

  // Méthodes utilitaires
  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  }

  formatPourcentage(valeur: number): string {
    return `${valeur}%`;
  }

  round(value: number): number {
    return Math.round(value);
  }

  // Actions
  genererRapport() {
    const rapport = this.prepareRapportData();
    console.log('Rapport généré:', rapport);
    
    // Créer un fichier de rapport
    const rapportContent = this.generateRapportContent(rapport);
    const blob = new Blob([rapportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Télécharger le fichier
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-medical-${this.selectedReport}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    this.notifications.success('Rapport généré et téléchargé avec succès');
  }

  exporterPDF() {
    // Simulation d'export PDF
    const rapport = this.prepareRapportData();
    console.log('Export PDF:', rapport);
    
    // Créer un contenu HTML pour le PDF
    const htmlContent = this.generateHTMLContent(rapport);
    
    // Ouvrir dans une nouvelle fenêtre pour impression PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Attendre que le contenu soit chargé puis imprimer
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
    
    this.notifications.success('Export PDF en cours...');
  }

  imprimerRapport() {
    const rapport = this.prepareRapportData();
    console.log('Impression:', rapport);
    
    // Créer un contenu HTML pour l'impression
    const htmlContent = this.generateHTMLContent(rapport);
    
    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Attendre que le contenu soit chargé puis imprimer
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
    
    this.notifications.success('Impression en cours...');
  }

  // Méthodes utilitaires pour la génération de rapports
  private prepareRapportData() {
    const data = {
      titre: `Rapport Médical - ${this.getReportTitle()}`,
      periode: this.selectedPeriod,
      annee: this.selectedYear,
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      statistiques: {} as any
    };

    switch (this.selectedReport) {
      case 'global':
        data.statistiques = this.statistiquesGlobales;
        break;
      case 'age':
        data.statistiques = this.statistiquesParAge;
        break;
      case 'maladies':
        data.statistiques = this.statistiquesMaladies;
        break;
      case 'financier':
        data.statistiques = this.statistiquesFinancieres;
        break;
      case 'annuel':
        data.statistiques = this.rapportAnnuel;
        break;
      case 'risques':
        data.statistiques = this.risquesExclusion;
        break;
    }

    return data;
  }

  private getReportTitle(): string {
    const titles = {
      'global': 'Statistiques Globales',
      'age': 'Par Classe d\'Âge',
      'maladies': 'Statistiques Maladies',
      'financier': 'Rapport Financier',
      'annuel': 'Rapport Annuel',
      'risques': 'Risques d\'Exclusion'
    };
    return titles[this.selectedReport as keyof typeof titles] || 'Rapport';
  }

  private generateRapportContent(data: any): string {
    let content = `RAPPORT MÉDICAL CDEJ\n`;
    content += `========================\n\n`;
    content += `Titre: ${data.titre}\n`;
    content += `Période: ${data.periode}\n`;
    content += `Année: ${data.annee}\n`;
    content += `Date de génération: ${data.dateGeneration}\n\n`;

    switch (this.selectedReport) {
      case 'global':
        content += this.generateGlobalContent(data.statistiques);
        break;
      case 'age':
        content += this.generateAgeContent(data.statistiques);
        break;
      case 'maladies':
        content += this.generateMaladiesContent(data.statistiques);
        break;
      case 'financier':
        content += this.generateFinancierContent(data.statistiques);
        break;
      case 'annuel':
        content += this.generateAnnuelContent(data.statistiques);
        break;
      case 'risques':
        content += this.generateRisquesContent(data.statistiques);
        break;
    }

    return content;
  }

  private generateHTMLContent(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.titre}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { font-size: 16px; color: #666; }
          .section { margin: 20px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .stat { margin: 10px 0; }
          .stat-label { font-weight: bold; }
          .stat-value { color: #0066cc; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RAPPORT MÉDICAL CDEJ</div>
          <div class="subtitle">${data.titre}</div>
          <div class="subtitle">Période: ${data.periode} | Année: ${data.annee}</div>
          <div class="subtitle">Généré le: ${data.dateGeneration}</div>
        </div>
        
        <div class="section">
          ${this.generateHTMLSection(data)}
        </div>
      </body>
      </html>
    `;
  }

  private generateHTMLSection(data: any): string {
    switch (this.selectedReport) {
      case 'global':
        return this.generateGlobalHTML(data.statistiques);
      case 'age':
        return this.generateAgeHTML(data.statistiques);
      case 'maladies':
        return this.generateMaladiesHTML(data.statistiques);
      case 'financier':
        return this.generateFinancierHTML(data.statistiques);
      case 'annuel':
        return this.generateAnnuelHTML(data.statistiques);
      case 'risques':
        return this.generateRisquesHTML(data.statistiques);
      default:
        return '<p>Aucun rapport disponible</p>';
    }
  }

  // Méthodes de génération de contenu spécifiques
  private generateGlobalContent(stats: StatistiquesGlobales): string {
    return `
STATISTIQUES GLOBALES
---------------------
Enfants suivis: ${stats.totalEnfants}
Consultations: ${stats.consultationsTotal}
Coût total: ${this.formatMontant(stats.coutTotal)}
Coût moyen: ${this.formatMontant(stats.coutMoyen)}
Suivis nutritionnels: ${stats.suiviNutritionnel}
Maladies identifiées: ${stats.maladiesIdentifiees}
Paiements totaux: ${stats.paiementsTotal}
Montant des paiements: ${this.formatMontant(stats.montantPaiements)}
`;
  }

  private generateGlobalHTML(stats: StatistiquesGlobales): string {
    return `
      <div class="section-title">Statistiques Globales</div>
      <div class="stat">
        <span class="stat-label">Enfants suivis:</span>
        <span class="stat-value">${stats.totalEnfants}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Consultations:</span>
        <span class="stat-value">${stats.consultationsTotal}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Coût total:</span>
        <span class="stat-value">${this.formatMontant(stats.coutTotal)}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Coût moyen:</span>
        <span class="stat-value">${this.formatMontant(stats.coutMoyen)}</span>
      </div>
    `;
  }

  private generateAgeContent(stats: { [key: string]: GroupeAge }): string {
    let content = 'STATISTIQUES PAR CLASSE D\'ÂGE\n';
    content += '-----------------------------\n\n';
    
    Object.entries(stats).forEach(([age, data]) => {
      content += `${age}:\n`;
      content += `  - Nombre d'enfants: ${data.dossiers}\n`;
      content += `  - Suivis: ${data.suivis}\n`;
      content += `  - Coût: ${this.formatMontant(data.cout)}\n\n`;
    });
    
    return content;
  }

  private generateAgeHTML(stats: { [key: string]: GroupeAge }): string {
    let html = '<div class="section-title">Statistiques par Classe d\'Âge</div>';
    html += '<table><thead><tr><th>Classe d\'Âge</th><th>Enfants</th><th>Suivis</th><th>Coût</th></tr></thead><tbody>';
    
    Object.entries(stats).forEach(([age, data]) => {
      html += `<tr><td>${age}</td><td>${data.dossiers}</td><td>${data.suivis}</td><td>${this.formatMontant(data.cout)}</td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }

  private generateMaladiesContent(stats: { [key: string]: StatistiquesMaladies }): string {
    let content = 'STATISTIQUES DES MALADIES\n';
    content += '-------------------------\n\n';
    
    Object.entries(stats).forEach(([categorie, data]) => {
      content += `${categorie}:\n`;
      content += `  - Nombre: ${data.nombre}\n`;
      content += `  - Coût: ${this.formatMontant(data.cout)}\n`;
      content += `  - Pourcentage: ${data.pourcentage}%\n\n`;
    });
    
    return content;
  }

  private generateMaladiesHTML(stats: { [key: string]: StatistiquesMaladies }): string {
    let html = '<div class="section-title">Statistiques des Maladies</div>';
    html += '<table><thead><tr><th>Catégorie</th><th>Nombre</th><th>Coût</th><th>Pourcentage</th></tr></thead><tbody>';
    
    Object.entries(stats).forEach(([categorie, data]) => {
      html += `<tr><td>${categorie}</td><td>${data.nombre}</td><td>${this.formatMontant(data.cout)}</td><td>${data.pourcentage}%</td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }

  private generateFinancierContent(stats: StatistiquesFinancieres): string {
    return `
RAPPORT FINANCIER
-----------------
Total paiements: ${stats.totalPaiements}
Montant total: ${this.formatMontant(stats.montantTotal)}
Montant moyen: ${this.formatMontant(stats.montantMoyen)}
Paiements en attente: ${stats.paiementsEnAttente}
Montant en attente: ${this.formatMontant(stats.montantEnAttente)}
Coût total dossiers: ${this.formatMontant(stats.coutTotalDossiers)}
`;
  }

  private generateFinancierHTML(stats: StatistiquesFinancieres): string {
    return `
      <div class="section-title">Rapport Financier</div>
      <div class="stat">
        <span class="stat-label">Total paiements:</span>
        <span class="stat-value">${stats.totalPaiements}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Montant total:</span>
        <span class="stat-value">${this.formatMontant(stats.montantTotal)}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Paiements en attente:</span>
        <span class="stat-value">${stats.paiementsEnAttente}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Montant en attente:</span>
        <span class="stat-value">${this.formatMontant(stats.montantEnAttente)}</span>
      </div>
    `;
  }

  private generateAnnuelContent(stats: RapportAnnuel): string {
    return `
RAPPORT ANNUEL ${stats.annee}
---------------------------
Consultations: ${stats.consultations}
Coût total: ${this.formatMontant(stats.coutTotal)}
Paiements: ${stats.paiements}
Montant paiements: ${this.formatMontant(stats.montantPaiements)}
Évolution: ${stats.evolution}

OBJECTIFS ${stats.annee + 1}
-------------------------
Consultations: ${stats.objectifs.consultations}
Vaccination: ${stats.objectifs.vaccination}
Prévention: ${stats.objectifs.prevention}
`;
  }

  private generateAnnuelHTML(stats: RapportAnnuel): string {
    return `
      <div class="section-title">Rapport Annuel ${stats.annee}</div>
      <div class="stat">
        <span class="stat-label">Consultations:</span>
        <span class="stat-value">${stats.consultations}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Coût total:</span>
        <span class="stat-value">${this.formatMontant(stats.coutTotal)}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Évolution:</span>
        <span class="stat-value">${stats.evolution}</span>
      </div>
      
      <div class="section-title">Objectifs ${stats.annee + 1}</div>
      <div class="stat">
        <span class="stat-label">Consultations:</span>
        <span class="stat-value">${stats.objectifs.consultations}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Vaccination:</span>
        <span class="stat-value">${stats.objectifs.vaccination}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Prévention:</span>
        <span class="stat-value">${stats.objectifs.prevention}</span>
      </div>
    `;
  }

  private generateRisquesContent(stats: RisquesExclusion): string {
    let content = 'RISQUES D\'EXCLUSION\n';
    content += '-------------------\n\n';
    content += `Total: ${stats.total}\n`;
    content += `Élevé: ${stats.eleve}\n`;
    content += `Modéré: ${stats.modere}\n`;
    content += `Faible: ${stats.faible}\n\n`;
    
    content += 'DÉTAILS:\n';
    content += '--------\n';
    stats.details.forEach(risque => {
      content += `${risque.enfant} (${risque.risque}): ${risque.raison} - ${this.formatMontant(risque.montant)}\n`;
    });
    
    return content;
  }

  private generateRisquesHTML(stats: RisquesExclusion): string {
    let html = '<div class="section-title">Risques d\'Exclusion</div>';
    html += '<div class="stat"><span class="stat-label">Total:</span><span class="stat-value">' + stats.total + '</span></div>';
    html += '<div class="stat"><span class="stat-label">Élevé:</span><span class="stat-value">' + stats.eleve + '</span></div>';
    html += '<div class="stat"><span class="stat-label">Modéré:</span><span class="stat-value">' + stats.modere + '</span></div>';
    html += '<div class="stat"><span class="stat-label">Faible:</span><span class="stat-value">' + stats.faible + '</span></div>';
    
    html += '<div class="section-title">Détails</div>';
    html += '<table><thead><tr><th>Enfant</th><th>Risque</th><th>Raison</th><th>Montant</th></tr></thead><tbody>';
    
    stats.details.forEach(risque => {
      html += `<tr><td>${risque.enfant}</td><td>${risque.risque}</td><td>${risque.raison}</td><td>${this.formatMontant(risque.montant)}</td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }

  // Couleurs pour les badges
  getRisqueColor(risque: string): string {
    switch (risque.toLowerCase()) {
      case 'élevé': return 'danger';
      case 'modéré': return 'warning';
      case 'faible': return 'success';
      default: return 'secondary';
    }
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'paye': return 'success';
      case 'en_attente': return 'warning';
      case 'annule': return 'danger';
      default: return 'secondary';
    }
  }
}
