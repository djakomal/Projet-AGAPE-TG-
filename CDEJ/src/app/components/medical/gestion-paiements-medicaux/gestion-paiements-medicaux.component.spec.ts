import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPaiementsMedicauxComponent } from './gestion-paiements-medicaux.component';

describe('GestionPaiementsMedicauxComponent', () => {
  let component: GestionPaiementsMedicauxComponent;
  let fixture: ComponentFixture<GestionPaiementsMedicauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPaiementsMedicauxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionPaiementsMedicauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
