import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { PermissionProfilesSection } from '../components/management/PermissionProfilesSection';
import { UserManagementSection } from '../components/management/UserManagementSection';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/apiClient';
import { assignRoleToUser, createUser, listPermissions, listRoles, listUsers } from '../services/managementService';
import {
  type AdminSection,
  OPERATIONAL_ROLE_CODES,
  toRoleViewModel,
  toUserViewModel,
} from '../presentation/identityPresentation';
import type { PermissionResponse, RoleResponse, UserResponse } from '../types/identity';

interface ManagementPageProps {
  onLogout: () => void;
}

interface UserFormValues {
  username: string;
  phone: string;
  password: string;
  fullName: string;
  roleId: string;
}

const initialForm: UserFormValues = { username: '', phone: '', password: '', fullName: '', roleId: '' };

export function ManagementPage({ onLogout }: ManagementPageProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('users');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [form, setForm] = useState<UserFormValues>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const canCreateUsers = Boolean(user?.permissions.includes('USERS_CREATE') && user.permissions.includes('USERS_ASSIGN_ROLE'));
  const canReadUsers = Boolean(user?.permissions.includes('USERS_READ'));
  const canAssignRoles = Boolean(user?.permissions.includes('USERS_ASSIGN_ROLE'));
  const targetAgencyId: number | null = null;

  const loadManagementData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const [loadedUsers, loadedRoles, loadedPermissions] = await Promise.all([
        canReadUsers ? listUsers() : Promise.resolve([]),
        listRoles(),
        listPermissions(),
      ]);
      setUsers(loadedUsers);
      setRoles(loadedRoles);
      setPermissions(loadedPermissions);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'No se pudo cargar la administración.'));
    } finally {
      setIsLoading(false);
    }
  }, [canReadUsers]);

  useEffect(() => {
    void loadManagementData();
  }, [loadManagementData]);

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!form.roleId) {
      setError('Selecciona un perfil para la cuenta.');
      return;
    }
    if (form.password.length < 8 || form.password.length > 30) {
      setError('La contraseña debe tener entre 8 y 30 caracteres.');
      return;
    }

    if (targetAgencyId === null) {
      setError('La creación de cuentas está pendiente de seleccionar una agencia.');
      return;
    }

    try {
      setIsSaving(true);
      await createUser({ ...form, roleId: Number(form.roleId), agencyId: targetAgencyId });
      setForm(initialForm);
      setMessage('Cuenta creada correctamente.');
      await loadManagementData();
    } catch (createError) {
      setError(getApiErrorMessage(createError, 'No se pudo crear la cuenta.'));
    } finally {
      setIsSaving(false);
    }
  }

  function updateForm(field: keyof UserFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
    setMessage('');
  }

  async function handleRoleChange(userId: number, roleId: number) {
    try {
      setIsUpdatingRole(true);
      setError('');
      setMessage('');
      const updatedUser = await assignRoleToUser(userId, roleId);
      setUsers((current) => current.map((item) => (item.userId === userId ? updatedUser : item)));
      setMessage('Perfil actualizado correctamente.');
    } catch (roleError) {
      setError(getApiErrorMessage(roleError, 'No se pudo actualizar el perfil.'));
    } finally {
      setIsUpdatingRole(false);
    }
  }

  const displayName = user?.fullName || user?.username || 'Cuenta interna';
  const usersView = users.map(toUserViewModel);
  const rolesView = roles.map((role) => toRoleViewModel(role, permissions));
  const operationalRolesView = rolesView.filter((role) => OPERATIONAL_ROLE_CODES.includes(role.code as typeof OPERATIONAL_ROLE_CODES[number]) && role.statusTone === 'active');

  return (
    <div className="admin-shell">
      <AdminSidebar activeSection={activeSection} user={user} onSectionChange={setActiveSection} onLogout={onLogout} />
      <div className="admin-main">
        <header className="admin-topbar">
          <div><p className="eyebrow">Administración general</p><strong>{displayName}</strong></div>
          <button className="button button--secondary admin-topbar__logout" type="button" onClick={onLogout}>Cerrar sesión</button>
        </header>
        <main className="admin-content" id="contenido-principal">
          {error && <div className="alert alert--error" role="alert">{error}</div>}
          {message && <div className="alert alert--success" role="status">{message}</div>}
          {activeSection === 'users' ? (
            <UserManagementSection
              users={canReadUsers ? usersView : []}
              form={form}
              canCreateUsers={canCreateUsers && targetAgencyId !== null}
              hasAgencyContext={targetAgencyId !== null}
              canAssignRoles={canAssignRoles}
              isLoading={isLoading}
              isSaving={isSaving || isUpdatingRole}
              roles={operationalRolesView}
              onFormChange={updateForm}
              onSubmit={handleCreateUser}
              onRoleChange={handleRoleChange}
            />
          ) : (
            <PermissionProfilesSection roles={rolesView} isLoading={isLoading} />
          )}
        </main>
      </div>
    </div>
  );
}
