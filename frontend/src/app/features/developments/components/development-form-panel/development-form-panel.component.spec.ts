import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentFormPanelComponent } from './development-form-panel.component';

describe('DevelopmentFormPanelComponent', () => {
  let component: DevelopmentFormPanelComponent;
  let fixture: ComponentFixture<DevelopmentFormPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentFormPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevelopmentFormPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 