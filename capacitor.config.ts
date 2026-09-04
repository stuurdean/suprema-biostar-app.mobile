import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neametrics.suprema.biostar',
  appName: 'Suprema BioStar',
  webDir: 'www',
  server: {
    // The app's own webview origin is served as https://localhost instead of http://localhost —
    // several web APIs (camera capture on the Profile/Biometrics pages) require a secure context to work.
    androidScheme: 'https',
    // The backend (configured per-device in Settings) is typically a self-hosted LAN server without a
    // real TLS certificate. This allows plain HTTP calls to it; it does not affect the webview's own
    // https origin above. Fine for this internal, LAN-only deployment — not something to ship publicly.
    cleartext: true,
  },
};

export default config;
