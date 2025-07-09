import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportsSensibilisationComponent } from './rapports-sensibilisation.component';

describe('RapportsSensibilisationComponent', () => {
  let component: RapportsSensibilisationComponent;
  let fixture: ComponentFixture<RapportsSensibilisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportsSensibilisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportsSensibilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
