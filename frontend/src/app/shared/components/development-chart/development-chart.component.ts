import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosGrafico } from '../../../core/models/desarrollo.model';

@Component({
  selector: 'app-development-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development-chart.component.html',
  styleUrl: './development-chart.component.scss'
})
export class DevelopmentChartComponent implements OnInit {
  @Input() data: DatosGrafico[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  getBarHeight(cantidad: number): number {
    if (!this.data || this.data.length === 0) return 0;
    
    const maxValue = Math.max(...this.data.map(item => item.cantidad));
    return maxValue > 0 ? (cantidad / maxValue) * 100 : 0;
  }
}
