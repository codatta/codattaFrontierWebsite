# Codatta Frontier Website — Claude Rules

## Language

- **AI responses**: Always in **Chinese (Simplified)**
- **Code**: English only
- **Commit messages**: English, conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)

## Tech Stack

- React 18 + TypeScript 5 + Vite 5
- react-router-dom v7 (BrowserRouter, lazy-load all pages)
- TailwindCSS 3 (dark theme)
- Ant Design 5, shadcn/ui, Lucide React icons
- Valtio (proxy + useSnapshot + derive)
- Axios via `src/apis/request.ts`
- Framer Motion, GSAP
- Path alias: `@/` → `src/`

## File Organization

| Directory            | Purpose                | Naming                                   |
| -------------------- | ---------------------- | ---------------------------------------- |
| `src/views/`         | Page-level components  | default export; snake_case for frontiers |
| `src/components/`    | Reusable UI components | named export; kebab-case dirs            |
| `src/apis/`          | API modules            | `{domain}.api.ts`, default export object |
| `src/stores/`        | Valtio stores          | `{domain}.store.ts(x)`                   |
| `src/hooks/`         | Custom hooks           | `use-{name}.ts`                          |
| `src/router/routes/` | Route definitions      | `{group}.routes.tsx`                     |
| `src/utils/`         | Utilities              | kebab-case                               |

## Naming Conventions

| Kind       | Convention                         | Example              |
| ---------- | ---------------------------------- | -------------------- |
| Component  | PascalCase                         | `SubmitSuccessModal` |
| Hook       | `use` prefix                       | `useCountdown`       |
| Store file | `{domain}.store.ts(x)`             | `user.store.tsx`     |
| API file   | `{domain}.api.ts`                  | `frontiter.api.ts`   |
| Util file  | kebab-case                         | `auth-redirect.ts`   |
| View file  | snake_case (frontier) / kebab-case | `airdrop_food.tsx`   |
| Constants  | UPPER_SNAKE_CASE                   | `TEMPLATE_ID`        |

## TypeScript

- Strict mode; avoid `any`
- `interface` for object shapes, `type` for unions/intersections
- `Record<K, V>` over index signatures
- Catch blocks: use `error.message`

## React

- Functional components + hooks only, never class components
- File order: imports → types → component → export
- Destructure props; `useCallback` for prop callbacks; `useMemo` only when expensive
- Import order: react → third-party → `@/` aliases → relative → assets
- `@/` alias for all imports, never relative `../../`

## API Modules

```typescript
// src/apis/{domain}.api.ts
import request from '@/apis/request'

const xxxApi = {
  getList: (params: P) => request.get<R>('/v1/xxx', { params }),
  create: (data: D) => request.post<R>('/v1/xxx', data)
}
export default xxxApi
```

- Never import raw `axios`, always use `@/apis/request`
- Never hardcode base URLs

## Valtio Stores

```typescript
// src/stores/{domain}.store.ts
const state = proxy({ ... })
export const useXxxStore = () => useSnapshot(state)
export const xxxStoreActions = {
  update: (val) => { state.field = val }
}
```

- Mutate proxy directly in actions, never mutate snapshot
- Use `derive` for computed values

## Routing

```typescript
// src/router/routes/{group}.routes.tsx
const Page = lazy(() => import('@/views/path/to/page'))
```

- Frontier routes: `simpleTemplateRoute(id, Component)` or `appDetectorRoute(id, Web, App)`
- `useParams()` for path params; `useSearchParams()` with `{ replace: true }` for query

## Tailwind / UI

- **Dark theme**: bg `#1C1C26`, surface `#252532`, primary `#875DFF`
- **Container**: `max-w-[1320px] mx-auto px-6`
- **Fonts**: `font-mona`, `font-zendots`, `font-inter`
- **Border**: `border-[#FFFFFF1F]`, subtle bg: `bg-[#FFFFFF0A]`
- **Error text**: `text-sm text-red-400`
- **Buttons**: `h-[44px] rounded-full text-base font-bold`
- **Responsive**: mobile-first, `md:` breakpoint
- No inline styles; no `!important`; no custom CSS unless necessary

## Component Patterns

- Auth pages: wrap with `<AuthChecker>`
- Loading: `<Spin spinning={loading}>`
- Notifications: `message.error()` / `message.success()`
- Icons: `lucide-react`
- Mobile: `AppContainerDetector` for web/app split; mobile components use `-app` suffix

## Error Handling

- Wrap API calls in try/catch
- `message.error()` for user-facing errors; `console.error()` for debug
- Fallback: `error.message || 'Operation failed'`

## Form Patterns

- State: `useState<FormData>({})` + `useState<Partial<Record<keyof FormData, string>>>({})` for errors
- `validateForm()` returns boolean and sets errors
- `updateFormData(field, value)` auto-clears field error
- Disable submit during loading; prevent double-submit

## Git Commit

```bash
git add <files>
git commit -m "feat: short description in English"
```

Types: `feat` `fix` `refactor` `chore` `docs` `style` `perf` `test`

## Available Commands

Use these slash commands for common workflows:

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `/new-page`           | Add a new page with route registration   |
| `/new-frontier-task`  | Scaffold a new Frontier task template    |
| `/build-check`        | Run tsc + lint + build before merging    |
| `/compress-images`    | Compress image assets with sharp-cli     |
