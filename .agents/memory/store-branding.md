---
name: Store branding
description: How administrator-managed logo branding is persisted and rendered.
---

The administrator-managed logo is stored with the existing browser-persisted store settings and rendered through one shared branding component across the storefront header, footer, and custom login screen.

**Why:** Keeping branding in the same settings state makes one saved admin change consistent across routes without introducing a second configuration source.

**How to apply:** Store uploaded logos as persistent data URLs or durable hosted paths, provide a bundled fallback when no logo is configured or an image fails, and keep the editable wordmark as the accessible fallback label.