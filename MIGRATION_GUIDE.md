# Clerk to Supabase Migration Guide

This guide documents the migration from Clerk authentication to Supabase authentication, including the new user/admin panel structure.

## What Changed

### Authentication System
- **Before**: Clerk authentication
- **After**: Supabase Auth with email/password

### Panel Structure
- **Before**: Single `/dashboard` route for all users
- **After**: 
  - `/user` - User Panel (forms, content upload, embed codes)
  - `/admin` - Admin Panel (analytics, user management)

### Role-Based Access Control
- Users now have roles stored in Supabase user metadata
- Roles: `user` (default) and `admin`
- Admin users have access to both panels
- Regular users only have access to user panel

## Key Files Changed

### Frontend

1. **package.json**
   - Removed: `@clerk/nextjs`
   - Added: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@supabase/auth-ui-react`

2. **lib/supabase.ts** (NEW)
   - Supabase client creation utilities

3. **lib/roles.ts** (NEW)
   - Role management functions

4. **components/providers/AuthProvider.tsx** (NEW)
   - Authentication context provider

5. **components/auth/AuthModal.tsx** (NEW)
   - Custom sign in/sign up modal

6. **components/auth/UserMenu.tsx** (NEW)
   - User dropdown menu component

7. **app/layout.tsx**
   - Replaced `ClerkProvider` with `AuthProvider`

8. **app/page.tsx**
   - Updated to use Supabase auth and role-based redirect

9. **app/middleware.ts**
   - Implemented Supabase session verification
   - Added role-based route protection

10. **app/user/** (NEW)
    - User panel with forms, content upload, and embed pages

11. **app/admin/** (NEW)
    - Admin panel with analytics and management pages

### Backend

1. **backend/app.py**
   - Updated JWT verification to use Supabase tokens
   - Added `require_admin` decorator for admin-only routes

## Migration Steps for Existing Projects

### 1. Install Dependencies

```bash
# Frontend
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-ui-react @supabase/auth-ui-shared

# Uninstall Clerk
npm uninstall @clerk/nextjs
```

### 2. Set Up Supabase Project

1. Create a Supabase project
2. Enable Email Authentication in Supabase Dashboard → Authentication → Providers
3. Copy your project credentials

### 3. Update Environment Variables

See `ENV_SETUP.md` for detailed instructions.

### 4. Migrate User Data (if applicable)

If you have existing users in Clerk:

1. Export user data from Clerk dashboard
2. Create corresponding users in Supabase:
   ```sql
   -- Example SQL to create users in Supabase
   -- Run this in Supabase SQL Editor
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('user@example.com', crypt('temporary-password', gen_salt('bf')), NOW());
   ```
3. Send password reset emails to users

### 5. Set Up Admin Users

For admin access:

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user you want to make admin
3. Edit user metadata:
   ```json
   {
     "role": "admin"
   }
   ```

### 6. Update Backend Routes (if custom)

If you have custom routes, update them to use the new `verify_token` function:

```python
from app import verify_token, require_admin

# Protected route (any authenticated user)
@blueprint.route('/endpoint', methods=['GET'])
@verify_token
def my_endpoint():
    user_id = request.user_id
    # Your code here
    return jsonify({'data': 'success'})

# Admin-only route
@blueprint.route('/admin-endpoint', methods=['GET'])
@verify_token
@require_admin
def admin_endpoint():
    # Your code here
    return jsonify({'data': 'success'})
```

## New Features

### User Panel (`/user`)
- **Forms Management**: Create, edit, duplicate, and delete forms
- **Content Upload**: Upload PDF, DOCX, TXT files for AI context
- **Embed Code Generator**: Get embed codes for inline or popup forms

### Admin Panel (`/admin`)
- **Analytics Dashboard**: Platform-wide metrics and charts
- **All Forms**: View all forms across all users
- **User Management**: View and manage user roles

## Testing the Migration

1. Start the backend: `cd backend && python app.py`
2. Start the frontend: `npm run dev`
3. Navigate to `http://localhost:3000`
4. Sign up with a new account
5. Verify email (check Supabase email logs in dev)
6. Sign in and test user panel features
7. Set your user as admin in Supabase Dashboard
8. Test admin panel access

## Troubleshooting

### Cannot access admin panel
- Check user metadata in Supabase Dashboard
- Ensure `role: "admin"` is set
- Clear browser cache and sign in again

### JWT verification errors in backend
- Verify `SUPABASE_JWT_SECRET` in backend `.env`
- Check that the secret matches your Supabase project

### Authentication not persisting
- Check that cookies are enabled
- Verify Supabase URL and anon key are correct
- Check browser console for errors

## Rollback Plan (if needed)

If you need to rollback:

1. Reinstall Clerk: `npm install @clerk/nextjs`
2. Restore previous versions of changed files from git
3. Restore environment variables
4. Restart services

## Support

For issues during migration:
- Check Supabase documentation: https://supabase.com/docs
- Review this migration guide
- Check application logs for specific errors

