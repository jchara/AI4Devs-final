import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { DevelopmentChartComponent } from '../../shared/components/development-chart/development-chart.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import {
  ActivityType,
  ChartData,
  Development,
  DevelopmentEnvironment,
  DevelopmentMetrics,
  DevelopmentStatus,
  RecentActivity
} from '../../shared/models/development.model';
import { BadgeUtilsService } from '../../shared/services/badge-utils.service';
import { DevelopmentService } from '../developments/services/development.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MetricCardComponent,
    DevelopmentChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  metrics: DevelopmentMetrics | null = null;
  developments: Development[] = [];
  recentActivities: RecentActivity[] = [];
  chartData: ChartData[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private developmentService: DevelopmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private badgeUtils: BadgeUtilsService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TrackBy functions para optimizar renderizado
  trackByDevelopment(index: number, item: Development): string {
    return item.id.toString();
  }

  trackByActivity(index: number, item: RecentActivity): string {
    return item.id.toString();
  }

  trackByChartData(index: number, item: ChartData): string {
    return item.environment;
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.developmentService.getDashboardData().subscribe({
      next: (data) => {
        this.metrics = data.metrics;
        this.developments = data.developments;
        this.recentActivities = data.recentActivities;
        this.chartData = data.chartData;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  getStatusClass(status: DevelopmentStatus): string {
    switch (status) {
      case DevelopmentStatus.IN_PROGRESS:
        return 'desarrollo';
      case DevelopmentStatus.CANCELLED:
        return 'archivado';
      case DevelopmentStatus.COMPLETED:
        return 'completado';
      case DevelopmentStatus.PLANNING:
        return 'planificacion';
      case DevelopmentStatus.TESTING:
        return 'pruebas';
      default:
        return '';
    }
  }

  // Métodos de utilidad - usando servicio centralizado
  getStatusBadgeClass(status: DevelopmentStatus): string {
    return this.badgeUtils.getStatusBadgeClass(status);
  }

  getEnvironmentBadgeClass(environment: DevelopmentEnvironment): string {
    return this.badgeUtils.getEnvironmentBadgeClass(environment);
  }

  getEnvironmentClass(environment: DevelopmentEnvironment): string {
    return this.badgeUtils.getEnvironmentClass(environment);
  }

  getActivityTypeClass(type: ActivityType): string {
    return this.badgeUtils.getActivityTypeClass(type);
  }

  formatDate(date: Date | undefined | null): string {
    return this.badgeUtils.formatDate(date);
  }

  getStatusColor(status: DevelopmentStatus): string {
    switch (status) {
      case DevelopmentStatus.IN_PROGRESS:
        return '#2196f3';
      case DevelopmentStatus.CANCELLED:
        return '#f44336';
      case DevelopmentStatus.COMPLETED:
        return '#4caf50';
      case DevelopmentStatus.PLANNING:
        return '#ff9800';
      case DevelopmentStatus.TESTING:
        return '#9c27b0';
      default:
        return '#757575';
    }
  }

  getActivityIcon(type: ActivityType): string {
    switch (type) {
      case ActivityType.DEVELOPMENT_CREATED:
        return 'fiber_new';
      case ActivityType.DEVELOPMENT_UPDATED:
        return 'edit_note';
      case ActivityType.STATUS_CHANGED:
        return 'published_with_changes';
      case ActivityType.MICROSERVICE_ADDED:
        return 'add_circle_outline';
      case ActivityType.MICROSERVICE_REMOVED:
        return 'remove_circle_outline';
      case ActivityType.PROGRESS_UPDATED:
        return 'show_chart';
      case ActivityType.DEPLOYMENT_SCHEDULED:
        return 'rocket_launch';
      default:
        return 'notifications';
    }
  }

  // Navegar al detalle del desarrollo
  viewDevelopmentDetails(development: Development): void {
    this.router.navigate(['/developments'], { 
      queryParams: { 
        viewDetails: development.id 
      } 
    });
  }
}
