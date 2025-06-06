import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { EnvironmentService } from '../../../../core/services/environment.service';
import { Environment } from '../../../../core/models/environment.model';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';

@Component({
  selector: 'app-environment-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './environment-delete-dialog.component.html',
  styleUrls: ['./environment-delete-dialog.component.scss'],
  animations: [
    trigger('panelState', [
      transition(':enter', [
        style({ 
          transform: 'translateY(50px)',
          opacity: 0 
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            transform: 'translateY(0)',
            opacity: 1 
          })
        ),
        query('@*', animateChild(), { optional: true })
      ]),
      transition(':leave', [
        query('@*', animateChild(), { optional: true }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            transform: 'translateY(50px)',
            opacity: 0 
          })
        )
      ])
    ]),
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0 })
        )
      ])
    ])
  ]
})
export class EnvironmentDeleteDialogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  
  constructor(
    private dialogRef: MatDialogRef<EnvironmentDeleteDialogComponent>,
    private environmentService: EnvironmentService,
    @Inject(MAT_DIALOG_DATA) public environment: Environment
  ) {
    this.environmentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onConfirm(): void {
    this.environmentService.deleteEnvironment(this.environment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {}
      });
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
} 