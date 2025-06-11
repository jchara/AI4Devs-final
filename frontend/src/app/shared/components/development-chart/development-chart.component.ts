import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../models/development.model';

@Component({
  selector: 'app-development-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development-chart.component.html',
  styleUrl: './development-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevelopmentChartComponent implements OnInit, OnChanges {
  @Input() data: ChartData[] = [];
  @Input() title: string = '';
  @Input() showLegend: boolean = true;
  @Input() height: string = '200px';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.data = this.data.map(item => ({
      ...item,
      color: item.color || this.getRandomColor()
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.data = (this.data || []).map(item => ({
        ...item,
        color: item.color || this.getRandomColor()
      }));
      this.cdr.markForCheck();
    }
  }

  getBarHeight(count: number): number {
    if (!this.data || this.data.length === 0) return 0;
    if (count === 0) return 0;
    
    const maxValue = Math.max(...this.data.map(item => item.count));
    
    if (maxValue === 0) return 0;
    
    // Asegurar que las barras tengan al menos 15% de altura para ser visibles
    const percentage = (count / maxValue) * 100;
    const finalHeight = Math.max(percentage, 15);
    return finalHeight;
  }

  getTotalCount(): number {
    return this.data.reduce((sum, item) => sum + item.count, 0);
  }

  getPercentage(count: number): number {
    const total = this.getTotalCount();
    return total > 0 ? (count / total) * 100 : 0;
  }

  trackByEnvironment(index: number, item: ChartData): string {
    return item.environment;
  }

  private getRandomColor(): string {
    const colors = [
      '#4CAF50', // Verde
      '#2196F3', // Azul
      '#FFC107', // Amarillo
      '#F44336', // Rojo
      '#9C27B0', // Púrpura
      '#00BCD4', // Cyan
      '#FF9800', // Naranja
      '#795548'  // Marrón
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
