export interface LogEntry {
  id: number;
  timestamp: string;
  eventType: string;
  userId: number | null;
  userName: string | null;
  bioStarUserId: string | null;
  deviceName: string;
}
