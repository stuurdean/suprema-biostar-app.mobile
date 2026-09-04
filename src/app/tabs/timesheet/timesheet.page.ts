import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Portal } from '../../core/services/portal';
import { TimesheetEntry } from '../../shared/models/portal.model';

@Component({
  standalone: false,
  selector: 'app-timesheet',
  templateUrl: './timesheet.page.html',
  styleUrls: ['./timesheet.page.scss'],
})
export class TimesheetPage implements OnInit {
  entries: TimesheetEntry[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly portal: Portal) {}

  ngOnInit(): void {
    this.loadTimesheet();
  }

  loadTimesheet(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.portal.getTimesheet().subscribe({
      next: (entries) => {
        this.entries = entries;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load your timesheet.';
        this.isLoading = false;
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    this.portal.getTimesheet().subscribe({
      next: (entries) => {
        this.entries = entries;
        event.target.complete();
      },
      error: () => {
        this.errorMessage = 'Could not load your timesheet.';
        event.target.complete();
      },
    });
  }

  get totalHours(): string {
    const total = this.entries.reduce((sum, e) => sum + (e.hoursWorked ?? 0), 0);
    return total.toFixed(1);
  }
}
