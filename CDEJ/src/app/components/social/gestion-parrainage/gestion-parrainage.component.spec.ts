import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionParrainageComponent } from './gestion-parrainage.component';

describe('GestionParrainageComponent', () => {
  let component: GestionParrainageComponent;
  let fixture: ComponentFixture<GestionParrainageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionParrainageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionParrainageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
