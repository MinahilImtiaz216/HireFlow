import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/models';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Page header -->
      <div class="dash-header">
        <div class="container">
          <p class="section-label">Browse</p>
          <h1>Open Positions</h1>
          <p class="mt-1">{{ jobs.length }} job{{ jobs.length !== 1 ? 's' : '' }} available right now</p>
          <!-- Search -->
          <form [formGroup]="searchForm" (ngSubmit)="search()" class="search-row">
            <input type="text" formControlName="search"   class="form-control" placeholder="Job title or keyword…">
            <input type="text" formControlName="location" class="form-control" placeholder="Location…">
            <button type="submit"   class="btn btn-primary">Search</button>
            <button type="button"   class="btn btn-outline" (click)="clearSearch()">Clear</button>
          </form>
        </div>
      </div>

      <div class="container" style="padding-top:2rem; padding-bottom:3rem">
        <div *ngIf="loading" class="empty-state"><p>Loading jobs…</p></div>
        <div *ngIf="!loading && jobs.length === 0" class="empty-state">
          <div class="icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try different search terms</p>
        </div>

        <div class="jobs-list" *ngIf="!loading && jobs.length > 0">
          <div class="job-row fade-in" *ngFor="let job of jobs" (click)="goToJob(job.id)">
            <div class="job-left">
              <div class="job-logo">{{ job.companyName[0] }}</div>
              <div class="job-text">
                <p class="job-title">{{ job.title }}</p>
                <p class="job-meta">
                  {{ job.companyName }}
                  <span *ngIf="job.location"> · {{ job.location }}</span>
                  <span *ngIf="job.salaryMin"> · {{ job.salaryMin | number }}–{{ job.salaryMax | number }} PKR</span>
                  <span *ngIf="job.deadline"> · Closes {{ job.deadline | date:'MMM d' }}</span>
                </p>
              </div>
            </div>
            <div class="job-right">
              <span class="badge" [ngClass]="job.status === 'open' ? 'badge-success' : 'badge-gray'">{{ job.status }}</span>
              <span class="text-subtle text-sm">{{ job.createdAt | date:'MMM d' }}</span>
              <button class="btn btn-outline btn-sm" (click)="$event.stopPropagation(); goToJob(job.id)">View →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-row {
      display: flex; gap: 0.625rem; flex-wrap: wrap; margin-top: 1.25rem;
    }
    .search-row .form-control { flex: 1; min-width: 180px; }
    .jobs-list {
      display: flex; flex-direction: column;
      border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;
    }
    .job-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.25rem; background: var(--surface);
      border-bottom: 1px solid var(--border);
      cursor: pointer; transition: background 0.15s; gap: 1rem;
    }
    .job-row:last-child { border-bottom: none; }
    .job-row:hover { background: var(--surface-2); }
    .job-left  { display: flex; align-items: center; gap: 0.875rem; flex: 1; min-width: 0; }
    .job-logo  {
      width: 38px; height: 38px; border-radius: var(--radius-sm); flex-shrink: 0;
      background: var(--surface-2); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; color: var(--text);
    }
    .job-text { min-width: 0; }
    .job-title { font-size: 0.9rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .job-meta  { font-size: 0.78rem; color: var(--text-2); margin-top: 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .job-right { display: flex; align-items: center; gap: 0.625rem; flex-shrink: 0; }
  `]
})
export class JobsListComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  searchForm: FormGroup;

  constructor(private jobService: JobService, private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({ search: [''], location: [''] });
  }

  ngOnInit(): void { this.loadJobs(); }

  loadJobs(search?: string, location?: string): void {
    this.loading = true;
    this.jobService.getJobs(search, location).subscribe({
      next: (jobs) => { this.jobs = jobs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  search(): void {
    const { search, location } = this.searchForm.value;
    this.loadJobs(search || undefined, location || undefined);
  }

  clearSearch(): void { this.searchForm.reset(); this.loadJobs(); }
  goToJob(id: string): void { this.router.navigate(['/jobs', id]); }
}
