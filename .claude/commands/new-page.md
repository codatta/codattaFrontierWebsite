Add a new page/view to the application with route registration.

## Step 1: Determine route group

| Route prefix          | Route file                          |
| --------------------- | ----------------------------------- |
| `/app/*`              | `app.routes.tsx`                    |
| `/frontier/project/*` | `frontier-project.routes.tsx`       |
| `/account/*`          | `account.routes.tsx`                |
| `/dataset/*`          | `dataset.routes.tsx`                |
| `/arena/*`            | `arena.routes.tsx`                  |

## Step 2: Create the view file

Create `src/views/{group}/{page-name}.tsx`:

- Default export, functional component
- `@/` alias for all imports
- Wrap with `<AuthChecker>` if authentication required

## Step 3: Register the route

In `src/router/routes/{group}.routes.tsx`:

```typescript
const NewPage = lazy(() => import('@/views/{group}/{page-name}'))
// then add <Route> in the appropriate section
```

## Step 4: Verify

```bash
npx tsc --noEmit
```

Then navigate to the new route in the browser to confirm it renders.
