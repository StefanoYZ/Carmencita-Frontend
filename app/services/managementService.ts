import { request } from './apiClient';
import type {
  PermissionResponse,
  RoleResponse,
  UserCreatePayload,
  UserResponse,
} from '../types/identity';

export function listUsers(): Promise<UserResponse[]> {
  return request<UserResponse[]>('/users');
}

export function createUser(payload: UserCreatePayload): Promise<UserResponse> {
  return request<UserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function assignRoleToUser(userId: number, roleId: number): Promise<UserResponse> {
  return request<UserResponse>(`/users/${userId}/roles/${roleId}`, { method: 'POST' });
}

export function listRoles(): Promise<RoleResponse[]> {
  return request<RoleResponse[]>('/roles');
}

export function listPermissions(): Promise<PermissionResponse[]> {
  return request<PermissionResponse[]>('/permissions');
}
