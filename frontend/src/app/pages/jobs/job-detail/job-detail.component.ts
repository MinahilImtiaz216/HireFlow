import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { Job } from '../../../models/models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="job-detail-page" *ngIf="job">
      <div class="job-hero">
        <div class="container">
          <a routerLink="/jobs" class="back-link">← Back to Jobs</a>
          <div class="job-hero-content">
            <div class="company-avatar-lg">{{ job.companyName[0] }}</div>
            <div>
              <h1>{{ job.title }}</h1>
              <div class="job-meta-row">
                <span class="meta-item">🏢 {{ job.companyName }}</span>
                <span class="meta-item" *ngIf="job.location">📍 {{ job.location }}</span>
                <span class="meta-item" *ngIf="job.salaryMin">💰 {{ job.salaryMin | number }} - {{ job.salaryMax | number }} PKR/month</span>
                <span class="badge" [ngClass]="job.status === 'open' ? 'badge-success' : 'badge-danger'">{{ job.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="job-body">
          <div class="job-main">
            <div class="card mb-3">
              <h2 class="section-h">Job Description</h2>
              <p class="job-description">{{ job.description }}</p>
            </div>
            <div class="card mb-3" *ngIf="job.deadline">
              <h2 class="section-h">Details</h2>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Deadline</span>
                  <span class="detail-value">{{ job.deadline | date:'longDate' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Posted</span>
                  <span class="detail-value">{{ job.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="job-sidebar">
            <div class="card apply-card">
              <div *ngIf="!auth.isLoggedIn">
                <h3>Interested in this job?</h3>
                <p class="text-muted mb-2">Sign in to apply</p>
                <a routerLink="/login" class="btn btn-primary w-full">Login to Apply</a>
                <a routerLink="/signup" class="btn btn-outline w-full mt-1">Create Account</a>
              </div>
              <div *ngIf="auth.isLoggedIn && auth.currentUser?.role === 'candidate'">
                <h3>Apply for this Job</h3>
                <div *ngIf="applied" class="alert alert-success">✅ Application submitted!</div>
                <div *ngIf="applyError" class="alert alert-error">{{ applyError }}</div>
                <form *ngIf="!applied" [formGroup]="applyForm" (ngSubmit)="applyNow()">
                  <div class="form-group">
                    <label>Cover Letter</label>
                    <textarea formControlName="coverLetter" class="form-control" rows="4"
                      placeholder="Tell them why you're a great fit..."></textarea>
                  </div>
                  <div class="form-group">
                    <label>Projects / Portfolio</label>
                    <textarea formControlName="projects" class="form-control" rows="2"
                      placeholder="Relevant projects or portfolio links..."></textarea>
                  </div>
                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" formControlName="priorExperience">
                      I have prior work experience
                    </label>
                  </div>
                  <div class="form-group" *ngIf="applyForm.value.priorExperience">
                    <label>Previous Company</label>
                    <input type="text" formControlName="priorCompany" class="form-control" placeholder="Company name">
                  </div>
                  <button type="submit" class="btn btn-primary w-full" [disabled]="applying">
                    <span *ngIf="applying" class="spinner"></span>
                    {{ applying ? 'Submitting...' : 'Submit Application' }}
                  </button>
                </form>
              </div>
              <div *ngIf="auth.isLoggedIn && auth.currentUser?.role !== 'candidate'">
                <p class="text-muted text-center">Only candidates can apply for jobs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="loading" class="text-center" style="padding:5rem">
      <div class="spinner" style="border-color: var(--border); border-top-color: var(--primary); width:40px; height:40px; margin: 0 auto"></div>
    </div>
  `,
  styles: [`
    .job-detail-page { min-height: calc(100vh - 64px); padding-bottom: 3rem; }
    .job-hero {
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      padding: 3rem 0; color: white; margin-bottom: 2rem;
    }
    .back-link { color: #94a3b8; font-size: 0.875rem; display: inline-block; margin-bottom: 1.5rem; }
    .back-link:hover { color: white; }
    .job-hero-content { display: flex; gap: 1.5rem; align-items: flex-start; }
    .company-avatar-lg {
      width: 64px; height: 64px; border-radius: 14px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.75rem;
    }
    .job-hero-content h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; }
    .job-meta-row { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
    .meta-item { font-size: 0.9rem; color: #cbd5e1; }
    .job-body { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
    .section-h { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
    .job-description { color: var(--text-muted); line-height: 1.8; white-space: pre-line; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-label { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-value { font-weight: 500; font-size: 0.9rem; }
    .apply-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
    .w-full { width: 100%; justify-content: center; padding: 0.75rem; }
    .mt-1 { margin-top: 0.75rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; }
    @media (max-width: 768px) { .job-body { grid-template-columns: 1fr; } .job-sidebar { order: -1; } }
  `]
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  applied = false;
  applying = false;
  applyError = '';
  applyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private appService: ApplicationService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.applyForm = this.fb.group({
      coverLetter: [''],
      projects: [''],
      priorExperience: [false],
      priorCompany: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.jobService.getJob(id).subscribe({
      next: (job) => { this.job = job; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyNow(): void {
    if (!this.job) return;
    this.applying = true;
    this.applyError = '';
    this.appService.apply(this.job.id, this.applyForm.value).subscribe({
      next: () => { this.applied = true; this.applying = false; },
      error: (err) => {
        this.applying = false;
        this.applyError = err.error?.message || 'Failed to apply. Try again.';
      }
    });
  }
}
