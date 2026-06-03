import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { CandidateProfile } from '../../../models/models';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-page">
      <div class="dash-header">
        <div class="container">
          <a routerLink="/candidate/dashboard" class="back-link">← Dashboard</a>
          <h1>My Profile</h1>
          <p>Update your professional information</p>
        </div>
      </div>
      <div class="container" style="padding:2rem 1.5rem">
        <div class="profile-layout">
          <div class="profile-sidebar">
            <div class="card text-center">
              <div class="avatar">{{ auth.currentUser?.name?.[0] }}</div>
              <h3>{{ auth.currentUser?.name }}</h3>
              <p class="text-muted">{{ auth.currentUser?.email }}</p>
              <span class="badge badge-success mt-1">Candidate</span>
            </div>
          </div>
          <div class="profile-main">
            <div class="card">
              <h2 style="font-size:1.125rem;font-weight:600;margin-bottom:1.5rem">Edit Profile</h2>
              <div *ngIf="saved" class="alert alert-success">Profile saved successfully!</div>
              <div *ngIf="error" class="alert alert-error">{{ error }}</div>
              <form [formGroup]="form" (ngSubmit)="save()">
                <div class="grid-2">
                  <div class="form-group">
                    <label>Location</label>
                    <input type="text" formControlName="location" class="form-control" placeholder="City, Country">
                  </div>
                  <div class="form-group">
                    <label>Years of Experience</label>
                    <input type="number" formControlName="experienceYears" class="form-control" min="0" placeholder="0">
                  </div>
                </div>
                <div class="form-group">
                  <label>Degree</label>
                  <input type="text" formControlName="degree" class="form-control" placeholder="BS Computer Science">
                </div>
                <div class="form-group">
                  <label>Skills (comma-separated)</label>
                  <input type="text" formControlName="skills" class="form-control" placeholder="Angular, C#, MongoDB, TypeScript">
                </div>
                <div class="form-group">
                  <label>Bio</label>
                  <textarea formControlName="bio" class="form-control" rows="3" placeholder="Write a short bio..."></textarea>
                </div>
                <div class="form-group">
                  <label>Resume Link / Path</label>
                  <input type="text" formControlName="resumePath" class="form-control" placeholder="https://...">
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
    .avatar {
      width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 700;
    }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
  `]
})
export class CandidateProfileComponent implements OnInit {
  form: FormGroup;
  saving = false;
  saved = false;
  error = '';

  constructor(private fb: FormBuilder, private companyService: CompanyService, public auth: AuthService) {
    this.form = this.fb.group({
      bio: [''], location: [''], experienceYears: [0], degree: [''], skills: [''], resumePath: ['']
    });
  }

  ngOnInit(): void {
    this.companyService.getMyCandidateProfile().subscribe({
      next: (profile: CandidateProfile) => { this.form.patchValue(profile); },
      error: () => {}
    });
  }

  save(): void {
    this.saving = true;
    this.saved = false;
    this.companyService.updateCandidateProfile(this.form.value).subscribe({
      next: () => { this.saving = false; this.saved = true; setTimeout(() => this.saved = false, 3000); },
      error: (err) => { this.saving = false; this.error = err.error?.message || 'Failed to save.'; }
    });
  }
}
