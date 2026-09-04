import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Biometric as BiometricService } from '../../core/services/biometric';
import { ConfirmDialog } from '../../core/services/confirm-dialog';
import { Device as DeviceService } from '../../core/services/device';
import { Portal } from '../../core/services/portal';
import { BiometricResponse, BiometricType } from '../../shared/models/biometric.model';
import { DeviceInfoResponse } from '../../shared/models/device.model';
import { PortalUserInfo } from '../../shared/models/portal.model';

@Component({
  standalone: false,
  selector: 'app-biometrics',
  templateUrl: './biometrics.page.html',
  styleUrls: ['./biometrics.page.scss'],
})
export class BiometricsPage implements OnInit {
  me: PortalUserInfo | null = null;

  devices: DeviceInfoResponse[] = [];
  selectedFingerprintDeviceId: number | null = null;
  selectedFaceDeviceId: number | null = null;
  selectedCardDeviceId: number | null = null;
  expandedType: BiometricType | null = null;
  enrolledBiometrics: BiometricResponse[] = [];
  scanning: BiometricType | null = null;
  scanError = '';

  constructor(
    private readonly portal: Portal,
    private readonly biometricService: BiometricService,
    private readonly deviceService: DeviceService,
    private readonly confirmDialog: ConfirmDialog,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.portal.getMe().subscribe({
      next: (me) => {
        this.me = me;
        this.loadBiometrics();
        this.cdr.detectChanges();
      },
    });

    this.deviceService.getConnectedDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.selectedFingerprintDeviceId = this.fingerprintDevices[0]?.deviceId ?? null;
        this.selectedFaceDeviceId = this.faceDevices[0]?.deviceId ?? null;
        this.selectedCardDeviceId = this.cardDevices[0]?.deviceId ?? null;
        this.cdr.detectChanges();
      },
    });
  }

  get fingerprintDevices(): DeviceInfoResponse[] {
    return this.devices.filter((d) => d.isOnline && d.fingerprintSupported);
  }

  get faceDevices(): DeviceInfoResponse[] {
    return this.devices.filter((d) => d.isOnline && d.faceSupported);
  }

  get cardDevices(): DeviceInfoResponse[] {
    return this.devices.filter((d) => d.isOnline && d.cardSupported);
  }

  toggleEnrollRow(type: BiometricType): void {
    this.expandedType = this.expandedType === type ? null : type;
  }

  enroll(type: BiometricType): void {
    const deviceId =
      type === 'Fingerprint' ? this.selectedFingerprintDeviceId : type === 'Face' ? this.selectedFaceDeviceId : this.selectedCardDeviceId;

    if (!this.me || !deviceId || this.scanning) {
      return;
    }

    this.scanning = type;
    this.scanError = '';

    this.biometricService.enroll(this.me.id, { deviceId, type }).subscribe({
      next: () => {
        this.scanning = null;
        this.expandedType = null;
        this.loadBiometrics();
      },
      error: (err) => {
        this.scanning = null;
        this.scanError = err?.error?.detail || `Could not capture ${type.toLowerCase()} — try again.`;
        this.cdr.detectChanges();
      },
    });
  }

  async removeBiometric(biometric: BiometricResponse): Promise<void> {
    if (!this.me) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Remove biometric',
      message: `Remove this ${biometric.type.toLowerCase()} enrollment? You will no longer be able to use it to authenticate.`,
      confirmLabel: 'Remove',
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    this.biometricService.delete(this.me.id, biometric.id).subscribe({
      next: () => this.loadBiometrics(),
    });
  }

  private loadBiometrics(): void {
    if (!this.me) {
      return;
    }

    this.biometricService.getAll(this.me.id).subscribe({
      next: (biometrics) => {
        this.enrolledBiometrics = biometrics;
        this.cdr.detectChanges();
      },
    });
  }
}
