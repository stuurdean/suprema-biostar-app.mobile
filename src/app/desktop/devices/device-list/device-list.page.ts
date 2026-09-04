import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Device } from '../../../core/services/device';
import { DeviceInfoResponse } from '../../../shared/models/device.model';

@Component({
  standalone: false,
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  devices: DeviceInfoResponse[] = [];
  isLoading = true;
  errorMessage = '';

  showConnectForm = false;
  ipAddress = '';
  port = 51211;
  connecting = false;

  constructor(
    private readonly deviceService: Device,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.isLoading = true;
    this.deviceService.getConnectedDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.describeError(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    this.deviceService.getConnectedDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        event.target.complete();
      },
      error: (err) => {
        this.errorMessage = this.describeError(err);
        event.target.complete();
      },
    });
  }

  connect(): void {
    if (!this.ipAddress) {
      return;
    }

    this.connecting = true;
    this.errorMessage = '';

    this.deviceService.connect({ ipAddress: this.ipAddress, port: this.port }).subscribe({
      next: () => {
        this.connecting = false;
        this.ipAddress = '';
        this.showConnectForm = false;
        this.loadDevices();
      },
      error: (err) => {
        this.connecting = false;
        this.errorMessage = this.describeError(err);
        this.cdr.detectChanges();
      },
    });
  }

  private describeError(err: unknown): string {
    const httpError = err as { error?: { detail?: string }; message?: string };
    return httpError?.error?.detail ?? httpError?.message ?? 'Something went wrong.';
  }
}
