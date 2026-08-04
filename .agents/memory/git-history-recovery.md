---
name: Git history recovery
description: Environment-specific guidance for resolving generic Git pane failures caused by divergent repository histories.
---

The local application history and the GitHub `origin/main` history may be unrelated even when both refs are valid. In that state, ordinary branch operations can surface a generic unknown Git error despite a healthy object database.

**Why:** The workspace may maintain an internal backup/agent history while the connected GitHub repository has its own older root, leaving the checked-out branch both ahead of and behind `origin/main` with no merge base.

**How to apply:** Confirm with `git status --short --branch`, `git merge-base main origin/main`, and `git fsck --full --no-reflogs`. If there is no merge base and the current working tree is the source of truth, join histories non-destructively with an `ours` merge of `origin/main`, then re-check status and refs. Avoid deleting project files or force-pushing unless explicitly requested.