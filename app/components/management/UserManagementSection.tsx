import type { FormEvent } from 'react';
import type { RoleViewModel, UserViewModel } from '../../presentation/identityPresentation';

interface UserFormValues {
  username: string;
  phone: string;
  password: string;
  fullName: string;
  roleId: string;
}

interface UserManagementSectionProps {
  users: UserViewModel[];
  form: UserFormValues;
  canCreateUsers: boolean;
  hasAgencyContext: boolean;
  canAssignRoles: boolean;
  isLoading: boolean;
  isSaving: boolean;
  roles: RoleViewModel[];
  onFormChange: (field: keyof UserFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRoleChange: (userId: number, roleId: number) => void;
}

export function UserManagementSection({
  users,
  form,
  canCreateUsers,
  hasAgencyContext,
  canAssignRoles,
  isLoading,
  isSaving,
  roles,
  onFormChange,
  onSubmit,
  onRoleChange,
}: UserManagementSectionProps) {
  return (
    <section className="management-section" aria-labelledby="users-heading">
      <div className="section-intro">
        <p className="eyebrow">Equipo interno</p>
        <h1 id="users-heading">Usuarios</h1>
        <p className="muted-copy">Crea cuentas y revisa el estado del equipo que utiliza el sistema.</p>
      </div>

      <article className="card">
        <div className="card-heading">
          <div><h2>Nueva cuenta</h2><p>Completa los datos de la persona que utilizará el sistema.</p></div>
        </div>
        {!canCreateUsers && <div className="alert alert--info">{hasAgencyContext ? 'No tienes autorización para crear cuentas.' : 'La creación de cuentas está pendiente de seleccionar una agencia.'}</div>}
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="field"><span>Usuario</span><input value={form.username} onChange={(event) => onFormChange('username', event.currentTarget.value)} required disabled={!canCreateUsers} /></label>
          <label className="field"><span>Nombre completo</span><input value={form.fullName} onChange={(event) => onFormChange('fullName', event.currentTarget.value)} required disabled={!canCreateUsers} /></label>
          <label className="field"><span>Teléfono</span><input value={form.phone} onChange={(event) => onFormChange('phone', event.currentTarget.value)} required disabled={!canCreateUsers} /></label>
          <label className="field"><span>Perfil</span><select aria-label="Perfil para la nueva cuenta" value={form.roleId} onChange={(event) => onFormChange('roleId', event.currentTarget.value)} required disabled={!canCreateUsers}><option value="" disabled>Selecciona un perfil</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}</select></label>
          <label className="field"><span>Contraseña</span><input type="password" minLength={8} maxLength={30} value={form.password} onChange={(event) => onFormChange('password', event.currentTarget.value)} required disabled={!canCreateUsers} /></label>
          <button className="button button--primary" type="submit" disabled={!canCreateUsers || isSaving}>{isSaving ? 'Guardando...' : 'Crear cuenta'}</button>
        </form>
      </article>

      <article className="card">
        <div className="card-heading"><div><h2>Cuentas registradas</h2><p>Consulta las cuentas internas disponibles.</p></div></div>
        {isLoading ? <p className="loading" role="status">Cargando cuentas...</p> : <UserTable users={users} roles={roles} canAssignRoles={canAssignRoles} onRoleChange={onRoleChange} />}
      </article>
    </section>
  );
}

function UserTable({ users, roles, canAssignRoles, onRoleChange }: { users: UserViewModel[]; roles: RoleViewModel[]; canAssignRoles: boolean; onRoleChange: (userId: number, roleId: number) => void }) {
  if (!users.length) return <div className="empty-state">No hay cuentas para mostrar.</div>;

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Usuario</th><th>Nombre</th><th>Teléfono</th><th>Agencia</th><th>Estado</th><th>Perfil</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><strong>{user.username}</strong></td>
              <td>{user.fullName}</td>
              <td>{user.phone}</td>
              <td>{user.agencyLabel}</td>
              <td><span className={`status status--${user.statusTone}`}>{user.statusLabel}</span></td>
              <td><RoleSelector user={user} roles={roles} canAssignRoles={canAssignRoles} onChange={onRoleChange} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleSelector({ user, roles, canAssignRoles, onChange }: { user: UserViewModel; roles: RoleViewModel[]; canAssignRoles: boolean; onChange: (userId: number, roleId: number) => void }) {
  const isControlledProfile = user.roleCode === 'ADMIN' || user.roleCode === 'AGENCY_ADMIN';
  const currentRole = roles.some((role) => role.code === user.roleCode) ? user.roleCode || '' : '';

  if (isControlledProfile || !canAssignRoles) return <span className="role-label">{user.roleLabels.join(', ') || 'Sin perfil'}</span>;

  return (
    <select
      className="table-select"
      value={currentRole}
      aria-label={`Perfil de ${user.username}`}
      disabled={user.statusTone !== 'active' || !roles.length}
      onChange={(event) => {
        const selectedRole = roles.find((role) => role.code === event.currentTarget.value);
        if (selectedRole) onChange(user.id, selectedRole.id);
      }}
    >
      <option value="" disabled>Selecciona un perfil</option>
      {roles.map((role) => <option key={role.id} value={role.code}>{role.label}</option>)}
    </select>
  );
}
