import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="apps-page">
      <div class="dash-header">
        <div class="container">
          <a routerLink="/candidate/dashboard" class="back-link">← Dashboard</a>
          <h1>My Applications</h1>
          <p>Track all your job applications</p>
        </div>
      </div>
      <div class="container" style="padding:2rem 1.5rem">
        <div *ngIf="loading" class="text-muted text-center" style="padding:3rem">Loading...</div>
        <div *ngIf="!loading && applications.length === 0" class="empty-state">
          <div class="icon">📋</div>
          <h3>No applications yet</h3>
          <a routerLink="/jobs" class="btn btn-primary mt-2">Browse Jobs</a>
        </div>
        <div class="apps-list" *ngIf="!loading && applications.length > 0">
          <div class="app-card fade-in" *ngFor="let app of applications">
            <div class="app-header">
              <div>
                <h3>{{ app.jobTitle }}</h3>
                <p class="text-muted">{{ app.companyName }}</p>
              </div>
              <span class="badge" [ngClass]="getStatusClass(app.status)">{{ app.status | titlecase }}</span>
            </div>
            <div class="app-body">
              <div *ngIf="app.coverLetter" class="app-detail">
                <strong>Cover Letter:</strong>
                <p>{{ app.coverLetter | slice:0:200 }}{{ app.coverLetter && app.coverLetter.length > 200 ? '...' : '' }}</p>
              </div>
            </div>
            <div class="app-footer">
              <span class="text-muted" style="font-size:0.8rem">Applied: {{ app.appliedAt | date:'mediumDate' }}</span>
              <span class="text-muted" style="font-size:0.8rem">Updated: {{ app.updatedAt | date:'mediumDate' }}</span>
              <button class="btn btn-danger btn-sm" (click)="withdraw(app.id)" [disabled]="withdrawing === app.id">
                {{ withdrawing === app.id ? 'Withdrawing...' : 'Withdraw' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .apps-page { min-height: calc(100vh - 64px); background: var(--bg); }
    .dash-header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 2rem 0; color: white; }
    .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .dash-header p { color: #94a3b8; }
    .back-link { color: #94a3b8; font-size: 0.875rem; display: inline-block; margin-bottom: 1rem; }
    .apps-list { display: flex; flex-direction: column; gap: 1rem; }
    .app-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
    .app-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .app-header h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
    .app-body { margin-bottom: 1rem; }
    .app-detail p { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }
    .app-footer { display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  withdrawing: string | null = null;

  constructor(private appService: ApplicationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.appService.getMyApplications().subscribe({
      next: (apps) => { this.applications = apps; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  withdraw(id: string): void {
    if (!confirm('Withdraw this application?')) return;
    this.withdrawing = id;
    this.appService.withdraw(id).subscribe({
      next: () => { this.applications = this.applications.filter(a => a.id !== id); this.withdrawing = null; },
      error: () => { this.withdrawing = null; }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      submitted: 'badge-info', under_review: 'badge-warning',
      approved: 'badge-success', rejected: 'badge-danger', closed: 'badge-gray'
    };
    return map[status] || 'badge-gray';
  }
}
