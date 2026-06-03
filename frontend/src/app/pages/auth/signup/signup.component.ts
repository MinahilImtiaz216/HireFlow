import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-box fade-in">
        <div class="auth-head">
          <p class="section-label">Get started</p>
          <h1>Create account</h1>
        </div>
        <div *ngIf="error"   class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full name</label>
            <input type="text" formControlName="name" class="form-control"
              [class.is-invalid]="form.get('name')?.invalid && form.get('name')?.touched"
              placeholder="Your name" autocomplete="name">
            <span class="error-text" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">Min 2 characters</span>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control"
              [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched"
              placeholder="you@gmail.com" autocomplete="email">
            <span class="error-text" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Use a real email (Gmail, Yahoo, Outlook, etc.)</span>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control"
              [class.is-invalid]="form.get('password')?.invalid && form.get('password')?.touched"
              placeholder="Min 8 characters" autocomplete="new-password">
            <span class="error-text" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Min 8 characters</span>
          </div>
          <div class="form-group">
            <label>I am a</label>
            <div class="role-picker">
              <button type="button" class="role-opt" [class.active]="form.value.role === 'candidate'"
                (click)="form.patchValue({role: 'candidate'})">
                <span class="role-opt-icon">👤</span>
                <div>
                  <div class="role-opt-title">Job Seeker</div>
                  <div class="role-opt-desc">Browse and apply to jobs</div>
                </div>
              </button>
              <button type="button" class="role-opt" [class.active]="form.value.role === 'employer'"
                (click)="form.patchValue({role: 'employer'})">
                <span class="role-opt-icon">🏢</span>
                <div>
                  <div class="role-opt-title">Employer</div>
                  <div class="role-opt-desc">Post jobs and hire talent</div>
                </div>
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>
        <p class="auth-footer">Already have an account? <a routerLink="/login">Sign in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 57px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem; background: var(--bg);
    }
    .auth-box {
      width: 100%; max-width: 400px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 2rem;
    }
    .auth-head { margin-bottom: 1.5rem; }
    .auth-head h1 { font-size: 1.5rem; }
    .role-picker { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .role-opt {
      display: flex; align-items: center; gap: 0.625rem;
      padding: 0.75rem; text-align: left;
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      background: var(--surface); cursor: pointer; transition: all 0.15s;
    }
    .role-opt:hover  { border-color: var(--text-2); }
    .role-opt.active { border-color: var(--accent); background: var(--surface-2); }
    .role-opt-icon  { font-size: 1.25rem; flex-shrink: 0; }
    .role-opt-title { font-size: 0.82rem; font-weight: 600; color: var(--text); }
    .role-opt-desc  { font-size: 0.72rem; color: var(--text-2); margin-top: 0.1rem; }
    .auth-footer { text-align: center; font-size: 0.82rem; color: var(--text-2); margin-top: 1.25rem; }
    .auth-footer a { color: var(--accent); font-weight: 500; }
  `]
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(2)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role:     ['candidate']
    });
  }

  ngOnInit(): void {
    const r = sessionStorage.getItem('signupRole');
    if (r) { this.form.patchValue({ role: r }); sessionStorage.removeItem('signupRole'); }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { name, email, password, role } = this.form.value;
    this.auth.register(name, email, password, role).subscribe({
      next:  () => { this.success = 'Account created! Redirecting…'; this.loading = false; setTimeout(() => this.router.navigate(['/login']), 1500); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Registration failed.'; }
    });
  }
}
