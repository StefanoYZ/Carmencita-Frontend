import type { PermissionResponse, RoleResponse, UserResponse } from '../types/identity';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador general',
  AGENCY_ADMIN: 'Administrador de agencia',
  SECRETARY: 'Secretaría',
  LOADER: 'Estiba',
  DRIVER: 'Conductor',
};

const PERMISSION_LABELS: Record<string, string> = {
  USERS_READ: 'Consultar usuarios',
  USERS_CREATE: 'Crear usuarios',
  USERS_UPDATE: 'Actualizar usuarios',
  USERS_ASSIGN_ROLE: 'Gestionar perfiles',
  ROLES_READ: 'Consultar perfiles',
  ROLES_PERMISSIONS_MANAGE: 'Gestionar permisos',
  PERMISSIONS_READ: 'Consultar permisos',
};

export const OPERATIONAL_ROLE_CODES = ['SECRETARY', 'LOADER', 'DRIVER'] as const;

export type AdminSection = 'users' | 'permissions';

export interface UserViewModel {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  agencyLabel: string;
  statusLabel: string;
  statusTone: 'active' | 'inactive';
  roleCode: string | null;
  roleLabels: string[];
}

export interface RoleViewModel {
  id: number;
  code: string;
  label: string;
  description: string;
  statusLabel: string;
  statusTone: 'active' | 'inactive';
  permissionLabels: string[];
}

export function getRoleLabel(roleName: string): string {
  return ROLE_LABELS[roleName] || 'Perfil operativo';
}

export function getPermissionLabel(permissionName: string): string {
  return PERMISSION_LABELS[permissionName] || 'Permiso operativo';
}

export function toUserViewModel(user: UserResponse): UserViewModel {
  return {
    id: user.userId,
    username: user.username,
    fullName: user.fullName,
    phone: user.phone,
    agencyLabel: user.agencyId === null ? 'Sin agencia' : 'Agencia asignada',
    statusLabel: user.isActive ? 'Activo' : 'Inactivo',
    statusTone: user.isActive ? 'active' : 'inactive',
    roleCode: user.roles[0] || null,
    roleLabels: user.roles.map(getRoleLabel),
  };
}

export function toRoleViewModel(role: RoleResponse, permissions: PermissionResponse[]): RoleViewModel {
  const knownPermissions = new Set(permissions.map((permission) => permission.permissionName));
  return {
    id: role.roleId,
    code: role.roleName,
    label: getRoleLabel(role.roleName),
    description: role.description,
    statusLabel: role.isActive ? 'Activo' : 'Inactivo',
    statusTone: role.isActive ? 'active' : 'inactive',
    permissionLabels: role.permissions
      .filter((permission) => knownPermissions.has(permission))
      .map(getPermissionLabel),
  };
}
