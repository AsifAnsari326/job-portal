import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { authGuard } from './core/guards/auth-guard';
import { Component } from '@angular/core';



@Component({
  standalone: true,
  template: '<h1>Dashboard Mock Loaded Successfully</h1>'
})
class MockDashboardComponent {}

export const routes: Routes = [
    {path:"login", component: Login},
    {path:"signup", component: Signup},
    {path:"", redirectTo:"login", pathMatch:'full'},
    { path: 'dashboard', canActivate: [authGuard], component: MockDashboardComponent,},
    {path:'jobs', loadComponent: () => import('./features/jobs/jobs-listing/jobs-listing').then(m => m.JobsListing)}
];
