import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportsStatistiquesComponent } from './rapports-statistiques.component';

describe('RapportsStatistiquesComponent', () => {
  let component: RapportsStatistiquesComponent;
  let fixture: ComponentFixture<RapportsStatistiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportsStatistiquesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportsStatistiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
