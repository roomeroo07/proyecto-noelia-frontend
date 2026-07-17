import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProcesosComponent } from './lista-procesos.component';

describe('ListaProcesosComponent', () => {
  let component: ListaProcesosComponent;
  let fixture: ComponentFixture<ListaProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaProcesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
