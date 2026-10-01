---
name: pre-deploy
description: Final checks before merging to main/deploying to production.
---

# Workflow: Pre-Deploy

1. Run `pnpm lint`
2. Run `pnpm typecheck`
3. Run `pnpm build`
4. Search for `TODO(Shalin)` in source files; flag if found
5. Verify no hardcoded content in user-facing JSX
6. Verify responsive layout (360px to 1920px)
7. Run complete [DEFINITION-OF-DONE.md](../../docs/DEFINITION-OF-DONE.md) checklist

