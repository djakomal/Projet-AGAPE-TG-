import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

import { GestionScolariteComponent } from './components/social/gestion-scolarite/gestion-scolarite.component';
import { GestionParrainageComponent } from './components/social/gestion-parrainage/gestion-parrainage.component';
import { GestionLettresComponent } from './components/social/gestion-lettres/gestion-lettres.component';
import { RapportsStatistiquesComponent } from './components/social/rapports-statistiques/rapports-statistiques.component';

// Imports des composants médicaux
import { SuiviSanteComponent } from './components/medical/suivi-sante/suivi-sante.component';
import { GestionMaladiesComponent } from './components/medical/gestion-maladies/gestion-maladies.component';
import { GestionPaiementsMedicauxComponent } from './components/medical/gestion-paiements-medicaux/gestion-paiements-medicaux.component';
import { RapportsSensibilisationComponent } from './components/medical/rapports-sensibilisation/rapports-sensibilisation.component';

// Imports des composants comptables
import { GestionFinanciereComponent } from './components/comptable/gestion-financiere/gestion-financiere.component';
import { ValidationDepensesComponent } from './components/comptable/validation-depenses/validation-depenses.component';
import { RapportsFinanciersComponent } from './components/comptable/rapports-financiers/rapports-financiers.component';

// Imports coordinateur (standalone)
import { VueEnsembleComponent } from './components/coordinateur/vue-ensemble/vue-ensemble.component';
import { GestionAdministrativeComponent } from './components/coordinateur/gestion-administrative/gestion-administrative.component';
import { SuiviEquipesComponent } from './components/coordinateur/suivi-equipes/suivi-equipes.component';
import { ChatInboxComponent } from './components/common/chat-inbox.component';
import { ActionsIndicateursCoordinateurComponent } from './components/coordinateur/actions-indicateurs/actions-indicateurs.component';

import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      // Routes sociales
      { path: 'scolarite', component: GestionScolariteComponent },
      { path: 'parrainage', component: GestionParrainageComponent },
      { path: 'lettres', component: GestionLettresComponent },
      { path: 'rapports', component: RapportsStatistiquesComponent },
      
      // Routes médicales
      { path: 'suivi-sante', component: SuiviSanteComponent },
      { path: 'gestion-maladies', component: GestionMaladiesComponent },
      { path: 'paiements-medicaux', component: GestionPaiementsMedicauxComponent },
      { path: 'rapports-sensibilisation', component: RapportsSensibilisationComponent },
      
      // Routes comptables
      { path: 'gestion-financiere', component: GestionFinanciereComponent },
      { path: 'validation-depenses', component: ValidationDepensesComponent },
      { path: 'rapports-financiers', component: RapportsFinanciersComponent },

      // Routes coordinateur
      { path: 'vue-ensemble', component: VueEnsembleComponent },
      { path: 'gestion-administrative', component: GestionAdministrativeComponent },
      { path: 'suivi-equipes', component: SuiviEquipesComponent },
      { path: 'actions-coordinateur', component: ActionsIndicateursCoordinateurComponent },

      // Inbox directives
      { path: 'inbox', component: ChatInboxComponent },

      { path: '', redirectTo: 'scolarite', pathMatch: 'full' }
    ]
  },

  { path: 'profile', component: ProfileComponent,   canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];
