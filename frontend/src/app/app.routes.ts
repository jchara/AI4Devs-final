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
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'ambientes',
    loadComponent: () => import('./features/environments/environments.component').then(m => m.EnvironmentsComponent)
  },
  {
    path: 'jira-sync',
    loadComponent: () => import('./features/jira-sync/jira-sync.component').then(m => m.JiraSyncComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
