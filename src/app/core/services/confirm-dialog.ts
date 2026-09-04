import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

/**
 * App-wide confirmation dialog, built on Ionic's own AlertController so it renders with the
 * platform's native look (iOS vs Material) automatically — no window.confirm/alert anywhere.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmDialog {
  constructor(private readonly alertController: AlertController) {}

  async confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.alertController
        .create({
          header: options.title,
          message: options.message,
          buttons: [
            {
              text: options.cancelLabel ?? 'Cancel',
              role: 'cancel',
              handler: () => resolve(false),
            },
            {
              text: options.confirmLabel ?? 'Confirm',
              role: options.danger ? 'destructive' : undefined,
              handler: () => resolve(true),
            },
          ],
        })
        .then((alert) => alert.present());
    });
  }
}
