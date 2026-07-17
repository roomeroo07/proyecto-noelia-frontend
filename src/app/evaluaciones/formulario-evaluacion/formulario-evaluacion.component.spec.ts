import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEvaluacionComponent } from './formulario-evaluacion.component';

describe('FormularioEvaluacionComponent', () => {
  let component: FormularioEvaluacionComponent;
  let fixture: ComponentFixture<FormularioEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
