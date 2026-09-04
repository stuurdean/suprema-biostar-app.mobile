import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CurrentUser, OperatorInfo, OperatorLoginResponse } from '../../shared/models/auth.model';
import { PortalLoginResponse, PortalUserInfo } from '../../shared/models/portal.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'current_user';

  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.getCachedUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /**
   * A single login field serves both audiences: an email signs in an Operator/Admin,
   * anything else is treated as a BioStar user ID and signs in a portal user.
   */
  login(identifier: string, password: string): Observable<CurrentUser> {
    const request$ = identifier.includes('@')
      ? this.http
          .post<OperatorLoginResponse>('/api/auth/login', { email: identifier, password })
          .pipe(map((res) => ({ token: res.accessToken, user: this.fromOperator(res.operator) })))
      : this.http
          .post<PortalLoginResponse>('/api/portal/auth/login', { userId: identifier, password })
          .pipe(map((res) => ({ token: res.accessToken, user: this.fromPortalUser(res.user) })));

    return request$.pipe(
      tap(({ token, user }) => {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      map(({ user }) => user),
      catchError((error) => this.handleAuthError(error))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isAdminRole(): boolean {
    const role = this.currentUserSubject.value?.role;
    return role === 'Admin' || role === 'Operator';
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  private fromOperator(op: OperatorInfo): CurrentUser {
    return {
      role: op.role === 'Admin' ? 'Admin' : 'Operator',
      id: op.id,
      displayName: op.fullName,
      subLabel: op.email,
    };
  }

  private fromPortalUser(user: PortalUserInfo): CurrentUser {
    return {
      role: 'PortalUser',
      id: user.id,
      displayName: user.name,
      subLabel: `User ID ${user.userId}`,
      userId: user.userId,
      hasFacePhoto: user.hasFacePhoto,
    };
  }

  private getCachedUser(): CurrentUser | null {
    const cached = localStorage.getItem(this.userKey);
    if (!cached) {
      return null;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  private handleAuthError(error: { status?: number; error?: { detail?: string } }) {
    let message = 'An error occurred. Please try again later.';
    const status = error?.status || 0;

    if (status === 401) {
      message = error?.error?.detail || 'Invalid credentials';
    } else if (status === 0) {
      message = 'Unable to connect to the server.';
    } else if (status >= 500) {
      message = 'Server error. Please try again later.';
    }

    return throwError(() => ({ status, message }));
  }
}
