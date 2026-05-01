export interface StaffRole {
  id: string;
  name: string;
}

export interface ModuleAccessEntry {
  canRead: boolean;
  canWrite: boolean;
}

export interface ModuleAccess {
  dashboard: ModuleAccessEntry;
  designs: ModuleAccessEntry;
  inventory: ModuleAccessEntry;
  production: ModuleAccessEntry;
  order: ModuleAccessEntry;
  finance: ModuleAccessEntry;
}

export interface Staff {
  kind: "staff";
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: StaffRole;
  moduleAccess: ModuleAccess;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  staff: Staff;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponse = LoginResponse;
