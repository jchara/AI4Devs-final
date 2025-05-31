import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DesarrolloService } from '../../core/services/desarrollo.service';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { DevelopmentChartComponent } from '../../shared/components/development-chart/development-chart.component';
import { 
  Desarrollo, 
  MetricaDesarrollo, 
  ActividadReciente, 
  ProximoDespliegue, 
  DatosGrafico,
  EstadoDesarrollo,
  Ambiente,
  TipoActividad
} from '../../core/models/desarrollo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, DevelopmentChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metricas: MetricaDesarrollo | null = null;
  desarrollos: Desarrollo[] = [];
  actividadReciente: ActividadReciente[] = [];
  proximosDespliegues: ProximoDespliegue[] = [];
  datosGrafico: DatosGrafico[] = [];

  constructor(private desarrolloService: DesarrolloService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Cargar métricas
    this.desarrolloService.getMetricas().subscribe(metricas => {
      this.metricas = metricas;
    });

    // Cargar desarrollos
    this.desarrolloService.getDesarrollos().subscribe(desarrollos => {
      this.desarrollos = desarrollos;
    });

    // Cargar actividad reciente
    this.desarrolloService.getActividadReciente().subscribe(actividad => {
      this.actividadReciente = actividad;
    });

    // Cargar próximos despliegues
    this.desarrolloService.getProximosDespliegues().subscribe(despliegues => {
      this.proximosDespliegues = despliegues;
    });

    // Cargar datos del gráfico
    this.desarrolloService.getDatosGrafico().subscribe(datos => {
      this.datosGrafico = datos;
    });
  }

  getEstadoClass(estado: EstadoDesarrollo): string {
    switch (estado) {
      case EstadoDesarrollo.DESARROLLO:
        return 'desarrollo';
      case EstadoDesarrollo.EN_QA:
        return 'en-qa';
      case EstadoDesarrollo.PRODUCCION:
        return 'produccion';
      case EstadoDesarrollo.PENDIENTE:
        return 'pendiente';
      default:
        return '';
    }
  }

  getAmbienteClass(ambiente: Ambiente): string {
    switch (ambiente) {
      case Ambiente.DEVELOPMENT:
        return 'development';
      case Ambiente.TESTING:
        return 'testing';
      case Ambiente.STAGING:
        return 'staging';
      case Ambiente.PRODUCTION:
        return 'production';
      default:
        return '';
    }
  }

  getTipoActividadClass(tipo: TipoActividad): string {
    switch (tipo) {
      case TipoActividad.DESPLIEGUE:
        return 'deployment';
      case TipoActividad.ACTUALIZACION:
        return 'update';
      case TipoActividad.REVISION:
        return 'review';
      case TipoActividad.COMPLETADO:
        return 'completed';
      default:
        return '';
    }
  }
}
