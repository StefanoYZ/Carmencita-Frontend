interface NavigationIconProps {
  name: 'users' | 'permissions';
}

export function NavigationIcon({ name }: NavigationIconProps) {
  if (name === 'permissions') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M8 7h12M8 12h12M8 17h12M3.5 7h.01M3.5 12h.01M3.5 17h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3 2.4-4.5 5.5-4.5s4.9 1.5 5.5 4.5M16 8h5M18.5 5.5v5" />
    </svg>
  );
}
