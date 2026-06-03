import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/models';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dash-header">
        <div class="container">
          <h1>Welcome back, {{ auth.currentUser?.name }}! 👋</h1>
          <p class="text-muted">Track your job applications and manage your profile</p>
        </div>
      </div>
      <div class="container" style="padding: 2rem 1.5rem">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon purple">📄</div>
            <div>
              <div class="stat-value">{{ applications.length }}</div>
              <div class="stat-label">Total Applications</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue">🔍</div>
            <div>
              <div class="stat-value">{{ countStatus('under_review') }}</div>
              <div class="stat-label">Under Review</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">✅</div>
            <div>
              <div class="stat-value">{{ countStatus('approved') }}</div>
              <div class="stat-label">Approved</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">⏳</div>
            <div>
              <div class="stat-value">{{ countStatus('submitted') }}</div>
              <div class="stat-label">Pending</div>
            </div>
          </div>
        </div>

        <div class="dash-section">
          <div class="flex-between mb-2">
            <h2>My Applications</h2>
            <a routerLink="/jobs" class="btn btn-primary btn-sm">Browse Jobs</a>
          </div>
          <div *ngIf="loading" class="text-muted">Loading...</div>
          <div *ngIf="!loading && applications.length === 0" class="empty-state">
            <div class="icon">📋</div>
            <h3>No applications yet</h3>
            <p>Start browsing jobs and apply!</p>
            <a routerLink="/jobs" class="btn btn-primary mt-2">Browse Jobs</a>
          </div>
          <div class="app-table-wrap" *ngIf="!loading && applications.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let app of applications">
                  <td><strong>{{ app.jobTitle }}</strong></td>
                  <td>{{ app.companyName }}</td>
                  <td>{{ app.appliedAt | date:'mediumDate' }}</td>
                  <td>
                    <span class="badge" [ngClass]="getStatusClass(app.status)">
                      {{ app.status | titlecase }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="quick-links">
          <a routerLink="/candidate/profile" class="quick-link-card">
            <div class="ql-icon">👤</div>
            <div>
              <div class="ql-title">My Profile</div>
              <div class="ql-desc">Update skills & resume</div>
            </div>
          </a>
          <a routerLink="/jobs" class="quick-link-card">
            <div class="ql-icon">🔍</div>
            <div>
              <div class="ql-title">Browse Jobs</div>
              <div class="ql-desc">Find new opportunities</div>
            </div>
          </a>
          <a routerLink="/candidate/applications" class="quick-link-card">
            <div class="ql-icon">📋</div>
            <div>
              <div class="ql-title">Applications</div>
              <div class="ql-desc">View all your applications</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: calc(100vh - 64px); background: var(--bg); }
    .dash-header {
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      padding: 2rem 0; color: white;
    }
    .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;
    }
    .dash-section { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 2rem; }
    .dash-section h2 { font-size: 1.125rem; font-weight: 600; }
    .app-table-wrap { overflow-x: auto; }
    .quick-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .quick-link-card {
      background: white; border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
      transition: all 0.2s; cursor: pointer;
    }
    .quick-link-card:hover { border-color: var(--primary); box-shadow: var(--shadow); transform: translateY(-2px); }
    .ql-icon { font-size: 1.75rem; }
    .ql-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; }
    .ql-desc { font-size: 0.8rem; color: var(--text-muted); }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .quick-links { grid-template-columns: 1fr; } }
  `]
})
export class CandidateDashboardComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(public auth: AuthService, private appService: ApplicationService) {}

  ngOnInit(): void {
    this.appService.getMyApplications().subscribe({
      next: (apps) => { this.applications = apps; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  countStatus(status: string): number {
    return this.applications.filter(a => a.status === status).length;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      submitted: 'badge-info', under_review: 'badge-warning',
      approved: 'badge-success', rejected: 'badge-danger', closed: 'badge-gray'
    };
    return map[status] || 'badge-gray';
  }
}
