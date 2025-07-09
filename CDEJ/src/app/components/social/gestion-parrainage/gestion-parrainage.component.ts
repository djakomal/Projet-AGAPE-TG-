import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfantMockService } from '../../../services/enfant-mock.service';
import { ParrainMockService } from '../../../services/parrain-mock.service';
import { NotificationsService } from '../../../services/notifications.service';
import { Enfant } from '../../../models/enfant.model';
import { Parrain } from '../../../models/parrain.model';
import { FormsModule } from '@angular/forms';
import { GiftMockService } from '../../../services/gift-mock.service';
import { Gift } from '../../../models/gift.model';
import { Lettre } from '../../../models/lettre.model';

@Component({
  selector: 'app-gestion-parrainage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-parrainage.component.html',
  styleUrl: './gestion-parrainage.component.css'
})
export class GestionParrainageComponent {
  enfantsParraines: Enfant[] = [];
  enfantsNonParraines: Enfant[] = [];
  parrains: Parrain[] = [];
  selectedEnfant: Enfant | null = null;
  selectedParrainId: string | null = null;
  historiqueEnfantId: string | null = null;
  historiqueEnfant: Enfant | null = null;
  gifts: Gift[] = [];
  lettres: Lettre[] = [];
  newGiftDesc = '';
  newParrain = { nom: '', contact: '' };

  constructor(
    private enfantService: EnfantMockService,
    private parrainService: ParrainMockService,
    private notifications: NotificationsService,
    private giftService: GiftMockService,
  
  ) {
    this.refresh();
  }

  refresh() {
    const all = this.enfantService.getAll();
    this.enfantsParraines = all.filter(e => !!e.parrainId);
    this.enfantsNonParraines = all.filter(e => !e.parrainId);
    this.parrains = this.parrainService.getAll();
  }

  getParrain(parrainId: string | null | undefined): Parrain | undefined {
    return this.parrains.find(p => p.id === parrainId);
  }

  selectEnfant(enfant: Enfant) {
    this.selectedEnfant = enfant;
    this.selectedParrainId = null;
  }

  attribuerParrain() {
    if (this.selectedEnfant && this.selectedParrainId) {
      this.enfantService.update(this.selectedEnfant.id, { parrainId: this.selectedParrainId });
      this.notifications.success('Parrain attribué avec succès');
      this.selectedEnfant = null;
      this.refresh();
    }
  }

  retirerParrain(enfant: Enfant) {
    this.enfantService.update(enfant.id, { parrainId: null });
    this.notifications.success('Parrain retiré');
    this.refresh();
  }

  cancel() {
    this.selectedEnfant = null;
  }

  showHistorique(enfant: Enfant) {
    this.historiqueEnfantId = enfant.id;
    this.historiqueEnfant = enfant;
    this.gifts = this.giftService.getByEnfant(enfant.id);
  }
  hideHistorique() {
    this.historiqueEnfantId = null;
    this.historiqueEnfant = null;
    this.gifts = [];
    this.lettres = [];
  }

  addGift(enfant: Enfant, parrainId: string) {
    if (this.newGiftDesc.trim()) {
      this.giftService.add({
        id: Date.now().toString(),
        enfantId: enfant.id,
        parrainId,
        description: this.newGiftDesc,
        date: new Date()
      });
      this.notifications.success('Cadeau ajouté');
      this.gifts = this.giftService.getByEnfant(enfant.id);
      this.newGiftDesc = '';
    }
  }

  addParrain() {
    if (this.newParrain.nom.trim() && this.newParrain.contact.trim()) {
      const id = Date.now().toString();
      this.parrainService.add({ id, nom: this.newParrain.nom, contact: this.newParrain.contact, enfant_parraine: [] });
      this.notifications.success('Parrain ajouté');
      this.newParrain = { nom: '', contact: '' };
      this.refresh();
    }
  }

  // Méthodes d'impression et export
  imprimerParrainage() {
    const rapport = this.prepareRapportParrainage();
    console.log('Impression parrainage:', rapport);
    
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
    
    this.notifications.success('Impression du parrainage lancée');
  }

  exporterPDF() {
    const rapport = this.prepareRapportParrainage();
    console.log('Export PDF parrainage:', rapport);
    
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
    
    this.notifications.success('Rapport de parrainage exporté en PDF');
  }

  genererRapport() {
    const rapport = this.prepareRapportParrainage();
    console.log('Rapport parrainage généré:', rapport);
    
    // Créer un fichier de rapport
    const rapportContent = this.generateRapportContent(rapport);
    const blob = new Blob([rapportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Télécharger le fichier
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-parrainage-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    this.notifications.success('Rapport de parrainage généré et téléchargé avec succès');
  }

  // Méthodes utilitaires pour la génération de rapports
  private prepareRapportParrainage() {
    return {
      titre: 'Rapport Gestion du Parrainage - CDEJ',
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      enfantsParraines: this.enfantsParraines,
      enfantsNonParraines: this.enfantsNonParraines,
      parrains: this.parrains,
      totalEnfants: this.enfantsParraines.length + this.enfantsNonParraines.length,
      totalParraines: this.enfantsParraines.length,
      totalNonParraines: this.enfantsNonParraines.length,
      totalParrains: this.parrains.length,
      tauxParrainage: Math.round((this.enfantsParraines.length / (this.enfantsParraines.length + this.enfantsNonParraines.length)) * 100)
    };
  }

  private generateRapportContent(data: any): string {
    let content = `RAPPORT GESTION DU PARRAINAGE CDEJ\n`;
    content += `====================================\n\n`;
    content += `Date de génération: ${data.dateGeneration}\n\n`;

    content += `STATISTIQUES GLOBALES\n`;
    content += `---------------------\n`;
    content += `Total enfants: ${data.totalEnfants}\n`;
    content += `Enfants parrainés: ${data.totalParraines}\n`;
    content += `Enfants non parrainés: ${data.totalNonParraines}\n`;
    content += `Total parrains: ${data.totalParrains}\n`;
    content += `Taux de parrainage: ${data.tauxParrainage}%\n\n`;

    content += `LISTE DES PARRAINS\n`;
    content += `------------------\n`;
    data.parrains.forEach((parrain: any) => {
      const enfantsParraines = data.enfantsParraines.filter((e: any) => e.parrainId === parrain.id);
      content += `${parrain.nom}:\n`;
      content += `  Contact: ${parrain.contact}\n`;
      content += `  Enfants parrainés: ${enfantsParraines.length}\n`;
      if (enfantsParraines.length > 0) {
        enfantsParraines.forEach((enfant: any) => {
          content += `    - ${enfant.nom} ${enfant.prenom} (${enfant.classe})\n`;
        });
      }
      content += `\n`;
    });

    content += `ENFANTS PARRAINÉS\n`;
    content += `-----------------\n`;
    data.enfantsParraines.forEach((enfant: any) => {
      const parrain = data.parrains.find((p: any) => p.id === enfant.parrainId);
      content += `${enfant.nom} ${enfant.prenom}:\n`;
      content += `  Classe: ${enfant.classe}\n`;
      content += `  Parrain: ${parrain ? parrain.nom : 'Non assigné'}\n`;
      content += `  Date de parrainage: ${enfant.dateParrainage ? new Date(enfant.dateParrainage).toLocaleDateString('fr-FR') : 'Non spécifiée'}\n`;
      content += `\n`;
    });

    if (data.enfantsNonParraines.length > 0) {
      content += `ENFANTS NON PARRAINÉS\n`;
      content += `---------------------\n`;
      data.enfantsNonParraines.forEach((enfant: any) => {
        content += `- ${enfant.nom} ${enfant.prenom} (${enfant.classe})\n`;
      });
      content += `\n`;
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
          .badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
          .bg-success { background-color: #28a745; }
          .bg-warning { background-color: #ffc107; color: #212529; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RAPPORT GESTION DU PARRAINAGE CDEJ</div>
          <div class="subtitle">Généré le: ${data.dateGeneration}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Statistiques Globales</div>
          <div class="stat">
            <span class="stat-label">Total enfants:</span>
            <span class="stat-value">${data.totalEnfants}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Enfants parrainés:</span>
            <span class="stat-value">${data.totalParraines}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Enfants non parrainés:</span>
            <span class="stat-value">${data.totalNonParraines}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total parrains:</span>
            <span class="stat-value">${data.totalParrains}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Taux de parrainage:</span>
            <span class="stat-value">${data.tauxParrainage}%</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Liste des Parrains</div>
          <table>
            <thead>
              <tr><th>Nom</th><th>Contact</th><th>Enfants parrainés</th></tr>
            </thead>
            <tbody>
              ${this.generateParrainsTableRows(data.parrains, data.enfantsParraines)}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Enfants Parrainés</div>
          <table>
            <thead>
              <tr><th>Enfant</th><th>Classe</th><th>Parrain</th><th>Date Parrainage</th></tr>
            </thead>
            <tbody>
              ${this.generateEnfantsParrainesTableRows(data.enfantsParraines, data.parrains)}
            </tbody>
          </table>
        </div>

        ${data.enfantsNonParraines.length > 0 ? `
        <div class="section">
          <div class="section-title">Enfants Non Parrainés</div>
          <table>
            <thead>
              <tr><th>Nom</th><th>Prénom</th><th>Classe</th></tr>
            </thead>
            <tbody>
              ${this.generateEnfantsNonParrainesTableRows(data.enfantsNonParraines)}
            </tbody>
          </table>
        </div>
        ` : ''}
      </body>
      </html>
    `;
  }

  private generateParrainsTableRows(parrains: any[], enfantsParraines: any[]): string {
    return parrains.map(parrain => {
      const enfantsDuParrain = enfantsParraines.filter(e => e.parrainId === parrain.id);
      return `<tr><td>${parrain.nom}</td><td>${parrain.contact}</td><td>${enfantsDuParrain.length}</td></tr>`;
    }).join('');
  }

  private generateEnfantsParrainesTableRows(enfantsParraines: any[], parrains: any[]): string {
    return enfantsParraines.map(enfant => {
      const parrain = parrains.find(p => p.id === enfant.parrainId);
      return `<tr>
        <td>${enfant.nom} ${enfant.prenom}</td>
        <td>${enfant.classe}</td>
        <td>${parrain ? parrain.nom : 'Non assigné'}</td>
        <td>${enfant.dateParrainage ? new Date(enfant.dateParrainage).toLocaleDateString('fr-FR') : 'Non spécifiée'}</td>
      </tr>`;
    }).join('');
  }

  private generateEnfantsNonParrainesTableRows(enfantsNonParraines: any[]): string {
    return enfantsNonParraines.map(enfant => 
      `<tr><td>${enfant.nom}</td><td>${enfant.prenom}</td><td>${enfant.classe}</td></tr>`
    ).join('');
  }
}
