---
name: Currency localization
description: The storefront's currency behavior and migration constraint.
---

The storefront uses Nigerian naira (NGN) as its customer-facing currency. All price, cart, checkout, account-order, report, and admin displays should use the shared NGN formatter rather than local symbols or ad hoc decimal formatting.

**Why:** Existing catalog, cart, order, and settings data was persisted in browser storage before the currency change, so changing only the display symbol would produce incorrect values.

**How to apply:** When changing prices or currency behavior, update the seed catalog and delivery thresholds together, keep the currency version marker, and preserve a one-time conversion for pre-existing browser-saved USD data. Fresh installations must not convert the already-NGN seed values.