export interface AdminAppUser {
  id: number;
  userId: string;
  name: string;
  userTypeId: number;
  userType: string;
  createdAt: string;
  hasPortalAccess?: boolean;
}

export interface UserType {
  id: number;
  name: string;
}

export interface CreateUserRequest {
  userId: string;
  name: string;
  userTypeId: number;
  portalPassword?: string;
}

export interface UpdateUserRequest {
  name: string;
  userTypeId: number;
  portalPassword?: string;
}

export interface SyncResult {
  deviceCount: number;
  successCount: number;
  errors: string[];
}
