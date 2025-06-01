import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
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
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metrics: DevelopmentMetrics | null = null;
  developments: Development[] = [];
  recentActivity: RecentActivity[] = [];
  upcomingDeployments: UpcomingDeployment[] = [];
  chartData: ChartData[] = [];

  constructor(private developmentService: DevelopmentService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load metrics
    this.developmentService.getMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });

    // Load developments
    this.developmentService.getDevelopments().subscribe(developments => {
      this.developments = developments;
    });

    // Load recent activity
    this.developmentService.getRecentActivity().subscribe(activity => {
      this.recentActivity = activity;
    });

    // Load upcoming deployments
    this.developmentService.getUpcomingDeployments().subscribe(deployments => {
      this.upcomingDeployments = deployments;
    });

    // Load chart data
    this.developmentService.getChartData().subscribe(data => {
      this.chartData = data;
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
