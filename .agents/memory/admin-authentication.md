---
name: Admin authentication
description: Authentication boundary and administrator access behavior for the store console.
---

The store uses Replit-managed Clerk for customer and administrator sign-in/account creation. Public `/login` and `/register` routes provide the customer flow, while `/admin` requires a signed-in Clerk session. The account page exposes the real Clerk profile and a direct sign-out action.

**Why:** A local password flow would duplicate account security and make the admin area harder to maintain; Clerk already owns the supported web authentication lifecycle.

**How to apply:** Keep auth transport cookie-based for the web app. Preserve `/sign-in/*?` and `/sign-up/*?` callback-compatible routes when changing the friendly `/login` and `/register` aliases. If the product later needs separate customer and administrator roles, add an explicit authorization rule (for example, an approved administrator email list or Clerk metadata) before allowing a signed-in user into `/admin`.