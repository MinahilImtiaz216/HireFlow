import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavControlsComponent } from './components/nav-controls/nav-controls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NavControlsComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-nav-controls></app-nav-controls>
  `
})
export class AppComponent {}
