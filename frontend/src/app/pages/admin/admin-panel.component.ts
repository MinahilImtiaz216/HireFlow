import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { AdminStats, AdminUser } from '../../models/models';

type AdminTab = 'overview' | 'users' | 'jobs';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="dash-header">
        <div class="container">
          <h1>⚙️ Admin Panel</h1>
          <p>Manage all users, jobs, and platform data</p>
        </div>
      </div>
      <div class="container" style="padding:2rem 1.5rem">
        <!-- Tabs -->
        <div class="tabs mb-3">
          <button class="tab-btn" [class.active]="tab === 'overview'" (click)="tab = 'overview'">📊 Overview</button>
          <button class="tab-btn" [class.active]="tab === 'users'" (click)="tab = 'users'; loadUsers()">👥 Users</button>
          <button class="tab-btn" [class.active]="tab === 'jobs'" (click)="tab = 'jobs'; loadJobs()">💼 Jobs</button>
        </div>

        <!-- Overview Tab -->
        <ng-container *ngIf="tab === 'overview'">
          <div *ngIf="statsLoading" class="text-muted text-center" style="padding:3rem">Loading stats...</div>
          <div *ngIf="stats" class="fade-in">
            <div class="stats-grid mb-3">
              <div class="stat-card">
                <div class="stat-icon purple">👥</div>
                <div><div class="stat-value">{{ stats.totalUsers }}</div><div class="stat-label">Total Users</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon green">👤</div>
                <div><div class="stat-value">{{ stats.totalCandidates }}</div><div class="stat-label">Candidates</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon blue">🏢</div>
                <div><div class="stat-value">{{ stats.totalEmployers }}</div><div class="stat-label">Employers</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon orange">💼</div>
                <div><div class="stat-value">{{ stats.totalJobs }}</div><div class="stat-label">Total Jobs</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon green">✅</div>
                <div><div class="stat-value">{{ stats.openJobs }}</div><div class="stat-label">Open Jobs</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon blue">📋</div>
                <div><div class="stat-value">{{ stats.totalApplications }}</div><div class="stat-label">Applications</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon purple">⭐</div>
                <div><div class="stat-value">{{ stats.averageReviewRating }}</div><div class="stat-label">Avg Rating</div></div>
              </div>
              <div class="stat-card">
                <div class="stat-icon orange">💬</div>
                <div><div class="stat-value">{{ stats.totalReviews }}</div><div class="stat-label">Reviews</div></div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Users Tab -->
        <ng-container *ngIf="tab === 'users'">
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:1.5rem">All Users ({{ users.length }})</h2>
            <div *ngIf="usersLoading" class="text-muted text-center" style="padding:2rem">Loading...</div>
            <div class="table-wrap" *ngIf="!usersLoading">
              <table class="table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of users">
                    <td><strong>{{ user.name }}</strong></td>
                    <td>{{ user.email }}</td>
                    <td><span class="badge" [ngClass]="getRoleBadge(user.role)">{{ user.role }}</span></td>
                    <td>
                      <span class="badge" [ngClass]="user.isActive ? 'badge-success' : 'badge-danger'">
                        {{ user.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>{{ user.createdAt | date:'mediumDate' }}</td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-outline btn-sm" (click)="toggleUser(user)">
                          {{ user.isActive ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button class="btn btn-danger btn-sm" (click)="deleteUser(user.id)" *ngIf="user.id !== auth.currentUser?.id">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>

        <!-- Jobs Tab -->
        <ng-container *ngIf="tab === 'jobs'">
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:1.5rem">All Jobs ({{ allJobs.length }})</h2>
            <div *ngIf="jobsLoading" class="text-muted text-center" style="padding:2rem">Loading...</div>
            <div class="table-wrap" *ngIf="!jobsLoading">
              <table class="table">
                <thead>
                  <tr><th>Title</th><th>Company</th><th>Status</th><th>Location</th><th>Posted</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let job of allJobs">
                    <td><strong>{{ job['title'] }}</strong></td>
                    <td>{{ job['companyName'] }}</td>
                    <td><span class="badge" [ngClass]="job['status'] === 'open' ? 'badge-success' : 'badge-gray'">{{ job['status'] }}</span></td>
                    <td>{{ job['location'] || '-' }}</td>
                    <td>{{ job['createdAt'] | date:'mediumDate' }}</td>
                    <td>
                      <button class="btn btn-danger btn-sm" (click)="deleteJob(job['id'])">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { min-height: calc(100vh - 64px); background: var(--bg); }
    .dash-header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 2rem 0; color: white; }
    .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .dash-header p { color: #94a3b8; }
    .tabs { display: flex; gap: 0.5rem; border-bottom: 2px solid var(--border); padding-bottom: 0; }
    .tab-btn {
      padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 500;
      background: transparent; border: none; cursor: pointer; color: var(--text-muted);
      border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s;
    }
    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
    .tab-btn:hover { color: var(--primary); }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .table-wrap { overflow-x: auto; }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class AdminPanelComponent implements OnInit {
  tab: AdminTab = 'overview';
  stats: AdminStats | null = null;
  statsLoading = true;
  users: AdminUser[] = [];
  usersLoading = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allJobs: any[] = [];
  jobsLoading = false;

  constructor(private companyService: CompanyService, public auth: AuthService) {}

  ngOnInit(): void {
    this.companyService.getAdminStats().subscribe({
      next: (s) => { this.stats = s; this.statsLoading = false; },
      error: () => { this.statsLoading = false; }
    });
  }

  loadUsers(): void {
    if (this.users.length > 0) return;
    this.usersLoading = true;
    this.companyService.getAdminUsers().subscribe({
      next: (u) => { this.users = u; this.usersLoading = false; },
      error: () => { this.usersLoading = false; }
    });
  }

  loadJobs(): void {
    if (this.allJobs.length > 0) return;
    this.jobsLoading = true;
    this.companyService.getAdminJobs().subscribe({
      next: (j) => { this.allJobs = j; this.jobsLoading = false; },
      error: () => { this.jobsLoading = false; }
    });
  }

  toggleUser(user: AdminUser): void {
    this.companyService.updateUserStatus(user.id, !user.isActive).subscribe({
      next: () => { user.isActive = !user.isActive; },
      error: () => {}
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Delete this user?')) return;
    this.companyService.deleteUser(id).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== id); },
      error: () => {}
    });
  }

  deleteJob(id: string): void {
    if (!confirm('Delete this job?')) return;
    this.companyService.deleteAdminJob(id).subscribe({
      next: () => { this.allJobs = this.allJobs.filter(j => j['id'] !== id); },
      error: () => {}
    });
  }

  getRoleBadge(role: string): string {
    const map: Record<string, string> = { candidate: 'badge-success', employer: 'badge-info', admin: 'badge-purple' };
    return map[role] || 'badge-gray';
  }
}
