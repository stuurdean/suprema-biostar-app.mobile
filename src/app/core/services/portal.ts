import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortalLogEntry, PortalUserInfo, TimesheetEntry } from '../../shared/models/portal.model';

@Injectable({
  providedIn: 'root',
})
export class Portal {
  private readonly baseUrl = '/api/portal';

  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<PortalUserInfo> {
    return this.http.get<PortalUserInfo>(`${this.baseUrl}/me`);
  }

  getLogs(): Observable<PortalLogEntry[]> {
    return this.http.get<PortalLogEntry[]>(`${this.baseUrl}/logs`);
  }

  getTimesheet(): Observable<TimesheetEntry[]> {
    return this.http.get<TimesheetEntry[]>(`${this.baseUrl}/timesheet`);
  }

  uploadFacePhoto(photoBase64: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/face-photo`, { photoBase64 });
  }
}
