import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionScolariteComponent } from './gestion-scolarite.component';

describe('GestionScolariteComponent', () => {
  let component: GestionScolariteComponent;
  let fixture: ComponentFixture<GestionScolariteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionScolariteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionScolariteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
