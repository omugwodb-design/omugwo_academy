# Password Reset Fix Instructions

## Issue
- Password reset email links to `localhost:3000` instead of `localhost:3000/reset-password`
- When manually adding `/reset-password`, shows "This link may have expired"

## Solution

### 1. Configure Supabase Redirect URLs

Go to your Supabase Dashboard:
1. https://supabase.com/dashboard
2. Select your Omugwo Academy project
3. Click **Authentication** in the left sidebar
4. Click **URL Configuration** (or **Redirect URLs**)
5. Add these URLs:
   - `http://localhost:3000/reset-password`
   - `http://localhost:3000`
   - `http://localhost:3000/**` (wildcard for development)
   - `https://your-production-domain.com/reset-password` (for production)

### 2. Update Site Configuration

In Supabase SQL Editor, run:
```sql
-- Update site config with correct site URL
UPDATE public.site_config 
SET site_url = 'http://localhost:3000' 
WHERE site_id = 'default';
```

### 3. Update ForgotPassword Component

The issue might also be in how we construct the redirect URL. Update the `redirectTo` to ensure it includes the full path:

```typescript
// In ForgotPassword.tsx, line 23
const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
});
```

This is already correct in your code.

### 4. Test the Flow

1. Go to `/forgot-password`
2. Enter your email
3. Check the email link - it should now point to `localhost:3000/reset-password#access_token=...`
4. Click the link
5. Should show "Create New Password" form instead of expired message

### 5. If Still Not Working

Check the Supabase auth logs:
1. In Supabase Dashboard → Authentication → Logs
2. Look for password reset attempts
3. Check if there are any errors in the redirect URL handling

The most common issue is missing redirect URL configuration in Supabase settings.
