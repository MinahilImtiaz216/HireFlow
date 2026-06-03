import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-box fade-in">
        <div class="auth-head">
          <p class="section-label">Welcome back</p>
          <h1>Sign in</h1>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control"
              [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched"
              placeholder="you@gmail.com" autocomplete="email">
            <span class="error-text" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Enter a valid email</span>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control"
              [class.is-invalid]="form.get('password')?.invalid && form.get('password')?.touched"
              placeholder="••••••••" autocomplete="current-password">
            <span class="error-text" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Password required</span>
          </div>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <hr class="divider">

        <div class="demo-section">
          <p class="text-subtle text-sm" style="margin-bottom:.5rem">Try a demo account</p>
          <div class="demo-row">
            <button class="demo-pill" (click)="fillDemo('candidate')">Candidate</button>
            <button class="demo-pill" (click)="fillDemo('employer')">Employer</button>
            <button class="demo-pill" (click)="fillDemo('admin')">Admin</button>
          </div>
        </div>

        <p class="auth-footer">No account? <a routerLink="/signup">Sign up</a></p>
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
      width: 100%; max-width: 380px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 2rem;
    }
    .auth-head { margin-bottom: 1.5rem; }
    .auth-head h1 { font-size: 1.5rem; }
    .demo-row { display: flex; gap: 0.5rem; }
    .demo-pill {
      flex: 1; padding: 0.4rem; font-size: 0.78rem; font-weight: 500;
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      background: var(--surface-2); color: var(--text-2); cursor: pointer;
      transition: all 0.15s;
    }
    .demo-pill:hover { border-color: var(--accent); color: var(--accent); background: var(--surface); }
    .auth-footer { text-align: center; font-size: 0.82rem; color: var(--text-2); margin-top: 1.25rem; }
    .auth-footer a { color: var(--accent); font-weight: 500; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  fillDemo(role: string): void {
    const demos: Record<string, { email: string; password: string }> = {
      candidate: { email: 'candidate@example.com', password: 'Candidate@123' },
      employer:  { email: 'employer@techcorp.com',  password: 'Employer@123'  },
      admin:     { email: 'admin@recruitment.com',  password: 'Admin@123'     }
    };
    this.form.patchValue(demos[role]);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next:  () => { this.loading = false; this.auth.redirectByRole(); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Login failed.'; }
    });
  }
}
