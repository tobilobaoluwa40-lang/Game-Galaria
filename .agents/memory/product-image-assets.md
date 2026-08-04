---
name: Product image assets
description: How product photography is assigned and migrated across persisted storefront data.
---

Seed catalog products use local public image assets mapped by stable product ID. Product cards, detail pages, cart rows, wishlists, and orders all consume the product image field, so one catalog mapping updates every surface.

**Why:** The storefront persists products and nested product snapshots in browser storage; replacing only the seed URLs would leave existing carts, orders, and wishlists showing old placeholder artwork.

**How to apply:** When replacing catalog photography, preserve stable product IDs and update the ID-to-asset map. Add a migration that replaces only legacy placeholder URLs, leaving custom admin-provided images intact.