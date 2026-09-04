export type AppRole = 'Admin' | 'Operator' | 'PortalUser';

/** Unified identity for whoever is signed in, regardless of which login endpoint authenticated them. */
export interface CurrentUser {
  role: AppRole;
  id: number;
  displayName: string;
  subLabel: string;
  userId?: string;
  hasFacePhoto?: boolean;
}

export interface OperatorInfo {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface OperatorLoginResponse {
  accessToken: string;
  expiresAt: string;
  operator: OperatorInfo;
}
