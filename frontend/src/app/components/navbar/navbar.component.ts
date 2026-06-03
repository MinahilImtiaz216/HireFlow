import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { WeatherService, WeatherData } from '../../services/weather.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="navbar">
      <div class="nav-inner">

        <!-- Brand -->
        <a routerLink="/" class="brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" fill="var(--accent)" opacity="0.9"/>
            <path d="M16 7V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="13" r="2" fill="white"/>
          </svg>
          <span>HireFlow</span>
        </a>

        <!-- Center nav links -->
        <nav class="nav-links">
          <a routerLink="/jobs" routerLinkActive="active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Jobs
          </a>
          <ng-container *ngIf="auth.isLoggedIn">
            <a *ngIf="auth.currentUser?.role === 'candidate'" routerLink="/candidate/dashboard" routerLinkActive="active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </a>
            <a *ngIf="auth.currentUser?.role === 'employer'" routerLink="/employer/dashboard" routerLinkActive="active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </a>
            <a *ngIf="auth.currentUser?.role === 'admin'" routerLink="/admin/dashboard" routerLinkActive="active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Admin
            </a>
          </ng-container>
        </nav>

        <!-- Right side -->
        <div class="nav-right">

          <!-- Live Clock -->
          <div class="clock-chip" *ngIf="currentTime" [title]="'Local time · ' + (weather?.timezone ?? 'Asia/Karachi')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="clock-time">{{ currentTime }}</span>
          </div>

          <!-- Weather -->
          <div class="weather-chip" *ngIf="weather"
            [title]="weather.description + ' · Feels ' + weather.feelsLike + '°C · Humidity ' + weather.humidity + '% · Wind ' + weather.windSpeed + ' km/h'">
            <span class="w-icon" [innerHTML]="getWeatherSvg(weather.description)"></span>
            <span class="w-temp">{{ weather.temp }}°C</span>
            <span class="w-city">{{ weather.city }}</span>
            <span class="live-dot"></span>
          </div>
          <div class="weather-chip loading" *ngIf="!weather && !weatherFailed">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            <span style="opacity:.5;font-size:0.75rem">Loading...</span>
          </div>

          <!-- Theme toggle -->
          <button class="icon-btn" (click)="theme.toggle()" [title]="theme.current ? 'Light mode' : 'Dark mode'">
            <svg *ngIf="theme.current" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg *ngIf="!theme.current" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>

          <!-- Auth -->
          <ng-container *ngIf="auth.isLoggedIn; else guestLinks">
            <div class="user-chip">
              <div class="user-avatar">{{ auth.currentUser?.name?.[0]?.toUpperCase() }}</div>
              <span class="user-name">{{ auth.currentUser?.name }}</span>
              <span class="role-dot" [ngClass]="'dot-' + auth.currentUser?.role"></span>
            </div>
            <button class="btn-signout" (click)="auth.logout()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </ng-container>
          <ng-template #guestLinks>
            <a routerLink="/login"  class="btn-ghost-sm">Login</a>
            <a routerLink="/signup" class="btn-primary-sm">Get Started</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: 58px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 1000;
      backdrop-filter: blur(12px);
    }
    .nav-inner {
      max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
      height: 100%; display: flex; align-items: center; gap: 1.5rem;
    }

    /* Brand */
    .brand {
      display: flex; align-items: center; gap: 0.5rem;
      font-size: 1rem; font-weight: 700; letter-spacing: -0.03em;
      color: var(--text); flex-shrink: 0; text-decoration: none;
    }

    /* Nav links */
    .nav-links { display: flex; align-items: center; gap: 0.125rem; flex: 1; }
    .nav-links a {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.35rem 0.65rem; border-radius: var(--radius-sm);
      font-size: 0.83rem; font-weight: 500;
      color: var(--text-2); transition: all 0.15s; text-decoration: none;
    }
    .nav-links a:hover { color: var(--text); background: var(--surface-2); }
    .nav-links a.active { color: var(--accent); background: var(--surface-2); }
    .nav-links a svg { flex-shrink: 0; opacity: 0.7; }

    /* Right */
    .nav-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

    /* Clock chip */
    .clock-chip {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.3rem 0.6rem;
      background: var(--surface-2); border: 1px solid var(--border);
      border-radius: var(--radius-sm); cursor: default;
    }
    .clock-chip svg { color: var(--accent); flex-shrink: 0; }
    .clock-time { font-size: 0.78rem; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: 0.03em; }

    /* Weather chip */
    .weather-chip {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.3rem 0.6rem;
      background: var(--surface-2); border: 1px solid var(--border);
      border-radius: var(--radius-sm); cursor: default;
    }
    .weather-chip.loading { opacity: 0.5; }
    .w-icon { display: flex; align-items: center; }
    .w-icon svg { width: 15px; height: 15px; }
    .w-temp { font-size: 0.8rem; font-weight: 600; color: var(--text); }
    .w-city { font-size: 0.72rem; color: var(--text-3); }
    .live-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: #22c55e; flex-shrink: 0;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

    /* Icon btn */
    .icon-btn {
      width: 32px; height: 32px; border-radius: var(--radius-sm);
      border: 1px solid var(--border); background: var(--surface-2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.15s; color: var(--text-2);
      flex-shrink: 0;
    }
    .icon-btn:hover { border-color: var(--accent); color: var(--accent); }

    /* User chip */
    .user-chip {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.25rem 0.6rem 0.25rem 0.3rem;
      background: var(--surface-2); border: 1px solid var(--border);
      border-radius: 99px;
    }
    .user-avatar {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.68rem; font-weight: 700;
    }
    .user-name { font-size: 0.8rem; font-weight: 500; color: var(--text); max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .role-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .dot-candidate { background: #22c55e; }
    .dot-employer  { background: #3b82f6; }
    .dot-admin     { background: #a855f7; }

    /* Buttons */
    .btn-signout {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.35rem 0.65rem; border-radius: var(--radius-sm);
      font-size: 0.8rem; font-weight: 500; cursor: pointer;
      background: transparent; border: 1px solid var(--border);
      color: var(--text-2); transition: all 0.15s;
    }
    .btn-signout:hover { border-color: var(--danger); color: var(--danger); }

    .btn-ghost-sm {
      padding: 0.35rem 0.7rem; font-size: 0.83rem; font-weight: 500;
      color: var(--text-2); border-radius: var(--radius-sm);
      border: 1px solid transparent; transition: all 0.15s; text-decoration: none;
    }
    .btn-ghost-sm:hover { background: var(--surface-2); color: var(--text); }

    .btn-primary-sm {
      padding: 0.35rem 0.85rem; font-size: 0.83rem; font-weight: 600;
      background: var(--accent); color: #fff;
      border-radius: var(--radius-sm); border: 1px solid var(--accent);
      transition: all 0.15s; text-decoration: none;
    }
    .btn-primary-sm:hover { background: var(--accent-hover); }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  weather: WeatherData | null = null;
  weatherFailed = false;
  currentTime = '';
  private weatherTimer: ReturnType<typeof setInterval> | null = null;
  private clockTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.fetchWeather();
    this.weatherTimer = setInterval(() => this.fetchWeather(), 10 * 60 * 1000);
    this.startClock();
  }

  ngOnDestroy(): void {
    if (this.weatherTimer) clearInterval(this.weatherTimer);
    if (this.clockTimer)   clearInterval(this.clockTimer);
  }

  fetchWeather(): void {
    this.weatherService.getWeather().subscribe({
      next: (data) => { if (data) { this.weather = data; } else { this.weatherFailed = true; } },
      error: () => { this.weatherFailed = true; }
    });
  }

  startClock(): void {
    this.tick();
    this.clockTimer = setInterval(() => this.tick(), 1000);
  }

  tick(): void {
    const tz = this.weather?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.currentTime = new Date().toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }

  getWeatherSvg(desc: string): string {
    const d = desc.toLowerCase();
    if (d.includes('clear'))   return `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    if (d.includes('cloud'))   return `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`;
    if (d.includes('rain') || d.includes('drizzle')) return `<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/></svg>`;
    if (d.includes('thunder')) return `<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`;
    if (d.includes('snow'))    return `<svg viewBox="0 0 24 24" fill="none" stroke="#bae6fd" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8" y2="20"/><line x1="8" y1="12" x2="8" y2="12.01"/><line x1="16" y1="16" x2="16" y2="20"/><line x1="16" y1="12" x2="16" y2="12.01"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="12" y1="14" x2="12" y2="14.01"/></svg>`;
    if (d.includes('fog'))     return `<svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M3 15h18M3 19h18M3 11h18M3 7h18"/></svg>`;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`;
  }
}
