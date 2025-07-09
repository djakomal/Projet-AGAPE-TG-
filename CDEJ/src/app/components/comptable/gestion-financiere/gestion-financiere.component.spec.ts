import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFinanciereComponent } from './gestion-financiere.component';

describe('GestionFinanciereComponent', () => {
  let component: GestionFinanciereComponent;
  let fixture: ComponentFixture<GestionFinanciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFinanciereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionFinanciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
