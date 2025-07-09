import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviEquipesComponent } from './suivi-equipes.component';

describe('SuiviEquipesComponent', () => {
  let component: SuiviEquipesComponent;
  let fixture: ComponentFixture<SuiviEquipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviEquipesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuiviEquipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
