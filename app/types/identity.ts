export interface AuthUser {
  userId: number;
  username: string;
  fullName: string;
  agencyId: number | null;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface UserResponse extends AuthUser {
  phone: string;
  isActive: boolean;
}

export interface RoleResponse {
  roleId: number;
  roleName: string;
  description: string;
  isActive: boolean;
  permissions: string[];
}

export interface PermissionResponse {
  permissionId: number;
  permissionName: string;
  description: string;
  isActive: boolean;
}

export interface UserCreatePayload {
  username: string;
  phone: string;
  password: string;
  fullName: string;
  roleId: number;
  agencyId: number;
}
