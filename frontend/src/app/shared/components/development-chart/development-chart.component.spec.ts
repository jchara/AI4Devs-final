import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentChartComponent } from './development-chart.component';

describe('DevelopmentChartComponent', () => {
  let component: DevelopmentChartComponent;
  let fixture: ComponentFixture<DevelopmentChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevelopmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
