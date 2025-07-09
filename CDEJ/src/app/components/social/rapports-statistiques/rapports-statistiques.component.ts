import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RapportsService, StatistiquesGlobales, StatistiquesParClasse, StatistiquesParrainage, RapportMensuel } from '../../../services/rapports.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-rapports-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapports-statistiques.component.html',
  styleUrl: './rapports-statistiques.component.css'
})
export class RapportsStatistiquesComponent implements OnInit {
  statsGlobales: StatistiquesGlobales | null = null;
  statsClasses: StatistiquesParClasse[] = [];
  statsParrainage: StatistiquesParrainage[] = [];
  rapportAnnuel: RapportMensuel[] = [];
  rapportExclusion: any[] = [];
  donneesGraphiques: any = {};
  
  activeTab = 'globales';
  anneeSelectionnee = new Date().getFullYear();
  moisSelectionne = new Date().getMonth() + 1;
  
  // Options d'impression
  showPrintOptions = false;
  selectedReport = 'globales';

  constructor(
    private rapportsService: RapportsService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.statsGlobales = this.rapportsService.getStatistiquesGlobales();
    this.statsClasses = this.rapportsService.getStatistiquesParClasse();
    this.statsParrainage = this.rapportsService.getStatistiquesParrainage();
    this.rapportAnnuel = this.rapportsService.getRapportAnnuel(this.anneeSelectionnee);
    this.rapportExclusion = this.rapportsService.getRapportExclusion();
    this.donneesGraphiques = this.rapportsService.getDonneesGraphiques();
  }

  // Méthodes d'impression
  imprimerRapport(type: string) {
    this.selectedReport = type;
    const rapport = this.prepareRapportData(type);
    console.log('Impression rapport:', rapport);
    
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
    
    this.notifications.success('Impression lancée');
  }

  imprimerTousRapports() {
    this.notifications.info('Préparation de tous les rapports...');
    
    // Créer un rapport global avec tous les onglets
    const rapportGlobal = this.prepareRapportGlobal();
    const htmlContent = this.generateHTMLContentGlobal(rapportGlobal);
    
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
    
    this.notifications.success('Impression de tous les rapports lancée');
  }

  exporterPDF() {
    // Simulation d'export PDF
    const rapport = this.prepareRapportData(this.selectedReport);
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
    
    this.notifications.success('Rapport exporté en PDF');
  }

  // Nouvelle méthode pour générer un rapport
  genererRapport(type: string) {
    const rapport = this.prepareRapportData(type);
    console.log('Rapport généré:', rapport);
    
    // Créer un fichier de rapport
    const rapportContent = this.generateRapportContent(rapport);
    const blob = new Blob([rapportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Télécharger le fichier
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-social-${type}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    this.notifications.success('Rapport généré et téléchargé avec succès');
  }

  // Méthodes utilitaires
  getTauxClass(taux: number): string {
    if (taux >= 80) return 'text-success';
    if (taux >= 60) return 'text-warning';
    return 'text-danger';
  }

  getProgressClass(taux: number): string {
    if (taux >= 80) return 'bg-success';
    if (taux >= 60) return 'bg-warning';
    return 'bg-danger';
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  }

  getRapportMensuel(mois: number): RapportMensuel | undefined {
    return this.rapportAnnuel.find(r => {
      const moisNoms = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      return moisNoms[mois - 1] === r.mois;
    });
  }

  // Calculs pour les graphiques
  getTotalBudget(): number {
    return this.rapportAnnuel.reduce((total, rapport) => total + rapport.budgetUtilise, 0);
  }

  getTotalLettres(): number {
    return this.rapportAnnuel.reduce((total, rapport) => total + rapport.lettresEnvoyees, 0);
  }

  getTotalNouveauxEnfants(): number {
    return this.rapportAnnuel.reduce((total, rapport) => total + rapport.nouveauxEnfants, 0);
  }

  // Nouvelles méthodes pour les totaux du rapport annuel
  getTotalNouveauxParrainages(): number {
    return this.rapportAnnuel.reduce((total, rapport) => total + rapport.nouveauxParrainages, 0);
  }

  getTotalLettresRecues(): number {
    return this.rapportAnnuel.reduce((total, rapport) => total + rapport.lettresRecues, 0);
  }

  getTotalEnfantsExclus(): number {
    return this.rapportAnnuel.reduce((total, rapport) => total + rapport.enfantsExclus, 0);
  }

  // Méthode pour calculer le pourcentage de lettres reçues
  getPourcentageLettresRecues(): number {
    if (!this.statsGlobales || !this.statsGlobales.totalLettres) {
      return 0;
    }
    return Math.round((this.statsGlobales.lettresRecues / this.statsGlobales.totalLettres) * 100);
  }

  // Méthode pour obtenir le taux de parrainage de manière sécurisée
  getTauxParrainage(): number {
    return this.statsGlobales?.tauxParrainage || 0;
  }

  // Méthode pour obtenir le taux d'envoi de manière sécurisée
  getTauxEnvoi(): number {
    return this.statsGlobales?.tauxEnvoi || 0;
  }

  // Méthodes pour les alertes
  getAlertes(): any[] {
    const alertes = [];
    
    if (this.statsGlobales) {
      if (this.statsGlobales.enfantsRisqueExclusion > 0) {
        alertes.push({
          type: 'danger',
          message: `${this.statsGlobales.enfantsRisqueExclusion} enfant(s) en risque d'exclusion`
        });
      }
      
      if (this.statsGlobales.tauxParrainage < 70) {
        alertes.push({
          type: 'warning',
          message: `Taux de parrainage faible (${this.statsGlobales.tauxParrainage}%)`
        });
      }
      
      if (this.statsGlobales.tauxEnvoi < 80) {
        alertes.push({
          type: 'info',
          message: `Taux d'envoi des lettres à améliorer (${this.statsGlobales.tauxEnvoi}%)`
        });
      }
    }
    
    return alertes;
  }

  // Méthodes utilitaires pour la génération de rapports
  private prepareRapportData(type: string) {
    const data = {
      titre: `Rapport Social - ${this.getReportTitle(type)}`,
      annee: this.anneeSelectionnee,
      mois: this.moisSelectionne,
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      statistiques: {} as any
    };

    switch (type) {
      case 'globales':
        data.statistiques = this.statsGlobales;
        break;
      case 'classes':
        data.statistiques = this.statsClasses;
        break;
      case 'parrainage':
        data.statistiques = this.statsParrainage;
        break;
      case 'annuel':
        data.statistiques = this.rapportAnnuel;
        break;
      case 'exclusion':
        data.statistiques = this.rapportExclusion;
        break;
    }

    return data;
  }

  private prepareRapportGlobal() {
    return {
      titre: 'Rapport Social Complet - CDEJ',
      annee: this.anneeSelectionnee,
      mois: this.moisSelectionne,
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      globales: this.statsGlobales,
      classes: this.statsClasses,
      parrainage: this.statsParrainage,
      annuel: this.rapportAnnuel,
      exclusion: this.rapportExclusion
    };
  }

  private getReportTitle(type: string): string {
    const titles = {
      'globales': 'Statistiques Globales',
      'classes': 'Statistiques par Classe',
      'parrainage': 'Statistiques Parrainage',
      'annuel': 'Rapport Annuel',
      'exclusion': 'Risques d\'Exclusion'
    };
    return titles[type as keyof typeof titles] || 'Rapport';
  }

  private generateRapportContent(data: any): string {
    let content = `RAPPORT SOCIAL CDEJ\n`;
    content += `==================\n\n`;
    content += `Titre: ${data.titre}\n`;
    content += `Année: ${data.annee}\n`;
    content += `Mois: ${data.mois}\n`;
    content += `Date de génération: ${data.dateGeneration}\n\n`;

    switch (this.selectedReport) {
      case 'globales':
        content += this.generateGlobalesContent(data.statistiques);
        break;
      case 'classes':
        content += this.generateClassesContent(data.statistiques);
        break;
      case 'parrainage':
        content += this.generateParrainageContent(data.statistiques);
        break;
      case 'annuel':
        content += this.generateAnnuelContent(data.statistiques);
        break;
      case 'exclusion':
        content += this.generateExclusionContent(data.statistiques);
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
          .alert { padding: 10px; margin: 10px 0; border-radius: 4px; }
          .alert-danger { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
          .alert-warning { background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
          .alert-info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RAPPORT SOCIAL CDEJ</div>
          <div class="subtitle">${data.titre}</div>
          <div class="subtitle">Année: ${data.annee} | Mois: ${data.mois}</div>
          <div class="subtitle">Généré le: ${data.dateGeneration}</div>
        </div>
        
        <div class="section">
          ${this.generateHTMLSection(data)}
        </div>
      </body>
      </html>
    `;
  }

  private generateHTMLContentGlobal(data: any): string {
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
          .section { margin: 20px 0; page-break-inside: avoid; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .stat { margin: 10px 0; }
          .stat-label { font-weight: bold; }
          .stat-value { color: #0066cc; }
          .alert { padding: 10px; margin: 10px 0; border-radius: 4px; }
          .alert-danger { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
          .alert-warning { background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
          .alert-info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
          @media print { body { margin: 0; } .section { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RAPPORT SOCIAL COMPLET CDEJ</div>
          <div class="subtitle">Année: ${data.annee} | Mois: ${data.mois}</div>
          <div class="subtitle">Généré le: ${data.dateGeneration}</div>
        </div>
        
        <div class="section">
          <div class="section-title">1. Statistiques Globales</div>
          ${this.generateGlobalesHTML(data.globales)}
        </div>
        
        <div class="section">
          <div class="section-title">2. Statistiques par Classe</div>
          ${this.generateClassesHTML(data.classes)}
        </div>
        
        <div class="section">
          <div class="section-title">3. Statistiques Parrainage</div>
          ${this.generateParrainageHTML(data.parrainage)}
        </div>
        
        <div class="section">
          <div class="section-title">4. Rapport Annuel</div>
          ${this.generateAnnuelHTML(data.annuel)}
        </div>
        
        <div class="section">
          <div class="section-title">5. Risques d'Exclusion</div>
          ${this.generateExclusionHTML(data.exclusion)}
        </div>
      </body>
      </html>
    `;
  }

  private generateHTMLSection(data: any): string {
    switch (this.selectedReport) {
      case 'globales':
        return this.generateGlobalesHTML(data.statistiques);
      case 'classes':
        return this.generateClassesHTML(data.statistiques);
      case 'parrainage':
        return this.generateParrainageHTML(data.statistiques);
      case 'annuel':
        return this.generateAnnuelHTML(data.statistiques);
      case 'exclusion':
        return this.generateExclusionHTML(data.statistiques);
      default:
        return '<p>Aucun rapport disponible</p>';
    }
  }

  // Méthodes de génération de contenu spécifiques
  private generateGlobalesContent(stats: StatistiquesGlobales | null): string {
    if (!stats) return 'Aucune donnée disponible';
    
    return `
STATISTIQUES GLOBALES
---------------------
Total enfants: ${stats.totalEnfants}
Enfants parrainés: ${stats.enfantsParraines}
Taux de parrainage: ${stats.tauxParrainage}%
Total lettres: ${stats.totalLettres}
Lettres reçues: ${stats.lettresRecues}
Taux d'envoi: ${stats.tauxEnvoi}%
Enfants en risque d'exclusion: ${stats.enfantsRisqueExclusion}
Budget total: ${this.formatMontant(stats.budgetTotal)}
Budget utilisé: ${this.formatMontant(stats.budgetUtilise)}
`;
  }

  private generateGlobalesHTML(stats: StatistiquesGlobales | null): string {
    if (!stats) return '<p>Aucune donnée disponible</p>';
    
    return `
      <div class="stat">
        <span class="stat-label">Total enfants:</span>
        <span class="stat-value">${stats.totalEnfants}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Enfants parrainés:</span>
        <span class="stat-value">${stats.enfantsParraines}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Taux de parrainage:</span>
        <span class="stat-value">${stats.tauxParrainage}%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Total lettres:</span>
        <span class="stat-value">${stats.totalLettres}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Lettres reçues:</span>
        <span class="stat-value">${stats.lettresRecues}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Budget total:</span>
        <span class="stat-value">${this.formatMontant(stats.budgetTotal)}</span>
      </div>
    `;
  }

  private generateClassesContent(stats: StatistiquesParClasse[]): string {
    let content = 'STATISTIQUES PAR CLASSE\n';
    content += '------------------------\n\n';
    
    stats.forEach(classe => {
      content += `${classe.nomClasse}:\n`;
      content += `  - Nombre d'enfants: ${classe.nombreEnfants}\n`;
      content += `  - Taux de réussite: ${classe.tauxReussite}%\n`;
      content += `  - Budget alloué: ${this.formatMontant(classe.budgetAlloue)}\n`;
      content += `  - Budget utilisé: ${this.formatMontant(classe.budgetUtilise)}\n\n`;
    });
    
    return content;
  }

  private generateClassesHTML(stats: StatistiquesParClasse[]): string {
    let html = '<table><thead><tr><th>Classe</th><th>Enfants</th><th>Taux Réussite</th><th>Budget Alloué</th><th>Budget Utilisé</th></tr></thead><tbody>';
    
    stats.forEach(classe => {
      html += `<tr><td>${classe.nomClasse}</td><td>${classe.nombreEnfants}</td><td>${classe.tauxReussite}%</td><td>${this.formatMontant(classe.budgetAlloue)}</td><td>${this.formatMontant(classe.budgetUtilise)}</td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }

  private generateParrainageContent(stats: StatistiquesParrainage[]): string {
    let content = 'STATISTIQUES PARRAINAGE\n';
    content += '------------------------\n\n';
    
    stats.forEach(stat => {
      content += `${stat.typeParrainage}:\n`;
      content += `  - Nombre: ${stat.nombre}\n`;
      content += `  - Montant total: ${this.formatMontant(stat.montantTotal)}\n`;
      content += `  - Montant moyen: ${this.formatMontant(stat.montantMoyen)}\n\n`;
    });
    
    return content;
  }

  private generateParrainageHTML(stats: StatistiquesParrainage[]): string {
    let html = '<table><thead><tr><th>Type</th><th>Nombre</th><th>Montant Total</th><th>Montant Moyen</th></tr></thead><tbody>';
    
    stats.forEach(stat => {
      html += `<tr><td>${stat.typeParrainage}</td><td>${stat.nombre}</td><td>${this.formatMontant(stat.montantTotal)}</td><td>${this.formatMontant(stat.montantMoyen)}</td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }

  private generateAnnuelContent(stats: RapportMensuel[]): string {
    let content = 'RAPPORT ANNUEL\n';
    content += '---------------\n\n';
    
    stats.forEach(rapport => {
      content += `${rapport.mois}:\n`;
      content += `  - Budget utilisé: ${this.formatMontant(rapport.budgetUtilise)}\n`;
      content += `  - Lettres envoyées: ${rapport.lettresEnvoyees}\n`;
      content += `  - Nouveaux enfants: ${rapport.nouveauxEnfants}\n`;
      content += `  - Nouveaux parrainages: ${rapport.nouveauxParrainages}\n`;
      content += `  - Lettres reçues: ${rapport.lettresRecues}\n`;
      content += `  - Enfants exclus: ${rapport.enfantsExclus}\n\n`;
    });
    
    return content;
  }

  private generateAnnuelHTML(stats: RapportMensuel[]): string {
    let html = '<table><thead><tr><th>Mois</th><th>Budget</th><th>Lettres Envoyées</th><th>Nouveaux Enfants</th><th>Nouveaux Parrainages</th><th>Lettres Reçues</th><th>Exclusions</th></tr></thead><tbody>';
    
    stats.forEach(rapport => {
      html += `<tr><td>${rapport.mois}</td><td>${this.formatMontant(rapport.budgetUtilise)}</td><td>${rapport.lettresEnvoyees}</td><td>${rapport.nouveauxEnfants}</td><td>${rapport.nouveauxParrainages}</td><td>${rapport.lettresRecues}</td><td>${rapport.enfantsExclus}</td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }

  private generateExclusionContent(stats: any[]): string {
    let content = 'RISQUES D\'EXCLUSION\n';
    content += '-------------------\n\n';
    
    if (stats.length === 0) {
      content += 'Aucun risque d\'exclusion détecté.\n';
    } else {
      stats.forEach(enfant => {
        content += `${enfant.nom} ${enfant.prenom}:\n`;
        content += `  - Dernière lettre: ${enfant.derniereLettre ? enfant.derniereLettre.toLocaleDateString('fr-FR') : 'Jamais'}\n`;
        content += `  - Mois sans lettre: ${enfant.moisSansLettre}\n`;
        content += `  - Date d'inscription: ${enfant.dateInscription.toLocaleDateString('fr-FR')}\n`;
        content += `  - Motif: ${enfant.motifExclusion}\n`;
        content += `  - Recommandation: ${enfant.recommandation}\n\n`;
      });
    }
    
    return content;
  }

  private generateExclusionHTML(stats: any[]): string {
    if (stats.length === 0) {
      return '<p>Aucun risque d\'exclusion détecté.</p>';
    }
    
    let html = '<table><thead><tr><th>Enfant</th><th>Dernière Lettre</th><th>Mois sans Lettre</th><th>Date d\'Inscription</th><th>Motif</th><th>Recommandation</th></tr></thead><tbody>';
    
    stats.forEach(enfant => {
      html += `<tr>
        <td><strong>${enfant.nom} ${enfant.prenom}</strong></td>
        <td>${enfant.derniereLettre ? enfant.derniereLettre.toLocaleDateString('fr-FR') : 'Jamais'}</td>
        <td>${enfant.moisSansLettre} mois</td>
        <td>${enfant.dateInscription.toLocaleDateString('fr-FR')}</td>
        <td>${enfant.motifExclusion}</td>
        <td>${enfant.recommandation}</td>
      </tr>`;
    });
    
    html += '</tbody></table>';
    return html;
  }
}
