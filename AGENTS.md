# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Mindly Project Rules

These rules MUST be followed in every session, without exception.

## 1. Folder & File Structure

Every component (top-level or inner/sub-component) MUST follow this pattern:

```
ComponentName/
  ComponentName.tsx
  ComponentName.styles.ts
```

- The `.tsx` file contains only the component logic and JSX.
- The `.styles.ts` file contains only the `StyleSheet.create(...)` export for that component.
- **No exceptions** — even small inner components get their own folder + styles file.

## 2. No Inline Styles

- **Never** use `style={{ ... }}` inline objects in JSX.
- All styles go in the companion `ComponentName.styles.ts` file.
- Dynamic styles (e.g. driven by props or state) should use a `getStyles(...)` factory function in the styles file, or compose named style keys.

## 3. Split Large Components

- If a component file is getting large or handles multiple concerns, **split it**.
- Extract logical sub-sections into their own `SubComponent/SubComponent.tsx` + `SubComponent.styles.ts` inside the parent folder.
- The parent component should compose its children — it should not contain all the JSX itself.

## 4. Reusable Components

- Before creating a new component, check `src/components/` for an existing reusable one.
- If a UI pattern appears more than once across the codebase, extract it into `src/components/ComponentName/ComponentName.tsx`.
- Current reusable components: `ScreenHeader`, `Button`, `BottomSheet`.

## 5. API Calls — React Query Only

- **All** server data fetching and mutations MUST use `@tanstack/react-query`.
- Use `useQuery` for reads, `useMutation` for writes.
- **Never** use raw `fetch`/`axios` inside `useEffect` for data fetching.
- Query keys should be descriptive arrays, e.g. `["notebook", notebookId, "sources"]`.

## 6. App Route Files Are Thin

- Files inside `src/app/` are Expo Router route entry points only.
- They must re-export the screen component from `src/components/features/`:
  ```tsx
  import MyScreen from "@/components/features/myFeature/MyScreen";
  export default MyScreen;
  ```
- No logic, no styles, no JSX beyond the import/export.

## 7. Styled via Theme Tokens Only

- **Never** use hardcoded color hex values (`#ffffff`, `#000000`, etc.) or custom `rgba(...)` string values in styles.
- **All** UI colors, backgrounds, borders, active/inactive states, and status colors must be imported and referenced exclusively from the global theme context: `@/theme/themes` or the `theme` object.

## 8. Native Modules & Development Builds

- Whenever adding, removing, or modifying libraries that include native code (e.g. edited package dependencies in `package.json`, modified permissions/configurations in `app.json` or `eas.json`), **you must explicitly stop and prompt the user to run a fresh development build** (e.g. `npx expo run:android` or similar build command). Expo Go / the current bundler cannot resolve native module additions on the fly without a fresh compilation.

