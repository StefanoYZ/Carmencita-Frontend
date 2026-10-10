import type { Page } from '@playwright/test';

export async function mockIdentityApi(page: Page): Promise<void> {
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^.*\/api\/v1/, '');

    if (path === '/auth/login' && request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'e2e-token',
          tokenType: 'Bearer',
          expiresIn: 900,
          user: {
            userId: 1,
            username: 'operator',
            fullName: 'Test Operator',
            agencyId: null,
            roles: ['ADMIN'],
            permissions: ['USERS_CREATE', 'USERS_READ', 'USERS_ASSIGN_ROLE', 'ROLES_READ', 'PERMISSIONS_READ'],
          },
        }),
      });
      return;
    }

    const responses: Record<string, unknown> = {
      '/users': [
        {
          userId: 1,
          username: 'operator',
          fullName: 'Test Operator',
          agencyId: 12,
          phone: '+51999999999',
          isActive: true,
          roles: ['SECRETARY'],
          permissions: ['USERS_CREATE', 'USERS_READ'],
        },
      ],
      '/roles': [
        {
          roleId: 1,
          roleName: 'ADMIN',
          description: 'Administrador global del sistema.',
          isActive: true,
          permissions: ['USERS_CREATE', 'USERS_READ'],
        },
        {
          roleId: 2,
          roleName: 'SECRETARY',
          description: 'Operaciones de agencia y atención al cliente.',
          isActive: true,
          permissions: [],
        },
        {
          roleId: 3,
          roleName: 'LOADER',
          description: 'Operaciones de carga y acomodo.',
          isActive: true,
          permissions: [],
        },
      ],
      '/permissions': [
        {
          permissionId: 1,
          permissionName: 'USERS_CREATE',
          description: 'Crear usuarios internos.',
          isActive: true,
        },
      ],
    };

    if (path === '/users' && request.method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 2,
          username: 'new-user',
          fullName: 'New User',
          agencyId: 12,
          phone: '+51123456789',
          isActive: true,
          roles: ['SECRETARY'],
          permissions: [],
        }),
      });
      return;
    }

    if (path === '/users/1/roles/3' && request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 1,
          username: 'operator',
          fullName: 'Test Operator',
          agencyId: 12,
          phone: '+51999999999',
          isActive: true,
          roles: ['LOADER'],
          permissions: ['USERS_CREATE', 'USERS_READ'],
        }),
      });
      return;
    }

    if (responses[path]) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(responses[path]) });
      return;
    }

    await route.continue();
  });
}
