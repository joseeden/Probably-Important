# Probably Important — Specification

A note-taking app where users write, organize, and optionally share richly formatted notes.

---

## 1. Project Overview

**Probably Important** is a personal note-taking web application. Authenticated users can create, edit, delete, and search notes written in a rich text editor. Each note can optionally be shared publicly via a unique URL. The app is private by default: users only see their own notes unless they explicitly share one.

**Goals**
- Simple, fast note management with a clean rich text editing experience.
- Secure, per-user data isolation.
- Optional public sharing of individual notes.

**Non-goals (out of scope)**
- Collaboration / multi-user editing.
- Folders, tags, or nested organization.
- File/image attachments.
- Mobile native apps.

---

## 2. Functional Requirements

1. **Authentication** — Users can sign up, log in, and log out. Sessions persist across reloads.
2. **Create note** — Authenticated users create a note with a title and rich text content.
3. **List notes** — Users see a list of their own notes, ordered by last updated (newest first), showing title and timestamp.
4. **View note** — Users open a note to read its full formatted content.
5. **Edit note** — Users update the title and content of their own notes.
6. **Delete note** — Users delete their own notes (with a confirmation step).
7. **Rich text editing** — The editor (TipTap) supports: bold, italic, underline, headings, bullet list, numbered list, links, blockquote, and horizontal rule.
8. **Search** — Users search their own notes by title or content via a simple database text search.
9. **Public sharing** — Users toggle a note as public, generating a unique unguessable URL. Anyone with the URL can view (read-only) the shared note without authentication. Users can revoke sharing.
10. **Authorization** — All note read/write operations (except viewing a shared public note) require authentication and verify ownership.

---

## 3. Non-Functional Requirements

- **Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Bun runtime.
- **Type safety**: TypeScript end to end; no `any` in domain code.
- **Security**: Ownership enforced server-side on every note operation; public share tokens are random and unguessable; session cookies are HTTP-only.
- **Performance**: Note list and search respond quickly for a typical personal volume of notes (indexed columns where relevant).
- **Simplicity**: Straightforward solutions; avoid premature abstraction.
- **Production-readiness**: Environment-based config, no secrets in source, basic input validation on all API routes.
- **Accessibility**: Semantic HTML, keyboard-usable editor and forms.

---

## 4. User Flows

**Sign up / Log in**
1. Visitor lands on the app → redirected to login if unauthenticated.
2. Visitor signs up or logs in via better-auth.
3. On success → redirected to the notes dashboard.

**Create a note**
1. From the dashboard, user clicks "New Note".
2. User enters a title and writes content in the TipTap editor.
3. User saves → note persisted with timestamps → returns to dashboard (or note view).

**Edit a note**
1. User opens a note → clicks "Edit".
2. User changes title/content → saves → `updatedAt` refreshed.

**Delete a note**
1. User opens a note (or list item menu) → clicks "Delete".
2. User confirms → note removed → returns to dashboard.

**Search**
1. User types in the search box on the dashboard.
2. List filters to notes whose title or content matches the query.

**Share a note**
1. User opens a note → toggles "Share publicly".
2. App generates a unique share token and shows the public URL.
3. User copies/sends the URL. Anyone visiting it sees a read-only rendered note.
4. User toggles sharing off → public URL stops working.

**Log out**
1. User clicks "Log out" → session cleared → redirected to login.

---

## 5. Database Schema

Managed with Prisma on Neon PostgreSQL. Auth tables (User, Session, Account, Verification) are provided/managed by better-auth's Prisma schema; the app-owned model is `Note`.

**User** (managed by better-auth)
- `id` (string, PK)
- `email` (string, unique)
- `name` (string, optional)
- `emailVerified` (boolean)
- `createdAt`, `updatedAt` (timestamps)
- Relations: `notes Note[]`

**Session / Account / Verification** — as defined by better-auth's Prisma adapter (sessions, OAuth/credential accounts, verification tokens).

**Note** (app-owned)
- `id` (string, PK, cuid)
- `title` (string)
- `content` (string — TipTap HTML or JSON)
- `userId` (string, FK → User.id, indexed)
- `isPublic` (boolean, default `false`)
- `shareToken` (string, unique, nullable — set when shared)
- `createdAt` (timestamp, default now)
- `updatedAt` (timestamp, auto-updated)

**Indexes**
- `Note.userId` (list/search by owner)
- `Note.shareToken` (unique, public lookup)
- Search relies on `title`/`content` filtering (`contains`, case-insensitive). A Postgres full-text or trigram index may be added later if needed — kept simple for now.

---

## 6. Authentication Flow

- **Library**: better-auth with the Prisma adapter (email + password credentials).
- **Sign up**: Credentials submitted → better-auth creates User + Account → session created.
- **Login**: Credentials verified → session cookie (HTTP-only) issued.
- **Session validation**: Server reads the session on each request; API routes and protected pages reject unauthenticated requests.
- **Authorization**: After authentication, each note operation checks `note.userId === session.user.id`. Public note viewing bypasses auth but is restricted to `isPublic === true` notes looked up by `shareToken`.
- **Logout**: better-auth clears the session.
- **Route protection**: Middleware (or per-page server checks) redirect unauthenticated users from protected routes to `/login`.

---

## 7. API Endpoints

better-auth mounts its own handler at `/api/auth/[...all]`. App routes (Next.js Route Handlers) below are all JSON and require a valid session except where noted.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `ALL` | `/api/auth/[...all]` | better-auth handler (sign up, login, logout, session) | Public |
| `GET` | `/api/notes` | List current user's notes; supports `?q=` search | Required |
| `POST` | `/api/notes` | Create a note | Required |
| `GET` | `/api/notes/:id` | Get a single owned note | Required (owner) |
| `PUT` | `/api/notes/:id` | Update title/content of an owned note | Required (owner) |
| `DELETE` | `/api/notes/:id` | Delete an owned note | Required (owner) |
| `POST` | `/api/notes/:id/share` | Enable sharing → returns `shareToken`/URL | Required (owner) |
| `DELETE` | `/api/notes/:id/share` | Disable sharing (revoke token) | Required (owner) |
| `GET` | `/api/public/:shareToken` | Fetch a public shared note (read-only) | Public |

**Validation & errors**: All write endpoints validate body input and return appropriate status codes (`400` invalid, `401` unauthenticated, `403` not owner, `404` not found).

---

## 8. Frontend Pages and Components

**Pages (App Router)**
- `/login` — Login / sign-up form.
- `/` (dashboard) — Authenticated note list + search bar + "New Note" button.
- `/notes/new` — Create note (editor).
- `/notes/[id]` — View a note (formatted, read-only with Edit/Delete/Share actions).
- `/notes/[id]/edit` — Edit note (editor).
- `/share/[shareToken]` — Public read-only view of a shared note (no auth).

**Key components**
- `AuthForm` — Login/sign-up form using better-auth client.
- `NoteList` — Renders list of notes with title + timestamp.
- `NoteListItem` — Single note row with quick actions.
- `SearchBar` — Debounced search input driving the list query.
- `NoteEditor` — TipTap-based rich text editor + title field + save.
- `EditorToolbar` — Formatting controls (bold, italic, underline, headings, lists, link, blockquote, horizontal rule).
- `NoteView` — Renders saved rich content read-only.
- `ShareToggle` — Enables/disables public sharing and shows the URL.
- `ConfirmDialog` — Reusable confirmation (used for delete).

---

## 9. Folder Structure

```
probably-important/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                  # dashboard
│  │  ├─ login/page.tsx
│  │  ├─ notes/
│  │  │  ├─ new/page.tsx
│  │  │  └─ [id]/
│  │  │     ├─ page.tsx            # view
│  │  │     └─ edit/page.tsx
│  │  ├─ share/[shareToken]/page.tsx
│  │  └─ api/
│  │     ├─ auth/[...all]/route.ts
│  │     ├─ notes/
│  │     │  ├─ route.ts            # GET list, POST create
│  │     │  └─ [id]/
│  │     │     ├─ route.ts         # GET, PUT, DELETE
│  │     │     └─ share/route.ts   # POST, DELETE
│  │     └─ public/[shareToken]/route.ts
│  ├─ components/
│  │  ├─ AuthForm.tsx
│  │  ├─ NoteList.tsx
│  │  ├─ NoteListItem.tsx
│  │  ├─ SearchBar.tsx
│  │  ├─ NoteEditor.tsx
│  │  ├─ EditorToolbar.tsx
│  │  ├─ NoteView.tsx
│  │  ├─ ShareToggle.tsx
│  │  └─ ConfirmDialog.tsx
│  ├─ lib/
│  │  ├─ auth.ts                   # better-auth server config
│  │  ├─ auth-client.ts            # better-auth client
│  │  ├─ prisma.ts                 # Prisma client singleton
│  │  └─ validation.ts             # input schemas
│  └─ middleware.ts                # route protection
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
└─ next.config.ts
```

---

## 10. Third-Party Dependencies

- **next** — framework (App Router).
- **react**, **react-dom** — UI.
- **typescript** — type safety.
- **tailwindcss**, **postcss**, **autoprefixer** — styling.
- **better-auth** — authentication.
- **prisma**, **@prisma/client** — ORM.
- **@neondatabase/serverless** (or standard Postgres driver) — Neon connection.
- **@tiptap/react**, **@tiptap/starter-kit**, **@tiptap/extension-underline**, **@tiptap/extension-link** — rich text editor (StarterKit covers bold, italic, headings, lists, blockquote, horizontal rule; underline and link added separately).
- **zod** — runtime input validation.
- **Runtime**: Bun (dev/build/run).

---

## 11. Implementation Phases

**Phase 1 — Project setup**
Scaffold Next.js + TypeScript + Tailwind with Bun; configure environment variables and base layout.

**Phase 2 — Database & ORM**
Set up Prisma with Neon; define `Note` model; integrate better-auth's Prisma schema; run initial migration.

**Phase 3 — Authentication**
Configure better-auth (server + client); build login/sign-up page; add route-protection middleware and logout.

**Phase 4 — Notes CRUD**
Implement `/api/notes` endpoints with ownership checks; build dashboard list, create, view, edit, and delete flows.

**Phase 5 — Rich text editor**
Integrate TipTap with the full formatting toolbar; wire it into create/edit; render saved content read-only.

**Phase 6 — Search**
Add `?q=` filtering on the notes list endpoint and the debounced `SearchBar`.

**Phase 7 — Public sharing**
Add share enable/disable endpoints + token; build the public `/share/[shareToken]` read-only page and `ShareToggle`.

**Phase 8 — Polish**
Validation, error states, loading states, basic accessibility, and final styling pass.
