import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionsIndicateursCoordinateurComponent } from '../../coordinateur/actions-indicateurs/actions-indicateurs.component';

interface SidebarLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ActionsIndicateursCoordinateurComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  userRole: 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur' | null = null;
  links: SidebarLink[] = [];
  showActionsPanel = false;

  constructor(private auth: AuthService) {
    this.userRole = this.auth.getUserRole();
    this.links = this.getLinksForRole(this.userRole);
  }

  toggleActionsPanel() {
    this.showActionsPanel = !this.showActionsPanel;
  }

  closeActionsPanel() {
    this.showActionsPanel = false;
  }

  private getLinksForRole(role: string | null): SidebarLink[] {
    switch (role) {
      case 'agent_social':
        return [
          { label: 'Gestion Scolarité', route: '/dashboard/scolarite' },
          { label: 'Gestion Parrainage', route: '/dashboard/parrainage' },
          { label: 'Gestion Lettres', route: '/dashboard/lettres' },
          { label: 'Rapports & Statistiques', route: '/dashboard/rapports' },
          { label: 'Boîte de réception', route: '/dashboard/inbox' },
        ];
      case 'agent_medical':
        return [
          { label: 'Suivi Santé', route: '/dashboard/suivi-sante' },
          { label: 'Gestion Maladies', route: '/dashboard/gestion-maladies' },
          { label: 'Paiements Médicaux', route: '/dashboard/paiements-medicaux' },
          { label: 'Rapports & Sensibilisation', route: '/dashboard/rapports-sensibilisation' },
          { label: 'Boîte de réception', route: '/dashboard/inbox' },
        ];
      case 'comptable':
        return [
          { label: 'Gestion Financière', route: '/dashboard/gestion-financiere' },
          { label: 'Validation Dépenses', route: '/dashboard/validation-depenses' },
          { label: 'Rapports Financiers', route: '/dashboard/rapports-financiers' },
          { label: 'Boîte de réception', route: '/dashboard/inbox' },
        ];
      case 'coordinateur':
        return [
          { label: "Vue d'ensemble", route: '/dashboard/vue-ensemble' },
          { label: 'Suivi des Équipes', route: '/dashboard/suivi-equipes' },
          { label: 'Gestion Administrative', route: '/dashboard/gestion-administrative' },
          { label: 'Boîte de réception', route: '/dashboard/inbox' },
        ];
      default:
        return [];
    }
  }

  getIcon(index: number): string {
    // Icônes différentes selon l'ordre des liens (exemple)
    const icons = [
      'bi-book', // Gestion Scolarité
      'bi-people', // Gestion Parrainage
      'bi-envelope-paper', // Gestion Lettres
      'bi-bar-chart', // Rapports & Statistiques
      'bi-heart-pulse', // Suivi Santé
      'bi-virus', // Gestion Maladies
      'bi-cash-coin', // Paiements Médicaux
      'bi-graph-up', // Rapports & Sensibilisation
      'bi-wallet2', // Gestion Financière
      'bi-check2-square', // Validation Dépenses
      'bi-file-earmark-bar-graph', // Rapports Financiers
      'bi-globe2', // Vue d'ensemble
      'bi-people-fill', // Suivi des Équipes
      'bi-gear', // Gestion Administrative
    ];
    return icons[index % icons.length];
  }
}
