import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface MembreEquipe {
  id: number;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  dateEmbauche: Date;
  performance: number;
  statut: 'actif' | 'inactif' | 'en congé';
  equipe: string;
}

interface Equipe {
  id: number;
  nom: string;
  responsable: string;
  nombreMembres: number;
  domaine: string;
  performance: number;
  projetsEnCours: number;
  statut: 'excellent' | 'bon' | 'moyen' | 'à améliorer';
}

@Component({
  selector: 'app-suivi-equipes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './suivi-equipes.component.html',
  styleUrl: './suivi-equipes.component.css'
})
export class SuiviEquipesComponent implements OnInit {
  equipes: Equipe[] = [];
  membres: MembreEquipe[] = [];
  membreForm: FormGroup;
  equipeForm: FormGroup;
  isEditingMembre = false;
  isEditingEquipe = false;
  editingMembreId: number | null = null;
  editingEquipeId: number | null = null;
  selectedEquipe: string = '';

  constructor(private fb: FormBuilder) {
    this.membreForm = this.fb.group({
      nom: ['', Validators.required],
      poste: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      equipe: ['', Validators.required],
      statut: ['actif', Validators.required]
    });

    this.equipeForm = this.fb.group({
      nom: ['', Validators.required],
      responsable: ['', Validators.required],
      domaine: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    // Simulation de données des équipes
    this.equipes = [
      {
        id: 1,
        nom: 'Équipe Sociale',
        responsable: 'Marie Dupont',
        nombreMembres: 8,
        domaine: 'Services sociaux',
        performance: 92,
        projetsEnCours: 5,
        statut: 'excellent'
      },
      {
        id: 2,
        nom: 'Équipe Médicale',
        responsable: 'Dr. Jean Martin',
        nombreMembres: 6,
        domaine: 'Soins de santé',
        performance: 88,
        projetsEnCours: 3,
        statut: 'bon'
      },
      {
        id: 3,
        nom: 'Équipe Administrative',
        responsable: 'Sophie Bernard',
        nombreMembres: 4,
        domaine: 'Administration',
        performance: 75,
        projetsEnCours: 2,
        statut: 'moyen'
      }
    ];

    // Simulation de données des membres
    this.membres = [
      {
        id: 1,
        nom: 'Marie Dupont',
        poste: 'Responsable Social',
        email: 'marie.dupont@cdej.org',
        telephone: '+33 1 23 45 67 89',
        dateEmbauche: new Date('2020-03-15'),
        performance: 95,
        statut: 'actif',
        equipe: 'Équipe Sociale'
      },
      {
        id: 2,
        nom: 'Dr. Jean Martin',
        poste: 'Médecin Coordinateur',
        email: 'jean.martin@cdej.org',
        telephone: '+33 1 23 45 67 90',
        dateEmbauche: new Date('2019-07-01'),
        performance: 88,
        statut: 'actif',
        equipe: 'Équipe Médicale'
      },
      {
        id: 3,
        nom: 'Sophie Bernard',
        poste: 'Administratrice',
        email: 'sophie.bernard@cdej.org',
        telephone: '+33 1 23 45 67 91',
        dateEmbauche: new Date('2021-01-10'),
        performance: 82,
        statut: 'actif',
        equipe: 'Équipe Administrative'
      }
    ];
  }

  ajouterMembre(): void {
    if (this.membreForm.valid) {
      const nouveauMembre: MembreEquipe = {
        id: this.membres.length + 1,
        ...this.membreForm.value,
        dateEmbauche: new Date(this.membreForm.value.dateEmbauche),
        performance: Math.floor(Math.random() * 30) + 70 // Simulation
      };
      this.membres.push(nouveauMembre);
      this.mettreAJourEffectifs();
      this.membreForm.reset({ statut: 'actif' });
    }
  }

  modifierMembre(membre: MembreEquipe): void {
    this.isEditingMembre = true;
    this.editingMembreId = membre.id;
    this.membreForm.patchValue({
      nom: membre.nom,
      poste: membre.poste,
      email: membre.email,
      telephone: membre.telephone,
      dateEmbauche: membre.dateEmbauche.toISOString().split('T')[0],
      equipe: membre.equipe,
      statut: membre.statut
    });
  }

  sauvegarderMembre(): void {
    if (this.membreForm.valid && this.editingMembreId) {
      const index = this.membres.findIndex(m => m.id === this.editingMembreId);
      if (index !== -1) {
        this.membres[index] = {
          ...this.membres[index],
          ...this.membreForm.value,
          dateEmbauche: new Date(this.membreForm.value.dateEmbauche)
        };
      }
      this.annulerModificationMembre();
    }
  }

  annulerModificationMembre(): void {
    this.isEditingMembre = false;
    this.editingMembreId = null;
    this.membreForm.reset({ statut: 'actif' });
  }

  supprimerMembre(id: number): void {
    this.membres = this.membres.filter(m => m.id !== id);
    this.mettreAJourEffectifs();
  }

  ajouterEquipe(): void {
    if (this.equipeForm.valid) {
      const nouvelleEquipe: Equipe = {
        id: this.equipes.length + 1,
        ...this.equipeForm.value,
        nombreMembres: 0,
        performance: 0,
        projetsEnCours: 0,
        statut: 'moyen'
      };
      this.equipes.push(nouvelleEquipe);
      this.equipeForm.reset();
    }
  }

  modifierEquipe(equipe: Equipe): void {
    this.isEditingEquipe = true;
    this.editingEquipeId = equipe.id;
    this.equipeForm.patchValue({
      nom: equipe.nom,
      responsable: equipe.responsable,
      domaine: equipe.domaine
    });
  }

  sauvegarderEquipe(): void {
    if (this.equipeForm.valid && this.editingEquipeId) {
      const index = this.equipes.findIndex(e => e.id === this.editingEquipeId);
      if (index !== -1) {
        this.equipes[index] = {
          ...this.equipes[index],
          ...this.equipeForm.value
        };
      }
      this.annulerModificationEquipe();
    }
  }

  annulerModificationEquipe(): void {
    this.isEditingEquipe = false;
    this.editingEquipeId = null;
    this.equipeForm.reset();
  }

  supprimerEquipe(id: number): void {
    this.equipes = this.equipes.filter(e => e.id !== id);
  }

  mettreAJourEffectifs(): void {
    this.equipes.forEach(equipe => {
      const membresEquipe = this.membres.filter(m => m.equipe === equipe.nom);
      equipe.nombreMembres = membresEquipe.length;
      if (membresEquipe.length > 0) {
        equipe.performance = Math.round(
          membresEquipe.reduce((sum, membre) => sum + membre.performance, 0) / membresEquipe.length
        );
      }
    });
  }

  getMembresEquipe(nomEquipe: string): MembreEquipe[] {
    return this.membres.filter(m => m.equipe === nomEquipe);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'excellent': return 'statut-excellent';
      case 'bon': return 'statut-bon';
      case 'moyen': return 'statut-moyen';
      case 'à améliorer': return 'statut-ameliorer';
      default: return '';
    }
  }

  getPerformanceClass(performance: number): string {
    if (performance >= 90) return 'performance-excellente';
    if (performance >= 80) return 'performance-bonne';
    if (performance >= 70) return 'performance-moyenne';
    return 'performance-faible';
  }

  filtrerParEquipe(equipe: string): void {
    this.selectedEquipe = this.selectedEquipe === equipe ? '' : equipe;
  }
}
