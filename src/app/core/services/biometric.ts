import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BiometricResponse, EnrollBiometricRequest } from '../../shared/models/biometric.model';

@Injectable({
  providedIn: 'root',
})
export class Biometric {
  constructor(private readonly http: HttpClient) {}

  getAll(userId: number): Observable<BiometricResponse[]> {
    return this.http.get<BiometricResponse[]>(`/api/users/${userId}/biometrics`);
  }

  enroll(userId: number, request: EnrollBiometricRequest): Observable<BiometricResponse> {
    return this.http.post<BiometricResponse>(`/api/users/${userId}/biometrics/enroll`, request);
  }

  delete(userId: number, biometricId: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${userId}/biometrics/${biometricId}`);
  }
}
