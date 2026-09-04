import { Injectable } from '@angular/core';

const STORAGE_KEY = 'server_base_url';

/**
 * The backend's base URL (e.g. "http://192.168.1.50:5080"), configurable at runtime from the
 * Settings page. On web/dev this stays empty and requests fall back to relative paths (same-origin
 * or the ng serve proxy); a native app has no "same origin" to fall back to, so it always needs this set.
 */
@Injectable({
  providedIn: 'root',
})
export class ServerConfig {
  getBaseUrl(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  }

  setBaseUrl(url: string): void {
    const normalized = this.normalize(url);
    try {
      if (normalized) {
        localStorage.setItem(STORAGE_KEY, normalized);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage unavailable — the setting just won't persist across restarts.
    }
  }

  private normalize(url: string): string {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (!trimmed) {
      return '';
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  }
}
