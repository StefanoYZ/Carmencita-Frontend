import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { ManagementPage } from '../pages/ManagementPage';

function getPath(): string {
  return window.location.pathname;
}

export function AppRouter() {
  const { isAuthenticated, logout } = useAuth();
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handlePopState = () => setPath(getPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(to: string) {
    window.history.pushState({}, '', to);
    setPath(to);
  }

  if (!isAuthenticated) {
    if (path !== '/login') navigate('/login');
    return <LoginPage onSuccess={() => navigate('/admin')} />;
  }

  if (path !== '/admin') {
    if (path !== '/login') navigate('/admin');
    return <ManagementPage onLogout={async () => { await logout(); navigate('/login'); }} />;
  }

  return <ManagementPage onLogout={async () => { await logout(); navigate('/login'); }} />;
}
