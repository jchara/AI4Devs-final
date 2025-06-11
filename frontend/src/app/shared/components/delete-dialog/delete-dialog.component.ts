import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';

export interface DeleteDialogData {
  title: string;
  entityName: string;
  entityType: string;
  breadcrumbs: string[];
  warningMessage?: string;
  additionalInfo?: {
    icon?: string;
    label?: string;
    value?: string;
  }[];
  onConfirm: () => void;
  loading$?: Subject<boolean>;
}

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  animations: [
    trigger('panelState', [
      transition(':enter', [
        style({ 
          transform: 'translateY(50px)',
          opacity: 0,
          willChange: 'transform, opacity'
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
            opacity: 0,
            willChange: 'auto'
          })
        )
      ])
    ]),
    trigger('overlay', [
      transition(':enter', [
        style({ 
          opacity: 0,
          willChange: 'opacity'
        }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            opacity: 0,
            willChange: 'auto'
          })
        )
      ])
    ])
  ]
})
export class DeleteDialogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  
  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {
    if (this.data.loading$) {
      this.data.loading$
        .pipe(takeUntil(this.destroy$))
        .subscribe(loading => {
          this.loading = loading;
        });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onConfirm(): void {
    this.data.onConfirm();
    this.dialogRef.close(true);
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
} 