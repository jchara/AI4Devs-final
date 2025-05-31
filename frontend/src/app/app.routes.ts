import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'desarrollos',
    loadComponent: () => import('./features/desarrollos/desarrollos.component').then(m => m.DesarrollosComponent)
  },
  {
    path: 'microservicios',
    loadComponent: () => import('./features/microservicios/microservicios.component').then(m => m.MicroserviciosComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
