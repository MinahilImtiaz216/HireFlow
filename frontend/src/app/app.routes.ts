import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'jobs', loadComponent: () => import('./pages/jobs/jobs-list/jobs-list.component').then(m => m.JobsListComponent) },
  { path: 'jobs/:id', loadComponent: () => import('./pages/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent) },
  {
    path: 'candidate',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidate'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/candidate/dashboard/candidate-dashboard.component').then(m => m.CandidateDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./pages/candidate/profile/candidate-profile.component').then(m => m.CandidateProfileComponent) },
      { path: 'applications', loadComponent: () => import('./pages/candidate/applications/applications.component').then(m => m.ApplicationsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'employer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['employer'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/employer/dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent) },
      { path: 'jobs', loadComponent: () => import('./pages/employer/jobs/employer-jobs.component').then(m => m.EmployerJobsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/employer/profile/employer-profile.component').then(m => m.EmployerProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/admin/admin-panel.component').then(m => m.AdminPanelComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
