export interface PortalLoginRequest {
  userId: string;
  password: string;
}

export interface PortalUserInfo {
  id: number;
  userId: string;
  name: string;
  hasFacePhoto?: boolean;
}

export interface PortalLoginResponse {
  accessToken: string;
  expiresAt: string;
  user: PortalUserInfo;
}

export interface PortalLogEntry {
  id: number;
  timestamp: string;
  eventType: string;
  deviceName?: string;
}

export interface TimesheetEntry {
  date: string;
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
}
