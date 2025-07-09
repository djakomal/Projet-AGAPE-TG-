import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMaladiesComponent } from './gestion-maladies.component';

describe('GestionMaladiesComponent', () => {
  let component: GestionMaladiesComponent;
  let fixture: ComponentFixture<GestionMaladiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMaladiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionMaladiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
