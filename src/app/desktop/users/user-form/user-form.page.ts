import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUser } from '../../../core/services/admin-user';
import { Biometric as BiometricService } from '../../../core/services/biometric';
import { ConfirmDialog } from '../../../core/services/confirm-dialog';
import { Device as DeviceService } from '../../../core/services/device';
import { AdminAppUser, UserType } from '../../../shared/models/admin-user.model';
import { BiometricResponse, BiometricType } from '../../../shared/models/biometric.model';
import { DeviceInfoResponse } from '../../../shared/models/device.model';

@Component({
  standalone: false,
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
  detailsForm: FormGroup;
  userTypes: UserType[] = [];
  isSaving = false;
  errorMessage = '';

  isEditMode = false;
  userDbId: number | null = null;

  grantPortalAccess = false;
  showPassword = false;

  savedUser: AdminAppUser | null = null;

  devices: DeviceInfoResponse[] = [];
  selectedFingerprintDeviceId: number | null = null;
  selectedFaceDeviceId: number | null = null;
  selectedCardDeviceId: number | null = null;
  expandedType: BiometricType | null = null;
  enrolledBiometrics: BiometricResponse[] = [];
  scanning: BiometricType | null = null;
  scanError = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: AdminUser,
    private readonly biometricService: BiometricService,
    private readonly deviceService: DeviceService,
    private readonly confirmDialog: ConfirmDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.detailsForm = this.fb.group({
      userId: ['', [Validators.required, Validators.maxLength(32)]],
      name: ['', [Validators.required]],
      userTypeId: [null, [Validators.required]],
      portalPassword: [''],
    });
  }

  togglePortalAccess(): void {
    this.grantPortalAccess = !this.grantPortalAccess;
    const control = this.detailsForm.get('portalPassword');
    control?.setValidators(this.grantPortalAccess ? [Validators.required, Validators.minLength(4)] : []);
    control?.updateValueAndValidity();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.userService.getTypes().subscribe({
      next: (types) => {
        this.userTypes = types;
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

    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userDbId = +idParam;
      this.detailsForm.get('userId')?.disable();

      this.userService.getById(this.userDbId).subscribe({
        next: (user) => {
          this.detailsForm.patchValue({ userId: user.userId, name: user.name, userTypeId: user.userTypeId });
          this.savedUser = user;
          this.loadBiometrics();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Could not load user.';
          this.cdr.detectChanges();
        },
      });
    }
  }

  saveDetails(): void {
    if (this.detailsForm.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.userDbId) {
      const { name, userTypeId } = this.detailsForm.getRawValue();
      this.userService.update(this.userDbId, { name, userTypeId }).subscribe({
        next: (user) => {
          this.isSaving = false;
          this.savedUser = user;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err?.error?.detail || 'Could not save user.';
          this.cdr.detectChanges();
        },
      });
      return;
    }

    const { userId, name, userTypeId, portalPassword } = this.detailsForm.value;
    this.userService
      .create({
        userId,
        name,
        userTypeId,
        portalPassword: this.grantPortalAccess ? portalPassword : undefined,
      })
      .subscribe({
        next: (user) => {
          this.isSaving = false;
          this.savedUser = user;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err?.error?.detail || 'Could not save user.';
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

    if (!this.savedUser || !deviceId || this.scanning) {
      return;
    }

    this.scanning = type;
    this.scanError = '';

    this.biometricService.enroll(this.savedUser.id, { deviceId, type }).subscribe({
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
    if (!this.savedUser) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Remove biometric',
      message: `Remove this ${biometric.type.toLowerCase()} enrollment? The user will no longer be able to use it to authenticate.`,
      confirmLabel: 'Remove',
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    this.biometricService.delete(this.savedUser.id, biometric.id).subscribe({
      next: () => this.loadBiometrics(),
    });
  }

  finish(): void {
    this.router.navigate(['/desktop/users']);
  }

  private loadBiometrics(): void {
    if (!this.savedUser) {
      return;
    }

    this.biometricService.getAll(this.savedUser.id).subscribe({
      next: (biometrics) => {
        this.enrolledBiometrics = biometrics;
        this.cdr.detectChanges();
      },
    });
  }
}
