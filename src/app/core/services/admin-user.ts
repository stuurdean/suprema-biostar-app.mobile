import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminAppUser, CreateUserRequest, SyncResult, UpdateUserRequest, UserType } from '../../shared/models/admin-user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUser {
  private readonly baseUrl = '/api/users';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<AdminAppUser[]> {
    return this.http.get<AdminAppUser[]>(this.baseUrl);
  }

  getById(id: number): Observable<AdminAppUser> {
    return this.http.get<AdminAppUser>(`${this.baseUrl}/${id}`);
  }

  getTypes(): Observable<UserType[]> {
    return this.http.get<UserType[]>(`${this.baseUrl}/types`);
  }

  create(request: CreateUserRequest): Observable<AdminAppUser> {
    return this.http.post<AdminAppUser>(this.baseUrl, request);
  }

  update(id: number, request: UpdateUserRequest): Observable<AdminAppUser> {
    return this.http.put<AdminAppUser>(`${this.baseUrl}/${id}`, request);
  }

  syncToDevices(id: number): Observable<SyncResult> {
    return this.http.post<SyncResult>(`${this.baseUrl}/${id}/sync`, {});
  }
}
