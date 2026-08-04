---
name: Admin authentication
description: Authentication boundary and administrator access behavior for the store console.
---

The store uses Replit-managed Clerk for customer and administrator sign-in/account creation. Public `/login` and `/register` routes provide the customer flow, while `/admin` requires a signed-in Clerk session. The account page exposes the real Clerk profile and a direct sign-out action.

**Why:** A local password flow would duplicate account security and make the admin area harder to maintain; Clerk already owns the supported web authentication lifecycle.

**How to apply:** Keep auth transport cookie-based for the web app. Preserve `/sign-in/*?` and `/sign-up/*?` callback-compatible routes when changing the friendly `/login` and `/register` aliases. If the product later needs separate customer and administrator roles, add an explicit authorization rule (for example, an approved administrator email list or Clerk metadata) before allowing a signed-in user into `/admin`.

The installed Clerk React SDK exposes a signal-based `useSignIn()` hook. Custom password forms must call `signIn.create({ identifier, password })`, inspect the returned `error`, then call Clerk's active-session setter after `signIn.status === "complete"`.

**Why:** The signal-based SDK does not return the completed sign-in object from `create()` and does not expose the legacy hook's `isLoaded`/`setActive` fields.

**How to apply:** Prefer the prebuilt Clerk component unless a two-field layout is required. For custom login UI, use `fetchStatus` for loading state, `signIn.status`/`createdSessionId` for completion, and never persist the password in app state beyond the active submit interaction.