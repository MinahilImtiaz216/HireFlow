import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dash-header">
        <div class="container">
          <h1>Employer Dashboard 🏢</h1>
          <p>Manage your job postings and applications</p>
        </div>
      </div>
      <div class="container" style="padding:2rem 1.5rem">
        <div *ngIf="loading" class="text-muted text-center" style="padding:3rem">Loading...</div>
        <ng-container *ngIf="!loading && dashboard">
          <div class="company-banner card mb-3">
            <div class="company-info">
              <div class="company-logo">{{ dashboard.company?.companyName?.[0] }}</div>
              <div>
                <h2>{{ dashboard.company?.companyName }}</h2>
                <p class="text-muted">{{ dashboard.company?.industry }} • {{ dashboard.company?.location }}</p>
              </div>
            </div>
            <a routerLink="/employer/profile" class="btn btn-outline btn-sm">Edit Profile</a>
          </div>
          <div class="stats-grid mb-3">
            <div class="stat-card">
              <div class="stat-icon purple">💼</div>
              <div>
                <div class="stat-value">{{ dashboard.totalJobs }}</div>
                <div class="stat-label">Total Jobs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">✅</div>
              <div>
                <div class="stat-value">{{ dashboard.openJobs }}</div>
                <div class="stat-label">Open Jobs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue">📋</div>
              <div>
                <div class="stat-value">{{ dashboard.totalApplications }}</div>
                <div class="stat-label">Applications</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">🔒</div>
              <div>
                <div class="stat-value">{{ dashboard.closedJobs }}</div>
                <div class="stat-label">Closed Jobs</div>
              </div>
            </div>
          </div>
          <div class="card mb-3">
            <div class="flex-between mb-2">
              <h2 style="font-size:1.1rem;font-weight:600">Recent Jobs</h2>
              <a routerLink="/employer/jobs" class="btn btn-primary btn-sm">Manage All</a>
            </div>
            <div *ngIf="dashboard.recentJobs?.length === 0" class="text-muted text-center" style="padding:1.5rem">
              No jobs posted yet. <a routerLink="/employer/jobs">Post your first job</a>
            </div>
            <table class="table" *ngIf="dashboard.recentJobs?.length > 0">
              <thead>
                <tr><th>Title</th><th>Status</th><th>Posted</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let job of dashboard.recentJobs">
                  <td><strong>{{ job.title }}</strong></td>
                  <td><span class="badge" [ngClass]="job.status === 'open' ? 'badge-success' : 'badge-gray'">{{ job.status }}</span></td>
                  <td>{{ job.createdAt | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="quick-links">
            <a routerLink="/employer/jobs" class="quick-link-card">
              <div class="ql-icon">💼</div>
              <div><div class="ql-title">Manage Jobs</div><div class="ql-desc">Post and edit job listings</div></div>
            </a>
            <a routerLink="/employer/profile" class="quick-link-card">
              <div class="ql-icon">🏢</div>
              <div><div class="ql-title">Company Profile</div><div class="ql-desc">Update company details</div></div>
            </a>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: calc(100vh - 64px); background: var(--bg); }
    .dash-header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 2rem 0; color: white; }
    .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .dash-header p { color: #94a3b8; }
    .company-banner { display: flex; justify-content: space-between; align-items: center; }
    .company-info { display: flex; gap: 1rem; align-items: center; }
    .company-logo {
      width: 56px; height: 56px; border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 700;
    }
    .company-info h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .quick-links { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .quick-link-card {
      background: white; border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
      transition: all 0.2s; cursor: pointer;
    }
    .quick-link-card:hover { border-color: var(--primary); box-shadow: var(--shadow); transform: translateY(-2px); }
    .ql-icon { font-size: 1.75rem; }
    .ql-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; }
    .ql-desc { font-size: 0.8rem; color: var(--text-muted); }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
  `]
})
export class EmployerDashboardComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dashboard: any = null;
  loading = true;

  constructor(public auth: AuthService, private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getDashboard().subscribe({
      next: (data) => { this.dashboard = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
