import { describe, expect, it } from 'vitest';
import { getPermissionLabel, getRoleLabel, toRoleViewModel, toUserViewModel } from '../../app/presentation/identityPresentation';

describe('identity presentation', () => {
  it('translates role and permission codes into interface labels', () => {
    expect(getRoleLabel('ADMIN')).toBe('Administrador general');
    expect(getPermissionLabel('USERS_CREATE')).toBe('Crear usuarios');
  });

  it('normalizes users and roles without exposing backend field names', () => {
    const user = toUserViewModel({
      userId: 1,
      username: 'operator',
      fullName: 'Test Operator',
      agencyId: 12,
      phone: '+51123456789',
      isActive: true,
      roles: ['ADMIN'],
      permissions: ['USERS_READ'],
    });
    const role = toRoleViewModel({
      roleId: 1,
      roleName: 'ADMIN',
      description: 'Administrador global del sistema.',
      isActive: true,
      permissions: ['USERS_READ'],
    }, [{ permissionId: 1, permissionName: 'USERS_READ', description: 'Consultar usuarios.', isActive: true }]);

    expect(user).toMatchObject({ id: 1, statusLabel: 'Activo', roleLabels: ['Administrador general'] });
    expect(role).toMatchObject({ id: 1, label: 'Administrador general', permissionLabels: ['Consultar usuarios'] });
  });
});
