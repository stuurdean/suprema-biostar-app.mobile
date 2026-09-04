import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../core/services/auth';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: Auth,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.auth.isAdminRole() ? '/desktop/dashboard' : '/tabs/logs');
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { identifier, password } = this.loginForm.value;

    this.auth.login(identifier, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigateByUrl(user.role === 'PortalUser' ? '/tabs/logs' : '/desktop/dashboard');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Could not sign in.';
      },
    });
  }
}
