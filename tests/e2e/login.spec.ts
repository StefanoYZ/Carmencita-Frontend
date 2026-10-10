import { expect, test } from '@playwright/test';
import { mockIdentityApi } from './support/mockIdentityApi';

test('permite iniciar sesión con la respuesta camelCase del backend', async ({ page }) => {
  await mockIdentityApi(page);
  await page.addInitScript(() => sessionStorage.clear());
  await page.goto('/login');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();

  await expect(page.getByLabel('Usuario')).toBeVisible();
  await page.getByLabel('Usuario').fill('operator');
  await page.getByLabel('Contraseña').fill('password-for-e2e');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Usuarios' })).toBeVisible();
});
