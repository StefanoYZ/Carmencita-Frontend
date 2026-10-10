import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../../app/App';

let root: Root | undefined;

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  document.body.innerHTML = '';
});

describe('application shell', () => {
  it('renders the login page when no session exists', () => {
    window.history.replaceState({}, '', '/login');
    const container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => root?.render(<App />));

    expect(container.querySelector('h1')?.textContent).toContain('Acceso operativo');
    expect(container.querySelector('input[name="username"]')).not.toBeNull();
  });
});
