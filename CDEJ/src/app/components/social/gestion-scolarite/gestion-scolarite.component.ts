import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfantMockService } from '../../../services/enfant-mock.service';
import { Enfant } from '../../../models/enfant.model';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-gestion-scolarite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-scolarite.component.html',
  styleUrl: './gestion-scolarite.component.css'
})
export class GestionScolariteComponent {
  enfants: Enfant[] = [];
  filteredEnfants: Enfant[] = [];
  selected: Enfant | null = null;
  isEdit = false;
  searchTerm = '';
  newEnfant: Enfant = { id: '', numero: '', nom: '', prenom: '', age: 0, classe: '', resultat_annee: 'reussi' };

  constructor(
    private enfantService: EnfantMockService,
    private notifications: NotificationsService
  ) {
    this.refresh();
  }

  refresh() {
    this.enfants = this.enfantService.getAll();
    this.filterEnfants();
  }

  filterEnfants() {
    if (!this.searchTerm.trim()) {
      this.filteredEnfants = [...this.enfants];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEnfants = this.enfants.filter(enfant =>
        enfant.nom.toLowerCase().includes(term) ||
        enfant.prenom.toLowerCase().includes(term) ||
        enfant.numero.toLowerCase().includes(term) ||
        enfant.classe.toLowerCase().includes(term)
      );
    }
  }

  // Getters pour les statistiques
  get totalEnfants(): number {
    return this.enfants.length;
  }

  get enfantsReussis(): number {
    return this.enfants.filter(e => e.resultat_annee === 'reussi').length;
  }

  get enfantsEchoues(): number {
    return this.enfants.filter(e => e.resultat_annee === 'echoue').length;
  }

  get enfantsParraines(): number {
    return this.enfants.filter(e => e.parrainId).length;
  }

  select(enfant: Enfant) {
    this.selected = { ...enfant };
    this.isEdit = true;
  }

  startAdd() {
    this.selected = { ...this.newEnfant };
    this.isEdit = false;
  }

  save() {
    if (this.selected) {
      if (this.isEdit) {
        this.enfantService.update(this.selected.id, this.selected);
        this.notifications.success('Enfant modifié avec succès');
      } else {
        this.selected.id = Date.now().toString();
        this.enfantService.add(this.selected);
        this.notifications.success('Enfant ajouté avec succès');
      }
      this.selected = null;
      this.refresh();
    }
  }

  delete(enfant: Enfant) {
    if (confirm('Supprimer cet enfant ?')) {
      this.enfantService.delete(enfant.id);
      this.notifications.success('Enfant supprimé');
      this.refresh();
    }
  }

  cancel() {
    this.selected = null;
  }

  // Méthodes d'impression et export
  imprimerScolarite() {
    const rapport = this.prepareRapportScolarite();
    console.log('Impression scolarité:', rapport);
    
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
    
    this.notifications.success('Impression de la scolarité lancée');
  }

  exporterPDF() {
    const rapport = this.prepareRapportScolarite();
    console.log('Export PDF scolarité:', rapport);
    
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
    
    this.notifications.success('Rapport de scolarité exporté en PDF');
  }

  genererRapport() {
    const rapport = this.prepareRapportScolarite();
    console.log('Rapport scolarité généré:', rapport);
    
    // Créer un fichier de rapport
    const rapportContent = this.generateRapportContent(rapport);
    const blob = new Blob([rapportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Télécharger le fichier
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-scolarite-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    this.notifications.success('Rapport de scolarité généré et téléchargé avec succès');
  }

  // Méthodes utilitaires pour la génération de rapports
  private prepareRapportScolarite() {
    return {
      titre: 'Rapport Gestion de la Scolarité - CDEJ',
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      enfants: this.enfants,
      totalEnfants: this.totalEnfants,
      enfantsReussis: this.enfantsReussis,
      enfantsEchoues: this.enfantsEchoues,
      enfantsParraines: this.enfantsParraines,
      tauxReussite: Math.round((this.enfantsReussis / this.totalEnfants) * 100),
      tauxParrainage: Math.round((this.enfantsParraines / this.totalEnfants) * 100),
      repartitionClasses: this.getRepartitionClasses(),
      repartitionResultats: this.getRepartitionResultats()
    };
  }

  private generateRapportContent(data: any): string {
    let content = `RAPPORT GESTION DE LA SCOLARITÉ CDEJ\n`;
    content += `=====================================\n\n`;
    content += `Date de génération: ${data.dateGeneration}\n\n`;

    content += `STATISTIQUES GLOBALES\n`;
    content += `---------------------\n`;
    content += `Total enfants: ${data.totalEnfants}\n`;
    content += `Enfants réussis: ${data.enfantsReussis}\n`;
    content += `Enfants échoués: ${data.enfantsEchoues}\n`;
    content += `Enfants parrainés: ${data.enfantsParraines}\n`;
    content += `Taux de réussite: ${data.tauxReussite}%\n`;
    content += `Taux de parrainage: ${data.tauxParrainage}%\n\n`;

    content += `RÉPARTITION PAR CLASSE\n`;
    content += `----------------------\n`;
    Object.keys(data.repartitionClasses).forEach(classe => {
      content += `${classe}: ${data.repartitionClasses[classe]} enfants\n`;
    });
    content += `\n`;

    content += `RÉPARTITION PAR RÉSULTAT\n`;
    content += `-------------------------\n`;
    Object.keys(data.repartitionResultats).forEach(resultat => {
      content += `${resultat}: ${data.repartitionResultats[resultat]} enfants\n`;
    });
    content += `\n`;

    content += `LISTE DES ENFANTS\n`;
    content += `-----------------\n`;
    data.enfants.forEach((enfant: any) => {
      content += `${enfant.numero} - ${enfant.nom} ${enfant.prenom}:\n`;
      content += `  Âge: ${enfant.age} ans\n`;
      content += `  Classe: ${enfant.classe}\n`;
      content += `  Résultat: ${enfant.resultat_annee}\n`;
      content += `  Parrainé: ${enfant.parrainId ? 'Oui' : 'Non'}\n`;
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
          .bg-success { background-color: #28a745; }
          .bg-danger { background-color: #dc3545; }
          .bg-warning { background-color: #ffc107; color: #212529; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">RAPPORT GESTION DE LA SCOLARITÉ CDEJ</div>
          <div class="subtitle">Généré le: ${data.dateGeneration}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Statistiques Globales</div>
          <div class="stat">
            <span class="stat-label">Total enfants:</span>
            <span class="stat-value">${data.totalEnfants}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Enfants réussis:</span>
            <span class="stat-value">${data.enfantsReussis}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Enfants échoués:</span>
            <span class="stat-value">${data.enfantsEchoues}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Enfants parrainés:</span>
            <span class="stat-value">${data.enfantsParraines}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Taux de réussite:</span>
            <span class="stat-value">${data.tauxReussite}%</span>
          </div>
          <div class="stat">
            <span class="stat-label">Taux de parrainage:</span>
            <span class="stat-value">${data.tauxParrainage}%</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Répartition par Classe</div>
          <table>
            <thead>
              <tr><th>Classe</th><th>Nombre d'enfants</th></tr>
            </thead>
            <tbody>
              ${this.generateClassesTableRows(data.repartitionClasses)}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Répartition par Résultat</div>
          <table>
            <thead>
              <tr><th>Résultat</th><th>Nombre d'enfants</th></tr>
            </thead>
            <tbody>
              ${this.generateResultatsTableRows(data.repartitionResultats)}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Liste des Enfants</div>
          <table>
            <thead>
              <tr><th>Numéro</th><th>Nom</th><th>Prénom</th><th>Âge</th><th>Classe</th><th>Résultat</th><th>Parrainé</th></tr>
            </thead>
            <tbody>
              ${this.generateEnfantsTableRows(data.enfants)}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  }

  private getRepartitionClasses(): any {
    return this.enfants.reduce((groups: any, enfant) => {
      const classe = enfant.classe;
      if (!groups[classe]) {
        groups[classe] = 0;
      }
      groups[classe]++;
      return groups;
    }, {});
  }

  private getRepartitionResultats(): any {
    return this.enfants.reduce((groups: any, enfant) => {
      const resultat = enfant.resultat_annee;
      if (!groups[resultat]) {
        groups[resultat] = 0;
      }
      groups[resultat]++;
      return groups;
    }, {});
  }

  private generateClassesTableRows(repartitionClasses: any): string {
    return Object.keys(repartitionClasses).map(classe => 
      `<tr><td>${classe}</td><td>${repartitionClasses[classe]}</td></tr>`
    ).join('');
  }

  private generateResultatsTableRows(repartitionResultats: any): string {
    return Object.keys(repartitionResultats).map(resultat => 
      `<tr><td><span class="badge bg-${resultat === 'reussi' ? 'success' : 'danger'}">${resultat}</span></td><td>${repartitionResultats[resultat]}</td></tr>`
    ).join('');
  }

  private generateEnfantsTableRows(enfants: any[]): string {
    return enfants.map(enfant => 
      `<tr>
        <td>${enfant.numero}</td>
        <td>${enfant.nom}</td>
        <td>${enfant.prenom}</td>
        <td>${enfant.age}</td>
        <td>${enfant.classe}</td>
        <td><span class="badge bg-${enfant.resultat_annee === 'reussi' ? 'success' : 'danger'}">${enfant.resultat_annee}</span></td>
        <td><span class="badge bg-${enfant.parrainId ? 'success' : 'warning'}">${enfant.parrainId ? 'Oui' : 'Non'}</span></td>
      </tr>`
    ).join('');
  }
}
