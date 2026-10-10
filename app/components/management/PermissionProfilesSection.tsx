import type { RoleViewModel } from '../../presentation/identityPresentation';

interface PermissionProfilesSectionProps {
  roles: RoleViewModel[];
  isLoading: boolean;
}

export function PermissionProfilesSection({ roles, isLoading }: PermissionProfilesSectionProps) {
  return (
    <section className="management-section" aria-labelledby="permissions-heading">
      <div className="section-intro">
        <p className="eyebrow">Accesos del sistema</p>
        <h1 id="permissions-heading">Perfiles y permisos</h1>
        <p className="muted-copy">Consulta los perfiles disponibles y las acciones asociadas a cada uno.</p>
      </div>

      <article className="card">
        <div className="card-heading"><div><h2>Perfiles disponibles</h2><p>La configuración de accesos se mantiene protegida.</p></div></div>
        <div className="alert alert--info" role="status">La asignación de permisos no está disponible por ahora.</div>
        {isLoading ? <p className="loading" role="status">Cargando perfiles...</p> : <div className="role-grid">{roles.map((role) => <RoleCard key={role.id} role={role} />)}</div>}
      </article>
    </section>
  );
}

function RoleCard({ role }: { role: RoleViewModel }) {
  return (
    <div className="role-card">
      <div className="role-card__heading">
        <div><h3>{role.label}</h3><p>{role.description}</p></div>
        <span className={`status status--${role.statusTone}`}>{role.statusLabel}</span>
      </div>
      <div className="permission-list">
        {role.permissionLabels.map((permission) => <span className="permission-tag" key={permission}>{permission}</span>)}
        {!role.permissionLabels.length && <span className="muted-copy">Sin permisos asignados</span>}
      </div>
    </div>
  );
}
