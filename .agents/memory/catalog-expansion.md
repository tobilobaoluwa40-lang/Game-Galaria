---
name: Catalog expansion
description: Durable rules for adding products to the storefront catalog.
---

New catalog inventory is represented as stable product records with category-specific generated imagery and is merged into existing browser-saved catalogs by product ID.

**Why:** The storefront persists catalog state locally, so replacing the saved list would delete admin-created products and existing edits.

**How to apply:** Add future inventory through the expansion data module, preserve unique stable IDs, keep category matching aligned with route slugs, and merge missing seed products into saved state rather than resetting it.