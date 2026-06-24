# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> edit a note title
- Location: tests/app.spec.ts:116:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Edit note' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Edit note' })

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  20  |   body = 'Test body.',
  21  | ) {
  22  |   await page.goto(`${BASE}/notes/new`);
  23  |   await page.getByPlaceholder('Title').fill(title);
  24  |   const editor = page.locator('.tiptap[contenteditable]');
  25  |   await editor.click();
  26  |   await page.keyboard.type(body);
  27  |   await page.getByRole('button', { name: 'Create note' }).click();
  28  |   await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  29  |   return page.url().split('/notes/')[1];
  30  | }
  31  | 
  32  | // ─── Route Protection ────────────────────────────────────────────────────────
  33  | 
  34  | test('unauthenticated /dashboard redirects to /auth', async ({ page }) => {
  35  |   await page.goto(`${BASE}/dashboard`);
  36  |   await expect(page).toHaveURL(/\/auth/);
  37  | });
  38  | 
  39  | test('unauthenticated /notes/new redirects to /auth', async ({ page }) => {
  40  |   await page.goto(`${BASE}/notes/new`);
  41  |   await expect(page).toHaveURL(/\/auth/);
  42  | });
  43  | 
  44  | // ─── Auth flows ───────────────────────────────────────────────────────────────
  45  | 
  46  | test('login with wrong password shows error', async ({ page }) => {
  47  |   const { email } = creds();
  48  |   await page.goto(`${BASE}/auth`);
  49  |   await page.getByLabel('Email').fill(email);
  50  |   await page.getByLabel('Password').fill('wrongpassword');
  51  |   await page.getByRole('button', { name: 'Sign in' }).click();
  52  |   await expect(page.locator('p.text-red-600, p.text-red-400')).toBeVisible({ timeout: 8000 });
  53  | });
  54  | 
  55  | test('sign out redirects to /auth', async ({ page }) => {
  56  |   const { email, password } = creds();
  57  |   await page.goto(`${BASE}/auth`);
  58  |   await page.getByLabel('Email').fill(email);
  59  |   await page.getByLabel('Password').fill(password);
  60  |   await page.getByRole('button', { name: 'Sign in' }).click();
  61  |   await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  62  |   await page.getByRole('button', { name: 'Sign out' }).click();
  63  |   await expect(page).toHaveURL(/\/auth/, { timeout: 8000 });
  64  | });
  65  | 
  66  | // ─── Note creation ────────────────────────────────────────────────────────────
  67  | 
  68  | authed('create a note and land on note view', async ({ page }) => {
  69  |   const id = await createNote(page, 'Create Flow Note', 'Testing note creation.');
  70  |   expect(id).toBeTruthy();
  71  |   await expect(page.getByRole('heading', { name: 'Create Flow Note' })).toBeVisible();
  72  | });
  73  | 
  74  | // ─── Note appears in dashboard list ──────────────────────────────────────────
  75  | 
  76  | authed('note appears in dashboard list', async ({ page }) => {
  77  |   await createNote(page, 'Dashboard List Note');
  78  |   await page.goto(`${BASE}/dashboard`);
  79  |   await expect(page.getByRole('link', { name: 'Dashboard List Note' })).toBeVisible({
  80  |     timeout: 10000,
  81  |   });
  82  | });
  83  | 
  84  | // ─── Rich text formatting ────────────────────────────────────────────────────
  85  | 
  86  | authed('bold formatting is saved', async ({ page }) => {
  87  |   await page.goto(`${BASE}/notes/new`);
  88  |   await page.getByPlaceholder('Title').fill('Bold Test');
  89  |   const editor = page.locator('.tiptap[contenteditable]');
  90  |   await editor.click();
  91  |   await page.keyboard.type('Bold text');
  92  |   await page.keyboard.press('Control+a');
  93  |   await page.getByRole('button', { name: 'B' }).click();
  94  |   await page.getByRole('button', { name: 'Create note' }).click();
  95  |   await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  96  |   const content = await page.locator('.note-content').innerHTML();
  97  |   expect(content).toContain('<strong>');
  98  | });
  99  | 
  100 | authed('H1 heading is saved', async ({ page }) => {
  101 |   await page.goto(`${BASE}/notes/new`);
  102 |   await page.getByPlaceholder('Title').fill('H1 Test');
  103 |   const editor = page.locator('.tiptap[contenteditable]');
  104 |   await editor.click();
  105 |   await page.keyboard.type('Section Heading');
  106 |   await page.keyboard.press('Control+a');
  107 |   await page.getByRole('button', { name: 'H1' }).click();
  108 |   await page.getByRole('button', { name: 'Create note' }).click();
  109 |   await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  110 |   const content = await page.locator('.note-content').innerHTML();
  111 |   expect(content).toContain('<h1>');
  112 | });
  113 | 
  114 | // ─── Edit note ────────────────────────────────────────────────────────────────
  115 | 
  116 | authed('edit a note title', async ({ page }) => {
  117 |   const id = await createNote(page, 'Edit Me Note');
  118 |   // Navigate to the edit page directly
  119 |   await page.goto(`${BASE}/notes/${id}/edit`);
> 120 |   await expect(page.getByRole('heading', { name: 'Edit note' })).toBeVisible({ timeout: 10000 });
      |                                                                  ^ Error: expect(locator).toBeVisible() failed
  121 | 
  122 |   const titleInput = page.getByPlaceholder('Title');
  123 |   await titleInput.fill('');
  124 |   await titleInput.fill('Edit Me Note (Updated)');
  125 | 
  126 |   await page.getByRole('button', { name: 'Save changes' }).click();
  127 |   await page.waitForURL(/\/notes\/(?!new)[^/]+$/, { timeout: 20000 });
  128 |   await expect(page.getByRole('heading', { name: 'Edit Me Note (Updated)' })).toBeVisible();
  129 | });
  130 | 
  131 | // ─── Delete note ──────────────────────────────────────────────────────────────
  132 | 
  133 | authed('delete a note via confirmation dialog', async ({ page }) => {
  134 |   await createNote(page, 'Note to Delete', 'Will be deleted.');
  135 | 
  136 |   await page.getByRole('button', { name: 'Delete' }).click();
  137 |   const dialog = page.locator('dialog');
  138 |   await expect(dialog).toBeVisible();
  139 |   await dialog.getByRole('button', { name: 'Delete' }).click();
  140 | 
  141 |   await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  142 |   await expect(page.getByText('Note to Delete')).not.toBeVisible({ timeout: 5000 });
  143 | });
  144 | 
  145 | // ─── Public sharing ───────────────────────────────────────────────────────────
  146 | 
  147 | authed('enable sharing exposes public URL', async ({ page, context }) => {
  148 |   await createNote(page, 'Shared Note', 'This note will be shared.');
  149 | 
  150 |   // Sharing starts off
  151 |   await expect(page.locator('span.font-medium.text-foreground')).toHaveText('off');
  152 | 
  153 |   await page.getByRole('button', { name: 'Turn on' }).click();
  154 |   await expect(page.locator('span.font-medium.text-foreground')).toHaveText('on', {
  155 |     timeout: 8000,
  156 |   });
  157 | 
  158 |   const shareUrlInput = page.locator('input[readonly]');
  159 |   await expect(shareUrlInput).toBeVisible();
  160 |   const shareUrl = await shareUrlInput.inputValue();
  161 |   expect(shareUrl).toContain('/share/');
  162 | 
  163 |   // Verify public URL accessible without auth
  164 |   const publicPage = await context.newPage();
  165 |   await publicPage.goto(shareUrl);
  166 |   await expect(publicPage.getByText('Shared note', { exact: true })).toBeVisible({
  167 |     timeout: 10000,
  168 |   });
  169 |   await expect(publicPage.getByRole('heading', { name: 'Shared Note' })).toBeVisible();
  170 |   await publicPage.close();
  171 | });
  172 | 
  173 | authed('copy share URL shows Copied!', async ({ page, context }) => {
  174 |   // Grant clipboard-write so navigator.clipboard.writeText() works headlessly
  175 |   await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  176 |   await createNote(page, 'Copy URL Note');
  177 |   await page.getByRole('button', { name: 'Turn on' }).click();
  178 |   await expect(page.locator('span.font-medium.text-foreground')).toHaveText('on', {
  179 |     timeout: 8000,
  180 |   });
  181 |   await page.getByRole('button', { name: 'Copy' }).click();
  182 |   await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible({ timeout: 3000 });
  183 | });
  184 | 
  185 | authed('disable sharing makes public URL return 404', async ({ page, context }) => {
  186 |   await createNote(page, 'Disable Share Note');
  187 |   await page.getByRole('button', { name: 'Turn on' }).click();
  188 |   await expect(page.locator('span.font-medium.text-foreground')).toHaveText('on', {
  189 |     timeout: 8000,
  190 |   });
  191 | 
  192 |   const shareUrlInput = page.locator('input[readonly]');
  193 |   const shareUrl = await shareUrlInput.inputValue();
  194 | 
  195 |   await page.getByRole('button', { name: 'Turn off' }).click();
  196 |   await expect(page.locator('span.font-medium.text-foreground')).toHaveText('off', {
  197 |     timeout: 8000,
  198 |   });
  199 | 
  200 |   const publicPage = await context.newPage();
  201 |   await publicPage.goto(shareUrl);
  202 |   await expect(publicPage.locator('h1').filter({ hasText: '404' })).toBeVisible({
  203 |     timeout: 8000,
  204 |   });
  205 |   await publicPage.close();
  206 | });
  207 | 
```