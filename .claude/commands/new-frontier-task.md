Create a new Frontier Task template (data collection / annotation task page).

## Step 0: Gather requirements

Ask the user to confirm:

1. `TEMPLATE_ID` — UPPER_SNAKE_CASE identifier
2. Page title — English
3. Form fields — name, type (`text` / `number` / `select` / `radio` / `checkbox` / `upload` / `date` / `textarea`), required?, validation rules
4. Guideline section needed?
5. App version needed? (`_app.tsx` via `AppContainerDetector`)
6. Async field validation? (`frontiterApi.checkTaskField`)
7. Post-submit behavior — re-submittable (clear form) or one-time (`SubmitSuccessModal` → back)

## Step 1: Define types

Create `FormData` interface in the view file or `src/components/frontier/airdrop/{task_name}/types.ts`.

## Step 2: Create view file

`src/views/frontiers/{template_name}.tsx` (snake_case, default export)

Standard layout:

```tsx
<AuthChecker>
  <Spin spinning={loading}>
    {/* header: back button + title */}
    {/* form fields */}
    {/* submit button */}
    <SubmitSuccessModal />
  </Spin>
</AuthChecker>
```

## Step 3: Implement form validation

- Error state: `useState<Partial<Record<keyof FormData, string>>>({})`
- `validateForm()` → returns boolean, sets errors
- `updateFormData(field, value)` → auto-clears field error
- Async validation: debounce + AbortController

## Step 4: App version (if needed)

`src/views/frontiers/{template_name}_app.tsx` with `isFeed?: boolean` prop.

## Step 5: Guideline (if needed)

`src/components/frontier/airdrop/{task_name}/guideline.tsx`

## Step 6: Register route

In `src/router/routes/frontier-project.routes.tsx`:

```typescript
const TaskPage = lazy(() => import('@/views/frontiers/{template_name}'))
// use simpleTemplateRoute(TEMPLATE_ID, TaskPage)
// or  appDetectorRoute(TEMPLATE_ID, TaskPage, TaskPageApp)
```

## Step 7: Pre-launch checklist

- [ ] View file created + route registered
- [ ] Component receives `templateId`; uses `useParams()` for `taskId`
- [ ] `frontiterApi.getTaskDetail` → template match check → reward calc
- [ ] All required fields validated; errors auto-clear on change; async uses debounce + AbortController
- [ ] `validateForm()` → `frontiterApi.submitTask()` → success modal; loading state; double-submit prevention
- [ ] UI: `<AuthChecker>`, back button, `max-w-[1320px]`, `space-y-[30px]`, red asterisks, `text-sm text-red-400` errors
- [ ] Edge cases: missing params, network errors, image upload in-progress check, hash dedup
- [ ] `npx tsc --noEmit` passes
