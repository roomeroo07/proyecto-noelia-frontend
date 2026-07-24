import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCentrosComponent } from './lista-centros.component';

describe('ListaCentrosComponent', () => {
  let component: ListaCentrosComponent;
  let fixture: ComponentFixture<ListaCentrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCentrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
