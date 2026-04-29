# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built with Next.js App Router, TypeScript, Tailwind CSS, and localStorage for persistence.

---

## Project Overview

Habit Tracker allows a user to:

- Sign up with email and password
- Log in and log out
- Create, edit, and delete daily habits
- Mark a habit complete for today and unmark it
- View a visible current streak
- Reload the app and retain all saved state
- Install the app as a PWA
- Load the cached app shell offline without a hard crash

This is a front-end-only application. There is no backend or external authentication service. All persistence is local and deterministic via `localStorage`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework and routing |
| React | UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| localStorage | Persistence |
| Vitest | Unit and integration tests |
| React Testing Library | Component tests |
| Playwright | End-to-end tests |

---

## Folder Structure

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx                  # Splash screen → redirect
    login/page.tsx
    signup/page.tsx
    dashboard/page.tsx
  components/
    auth/
      LoginForm.tsx
      SignupForm.tsx
    habits/
      HabitForm.tsx
      HabitList.tsx
      HabitCard.tsx
    shared/
      SplashScreen.tsx
      ProtectedRoute.tsx
  lib/
    auth.ts
    constants.ts
    habits.ts
    slug.ts
    storage.ts
    streaks.ts
    validators.ts
  types/
    auth.ts
    habit.ts
public/
  icons/
    icon-192.png
    icon-512.png
  manifest.json
  sw.js
tests/
  unit/
    slug.test.ts
    validators.test.ts
    streaks.test.ts
    habits.test.ts
  integration/
    auth-flow.test.tsx
    habit-form.test.tsx
  e2e/
    app.spec.ts
```

---

## Setup

**Prerequisites:** Node.js 18+

```bash
git clone <repo-url>
cd habit-tracker
npm install
```

---

## Running the App

```bash
# Development server
npm run dev
# Open http://localhost:3000

# Production build
npm run build

# Start production server
npm run start
```

---

## Running Tests

```bash
# Unit tests with coverage report
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (starts production server automatically)
npm run test:e2e

# Run all tests
npm run test
```

Coverage is reported for all files inside `src/lib/`. Minimum threshold is 80% line coverage.

---

## Local Persistence Structure

All data is stored in `localStorage` under exactly three keys:

### `habit-tracker-users`

Stores all registered users as a JSON array.

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "password": "plaintext-password",
    "createdAt": "2024-06-15T10:00:00.000Z"
  }
]
```

### `habit-tracker-session`

Stores the active session, or `null` when logged out.

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

Stores all habits for all users as a JSON array. Each habit belongs to one user via `userId`.

```json
[
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Drink Water",
    "description": "Eight glasses a day",
    "frequency": "daily",
    "createdAt": "2024-06-15T10:00:00.000Z",
    "completions": ["2024-06-14", "2024-06-15"]
  }
]
```

`completions` contains unique `YYYY-MM-DD` date strings. Duplicate dates are never stored.

---

## PWA Support

PWA installability is implemented via three pieces:

**`public/manifest.json`**
Describes the app to the browser: name, short name, start URL, display mode (`standalone`), theme color, background color, and icon paths for 192px and 512px.

**`public/sw.js`**
A service worker that:
- On `install`: pre-caches the app shell routes (`/`, `/login`, `/signup`, `/dashboard`)
- On `fetch`: uses a network-first strategy — tries the network, falls back to the cache if offline
- On `activate`: cleans up old cache versions

**`src/app/layout.tsx`**
Registers the service worker on the client side on every page load via a `useEffect`. Also links the manifest and apple-touch-icon in the HTML `<head>`.

After the first visit, the app shell loads from cache when offline and does not hard-crash.

---

## Trade-offs and Limitations

| Area | Decision | Reason |
|------|----------|--------|
| Passwords | Stored as plaintext | Spec requires no external auth service; no bcrypt on the client |
| Multi-device | No sync | `localStorage` is per-device and per-origin |
| Frequency | `daily` only | Stage 3 scope — other frequencies not required |
| Session expiry | None — lasts until logout | Simplest correct behavior for local auth |
| Offline CRUD | Not supported | Only the app shell is cached; habit data lives in `localStorage` which is always available |
| Coverage scope | `src/lib/**` only | Spec threshold applies to utility files, not all source |

---

## Test File Map

| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/unit/slug.test.ts` | `getHabitSlug` — lowercases, hyphenates, trims whitespace, collapses repeated spaces, strips non-alphanumeric characters |
| `tests/unit/validators.test.ts` | `validateHabitName` — rejects empty input, rejects names over 60 chars, returns trimmed valid value |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` — returns 0 for empty or missing today, counts consecutive days, ignores duplicates, breaks on gap |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` — adds date when absent, removes when present, does not mutate original, prevents duplicates |
| `tests/integration/auth-flow.test.tsx` | Signup creates user and session; duplicate email is rejected; login validates credentials and stores session; invalid credentials show error |
| `tests/integration/habit-form.test.tsx` | Empty name shows validation error; create calls onSave with correct data; edit preserves id/userId/createdAt/completions; delete requires confirmation; completion toggle updates streak display |
| `tests/e2e/app.spec.ts` | Splash screen visible then redirects; authenticated users go to dashboard; unauthenticated users redirected from dashboard; full signup/login/create/complete/delete/logout flows; persistence after reload; offline app shell loads |