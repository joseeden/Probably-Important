import { test, expect } from '@playwright/test';
import fs from 'fs';

const BASE = 'http://localhost:3030';

function creds() {
  const raw = fs.readFileSync('/tmp/pw-test-credentials.json', 'utf-8');
  return JSON.parse(raw) as { email: string; password: string; name: string };
}

// Authenticated tests reuse the saved session so we never re-login.
const authed = test.extend<object, object>({
  storageState: '/tmp/pw-auth-state.json',
});

// Helper: create a note and return its ID.
async function createNote(
  page: import('@playwright/test').Page,
  title: string,
  body = 'Test body.',
) {
  await page.goto(`${BASE}/notes/new`);
  await page.getByPlaceholder('Title').fill(title);
  const editor = page.locator('.tiptap[contenteditable]');
  await editor.click();
  await page.keyboard.type(body);
  await page.getByRole('button', { name: 'Create note' }).click();
  await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  return page.url().split('/notes/')[1];
}

// ─── Route Protection ────────────────────────────────────────────────────────

test('unauthenticated /dashboard redirects to /auth', async ({ page }) => {
  await page.goto(`${BASE}/dashboard`);
  await expect(page).toHaveURL(/\/auth/);
});

test('unauthenticated /notes/new redirects to /auth', async ({ page }) => {
  await page.goto(`${BASE}/notes/new`);
  await expect(page).toHaveURL(/\/auth/);
});

// ─── Auth flows ───────────────────────────────────────────────────────────────

test('login with wrong password shows error', async ({ page }) => {
  const { email } = creds();
  await page.goto(`${BASE}/auth`);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('p.text-red-600, p.text-red-400')).toBeVisible({ timeout: 8000 });
});

test('sign out redirects to /auth', async ({ page }) => {
  const { email, password } = creds();
  await page.goto(`${BASE}/auth`);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/auth/, { timeout: 8000 });
});

// ─── Note creation ────────────────────────────────────────────────────────────

authed('create a note and land on note view', async ({ page }) => {
  const id = await createNote(page, 'Create Flow Note', 'Testing note creation.');
  expect(id).toBeTruthy();
  await expect(page.getByRole('heading', { name: 'Create Flow Note' })).toBeVisible();
});

// ─── Note appears in dashboard list ──────────────────────────────────────────

authed('note appears in dashboard list', async ({ page }) => {
  await createNote(page, 'Dashboard List Note');
  await page.goto(`${BASE}/dashboard`);
  await expect(page.getByRole('link', { name: 'Dashboard List Note' })).toBeVisible({
    timeout: 10000,
  });
});

// ─── Rich text formatting ────────────────────────────────────────────────────

authed('bold formatting is saved', async ({ page }) => {
  await page.goto(`${BASE}/notes/new`);
  await page.getByPlaceholder('Title').fill('Bold Test');
  const editor = page.locator('.tiptap[contenteditable]');
  await editor.click();
  await page.keyboard.type('Bold text');
  await page.keyboard.press('Control+a');
  await page.getByRole('button', { name: 'B' }).click();
  await page.getByRole('button', { name: 'Create note' }).click();
  await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  const content = await page.locator('.note-content').innerHTML();
  expect(content).toContain('<strong>');
});

authed('H1 heading is saved', async ({ page }) => {
  await page.goto(`${BASE}/notes/new`);
  await page.getByPlaceholder('Title').fill('H1 Test');
  const editor = page.locator('.tiptap[contenteditable]');
  await editor.click();
  await page.keyboard.type('Section Heading');
  await page.keyboard.press('Control+a');
  await page.getByRole('button', { name: 'H1' }).click();
  await page.getByRole('button', { name: 'Create note' }).click();
  await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  const content = await page.locator('.note-content').innerHTML();
  expect(content).toContain('<h1>');
});

// ─── Edit note ────────────────────────────────────────────────────────────────

authed('edit a note title', async ({ page }) => {
  const id = await createNote(page, 'Edit Me Note');
  // Navigate to the edit page directly
  await page.goto(`${BASE}/notes/${id}/edit`);
  await expect(page.getByRole('heading', { name: 'Edit note' })).toBeVisible({ timeout: 10000 });

  const titleInput = page.getByPlaceholder('Title');
  await titleInput.fill('');
  await titleInput.fill('Edit Me Note (Updated)');

  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  await expect(page.getByRole('heading', { name: 'Edit Me Note (Updated)' })).toBeVisible();
});

// ─── Delete note ──────────────────────────────────────────────────────────────

authed('delete a note via confirmation dialog', async ({ page }) => {
  await createNote(page, 'Note to Delete', 'Will be deleted.');

  await page.getByRole('button', { name: 'Delete' }).click();
  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Delete' }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  await expect(page.getByText('Note to Delete')).not.toBeVisible({ timeout: 5000 });
});

// ─── Public sharing ───────────────────────────────────────────────────────────

authed('enable sharing exposes public URL', async ({ page, context }) => {
  await createNote(page, 'Shared Note', 'This note will be shared.');

  // Sharing starts off
  await expect(page.locator('span.font-medium.text-foreground')).toHaveText('off');

  await page.getByRole('button', { name: 'Turn on' }).click();
  await expect(page.locator('span.font-medium.text-foreground')).toHaveText('on', {
    timeout: 8000,
  });

  const shareUrlInput = page.locator('input[readonly]');
  await expect(shareUrlInput).toBeVisible();
  const shareUrl = await shareUrlInput.inputValue();
  expect(shareUrl).toContain('/share/');

  // Verify public URL accessible without auth
  const publicPage = await context.newPage();
  await publicPage.goto(shareUrl);
  await expect(publicPage.getByText('Shared note', { exact: true })).toBeVisible({
    timeout: 10000,
  });
  await expect(publicPage.getByRole('heading', { name: 'Shared Note' })).toBeVisible();
  await publicPage.close();
});

authed('copy share URL shows Copied!', async ({ page, context }) => {
  // Grant clipboard-write so navigator.clipboard.writeText() works headlessly
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await createNote(page, 'Copy URL Note');
  await page.getByRole('button', { name: 'Turn on' }).click();
  await expect(page.locator('span.font-medium.text-foreground')).toHaveText('on', {
    timeout: 8000,
  });
  await page.getByRole('button', { name: 'Copy' }).click();
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible({ timeout: 3000 });
});

authed('disable sharing makes public URL return 404', async ({ page, context }) => {
  await createNote(page, 'Disable Share Note');
  await page.getByRole('button', { name: 'Turn on' }).click();
  await expect(page.locator('span.font-medium.text-foreground')).toHaveText('on', {
    timeout: 8000,
  });

  const shareUrlInput = page.locator('input[readonly]');
  const shareUrl = await shareUrlInput.inputValue();

  await page.getByRole('button', { name: 'Turn off' }).click();
  await expect(page.locator('span.font-medium.text-foreground')).toHaveText('off', {
    timeout: 8000,
  });

  const publicPage = await context.newPage();
  await publicPage.goto(shareUrl);
  await expect(publicPage.locator('h1').filter({ hasText: '404' })).toBeVisible({
    timeout: 8000,
  });
  await publicPage.close();
});
