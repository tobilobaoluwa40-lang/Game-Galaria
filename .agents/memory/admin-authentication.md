---
name: Admin authentication
description: Authentication boundary and administrator access behavior for the store console.
---

The store uses Replit-managed Clerk for administrator sign-in and account creation. The storefront remains public, while the `/admin` route requires a signed-in Clerk session. The admin header exposes a direct sign-out action that returns to the storefront.

**Why:** A local password flow would duplicate account security and make the admin area harder to maintain; Clerk already owns the supported web authentication lifecycle.

**How to apply:** Keep auth transport cookie-based for the web app. If the product later needs separate customer and administrator roles, add an explicit authorization rule (for example, an approved administrator email list or Clerk metadata) before allowing a signed-in user into `/admin`.