import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() description?: string;
  @Input() iconColor: string = 'var(--color-primary)';
  @Input() cardClass?: string;
  @Input() changeValue?: number;

  // Exponer Math para el template
  Math = Math;
}
