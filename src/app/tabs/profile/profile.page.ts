import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Portal } from '../../core/services/portal';
import { PortalUserInfo } from '../../shared/models/portal.model';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;

  user: PortalUserInfo | null = null;
  hasFacePhoto = false;

  capturing = false;
  capturedPhoto: string | null = null;
  uploading = false;
  faceError = '';

  private stream: MediaStream | null = null;

  constructor(
    private readonly auth: Auth,
    private readonly portal: Portal,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.portal.getMe().subscribe({
      next: (info) => {
        this.user = info;
        this.hasFacePhoto = !!info.hasFacePhoto;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  get initials(): string {
    const name = this.user?.name?.trim();
    if (!name) {
      return '?';
    }
    const parts = name.split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || name[0].toUpperCase();
  }

  async startCapture(): Promise<void> {
    this.faceError = '';
    this.capturedPhoto = null;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      this.capturing = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        if (this.videoEl?.nativeElement) {
          this.videoEl.nativeElement.srcObject = this.stream;
        }
      });
    } catch {
      this.faceError = 'Could not access the camera. Check camera permissions and try again.';
      this.cdr.detectChanges();
    }
  }

  capturePhoto(): void {
    const video = this.videoEl?.nativeElement;
    if (!video) {
      return;
    }

    const size = 160;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const side = Math.min(video.videoWidth, video.videoHeight);
    ctx.drawImage(video, (video.videoWidth - side) / 2, (video.videoHeight - side) / 2, side, side, 0, 0, size, size);

    // The device profile photo slot is capped at 16KB — shrink quality until the JPEG fits.
    const maxBytes = 16 * 1024;
    let quality = 0.7;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (this.estimateBytes(dataUrl) > maxBytes && quality > 0.2) {
      quality -= 0.15;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    this.capturedPhoto = dataUrl;
    this.stopCamera();
  }

  retake(): void {
    this.capturedPhoto = null;
    this.startCapture();
  }

  cancelCapture(): void {
    this.stopCamera();
    this.capturedPhoto = null;
  }

  saveFacePhoto(): void {
    if (!this.capturedPhoto || this.uploading) {
      return;
    }

    this.uploading = true;
    this.faceError = '';

    this.portal.uploadFacePhoto(this.capturedPhoto).subscribe({
      next: () => {
        this.uploading = false;
        this.hasFacePhoto = true;
        this.capturedPhoto = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploading = false;
        this.faceError = err?.error?.detail || 'Could not save your photo. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }

  logout(): void {
    this.stopCamera();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  private stopCamera(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.capturing = false;
    this.cdr.detectChanges();
  }

  private estimateBytes(dataUrl: string): number {
    const base64 = dataUrl.split(',')[1] ?? '';
    return Math.floor(base64.length * 0.75);
  }
}
