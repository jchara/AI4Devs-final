import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../../features/developments/models/development.model';

@Component({
  selector: 'app-development-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development-chart.component.html',
  styleUrl: './development-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevelopmentChartComponent implements OnInit {
  @Input() data: ChartData[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  // TrackBy function para optimizar renderizado
  trackByEnvironment(index: number, item: ChartData): string {
    return item.environment;
  }

  getBarHeight(count: number): number {
    if (!this.data || this.data.length === 0) return 0;
    
    const maxValue = Math.max(...this.data.map(item => item.count));
    return maxValue > 0 ? (count / maxValue) * 100 : 0;
  }
}
