# Known Issues & Solutions

## content-all.js Connection Errors

### Issue
You may see console errors like:
```
GET chrome-extension://[extension-id]/content-all.js net::ERR_FAILED
```
or
```
Refused to load the script 'chrome-extension://...' because it violates the Content Security Policy
```

### Cause
These errors are **NOT from the Omugwo Academy application**. They are caused by **browser extensions** trying to inject scripts into the page. Common extensions that cause this:

- **Password managers** (LastPass, 1Password, Bitwarden, etc.)
- **Ad blockers** (uBlock Origin, AdBlock, etc.)
- **Developer tools** (React DevTools, Redux DevTools, etc.)
- **Grammarly** or other text enhancement tools
- **VPN extensions**
- **Screenshot tools**

### Solution
These errors are harmless and do not affect the application functionality. To eliminate them:

1. **Ignore them** - They don't impact the app
2. **Disable extensions** temporarily when developing
3. **Use Incognito/Private mode** with extensions disabled
4. **Filter console output** to hide extension-related errors

### How to Filter in Chrome DevTools
1. Open DevTools (F12)
2. Go to Console tab
3. Click the filter icon
4. Add `-chrome-extension` to filter out extension errors

---

## Database 400/404 Errors

### Issue
API calls to Supabase return 400 or 404 errors.

### Cause
Missing database tables or incorrect table schemas.

### Solution
Run the latest migration to ensure all tables exist:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration in Supabase SQL Editor
# File: supabase/migrations/20260310000000_ensure_all_tables.sql
```

The migration file `20260310000000_ensure_all_tables.sql` creates all required tables with `IF NOT EXISTS` clauses, so it's safe to run multiple times.

---

## Supabase Type Errors

### Issue
TypeScript errors like `Property 'X' does not exist on type 'never'` in Supabase queries.

### Solution
Regenerate Supabase types after schema changes:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Then update imports to use the generated types.
