import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification.service';
import { DevelopmentChartComponent } from '../../shared/components/development-chart/development-chart.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { BadgeUtilsService } from '../../shared/services/badge-utils.service';
import {
  ActivityType,
  ChartData,
  Development,
  DevelopmentMetrics,
  DevelopmentStatus,
  Environment,
  RecentActivity,
  UpcomingDeployment
} from '../developments/models/development.model';
import { DevelopmentService } from '../developments/services/development.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, DevelopmentChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  metrics: DevelopmentMetrics | null = null;
  developments: Development[] = [];
  recentActivity: RecentActivity[] = [];
  upcomingDeployments: UpcomingDeployment[] = [];
  chartData: ChartData[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private developmentService: DevelopmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private badgeUtils: BadgeUtilsService,
    private notificationService: NotificationService
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
    return item.id;
  }

  trackByActivity(index: number, item: RecentActivity): string {
    return item.id;
  }

  trackByDeployment(index: number, item: UpcomingDeployment): string {
    return item.id;
  }

  trackByChartData(index: number, item: ChartData): string {
    return item.environment;
  }

  private loadDashboardData(): void {
    // Load metrics
    this.developmentService.getMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.metrics = metrics;
        this.changeDetectorRef.markForCheck();
      });

    // Load developments
    this.developmentService.getDevelopments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(developments => {
        this.developments = developments;
        this.changeDetectorRef.markForCheck();
      });

    // Load recent activity
    this.developmentService.getRecentActivity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(activity => {
        this.recentActivity = activity;
        this.changeDetectorRef.markForCheck();
      });

    // Load upcoming deployments
    this.developmentService.getUpcomingDeployments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(deployments => {
        this.upcomingDeployments = deployments;
        this.changeDetectorRef.markForCheck();
      });

    // Load chart data
    this.developmentService.getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartData = data;
        this.changeDetectorRef.markForCheck();
      });
  }

  getStatusClass(status: DevelopmentStatus): string {
    switch (status) {
      case DevelopmentStatus.DEVELOPMENT:
        return 'desarrollo';
      case DevelopmentStatus.ARCHIVED:
        return 'archivado';
      case DevelopmentStatus.COMPLETED:
        return 'completado';
      default:
        return '';
    }
  }

  // Métodos de utilidad - usando servicio centralizado
  getStatusBadgeClass(status: DevelopmentStatus): string {
    return this.badgeUtils.getStatusBadgeClass(status);
  }

  getEnvironmentBadgeClass(environment: Environment): string {
    return this.badgeUtils.getEnvironmentBadgeClass(environment);
  }

  getEnvironmentClass(environment: Environment): string {
    return this.badgeUtils.getEnvironmentClass(environment);
  }

  getActivityTypeClass(type: ActivityType): string {
    return this.badgeUtils.getActivityTypeClass(type);
  }
}
