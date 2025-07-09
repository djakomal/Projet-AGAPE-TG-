import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDepensesComponent } from './validation-depenses.component';

describe('ValidationDepensesComponent', () => {
  let component: ValidationDepensesComponent;
  let fixture: ComponentFixture<ValidationDepensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationDepensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidationDepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
