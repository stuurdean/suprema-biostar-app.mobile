import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Portal-user tabs (logs/timesheet/profile) — Operators/Admins get bounced to the desktop area instead. */
export const portalGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.isAdminRole()) {
    router.navigate(['/desktop/dashboard']);
    return false;
  }

  return true;
};
