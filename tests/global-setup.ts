import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3030';

export default async function globalSetup() {
  const TS = Date.now();
  const email = `tester+${TS}@example.com`;
  const password = 'testpassword123';

  // Write credentials to a temp file so tests can read them
  const fs = await import('fs');
  fs.writeFileSync(
    '/tmp/pw-test-credentials.json',
    JSON.stringify({ email, password, name: 'Test User' }),
  );

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Sign up
  await page.goto(`${BASE}/auth`);
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });

  // Save the authenticated session cookies
  await context.storageState({ path: '/tmp/pw-auth-state.json' });

  await browser.close();
}
