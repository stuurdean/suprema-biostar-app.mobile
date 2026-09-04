import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceConnectionRequest, DeviceInfoResponse } from '../../shared/models/device.model';

@Injectable({
  providedIn: 'root',
})
export class Device {
  private readonly baseUrl = '/api/device';

  constructor(private readonly http: HttpClient) {}

  getConnectedDevices(): Observable<DeviceInfoResponse[]> {
    return this.http.get<DeviceInfoResponse[]>(this.baseUrl);
  }

  connect(request: DeviceConnectionRequest): Observable<DeviceInfoResponse> {
    return this.http.post<DeviceInfoResponse>(`${this.baseUrl}/connect`, request);
  }
}
