import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = new BehaviorSubject<boolean>(localStorage.getItem('theme') === 'dark');
  isDark$ = this.isDark.asObservable();

  constructor() {
    this.applyTheme(this.isDark.value);
  }

  toggle(): void {
    const next = !this.isDark.value;
    this.isDark.next(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    this.applyTheme(next);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  get current(): boolean { return this.isDark.value; }
}
