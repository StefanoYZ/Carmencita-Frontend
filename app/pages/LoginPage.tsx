import { FormEvent, useState } from 'react';
import { getApiErrorMessage } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(username.trim(), password);
      onSuccess();
    } catch (loginError) {
      setError(getApiErrorMessage(loginError, 'No se pudo validar el acceso.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Carmencita Express">
        <picture className="login-story__visual" aria-hidden="true">
          <source
            type="image/webp"
            srcSet="/images/hero-camion-768.webp 768w, /images/hero-camion-1280.webp 1280w, /images/hero-camion-1721.webp 1721w"
            sizes="calc(100vw - 480px)"
          />
          <img src="/images/hero-camion-1280.webp" alt="" width="1280" height="680" />
        </picture>
        <div className="login-story__overlay" aria-hidden="true" />
        <div className="login-story__brand">
          <img className="brand-logo brand-logo--story" src="/brand/logo.webp" alt="Carmencita Express Cargo" width="866" height="288" />
        </div>
        <div className="login-story__copy">
          <p className="eyebrow eyebrow--lime">Sistema interno</p>
          <h1>Acceso operativo para el equipo de Carmencita Express.</h1>
          <p>Acceso seguro para la gestión interna de Carmencita Express.</p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel__inner">
          <img className="brand-logo brand-logo--panel" src="/brand/logo.webp" alt="Carmencita Express Cargo" width="866" height="288" />
          <p className="eyebrow">Inicio de sesión</p>
          <h2>Carmencita Smart System</h2>
          <p className="muted-copy">Ingresa con tu usuario interno para continuar.</p>

          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            {error && <div className="alert alert--error" role="alert">{error}</div>}
            <label className="field">
              <span>Usuario</span>
              <input
                autoComplete="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                placeholder="usuario"
                required
              />
            </label>
            <label className="field">
              <span>Contraseña</span>
              <input
                autoComplete="current-password"
                name="password"
                type="password"
                maxLength={30}
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </label>
            <button className="button button--primary button--wide" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Validando acceso...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
