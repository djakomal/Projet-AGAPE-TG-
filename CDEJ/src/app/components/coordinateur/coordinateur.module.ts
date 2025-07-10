import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GestionAdministrativeComponent } from './gestion-administrative/gestion-administrative.component';
import { SuiviEquipesComponent } from './suivi-equipes/suivi-equipes.component';
import { VueEnsembleComponent } from './vue-ensemble/vue-ensemble.component';
import { ActionsIndicateursCoordinateurComponent } from './actions-indicateurs/actions-indicateurs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GestionAdministrativeComponent,
    SuiviEquipesComponent,
    VueEnsembleComponent,
    ActionsIndicateursCoordinateurComponent
  ],
  declarations: [
  ],
  exports: [
    GestionAdministrativeComponent,
    SuiviEquipesComponent,
    VueEnsembleComponent
  ]
})
export class CoordinateurModule { }
