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
    path: 'developments',
    loadComponent: () => import('./features/developments/developments.component').then(m => m.DevelopmentsComponent)
  },
  {
    path: 'microservices',
    loadComponent: () => import('./features/microservices/microservices.component').then(m => m.MicroservicesComponent)
  },
  {
    path: 'ambientes',
    loadComponent: () => import('./features/environments/environments.component').then(m => m.EnvironmentsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
