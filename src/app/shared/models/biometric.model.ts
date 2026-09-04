export type BiometricType = 'Fingerprint' | 'Face' | 'Card';

export interface BiometricResponse {
  id: number;
  type: BiometricType;
  enrolledAt: string;
}

export interface EnrollBiometricRequest {
  deviceId: number;
  type: BiometricType;
}
