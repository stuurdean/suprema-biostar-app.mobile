import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CurrentUser } from '../../shared/models/auth.model';

@Component({
  standalone: false,
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.page.html',
  styleUrls: ['./admin-profile.page.scss'],
})
export class AdminProfilePage implements OnInit {
  user: CurrentUser | null = null;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }

  get initials(): string {
    const name = this.user?.displayName?.trim();
    if (!name) {
      return '?';
    }
    const parts = name.split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || name[0].toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
