import { Routes } from '@angular/router';
import { ShellComponent } from './components/shell.component';

const lead = (leadType: string) => ({
  loadComponent: () => import('./pages/lead-form.component').then(m => m.LeadFormComponent),
  data: { leadType }
});

export const routes: Routes = [
  // Paid-ad landing page: no header, footer or navigation
  { path: 'lp', ...lead('ad-landing') },

  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
      { path: 'services', loadComponent: () => import('./pages/services-list.component').then(m => m.ServicesListComponent) },
      { path: 'services/:slug', loadComponent: () => import('./pages/service-detail.component').then(m => m.ServiceDetailComponent) },
      { path: 'portfolio', loadComponent: () => import('./pages/portfolio-list.component').then(m => m.PortfolioListComponent) },
      { path: 'portfolio/:id', loadComponent: () => import('./pages/case-detail.component').then(m => m.CaseDetailComponent) },
      { path: 'about', loadComponent: () => import('./pages/content.component').then(m => m.ContentPageComponent), data: { page: 'about' } },
      { path: 'industries', loadComponent: () => import('./pages/content.component').then(m => m.ContentPageComponent), data: { page: 'industries' } },
      { path: 'insights', loadComponent: () => import('./pages/content.component').then(m => m.ContentPageComponent), data: { page: 'insights' } },
      { path: 'privacy', loadComponent: () => import('./pages/content.component').then(m => m.ContentPageComponent), data: { page: 'privacy' } },
      { path: 'terms', loadComponent: () => import('./pages/content.component').then(m => m.ContentPageComponent), data: { page: 'terms' } },
      { path: 'engineering', loadComponent: () => import('./pages/content.component').then(m => m.ContentPageComponent), data: { page: 'engineering' } },
      { path: 'contact', ...lead('contact') },
      { path: 'consult', ...lead('consultation') },
      { path: 'audit', ...lead('audit') },
      { path: 'quote', ...lead('quote') },
      { path: 'guide', ...lead('guide') },
      { path: 'thanks/:type', loadComponent: () => import('./pages/thanks.component').then(m => m.ThanksComponent) },
      { path: '**', loadComponent: () => import('./pages/not-found.component').then(m => m.NotFoundComponent) }
    ]
  }
];
