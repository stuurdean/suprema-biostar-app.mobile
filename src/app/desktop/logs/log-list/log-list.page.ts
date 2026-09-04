import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Log } from '../../../core/services/log';
import { LogEntry } from '../../../shared/models/log.model';

@Component({
  standalone: false,
  selector: 'app-log-list',
  templateUrl: './log-list.page.html',
  styleUrls: ['./log-list.page.scss'],
})
export class LogListPage implements OnInit {
  logs: LogEntry[] = [];
  filteredLogs: LogEntry[] = [];
  searchTerm = '';
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly logService: Log,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.logService.getAll().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.filteredLogs = logs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load logs.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    this.logService.getAll().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.applySearch();
        event.target.complete();
      },
      error: () => {
        this.errorMessage = 'Could not load logs.';
        event.target.complete();
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applySearch();
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

  private applySearch(): void {
    const lower = this.searchTerm.toLowerCase();
    this.filteredLogs = this.logs.filter(
      (l) =>
        (l.userName ?? '').toLowerCase().includes(lower) ||
        (l.bioStarUserId ?? '').toLowerCase().includes(lower) ||
        l.eventType.toLowerCase().includes(lower) ||
        l.deviceName.toLowerCase().includes(lower)
    );
  }
}
