import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroserviciosComponent } from './microservicios.component';

describe('MicroserviciosComponent', () => {
  let component: MicroserviciosComponent;
  let fixture: ComponentFixture<MicroserviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroserviciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
