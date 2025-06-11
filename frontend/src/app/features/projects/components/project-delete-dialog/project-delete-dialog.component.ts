import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../../core/services/project.service';
import { Project, ProjectType } from '../../../../shared/models/project.model';

@Component({
  selector: 'app-project-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-delete-dialog.component.html',
  styleUrls: ['./project-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDeleteDialogComponent {
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<ProjectDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project,
    private projectService: ProjectService
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.loading = true;
    
    this.projectService.deleteProject(this.project.id).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al eliminar proyecto:', error);
        this.loading = false;
        // El error ya se maneja en el servicio con snackbar
      }
    });
  }

  getProjectTypeLabel(type: ProjectType): string {
    return this.projectService.getProjectTypeLabel(type);
  }

  getProjectTypeIcon(type: ProjectType): string {
    const icons: Record<ProjectType, string> = {
      [ProjectType.BACKEND]: 'dns',
      [ProjectType.FRONTEND]: 'web'
    };
    
    return icons[type] || 'code';
  }
} 