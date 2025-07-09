import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LettreMockService, Lettre, EnfantSansLettre } from '../../../services/lettre-mock.service';
import { EnfantMockService } from '../../../services/enfant-mock.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-gestion-lettres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-lettres.component.html',
  styleUrl: './gestion-lettres.component.css'
})
export class GestionLettresComponent implements OnInit {
  lettres: Lettre[] = [];
  enfantsSansLettre: EnfantSansLettre[] = [];
  enfants: any[] = [];
  selectedLettre: Lettre | null = null;
  isEdit = false;
  activeTab = 'lettres'; // 'lettres' ou 'enfants-sans-lettre'
  statistiques: any = {};

  constructor(
    private lettreService: LettreMockService,
    private enfantService: EnfantMockService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.lettres = this.lettreService.getAll();
    this.enfants = this.enfantService.getAll();
    this.enfantsSansLettre = this.lettreService.getEnfantsSansLettre(this.enfants);
    this.statistiques = this.lettreService.getStatistiques();
  }

  selectLettre(lettre: Lettre) {
    this.selectedLettre = { ...lettre };
    this.isEdit = true;
  }

  startAdd() {
    this.selectedLettre = {
      id: '',
      enfantId: '',
      enfantNom: '',
      enfantPrenom: '',
      destinataire: '',
      contenu: '',
      dateEcriture: new Date(),
      statut: 'brouillon',
      type: 'remerciement'
    };
    this.isEdit = false;
  }

  saveLettre() {
    if (this.selectedLettre) {
      if (this.isEdit) {
        this.lettreService.update(this.selectedLettre.id, this.selectedLettre);
        this.notifications.success('Lettre modifiée avec succès');
      } else {
        // Trouver l'enfant pour récupérer nom et prénom
        const enfant = this.enfants.find(e => e.id === this.selectedLettre!.enfantId);
        if (enfant) {
          this.selectedLettre.enfantNom = enfant.nom;
          this.selectedLettre.enfantPrenom = enfant.prenom;
        }
        
        this.lettreService.add(this.selectedLettre);
        this.notifications.success('Lettre ajoutée avec succès');
      }
      this.selectedLettre = null;
      this.refresh();
    }
  }

  deleteLettre(lettre: Lettre) {
    if (confirm('Supprimer cette lettre ?')) {
      this.lettreService.delete(lettre.id);
      this.notifications.success('Lettre supprimée');
      this.refresh();
    }
  }

  cancel() {
    this.selectedLettre = null;
  }

  getEnfantById(enfantId: string) {
    return this.enfants.find(e => e.id === enfantId);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'envoyee': return 'bg-primary';
      case 'recue': return 'bg-success';
      case 'brouillon': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'remerciement': return 'bg-success';
      case 'demande': return 'bg-info';
      case 'nouvelle': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getRisqueClass(risque: boolean): string {
    return risque ? 'bg-danger text-white' : 'bg-warning';
  }

  envoyerLettre(lettre: Lettre) {
    if (lettre.statut === 'brouillon') {
      this.lettreService.update(lettre.id, {
        statut: 'envoyee',
        dateEnvoi: new Date()
      });
      this.notifications.success('Lettre envoyée');
      this.refresh();
    }
  }

  marquerRecue(lettre: Lettre) {
    if (lettre.statut === 'envoyee') {
      this.lettreService.update(lettre.id, { statut: 'recue' });
      this.notifications.success('Lettre marquée comme reçue');
      this.refresh();
    }
  }

  // Méthodes d'impression et export
  imprimerLettres() {
    const rapport = this.prepareRapportLettres();
    console.log('Impression lettres:', rapport);
    
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
    
    this.notifications.success('Impression des lettres lancée');
  }

  exporterPDF() {
    const rapport = this.prepareRapportLettres();
    console.log('Export PDF lettres:', rapport);
    
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
    
    this.notifications.success('Rapport des lettres exporté en PDF');
  }

  genererRapport() {
    const rapport = this.prepareRapportLettres();
    console.log('Rapport lettres généré:', rapport);
    
    // Créer un fichier de rapport
    const rapportContent = this.generateRapportContent(rapport);
    const blob = new Blob([rapportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Télécharger le fichier
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-lettres-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    this.notifications.success('Rapport des lettres généré et téléchargé avec succès');
  }

  // Méthodes utilitaires pour la génération de rapports
  private prepareRapportLettres() {
    return {
      titre: 'Rapport Gestion des Lettres - CDEJ',
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      statistiques: this.statistiques,
      lettres: this.lettres,
      enfantsSansLettre: this.enfantsSansLettre,
      totalLettres: this.lettres.length,
      lettresEnvoyees: this.lettres.filter(l => l.statut === 'envoyee').length,
      lettresRecues: this.lettres.filter(l => l.statut === 'recue').length,
      lettresBrouillon: this.lettres.filter(l => l.statut === 'brouillon').length,
      enfantsSansLettreCount: this.enfantsSansLettre.length
    };
  }

  private generateRapportContent(data: any): string {
    let content = `RAPPORT GESTION DES LETTRES CDEJ\n`;
    content += `==================================\n\n`;
    content += `Date de génération: ${data.dateGeneration}\n\n`;

    content += `STATISTIQUES GLOBALES\n`;
    content += `---------------------\n`;
    content += `Total lettres: ${data.totalLettres}\n`;
    content += `Lettres envoyées: ${data.lettresEnvoyees}\n`;
    content += `Lettres reçues: ${data.lettresRecues}\n`;
    content += `Lettres en brouillon: ${data.lettresBrouillon}\n`;
    content += `Enfants sans lettre: ${data.enfantsSansLettreCount}\n\n`;

    content += `RÉPARTITION PAR TYPE\n`;
    content += `-------------------\n`;
    const types = this.groupByType(data.lettres);
    Object.keys(types).forEach(type => {
      content += `${type}: ${types[type].length} lettres\n`;
    });
    content += `\n`;

    content += `RÉPARTITION PAR STATUT\n`;
    content += `---------------------\n`;
    const statuts = this.groupByStatut(data.lettres);
    Object.keys(statuts).forEach(statut => {
      content += `${statut}: ${statuts[statut].length} lettres\n`;
    });
    content += `\n`;

    if (data.enfantsSansLettre.length > 0) {
      content += `ENFANTS SANS LETTRE\n`;
      content += `------------------\n`;
      data.enfantsSansLettre.forEach((enfant: any) => {
        content += `- ${enfant.nom} ${enfant.prenom} (${enfant.classe})\n`;
      });
      content += `\n`;
    }

    content += `DÉTAIL DES LETTRES\n`;
    content += `-----------------\n`;
    data.lettres.forEach((lettre: any) => {
      content += `Lettre ${lettre.id}:\n`;
      content += `  Enfant: ${lettre.enfantNom} ${lettre.enfantPrenom}\n`;
      content += `  Type: ${lettre.type}\n`;
      content += `  Statut: ${lettre.statut}\n`;
      content += `  Date écriture: ${new Date(lettre.dateEcriture).toLocaleDateString('fr-FR')}\n`;
      if (lettre.dateEnvoi) {
        content += `  Date envoi: ${new Date(lettre.dateEnvoi).toLocaleDateString('fr-FR')}\n`;
      }
      content += `\n`;
    });

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
          .badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
          .bg-primary { background-color: #007bff; }
          .bg-success { background-color: #28a745; }
          .bg-warning { background-color: #ffc107; color: #212529; }
          .bg-danger { background-color: #dc3545; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RAPPORT GESTION DES LETTRES CDEJ</div>
          <div class="subtitle">Généré le: ${data.dateGeneration}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Statistiques Globales</div>
          <div class="stat">
            <span class="stat-label">Total lettres:</span>
            <span class="stat-value">${data.totalLettres}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Lettres envoyées:</span>
            <span class="stat-value">${data.lettresEnvoyees}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Lettres reçues:</span>
            <span class="stat-value">${data.lettresRecues}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Lettres en brouillon:</span>
            <span class="stat-value">${data.lettresBrouillon}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Enfants sans lettre:</span>
            <span class="stat-value">${data.enfantsSansLettreCount}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Répartition par Type</div>
          <table>
            <thead>
              <tr><th>Type</th><th>Nombre</th></tr>
            </thead>
            <tbody>
              ${this.generateTypeTableRows(data.lettres)}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Répartition par Statut</div>
          <table>
            <thead>
              <tr><th>Statut</th><th>Nombre</th></tr>
            </thead>
            <tbody>
              ${this.generateStatutTableRows(data.lettres)}
            </tbody>
          </table>
        </div>

        ${data.enfantsSansLettre.length > 0 ? `
        <div class="section">
          <div class="section-title">Enfants sans Lettre</div>
          <table>
            <thead>
              <tr><th>Nom</th><th>Prénom</th><th>Classe</th></tr>
            </thead>
            <tbody>
              ${this.generateEnfantsSansLettreTableRows(data.enfantsSansLettre)}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Détail des Lettres</div>
          <table>
            <thead>
              <tr><th>Enfant</th><th>Type</th><th>Statut</th><th>Date Écriture</th><th>Date Envoi</th></tr>
            </thead>
            <tbody>
              ${this.generateLettresTableRows(data.lettres)}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  }

  private groupByType(lettres: Lettre[]): any {
    return lettres.reduce((groups: any, lettre) => {
      const type = lettre.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(lettre);
      return groups;
    }, {});
  }

  private groupByStatut(lettres: Lettre[]): any {
    return lettres.reduce((groups: any, lettre) => {
      const statut = lettre.statut;
      if (!groups[statut]) {
        groups[statut] = [];
      }
      groups[statut].push(lettre);
      return groups;
    }, {});
  }

  private generateTypeTableRows(lettres: Lettre[]): string {
    const types = this.groupByType(lettres);
    return Object.keys(types).map(type => 
      `<tr><td>${type}</td><td>${types[type].length}</td></tr>`
    ).join('');
  }

  private generateStatutTableRows(lettres: Lettre[]): string {
    const statuts = this.groupByStatut(lettres);
    return Object.keys(statuts).map(statut => {
      let badgeClass = 'secondary';
      switch (statut) {
        case 'envoyee': badgeClass = 'primary'; break;
        case 'recue': badgeClass = 'success'; break;
        case 'brouillon': badgeClass = 'warning'; break;
        default: badgeClass = 'secondary';
      }
      return `<tr><td><span class="badge bg-${badgeClass}">${statut}</span></td><td>${statuts[statut].length}</td></tr>`;
    }).join('');
  }

  private generateEnfantsSansLettreTableRows(enfants: any[]): string {
    return enfants.map(enfant => 
      `<tr><td>${enfant.nom}</td><td>${enfant.prenom}</td><td>${enfant.classe}</td></tr>`
    ).join('');
  }

  private generateLettresTableRows(lettres: Lettre[]): string {
    return lettres.map(lettre => {
      // Mapper le type aux classes CSS
      let typeClass = 'secondary';
      switch (lettre.type) {
        case 'remerciement': typeClass = 'success'; break;
        case 'demande': typeClass = 'info'; break;
        case 'nouvelle': typeClass = 'warning'; break;
        default: typeClass = 'secondary';
      }
      
      // Mapper le statut aux classes CSS
      let statutClass = 'secondary';
      switch (lettre.statut) {
        case 'envoyee': statutClass = 'primary'; break;
        case 'recue': statutClass = 'success'; break;
        case 'brouillon': statutClass = 'warning'; break;
        default: statutClass = 'secondary';
      }
      
      return `<tr>
        <td>${lettre.enfantNom} ${lettre.enfantPrenom}</td>
        <td><span class="badge bg-${typeClass}">${lettre.type}</span></td>
        <td><span class="badge bg-${statutClass}">${lettre.statut}</span></td>
        <td>${new Date(lettre.dateEcriture).toLocaleDateString('fr-FR')}</td>
        <td>${lettre.dateEnvoi ? new Date(lettre.dateEnvoi).toLocaleDateString('fr-FR') : '-'}</td>
      </tr>`;
    }).join('');
  }
}
