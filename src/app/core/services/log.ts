import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogEntry } from '../../shared/models/log.model';

@Injectable({
  providedIn: 'root',
})
export class Log {
  private readonly baseUrl = '/api/logs';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(this.baseUrl);
  }
}
