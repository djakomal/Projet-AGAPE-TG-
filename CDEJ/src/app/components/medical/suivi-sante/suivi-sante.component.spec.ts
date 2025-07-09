import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviSanteComponent } from './suivi-sante.component';

describe('SuiviSanteComponent', () => {
  let component: SuiviSanteComponent;
  let fixture: ComponentFixture<SuiviSanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviSanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuiviSanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
