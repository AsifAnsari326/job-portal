import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(Auth);
  private router = inject(Router);

  readonly currentUser = toSignal(this.authService.currentUser$, { initialValue: this.authService.getCurrentUser() });
  readonly menuOpen = signal(false);

  logout(): void {
    this.authService.logout();
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  get userInitial(): string {
    return this.currentUser()?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  }
}
