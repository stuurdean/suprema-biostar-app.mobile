import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Portal } from '../../core/services/portal';
import { PortalLogEntry } from '../../shared/models/portal.model';

@Component({
  standalone: false,
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  logs: PortalLogEntry[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly portal: Portal) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.portal.getLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load your logs.';
        this.isLoading = false;
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    this.portal.getLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        event.target.complete();
      },
      error: () => {
        this.errorMessage = 'Could not load your logs.';
        event.target.complete();
      },
    });
  }

  eventTone(eventType: string): 'success' | 'danger' | 'info' {
    const lower = eventType.toLowerCase();
    if (lower.includes('fail') || lower.includes('duress')) {
      return 'danger';
    }
    if (lower.includes('success')) {
      return 'success';
    }
    return 'info';
  }
}
