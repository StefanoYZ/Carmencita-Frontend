import { expect, test } from '@playwright/test';

const username = process.env.IDENTITY_TEST_USERNAME;
const password = process.env.IDENTITY_TEST_PASSWORD;
const apiBaseUrl = (process.env.IDENTITY_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');

test('login del backend conserva el contrato camelCase aprobado', async ({ request }) => {
  test.skip(!username || !password, 'Requires explicit IDENTITY_TEST_USERNAME and IDENTITY_TEST_PASSWORD.');

  const response = await request.post(`${apiBaseUrl}/auth/login`, {
    data: { username, password },
  });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body).toEqual(expect.objectContaining({ accessToken: expect.any(String), tokenType: expect.any(String), expiresIn: expect.any(Number) }));
  expect(body.user).toEqual(expect.objectContaining({ userId: expect.any(Number), username: expect.any(String), fullName: expect.any(String), roles: expect.any(Array), permissions: expect.any(Array) }));
  expect(body.user).toHaveProperty('agencyId');
});
