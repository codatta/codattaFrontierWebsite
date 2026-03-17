Run TypeScript type check, ESLint, and production build to verify no errors before merging.

```bash
# 1. TypeScript
npx tsc --noEmit

# 2. ESLint
npm run lint
# auto-fix: npm run lint:fix

# 3. Production build
npm run build
```

Fix all errors before proceeding. Check that `dist/` output size is reasonable.
