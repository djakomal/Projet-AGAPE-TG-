import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLettresComponent } from './gestion-lettres.component';

describe('GestionLettresComponent', () => {
  let component: GestionLettresComponent;
  let fixture: ComponentFixture<GestionLettresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLettresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionLettresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
