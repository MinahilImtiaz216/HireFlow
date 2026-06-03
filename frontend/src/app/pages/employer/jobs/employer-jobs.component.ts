import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { ApplicationService } from '../../../services/application.service';
import { Job, Application } from '../../../models/models';

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="emp-jobs-page">
      <div class="dash-header">
        <div class="container">
          <a routerLink="/employer/dashboard" class="back-link">← Dashboard</a>
          <div class="flex-between">
            <div>
              <h1>Manage Jobs</h1>
              <p>Post, edit, and manage your job listings</p>
            </div>
            <button class="btn btn-primary" (click)="showForm = !showForm">
              {{ showForm ? '✕ Cancel' : '+ Post New Job' }}
            </button>
          </div>
        </div>
      </div>
      <div class="container" style="padding:2rem 1.5rem">
        <!-- Post Job Form -->
        <div class="card mb-3" *ngIf="showForm">
          <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:1.5rem">{{ editId ? 'Edit Job' : 'Post New Job' }}</h2>
          <div *ngIf="formError" class="alert alert-error">{{ formError }}</div>
          <form [formGroup]="jobForm" (ngSubmit)="saveJob()">
            <div class="form-group">
              <label>Job Title *</label>
              <input type="text" formControlName="title" class="form-control"
                [class.is-invalid]="jobForm.get('title')?.invalid && jobForm.get('title')?.touched"
                placeholder="e.g. Senior Angular Developer">
              <span class="error-text" *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">Title is required</span>
            </div>
            <div class="form-group">
              <label>Description *</label>
              <textarea formControlName="description" class="form-control" rows="4"
                [class.is-invalid]="jobForm.get('description')?.invalid && jobForm.get('description')?.touched"
                placeholder="Describe the role, requirements, and responsibilities..."></textarea>
              <span class="error-text" *ngIf="jobForm.get('description')?.invalid && jobForm.get('description')?.touched">Description is required (min 10 chars)</span>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Location</label>
                <input type="text" formControlName="location" class="form-control" placeholder="City or Remote">
              </div>
              <div class="form-group">
                <label>Deadline</label>
                <input type="date" formControlName="deadline" class="form-control">
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Min Salary (PKR)</label>
                <input type="number" formControlName="salaryMin" class="form-control" placeholder="50000">
              </div>
              <div class="form-group">
                <label>Max Salary (PKR)</label>
                <input type="number" formControlName="salaryMax" class="form-control" placeholder="100000">
              </div>
            </div>
            <div class="flex gap-1">
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                <span *ngIf="saving" class="spinner"></span>
                {{ saving ? 'Saving...' : (editId ? 'Update Job' : 'Post Job') }}
              </button>
              <button type="button" class="btn btn-outline" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Jobs List -->
        <div *ngIf="loading" class="text-muted text-center" style="padding:3rem">Loading jobs...</div>
        <div *ngIf="!loading && jobs.length === 0 && !showForm" class="empty-state">
          <div class="icon">💼</div>
          <h3>No jobs posted yet</h3>
          <button class="btn btn-primary mt-2" (click)="showForm = true">Post Your First Job</button>
        </div>
        <div class="jobs-list" *ngIf="!loading && jobs.length > 0">
          <div class="job-row card" *ngFor="let job of jobs">
            <div class="job-info-row">
              <div>
                <h3>{{ job.title }}</h3>
                <div class="job-meta-small">
                  <span *ngIf="job.location">📍 {{ job.location }}</span>
                  <span *ngIf="job.deadline">⏰ {{ job.deadline | date:'mediumDate' }}</span>
                  <span>💰 {{ job.salaryMin | number }} - {{ job.salaryMax | number }} PKR</span>
                </div>
              </div>
              <div class="job-actions">
                <span class="badge" [ngClass]="job.status === 'open' ? 'badge-success' : 'badge-gray'">{{ job.status }}</span>
                <button class="btn btn-outline btn-sm" (click)="viewApplicants(job.id)">
                  👥 Applicants {{ getAppCount(job.id) > 0 ? '(' + getAppCount(job.id) + ')' : '' }}
                </button>
                <button class="btn btn-outline btn-sm" (click)="startEdit(job)">Edit</button>
                <button class="btn btn-outline btn-sm" (click)="toggleStatus(job)">
                  {{ job.status === 'open' ? 'Close' : 'Reopen' }}
                </button>
                <button class="btn btn-danger btn-sm" (click)="deleteJob(job.id)">Delete</button>
              </div>
            </div>
            <!-- Applicants panel -->
            <div class="applicants-panel" *ngIf="selectedJobId === job.id">
              <h4 style="margin-bottom:1rem;font-size:0.95rem">Applicants for "{{ job.title }}"</h4>
              <div *ngIf="loadingApps" class="text-muted">Loading...</div>
              <div *ngIf="!loadingApps && applicants.length === 0" class="text-muted">No applications yet.</div>
              <table class="table" *ngIf="!loadingApps && applicants.length > 0">
                <thead>
                  <tr><th>Candidate</th><th>Applied</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let app of applicants">
                    <td>{{ app.candidateName || 'Candidate' }}</td>
                    <td>{{ app.appliedAt | date:'mediumDate' }}</td>
                    <td><span class="badge" [ngClass]="getStatusClass(app.status)">{{ app.status | titlecase }}</span></td>
                    <td>
                      <select class="form-control" style="width:auto;padding:0.3rem" (change)="updateStatus(app.id, $event)">
                        <option value="">Change status</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                        <option value="closed">Close</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .emp-jobs-page { min-height: calc(100vh - 64px); background: var(--bg); }
    .dash-header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 2rem 0; color: white; }
    .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .dash-header p { color: #94a3b8; }
    .back-link { color: #94a3b8; font-size: 0.875rem; display: inline-block; margin-bottom: 1rem; }
    .jobs-list { display: flex; flex-direction: column; gap: 1rem; }
    .job-row { }
    .job-info-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
    .job-info-row h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
    .job-meta-small { display: flex; gap: 0.75rem; font-size: 0.82rem; color: var(--text-muted); flex-wrap: wrap; margin-top: 0.25rem; }
    .job-actions { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
    .applicants-panel {
      margin-top: 1.25rem; padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
  `]
})
export class EmployerJobsComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  showForm = false;
  editId: string | null = null;
  saving = false;
  formError = '';
  jobForm: FormGroup;
  selectedJobId: string | null = null;
  applicants: Application[] = [];
  loadingApps = false;
  appCounts: Record<string, number> = {};

  constructor(
    private jobService: JobService,
    private appService: ApplicationService,
    private fb: FormBuilder
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: [''],
      deadline: [''],
      salaryMin: [null],
      salaryMax: [null]
    });
  }

  ngOnInit(): void { this.loadJobs(); }

  loadJobs(): void {
    this.jobService.getMyJobs().subscribe({
      next: (jobs) => { this.jobs = jobs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  saveJob(): void {
    if (this.jobForm.invalid) { this.jobForm.markAllAsTouched(); return; }
    this.saving = true;
    this.formError = '';
    const data = this.jobForm.value;
    const obs = this.editId
      ? this.jobService.updateJob(this.editId, data)
      : this.jobService.createJob(data);
    obs.subscribe({
      next: () => { this.saving = false; this.showForm = false; this.editId = null; this.jobForm.reset(); this.loadJobs(); },
      error: (err) => { this.saving = false; this.formError = err.error?.message || 'Failed to save job.'; }
    });
  }

  startEdit(job: Job): void {
    this.editId = job.id;
    this.showForm = true;
    this.jobForm.patchValue({ ...job, deadline: job.deadline ? job.deadline.split('T')[0] : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void { this.showForm = false; this.editId = null; this.jobForm.reset(); }

  toggleStatus(job: Job): void {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    this.jobService.updateJob(job.id, { status: newStatus }).subscribe({
      next: () => { job.status = newStatus as 'open' | 'closed'; },
      error: () => {}
    });
  }

  deleteJob(id: string): void {
    if (!confirm('Delete this job?')) return;
    this.jobService.deleteJob(id).subscribe({
      next: () => { this.jobs = this.jobs.filter(j => j.id !== id); },
      error: () => {}
    });
  }

  viewApplicants(jobId: string): void {
    if (this.selectedJobId === jobId) { this.selectedJobId = null; return; }
    this.selectedJobId = jobId;
    this.loadingApps = true;
    this.appService.getJobApplications(jobId).subscribe({
      next: (apps) => { this.applicants = apps; this.loadingApps = false; this.appCounts[jobId] = apps.length; },
      error: () => { this.loadingApps = false; }
    });
  }

  getAppCount(jobId: string): number { return this.appCounts[jobId] || 0; }

  updateStatus(appId: string, event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (!status) return;
    this.appService.updateStatus(appId, status).subscribe({
      next: (updated) => {
        const idx = this.applicants.findIndex(a => a.id === appId);
        if (idx > -1) this.applicants[idx].status = updated.status;
      },
      error: () => {}
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
