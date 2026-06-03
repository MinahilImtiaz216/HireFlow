import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { Company } from '../../../models/models';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-page">
      <div class="dash-header">
        <div class="container">
          <a routerLink="/employer/dashboard" class="back-link">← Dashboard</a>
          <h1>Company Profile</h1>
          <p>Update your company information</p>
        </div>
      </div>
      <div class="container" style="padding:2rem 1.5rem">
        <div class="profile-layout">
          <div class="profile-sidebar">
            <div class="card text-center">
              <div class="company-logo">{{ company?.companyName?.[0] || 'C' }}</div>
              <h3>{{ company?.companyName }}</h3>
              <p class="text-muted">{{ company?.industry }}</p>
              <p class="text-muted" style="font-size:0.8rem">{{ company?.location }}</p>
            </div>
          </div>
          <div class="profile-main">
            <div class="card">
              <h2 style="font-size:1.125rem;font-weight:600;margin-bottom:1.5rem">Edit Company Profile</h2>
              <div *ngIf="saved" class="alert alert-success">Profile saved!</div>
              <div *ngIf="error" class="alert alert-error">{{ error }}</div>
              <form [formGroup]="form" (ngSubmit)="save()">
                <div class="form-group">
                  <label>Company Name *</label>
                  <input type="text" formControlName="companyName" class="form-control" placeholder="Your Company Name">
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <label>Industry</label>
                    <input type="text" formControlName="industry" class="form-control" placeholder="Technology, Finance...">
                  </div>
                  <div class="form-group">
                    <label>Location</label>
                    <input type="text" formControlName="location" class="form-control" placeholder="City, Country">
                  </div>
                </div>
                <div class="form-group">
                  <label>Website</label>
                  <input type="url" formControlName="website" class="form-control" placeholder="https://...">
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea formControlName="description" class="form-control" rows="4" placeholder="Describe your company..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  <span *ngIf="saving" class="spinner"></span>
                  {{ saving ? 'Saving...' : 'Save Profile' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { min-height: calc(100vh - 64px); background: var(--bg); }
    .dash-header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 2rem 0; color: white; }
    .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .dash-header p { color: #94a3b8; }
    .back-link { color: #94a3b8; font-size: 0.875rem; display: inline-block; margin-bottom: 1rem; }
    .profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 1.5rem; }
    .company-logo {
      width: 80px; height: 80px; border-radius: 16px; margin: 0 auto 1rem;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 700;
    }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
  `]
})
export class EmployerProfileComponent implements OnInit {
  form: FormGroup;
  company: Company | null = null;
  saving = false;
  saved = false;
  error = '';

  constructor(private fb: FormBuilder, private companyService: CompanyService, public auth: AuthService) {
    this.form = this.fb.group({
      companyName: [''], industry: [''], location: [''], website: [''], description: ['']
    });
  }

  ngOnInit(): void {
    this.companyService.getMyCompany().subscribe({
      next: (c) => { this.company = c; this.form.patchValue(c); },
      error: () => {}
    });
  }

  save(): void {
    this.saving = true;
    this.saved = false;
    this.companyService.updateMyCompany(this.form.value).subscribe({
      next: (c) => { this.company = c; this.saving = false; this.saved = true; setTimeout(() => this.saved = false, 3000); },
      error: (err) => { this.saving = false; this.error = err.error?.message || 'Failed to save.'; }
    });
  }
}
