import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nav-controls">

      <!-- Back button -->
      <button class="nav-btn" (click)="goBack()" title="Go Back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>

      <!-- Forward button -->
      <button class="nav-btn" (click)="goForward()" title="Go Forward">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Scroll to top -->
      <button class="nav-btn top-btn" (click)="scrollTop()" [class.visible]="showTop" title="Scroll to Top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>

    </div>
  `,
  styles: [`
    .nav-controls {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 999;
    }

    .nav-btn {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: all 0.2s;
      backdrop-filter: blur(8px);
    }

    .nav-btn:hover {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px color-mix(in srgb, var(--accent) 30%, transparent);
    }

    .top-btn {
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      transition: all 0.25s;
    }

    .top-btn.visible {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }
  `]
})
export class NavControlsComponent implements OnInit {
  showTop = false;

  constructor(private location: Location, private router: Router) {}

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop = window.scrollY > 300;
  }

  goBack(): void { this.location.back(); }
  goForward(): void { this.location.forward(); }
  scrollTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
