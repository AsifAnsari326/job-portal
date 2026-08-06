import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './features/dashboard/dashboard';
import { Companies } from './features/companies/companies';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', canActivate: [authGuard], component: Dashboard },
  { path: 'companies', component: Companies },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/jobs-listing/jobs-listing').then((m) => m.JobsListing),
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./features/jobs/job-detail/job-detail').then((m) => m.JobDetail),
  },
];
