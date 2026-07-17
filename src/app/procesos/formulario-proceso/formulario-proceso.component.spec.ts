import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProcesoComponent } from './formulario-proceso.component';

describe('FormularioProcesoComponent', () => {
  let component: FormularioProcesoComponent;
  let fixture: ComponentFixture<FormularioProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioProcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
