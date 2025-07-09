import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdministrativeComponent } from './gestion-administrative.component';

describe('GestionAdministrativeComponent', () => {
  let component: GestionAdministrativeComponent;
  let fixture: ComponentFixture<GestionAdministrativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAdministrativeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAdministrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
