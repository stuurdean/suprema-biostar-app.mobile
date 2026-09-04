export interface DeviceInfoResponse {
  deviceId: number;
  name?: string;
  ipAddress: string;
  port: number;
  connectionMode: 'Direct' | 'Server' | 'Unknown';
  maxUserCapacity: number;
  fingerprintSupported: boolean;
  cardSupported: boolean;
  faceSupported: boolean;
  isOnline: boolean;
  isSaved: boolean;
}

export interface DeviceConnectionRequest {
  ipAddress: string;
  port: number;
}
