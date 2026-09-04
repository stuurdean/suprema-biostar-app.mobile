import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Desktop area (devices/users/enrollment) — portal users get bounced to their own tabs instead. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!auth.isAdminRole()) {
    router.navigate(['/tabs/logs']);
    return false;
  }

  return true;
};
