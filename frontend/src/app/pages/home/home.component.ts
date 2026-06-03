import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>
      <div class="hero-grid-bg"></div>
      <div class="container hero-inner">
        <div class="hero-text fade-in">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Trusted by 150+ companies in Pakistan
          </div>
          <h1 class="hero-title">
            The smarter way<br>
            to <span class="highlight">hire</span> &amp;
            get <span class="highlight">hired</span>
          </h1>
          <p class="hero-desc">
            HireFlow connects top talent with leading companies across Pakistan.
            Post jobs, apply instantly, and track everything — all in one place.
          </p>
          <div class="hero-cta">
            <a routerLink="/jobs" class="cta-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Browse Jobs
            </a>
            <a routerLink="/signup" class="cta-secondary">Post a Job →</a>
          </div>
          <div class="hero-stats">
            <div class="h-stat">
              <span class="h-num" id="stat-jobs">{{ animatedJobs }}+</span>
              <span class="h-lbl">Open Jobs</span>
            </div>
            <div class="h-divider"></div>
            <div class="h-stat">
              <span class="h-num">{{ animatedCandidates }}+</span>
              <span class="h-lbl">Candidates</span>
            </div>
            <div class="h-divider"></div>
            <div class="h-stat">
              <span class="h-num">{{ animatedCompanies }}+</span>
              <span class="h-lbl">Companies</span>
            </div>
          </div>
        </div>

        <!-- Hero visual: floating cards -->
        <div class="hero-visual fade-in">
          <div class="visual-card vc-1">
            <div class="vc-avatar">T</div>
            <div>
              <div class="vc-title">Senior Developer</div>
              <div class="vc-sub">Tech Corp · Lahore</div>
            </div>
            <span class="vc-badge">Open</span>
          </div>
          <div class="visual-card vc-2">
            <div class="vc-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="vc-title">2,400+ Applicants</div>
              <div class="vc-sub">This month</div>
            </div>
          </div>
          <div class="visual-card vc-3">
            <div class="vc-icon green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div class="vc-title">Application Approved</div>
              <div class="vc-sub">Finance Inc · Karachi</div>
            </div>
          </div>
          <div class="visual-main-card">
            <div class="vmc-top">
              <div class="vmc-logo">F</div>
              <span class="vc-badge">Hiring</span>
            </div>
            <div class="vmc-role">Angular Developer</div>
            <div class="vmc-company">Finance Inc</div>
            <div class="vmc-tags">
              <span class="tag">Remote</span>
              <span class="tag">Full-time</span>
              <span class="tag">PKR 90k+</span>
            </div>
            <button class="vmc-btn">Apply Now</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== COMPANIES ===== -->
    <section class="companies-bar">
      <div class="container">
        <p class="companies-label">Trusted by leading companies</p>
        <div class="companies-row">
          <div class="company-logo-item" *ngFor="let c of companies">
            <div class="co-avatar">{{ c.letter }}</div>
            <span>{{ c.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="how-section">
      <div class="container">
        <div class="section-header text-center">
          <p class="section-label">Process</p>
          <h2>How HireFlow works</h2>
          <p class="section-desc">Get hired or hire talent in three simple steps</p>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-num">01</div>
            <div class="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3>Create Profile</h3>
            <p>Sign up, fill in your skills and experience. Takes less than 2 minutes.</p>
          </div>
          <div class="step-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div class="step-card">
            <div class="step-num">02</div>
            <div class="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3>Find Matches</h3>
            <p>Browse and filter hundreds of verified job listings from top companies.</p>
          </div>
          <div class="step-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div class="step-card">
            <div class="step-num">03</div>
            <div class="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3>Get Hired</h3>
            <p>Apply with one click, track your status in real-time on your dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LATEST JOBS ===== -->
    <section class="jobs-section">
      <div class="container">
        <div class="flex-between mb-3">
          <div>
            <p class="section-label">Opportunities</p>
            <h2>Latest Jobs</h2>
          </div>
          <a routerLink="/jobs" class="view-all-btn">
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div *ngIf="loading" class="empty-state"><p>Loading jobs...</p></div>
        <div class="jobs-grid" *ngIf="!loading">
          <div class="job-card-new fade-in" *ngFor="let job of latestJobs" (click)="goToJob(job.id)">
            <div class="jc-header">
              <div class="jc-logo">{{ job.companyName[0] }}</div>
              <span class="jc-badge">{{ job.status }}</span>
            </div>
            <h4 class="jc-title">{{ job.title }}</h4>
            <p class="jc-company">{{ job.companyName }}</p>
            <div class="jc-tags">
              <span class="jc-tag" *ngIf="job.location">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ job.location }}
              </span>
              <span class="jc-tag" *ngIf="job.salaryMin">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {{ job.salaryMin | number }}–{{ job.salaryMax | number }}
              </span>
            </div>
            <div class="jc-footer">
              <span class="jc-date">{{ job.createdAt | date:'MMM d' }}</span>
              <span class="jc-apply">Apply →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section class="features-section">
      <div class="container">
        <div class="features-inner">
          <div class="features-text">
            <p class="section-label">Why HireFlow</p>
            <h2>Everything you need<br>in one platform</h2>
            <p class="section-desc">From job posting to hiring — manage the entire process without switching tools.</p>
            <a routerLink="/signup" class="cta-primary" style="margin-top:1.5rem;display:inline-flex">Start for free →</a>
          </div>
          <div class="features-list">
            <div class="feature-item" *ngFor="let f of features">
              <div class="fi-icon">
                <span [innerHTML]="f.svg"></span>
              </div>
              <div>
                <div class="fi-title">{{ f.title }}</div>
                <div class="fi-desc">{{ f.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA BANNER ===== -->
    <section class="cta-banner">
      <div class="container">
        <div class="cta-inner">
          <div class="cta-blob"></div>
          <div class="cta-content">
            <h2>Ready to find your next opportunity?</h2>
            <p>Join thousands of professionals who trust HireFlow.</p>
            <div class="cta-btns">
              <a routerLink="/signup" class="cta-primary" style="background:white;color:#4f46e5">Create Free Account</a>
              <a routerLink="/jobs"   class="cta-outline-white">Browse Jobs</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" fill="var(--accent)"/>
              <path d="M16 7V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="13" r="2" fill="white"/>
            </svg>
            <span>HireFlow</span>
          </div>
          <div class="footer-links">
            <a routerLink="/jobs">Jobs</a>
            <a routerLink="/signup">For Employers</a>
            <a routerLink="/login">Sign In</a>
          </div>
          <p class="footer-copy">© 2026 HireFlow · Pakistan</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* ===== HERO ===== */
    .hero {
      min-height: 88vh; display: flex; align-items: center;
      background: var(--bg); position: relative; overflow: hidden;
      padding: 5rem 0;
    }
    .hero-blobs { position: absolute; inset: 0; pointer-events: none; }
    .blob {
      position: absolute; border-radius: 50%;
      filter: blur(80px); opacity: 0.25; animation: blobFloat 8s ease-in-out infinite;
    }
    .blob-1 { width: 500px; height: 500px; background: #6366f1; top: -100px; right: -100px; animation-delay: 0s; }
    .blob-2 { width: 350px; height: 350px; background: #8b5cf6; bottom: -50px; left: -80px; animation-delay: 3s; }
    .blob-3 { width: 250px; height: 250px; background: #06b6d4; top: 40%; left: 40%; animation-delay: 6s; }
    @keyframes blobFloat {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(20px,-30px) scale(1.05); }
      66%      { transform: translate(-20px,20px) scale(0.95); }
    }
    .hero-grid-bg {
      position: absolute; inset: 0; pointer-events: none;
      background-image: linear-gradient(var(--border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 40px 40px; opacity: 0.4;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    }
    .hero-inner {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 4rem; align-items: center; position: relative; z-index: 1;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-size: 0.8rem; font-weight: 500; color: var(--accent);
      background: color-mix(in srgb, var(--accent) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
      padding: 0.35rem 0.875rem; border-radius: 99px; margin-bottom: 1.5rem;
    }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
    .hero-title {
      font-size: 3.25rem; font-weight: 800; letter-spacing: -0.04em;
      line-height: 1.1; color: var(--text); margin-bottom: 1.25rem;
    }
    .highlight {
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-desc { font-size: 1rem; color: var(--text-2); line-height: 1.75; margin-bottom: 2rem; max-width: 460px; }
    .hero-cta { display: flex; gap: 1rem; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; }
    .cta-primary {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.7rem 1.4rem; background: var(--accent); color: #fff;
      border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600;
      text-decoration: none; transition: all 0.2s; border: none; cursor: pointer;
    }
    .cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 30%, transparent); }
    .cta-secondary {
      font-size: 0.9rem; font-weight: 500; color: var(--text-2);
      text-decoration: none; transition: color 0.15s;
    }
    .cta-secondary:hover { color: var(--text); }
    .hero-stats { display: flex; align-items: center; gap: 1.5rem; }
    .h-stat { display: flex; flex-direction: column; gap: 0.15rem; }
    .h-num { font-size: 1.5rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
    .h-lbl { font-size: 0.72rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.07em; }
    .h-divider { width: 1px; height: 30px; background: var(--border); }

    /* Hero visual */
    .hero-visual { position: relative; height: 420px; }
    .visual-card {
      position: absolute; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 0.875rem 1rem;
      display: flex; align-items: center; gap: 0.75rem;
      box-shadow: var(--shadow); animation: floatCard 6s ease-in-out infinite;
      min-width: 220px;
    }
    .vc-1 { top: 10px; right: 0; animation-delay: 0s; }
    .vc-2 { top: 130px; left: 0; animation-delay: 2s; }
    .vc-3 { bottom: 60px; right: 20px; animation-delay: 4s; }
    @keyframes floatCard {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }
    .vc-avatar {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem;
    }
    .vc-icon {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: #ede9fe; display: flex; align-items: center; justify-content: center;
    }
    .vc-icon.green { background: #dcfce7; }
    .vc-icon.green svg { stroke: #16a34a; }
    .vc-title { font-size: 0.82rem; font-weight: 600; color: var(--text); }
    .vc-sub   { font-size: 0.72rem; color: var(--text-2); }
    .vc-badge {
      margin-left: auto; font-size: 0.68rem; font-weight: 600;
      background: #dcfce7; color: #15803d; padding: 0.2rem 0.5rem;
      border-radius: 99px; flex-shrink: 0;
    }
    .visual-main-card {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 1.5rem; width: 220px;
      box-shadow: var(--shadow); animation: floatCard 6s ease-in-out infinite;
      animation-delay: 1s;
    }
    .vmc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .vmc-logo {
      width: 42px; height: 42px; border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem;
    }
    .vmc-role { font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 0.2rem; }
    .vmc-company { font-size: 0.78rem; color: var(--text-2); margin-bottom: 0.875rem; }
    .vmc-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .tag {
      font-size: 0.68rem; font-weight: 500;
      background: var(--surface-2); border: 1px solid var(--border);
      color: var(--text-2); padding: 0.18rem 0.5rem; border-radius: 99px;
    }
    .vmc-btn {
      width: 100%; padding: 0.55rem; background: var(--accent); color: #fff;
      border: none; border-radius: var(--radius-sm); font-size: 0.82rem;
      font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .vmc-btn:hover { background: var(--accent-hover); }

    /* ===== COMPANIES BAR ===== */
    .companies-bar {
      padding: 2rem 0; border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border); background: var(--surface);
    }
    .companies-label { font-size: 0.75rem; color: var(--text-3); text-align: center; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem; }
    .companies-row { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    .company-logo-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-2); font-size: 0.85rem; font-weight: 600; }
    .co-avatar {
      width: 30px; height: 30px; border-radius: 6px;
      background: var(--surface-2); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; color: var(--accent);
    }

    /* ===== HOW IT WORKS ===== */
    .how-section { padding: 5rem 0; }
    .section-header { margin-bottom: 3rem; }
    .section-header h2 { font-size: 1.875rem; margin-bottom: 0.5rem; }
    .section-desc { color: var(--text-2); font-size: 0.9rem; max-width: 420px; margin: 0 auto; }
    .steps-grid { display: flex; align-items: center; gap: 0; }
    .step-card {
      flex: 1; padding: 2rem; background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .step-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 10%, transparent); }
    .step-arrow { flex-shrink: 0; padding: 0 0.75rem; }
    .step-num { font-size: 0.72rem; font-weight: 700; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 0.875rem; }
    .step-icon {
      width: 44px; height: 44px; border-radius: var(--radius-sm);
      background: color-mix(in srgb, var(--accent) 10%, transparent);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem;
    }
    .step-card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
    .step-card p  { font-size: 0.85rem; color: var(--text-2); line-height: 1.6; }

    /* ===== JOBS ===== */
    .jobs-section { padding: 5rem 0; background: var(--surface); border-top: 1px solid var(--border); }
    .view-all-btn {
      display: flex; align-items: center; gap: 0.35rem;
      font-size: 0.83rem; font-weight: 500; color: var(--accent);
      text-decoration: none; transition: gap 0.15s;
    }
    .view-all-btn:hover { gap: 0.6rem; }
    .jobs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .job-card-new {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 1.25rem;
      cursor: pointer; transition: all 0.2s;
    }
    .job-card-new:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }
    .jc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .jc-logo {
      width: 42px; height: 42px; border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem;
    }
    .jc-badge {
      font-size: 0.68rem; font-weight: 600;
      background: #dcfce7; color: #15803d;
      padding: 0.2rem 0.55rem; border-radius: 99px;
    }
    .jc-title   { font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
    .jc-company { font-size: 0.8rem; color: var(--text-2); margin-bottom: 0.75rem; }
    .jc-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .jc-tag {
      display: flex; align-items: center; gap: 0.3rem;
      font-size: 0.72rem; color: var(--text-2);
      background: var(--surface-2); border: 1px solid var(--border);
      padding: 0.2rem 0.55rem; border-radius: 99px;
    }
    .jc-footer { display: flex; justify-content: space-between; align-items: center; }
    .jc-date  { font-size: 0.72rem; color: var(--text-3); }
    .jc-apply { font-size: 0.78rem; font-weight: 600; color: var(--accent); }

    /* ===== FEATURES ===== */
    .features-section { padding: 5rem 0; }
    .features-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .features-text h2 { font-size: 1.875rem; margin-bottom: 0.75rem; }
    .features-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .feature-item {
      display: flex; gap: 1rem; align-items: flex-start;
      padding: 1rem; border-radius: var(--radius);
      border: 1px solid var(--border); background: var(--surface);
      transition: border-color 0.15s;
    }
    .feature-item:hover { border-color: var(--accent); }
    .fi-icon {
      width: 38px; height: 38px; flex-shrink: 0; border-radius: var(--radius-sm);
      background: color-mix(in srgb, var(--accent) 10%, transparent);
      display: flex; align-items: center; justify-content: center;
    }
    .fi-title { font-size: 0.875rem; font-weight: 600; color: var(--text); margin-bottom: 0.2rem; }
    .fi-desc  { font-size: 0.8rem; color: var(--text-2); line-height: 1.5; }

    /* ===== CTA BANNER ===== */
    .cta-banner { padding: 4rem 0; }
    .cta-inner {
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
      border-radius: var(--radius-lg); padding: 4rem;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-blob {
      position: absolute; width: 400px; height: 400px;
      background: rgba(255,255,255,0.07); border-radius: 50%;
      top: -150px; right: -100px; pointer-events: none;
    }
    .cta-content { position: relative; z-index: 1; }
    .cta-content h2 { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem; }
    .cta-content p  { color: rgba(255,255,255,0.8); margin-bottom: 2rem; }
    .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .cta-outline-white {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.7rem 1.4rem; background: transparent; color: #fff;
      border: 1.5px solid rgba(255,255,255,0.6);
      border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600;
      text-decoration: none; transition: all 0.2s;
    }
    .cta-outline-white:hover { background: rgba(255,255,255,0.1); border-color: white; }

    /* ===== FOOTER ===== */
    .footer { border-top: 1px solid var(--border); padding: 1.5rem 0; background: var(--surface); }
    .footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .footer-brand { display: flex; align-items: center; gap: 0.45rem; font-size: 0.9rem; font-weight: 700; color: var(--text); }
    .footer-links { display: flex; gap: 1.5rem; }
    .footer-links a { font-size: 0.82rem; color: var(--text-2); text-decoration: none; transition: color 0.15s; }
    .footer-links a:hover { color: var(--text); }
    .footer-copy { font-size: 0.75rem; color: var(--text-3); }

    @media (max-width: 900px) {
      .hero-inner { grid-template-columns: 1fr; }
      .hero-visual { display: none; }
      .hero-title { font-size: 2.25rem; }
      .steps-grid { flex-direction: column; }
      .step-arrow { transform: rotate(90deg); }
      .jobs-grid { grid-template-columns: repeat(2, 1fr); }
      .features-inner { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .jobs-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  latestJobs: Job[] = [];
  loading = true;
  animatedJobs = 0;
  animatedCandidates = 0;
  animatedCompanies = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  companies = [
    { letter: 'T', name: 'Tech Corp' },
    { letter: 'F', name: 'Finance Inc' },
    { letter: 'N', name: 'NextGen' },
    { letter: 'S', name: 'SoftHouse' },
    { letter: 'A', name: 'Arbisoft' },
    { letter: 'S', name: 'Systems Ltd' },
  ];

  features = [
    {
      title: 'Smart Job Matching',
      desc: 'Filter by role, location, salary and experience to find the perfect fit.',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`
    },
    {
      title: 'Real-time Application Tracking',
      desc: 'Track every application status — submitted, reviewed, approved — live.',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
    },
    {
      title: 'Verified Company Profiles',
      desc: 'Every employer is verified with reviews from real candidates.',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    },
    {
      title: 'JWT-Secured Accounts',
      desc: 'Your profile and data are secured with industry-standard authentication.',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    },
  ];

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => { this.latestJobs = jobs.slice(0, 6); this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.animateCounters();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  animateCounters(): void {
    let j = 0, c = 0, co = 0;
    const tJ = 500, tC = 2000, tCo = 150;
    this.intervalId = setInterval(() => {
      if (j < tJ)   { j  += 12; this.animatedJobs = Math.min(j, tJ); }
      if (c < tC)   { c  += 48; this.animatedCandidates = Math.min(c, tC); }
      if (co < tCo) { co += 4;  this.animatedCompanies = Math.min(co, tCo); }
      if (j >= tJ && c >= tC && co >= tCo) {
        clearInterval(this.intervalId!);
        const el = document.getElementById('stat-jobs');
        if (el) el.style.color = 'var(--accent)';
      }
    }, 20);
  }

  goToJob(id: string): void { this.router.navigate(['/jobs', id]); }
}
