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
    
    // Calcular porcentaje basado en el valor máximo
    const percentage = (count / maxValue) * 100;
    // Asegurar que las barras tengan al menos 8% de altura para ser visibles
    return Math.max(percentage, 8);
  }

  // Determinar si el valor debe mostrarse dentro de la barra
  shouldShowValue(count: number): boolean {
    if (count === 0) return false;
    
    const heightPercentage = this.getBarHeight(count);
    // Mostrar valor solo si la barra tiene al menos 20% de altura (suficiente espacio)
    return heightPercentage >= 20;
  }

  // Determinar el color del texto basado en el color de fondo de la barra
  getTextColor(backgroundColor: string): string {
    // Convertir hex a RGB si es necesario
    let r, g, b;
    
    if (backgroundColor.startsWith('#')) {
      const hex = backgroundColor.slice(1);
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else {
      // Para colores RGB o nombres de colores, usar blanco por defecto
      return 'white';
    }
    
    // Calcular luminancia para determinar si usar texto blanco o negro
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
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
