import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AdminUser } from '../../core/services/admin-user';
import { Device } from '../../core/services/device';
import { Log } from '../../core/services/log';
import { AdminAppUser } from '../../shared/models/admin-user.model';
import { DeviceInfoResponse } from '../../shared/models/device.model';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  today = new Date();
  connectedDevices: DeviceInfoResponse[] = [];
  recentUsers: AdminAppUser[] = [];
  totalUsers = 0;
  logCount = 0;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly deviceService: Device,
    private readonly userService: AdminUser,
    private readonly logService: Log,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    forkJoin({
      devices: this.deviceService.getConnectedDevices(),
      users: this.userService.getAll(),
      logs: this.logService.getAll(),
    }).subscribe({
      next: ({ devices, users, logs }) => {
        this.connectedDevices = devices;
        this.totalUsers = users.length;
        this.recentUsers = users.slice(0, 3);
        this.logCount = logs.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load dashboard data.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    forkJoin({
      devices: this.deviceService.getConnectedDevices(),
      users: this.userService.getAll(),
      logs: this.logService.getAll(),
    }).subscribe({
      next: ({ devices, users, logs }) => {
        this.connectedDevices = devices;
        this.totalUsers = users.length;
        this.recentUsers = users.slice(0, 3);
        this.logCount = logs.length;
        event.target.complete();
      },
      error: () => {
        this.errorMessage = 'Could not load dashboard data.';
        event.target.complete();
      },
    });
  }
}
