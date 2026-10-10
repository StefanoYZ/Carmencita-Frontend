import { NavigationIcon } from './NavigationIcon';
import { getRoleLabel, type AdminSection } from '../../presentation/identityPresentation';
import type { AuthUser } from '../../types/identity';

interface AdminSidebarProps {
  activeSection: AdminSection;
  user: AuthUser | null;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
}

const navigationItems: Array<{ id: AdminSection; label: string; description: string }> = [
  { id: 'users', label: 'Usuarios', description: 'Cuentas internas' },
  { id: 'permissions', label: 'Perfiles y permisos', description: 'Accesos del sistema' },
];

function getInitials(user: AuthUser | null): string {
  const name = user?.fullName || user?.username || '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length ? `${parts[0][0]}${parts[1]?.[0] || ''}`.toUpperCase() : 'U';
}

export function AdminSidebar({ activeSection, user, onSectionChange, onLogout }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <img src="/brand/logo.webp" alt="Carmencita Express Cargo" width="866" height="288" />
        <span>Gestión interna</span>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Secciones de administración">
        {navigationItems.map((item) => (
          <button
            className={`sidebar-link ${activeSection === item.id ? 'sidebar-link--active' : ''}`}
            key={item.id}
            type="button"
            aria-current={activeSection === item.id ? 'page' : undefined}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="sidebar-link__icon"><NavigationIcon name={item.id} /></span>
            <span className="sidebar-link__copy"><strong>{item.label}</strong><small>{item.description}</small></span>
          </button>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="sidebar-profile">
          <span className="sidebar-profile__avatar">{getInitials(user)}</span>
          <span className="sidebar-profile__copy"><strong>{user?.fullName || user?.username}</strong><small>{user?.roles.map(getRoleLabel).join(', ') || 'Cuenta interna'}</small></span>
        </div>
        <button className="sidebar-logout" type="button" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
