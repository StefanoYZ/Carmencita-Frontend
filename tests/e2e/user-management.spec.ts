import { expect, test } from '@playwright/test';
import { mockIdentityApi } from './support/mockIdentityApi';

test.beforeEach(async ({ page }) => {
  await mockIdentityApi(page);
  await page.addInitScript(() => sessionStorage.clear());
  await page.goto('/login');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await page.getByLabel('Usuario').fill('operator');
  await page.getByLabel('Contraseña').fill('password-for-e2e');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('heading', { name: 'Usuarios' })).toBeVisible();
});

test('bloquea la creación hasta contar con una agencia seleccionable', async ({ page }) => {
  await expect(page.getByLabel('Perfil para la nueva cuenta')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeDisabled();
  await expect(page.getByRole('option', { name: 'Administrador general' })).toHaveCount(0);
  await expect(page.getByRole('option', { name: 'Administrador de agencia' })).toHaveCount(0);
  await expect(page.getByText('La creación de cuentas está pendiente de seleccionar una agencia.')).toBeVisible();
});

test('cambia el perfil operativo de una cuenta existente', async ({ page }) => {
  await page.getByLabel('Perfil de operator').selectOption('LOADER');

  await expect(page.getByRole('status').filter({ hasText: 'Perfil actualizado correctamente.' })).toBeVisible();
});

test('muestra el bloqueo de asignación de permisos del contrato actual', async ({ page }) => {
  await page.getByRole('button', { name: 'Perfiles y permisos' }).click();
  await expect(page.getByRole('heading', { name: 'Perfiles y permisos' })).toBeVisible();
  await expect(page.getByText('La asignación de permisos no está disponible por ahora.')).toBeVisible();
  for (const technicalLabel of ['ADMIN', 'USERS_CREATE', 'GET /users', 'PUT', 'DELETE', 'API', 'backend']) {
    await expect(page.getByText(technicalLabel, { exact: true })).toHaveCount(0);
  }
});
