import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DevelopmentService } from '../developments/services/development.service';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { DevelopmentChartComponent } from '../../shared/components/development-chart/development-chart.component';
import { 
  Development, 
  DevelopmentMetrics, 
  RecentActivity, 
  UpcomingDeployment, 
  ChartData,
  DevelopmentStatus,
  Environment,
  ActivityType
} from '../developments/models/development.model';

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
    private changeDetectorRef: ChangeDetectorRef
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

  getStatusBadgeClass(status: DevelopmentStatus): string {
    switch (status) {
      case DevelopmentStatus.DEVELOPMENT:
        return 'badge-desarrollo';
      case DevelopmentStatus.ARCHIVED:
        return 'badge-archivado';
      case DevelopmentStatus.COMPLETED:
        return 'badge-completado';
      default:
        return '';
    }
  }

  getEnvironmentClass(environment: Environment): string {
    switch (environment) {
      case Environment.DEVELOPMENT:
        return 'development';
      case Environment.TESTING:
        return 'testing';
      case Environment.STAGING:
        return 'staging';
      case Environment.PRODUCTION:
        return 'production';
      default:
        return '';
    }
  }

  getEnvironmentBadgeClass(environment: Environment): string {
    switch (environment) {
      case Environment.DEVELOPMENT:
        return 'ambiente-development';
      case Environment.TESTING:
        return 'ambiente-testing';
      case Environment.STAGING:
        return 'ambiente-staging';
      case Environment.PRODUCTION:
        return 'ambiente-production';
      default:
        return '';
    }
  }

  getActivityTypeClass(type: ActivityType): string {
    switch (type) {
      case ActivityType.DEPLOYMENT:
        return 'deployment';
      case ActivityType.UPDATE:
        return 'update';
      case ActivityType.REVIEW:
        return 'review';
      case ActivityType.COMPLETED:
        return 'completed';
      default:
        return '';
    }
  }
}
