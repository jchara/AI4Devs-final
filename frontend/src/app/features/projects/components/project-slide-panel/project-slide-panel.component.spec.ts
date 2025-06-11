import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectSlidePanelComponent } from './project-slide-panel.component';

describe('ProjectSlidePanelComponent', () => {
  let component: ProjectSlidePanelComponent;
  let fixture: ComponentFixture<ProjectSlidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSlidePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSlidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 