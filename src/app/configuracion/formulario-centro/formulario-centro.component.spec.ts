import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCentroComponent } from './formulario-centro.component';

describe('FormularioCentroComponent', () => {
  let component: FormularioCentroComponent;
  let fixture: ComponentFixture<FormularioCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioCentroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
